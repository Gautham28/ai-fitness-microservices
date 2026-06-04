package com.fitness.aiservice.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @PostConstruct
    public void debug() {
        System.out.println("======================================");
        System.out.println("Gemini URL = " + geminiApiUrl);
        System.out.println("Gemini Key Present = "
                + (geminiApiKey != null && !geminiApiKey.isBlank()));
        System.out.println("======================================");
    }

    public String getAnswer(String question) {

        String finalUrl = geminiApiUrl + geminiApiKey;

        System.out.println("======================================");
        System.out.println("FINAL GEMINI URL = " + finalUrl);
        System.out.println("QUESTION = " + question);
        System.out.println("======================================");

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", question)
                                }
                        )
                }
        );

        String response = webClient.post()
                .uri(finalUrl)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return response;
    }
}