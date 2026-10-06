package com.ecocycle.service

import com.ecocycle.repository.EWasteRepository
import com.ecocycle.repository.UserRepository
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class DeletedUserRequestAnonymizer(
    private val userRepository: UserRepository,
    private val ewasteRepository: EWasteRepository,
    private val requestAnonymizer: EWasteRequestAnonymizer
) : ApplicationRunner {

    @Transactional
    override fun run(args: ApplicationArguments) {
        val activeEmails = userRepository.findAll()
            .map { it.email.trim().lowercase() }
            .toSet()

        val orphanedRequests = ewasteRepository.findAll()
            .filter { request ->
                request.status == "Recycled" ||
                    (request.userEmail.isNotBlank() &&
                        request.userEmail.trim().lowercase() !in activeEmails)
            }

        orphanedRequests.forEach(requestAnonymizer::anonymize)

        ewasteRepository.saveAll(orphanedRequests)
    }
}
