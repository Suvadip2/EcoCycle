package com.ecocycle.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController {

    @GetMapping("/api/test")
    fun test(): Map<String, String> {
        return mapOf(
            "message" to "EcoCycle Backend Connected Successfully"
        )
    }
}