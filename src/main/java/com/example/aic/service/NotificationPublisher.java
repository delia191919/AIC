package com.example.aic.service;

import com.example.aic.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationPublisher {

    private static final Logger logger = LoggerFactory.getLogger(NotificationPublisher.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private com.example.aic.repository.UserRepository userRepository;

    public void sendAvalancheCreatedEvent(String message) {
        logger.info("Picking random Expert for notification: {}", message);

        // Use "EXPERT" as in DataInitializer (without ROLE_ prefix)
        java.util.List<com.example.aic.model.User> targets = userRepository
                .findByRoleNameIn(java.util.Arrays.asList("EXPERT"));

        logger.info("Total potential Expert targets found in DB: {}", targets.size());

        String payload;
        if (!targets.isEmpty()) {
            com.example.aic.model.User luckyOne = targets.get(new java.util.Random().nextInt(targets.size()));
            payload = "TARGET:" + luckyOne.getUsername() + "|MSG:" + message;
            logger.info("Selected target: {}", luckyOne.getUsername());
        } else {
            logger.warn("No EXPERTS found in database! Broadcasting to ALL.");
            payload = "TARGET:ALL|MSG:" + message;
        }

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "avalanche.created", payload);
    }

    public void sendAvalancheValidatedEvent(String message) {
        logger.info("Sending avalanche validated event (Public Broadcast): {}", message);
        String payload = "TARGET:ALL|MSG:" + message;
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "avalanche.validated", payload);
    }
}
