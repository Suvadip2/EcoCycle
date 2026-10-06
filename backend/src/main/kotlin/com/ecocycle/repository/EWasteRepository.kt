package com.ecocycle.repository

import com.ecocycle.model.EWasteRequest
import org.springframework.data.jpa.repository.JpaRepository

interface EWasteRepository : JpaRepository<EWasteRequest, Long> {

    fun findByUserEmail(userEmail: String): List<EWasteRequest>
}