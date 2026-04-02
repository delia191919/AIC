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
        logger.info("Picking random Admin/Expert for notification: {}", message);
        
        java.util.List<com.example.aic.model.User> targets = userRepository.findByRoleNameIn(java.util.Arrays.asList("ROLE_ADMIN", "ROLE_EXPERT"));
        
        String payload;
        if (!targets.isEmpty()) {
            com.example.aic.model.User luckyOne = targets.get(new java.util.Random().nextInt(targets.size()));
            payload = "TARGET:" + luckyOne.getUsername() + "|MSG:" + message;
            logger.info("Selected target: {}", luckyOne.getUsername());
        } else {
            payload = "TARGET:ALL|MSG:" + message;
        }

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "avalanche.created", payload);
    }

    public void sendAvalancheValidatedEvent(String message) {
        logger.info("Sending avalanche validated event: {}", message);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "avalanche.validated", message);
    }
}
