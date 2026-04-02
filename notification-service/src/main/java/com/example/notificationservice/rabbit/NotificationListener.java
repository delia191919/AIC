package com.example.notificationservice.rabbit;

import com.example.notificationservice.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    private static final Logger logger = LoggerFactory.getLogger(NotificationListener.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = RabbitMQConfig.ADMIN_QUEUE)
    public void receiveAdminNotification(String message) {
        logger.info("Received Admin Notification: {}", message);
        messagingTemplate.convertAndSend("/topic/admin", message);
    }

    @RabbitListener(queues = RabbitMQConfig.USER_QUEUE)
    public void receiveUserNotification(String message) {
        logger.info("Received User Notification: {}", message);
        messagingTemplate.convertAndSend("/topic/users", message);
    }
}
