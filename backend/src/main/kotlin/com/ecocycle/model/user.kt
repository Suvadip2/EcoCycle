package com.ecocycle.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false, unique = true)
    var email: String = "",

    @Column(nullable = false)
    var password: String = "",

    @Column(nullable = false)
    var phone: String = "",

    @Column(nullable = false)
    var role: String = "USER",

    @Column(name = "created_at", nullable = true, updatable = false)
    var createdAt: LocalDateTime? = null
) {
    @PrePersist
    fun setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now()
        }
    }
}