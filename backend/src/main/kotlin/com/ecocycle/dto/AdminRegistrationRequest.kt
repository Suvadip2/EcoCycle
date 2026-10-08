package com.ecocycle.dto

data class AdminRegistrationRequest(
    val name: String,
    val email: String,
    val password: String,
    val adminCode: String
)
