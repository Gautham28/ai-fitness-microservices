package com.fitness.activityservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()
                .info(
                        new Info()
                                .title("Fitness Activity Service API")
                                .version("1.0")
                                .description(
                                        "Microservice responsible for tracking and managing fitness activities."
                                )
                                .contact(
                                        new Contact()
                                                .name("Gautham Krishna")
                                                .email("gautham@example.com")
                                )
                                .license(
                                        new License()
                                                .name("MIT License")
                                )
                );
    }
}