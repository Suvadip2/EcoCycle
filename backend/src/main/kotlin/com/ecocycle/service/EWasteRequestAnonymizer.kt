package com.ecocycle.service

import com.ecocycle.model.EWasteRequest
import org.springframework.stereotype.Component

@Component
class EWasteRequestAnonymizer {

    fun anonymize(request: EWasteRequest) {
        request.deviceName = "Recycled item"
        request.quantity = 1
        request.condition = ""
        request.description = ""
        request.userEmail = ""
        request.pickupAddress = ""
        request.pickupCity = ""
        request.pickupPincode = ""
    }
}
