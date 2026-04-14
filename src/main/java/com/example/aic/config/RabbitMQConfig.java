package com.example.aic.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "avalanche_exchange";

    @Bean
    public TopicExchange avalancheExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }
}
