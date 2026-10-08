package com.ecocycle.controller

import com.ecocycle.model.EWasteRequest
import com.ecocycle.repository.EWasteRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@CrossOrigin(origins = ["http://localhost:5173"])
@RequestMapping("/api/ewaste")
class EWasteController(
    private val ewasteRepository: EWasteRepository
) {

    @GetMapping
    fun getAllRequests(): List<EWasteRequest> {
        return ewasteRepository.findAll()
    }

    @PostMapping
    fun createRequest(
        @RequestBody request: EWasteRequest
    ): ResponseEntity<EWasteRequest> {

        request.status = "Pending"
        request.recycledAt = null

        val savedRequest =
            ewasteRepository.save(request)

        return ResponseEntity.ok(savedRequest)
    }

    @GetMapping("/{id}")
    fun getRequestById(
        @PathVariable id: Long
    ): ResponseEntity<EWasteRequest> {

        val request =
            ewasteRepository.findById(id)

        return if (request.isPresent) {
            ResponseEntity.ok(request.get())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/user/{email}")
    fun getUserRequests(
        @PathVariable email: String
    ): List<EWasteRequest> {

        return ewasteRepository.findByUserEmail(email)
    }

    @DeleteMapping("/{id}")
    fun deleteRequest(
        @PathVariable id: Long
    ): ResponseEntity<Void> {

        if (!ewasteRepository.existsById(id)) {
            return ResponseEntity.notFound().build()
        }

        ewasteRepository.deleteById(id)

        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}/status")
    fun updateStatus(
        @PathVariable id: Long,
        @RequestBody statusRequest: Map<String, String>
    ): ResponseEntity<Any> {

        val request =
            ewasteRepository.findById(id)

        if (request.isEmpty) {
            return ResponseEntity.notFound().build()
        }

        val newStatus =
            statusRequest["status"]

        if (newStatus.isNullOrBlank()) {
            return ResponseEntity
                .badRequest()
                .body(
                    mapOf(
                        "message" to "Status is required"
                    )
                )
        }

        val ewaste = request.get()

        ewaste.status = newStatus
        ewaste.recycledAt =
            if (newStatus == "Recycled") ewaste.recycledAt ?: LocalDateTime.now() else null

        val updatedRequest =
            ewasteRepository.save(ewaste)

        return ResponseEntity.ok(updatedRequest)
    }
}
