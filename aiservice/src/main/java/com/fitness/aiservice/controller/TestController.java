package com.fitness.aiservice.controller;

import com.fitness.aiservice.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final GeminiService geminiService;

    @GetMapping("/test")
    public String test() {
        return geminiService.getAnswer("Say hello in one sentence.");
    }
}