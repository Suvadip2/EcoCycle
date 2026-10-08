package com.ecocycle.controller

import com.ecocycle.model.User
import com.ecocycle.repository.EWasteRepository
import com.ecocycle.repository.UserRepository
import com.ecocycle.service.EWasteRequestAnonymizer
import com.ecocycle.dto.AdminRegistrationRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import java.security.MessageDigest
import java.nio.charset.StandardCharsets

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val ewasteRepository: EWasteRepository,
    private val requestAnonymizer: EWasteRequestAnonymizer,
    private val passwordEncoder: PasswordEncoder,
    @Value("\${ecocycle.admin-code:}") private val adminCode: String
) {

    @PostMapping("/register")
    fun register(
        @RequestBody user: User
    ): ResponseEntity<Any> {

        if (userRepository.findByEmail(user.email) != null) {
            return ResponseEntity
                .badRequest()
                .body(
                    mapOf(
                        "message" to "Email already registered"
                    )
                )
        }

        user.role = "USER"

        val encodedPassword =
            passwordEncoder.encode(user.password)
                ?: return ResponseEntity
                    .internalServerError()
                    .body(
                        mapOf(
                            "message" to "Password encryption failed"
                        )
                    )

        user.password = encodedPassword

        val savedUser = userRepository.save(user)

        return ResponseEntity.ok(
            mapOf(
                "message" to "Registration successful",
                "userId" to savedUser.id
            )
        )
    }

    @PostMapping("/admin/register")
    fun registerAdmin(
        @RequestBody request: AdminRegistrationRequest
    ): ResponseEntity<Any> {
        if (adminCode.isBlank()) {
            return ResponseEntity
                .internalServerError()
                .body(mapOf("message" to "Admin registration is not configured"))
        }

        if (request.adminCode.isBlank() || !MessageDigest.isEqual(
                request.adminCode.toByteArray(StandardCharsets.UTF_8),
                adminCode.toByteArray(StandardCharsets.UTF_8)
            )
        ) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("message" to "Invalid Admin Code."))
        }

        if (request.name.isBlank() || request.email.isBlank() || request.password.isBlank()) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("message" to "Name, email and password are required"))
        }

        if (userRepository.findByEmail(request.email) != null) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("message" to "Email already registered"))
        }

        val encodedPassword = passwordEncoder.encode(request.password)
            ?: return ResponseEntity
                .internalServerError()
                .body(mapOf("message" to "Password encryption failed"))

        val savedUser = userRepository.save(
            User(
                name = request.name,
                email = request.email,
                password = encodedPassword,
                phone = "",
                role = "ADMIN"
            )
        )

        return ResponseEntity.ok(
            mapOf(
                "message" to "Admin registration successful",
                "userId" to savedUser.id
            )
        )
    }

    @PostMapping("/login")
    fun login(
        @RequestBody loginRequest: Map<String, String>
    ): ResponseEntity<Any> {

        val email = loginRequest["email"]
        val password = loginRequest["password"]

        if (email.isNullOrBlank() || password.isNullOrBlank()) {
            return ResponseEntity
                .badRequest()
                .body(
                    mapOf(
                        "message" to "Email and password are required"
                    )
                )
        }

        val user = userRepository.findByEmail(email)

        if (user == null) {
            return ResponseEntity
                .status(401)
                .body(
                    mapOf(
                        "message" to "Invalid email or password"
                    )
                )
        }

        val storedPassword = user.password
        val isBcryptPassword = isBcryptPassword(storedPassword)
        val passwordMatches = passwordMatches(password, storedPassword)

        if (!passwordMatches) {
            return ResponseEntity
                .status(401)
                .body(
                    mapOf(
                        "message" to "Invalid email or password"
                    )
                )
        }

        // Convert old plain-text passwords to BCrypt
        if (!isBcryptPassword) {

            val encodedPassword =
                passwordEncoder.encode(password)
                    ?: return ResponseEntity
                        .internalServerError()
                        .body(
                            mapOf(
                                "message" to "Password encryption failed"
                            )
                        )

            user.password = encodedPassword

            userRepository.save(user)
        }

        return ResponseEntity.ok(
            mapOf(
                "id" to user.id,
                "name" to user.name,
                "email" to user.email,
                "phone" to user.phone,
                "role" to user.role,
                "createdAt" to user.createdAt
            )
        )
    }

    @GetMapping("/users")
    fun getAllUsers(): List<Map<String, Any?>> {

        return userRepository.findAll().map { user ->

            mapOf(
                "id" to user.id,
                "name" to user.name,
                "email" to user.email,
                "phone" to user.phone,
                "role" to user.role,
                "createdAt" to user.createdAt
            )
        }
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    fun deleteUser(
        @PathVariable id: Long,
        @RequestBody credentials: Map<String, String>
    ): ResponseEntity<Any> {

        val email = credentials["email"]
        val password = credentials["password"]

        if (email.isNullOrBlank() || password.isNullOrBlank()) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("message" to "Admin email and password are required"))
        }

        val admin = userRepository.findByEmail(email)
        if (admin == null || admin.role != "ADMIN" || !passwordMatches(password, admin.password)) {
            return ResponseEntity
                .status(403)
                .body(mapOf("message" to "Admin credentials are invalid"))
        }

        val targetUser = userRepository.findById(id)
        if (targetUser.isEmpty) {
            return ResponseEntity
                .notFound()
                .build<Any>()
        }

        if (targetUser.get().role == "ADMIN") {
            return ResponseEntity
                .status(403)
                .body(mapOf("message" to "Admin accounts cannot be deleted"))
        }

        val requests = ewasteRepository.findByUserEmail(targetUser.get().email)
        requests.forEach(requestAnonymizer::anonymize)
        ewasteRepository.saveAll(requests)

        userRepository.deleteById(id)

        return ResponseEntity.noContent().build()
    }

    private fun isBcryptPassword(password: String): Boolean =
        password.startsWith("\$2a\$") ||
            password.startsWith("\$2b\$") ||
            password.startsWith("\$2y\$")

    private fun passwordMatches(password: String, storedPassword: String): Boolean =
        if (isBcryptPassword(storedPassword)) {
            passwordEncoder.matches(password, storedPassword)
        } else {
            storedPassword == password
        }
}