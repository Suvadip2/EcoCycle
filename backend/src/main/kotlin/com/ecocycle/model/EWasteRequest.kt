package com.ecocycle.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "ewaste_requests")
class EWasteRequest(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var deviceName: String = "",

    @Column(nullable = false)
    var category: String = "",

    @Column(nullable = false)
    var quantity: Int = 1,

    @Column(name = "device_condition", nullable = false)
    var condition: String = "",

    @Column(nullable = false)
    var weight: Double = 0.0,

    @Column(length = 500)
    var description: String = "",

    @Column(nullable = false)
    var status: String = "Pending",

    @Column(nullable = false)
    var userEmail: String = "",

    /*
     * Pickup information
     */
    @Column(length = 500)
    var pickupAddress: String = "",

    @Column(length = 100)
    var pickupCity: String = "",

    @Column(length = 10)
    var pickupPincode: String = "",

    @Column(name = "created_at", nullable = true, updatable = false)
    var createdAt: LocalDateTime? = null,

    @Column(name = "recycled_at")
    var recycledAt: LocalDateTime? = null
) {
    @PrePersist
    fun setCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now()
        }
    }
}
