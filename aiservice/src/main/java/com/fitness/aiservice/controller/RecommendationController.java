package com.fitness.aiservice.controller;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendations")
@Tag(
        name = "Recommendation API",
        description = "Endpoints for retrieving AI-generated fitness recommendations"
)
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Operation(
            summary = "Get User Recommendations",
            description = "Retrieve all recommendations generated for a specific user"
    )
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendation(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                recommendationService.getUserRecommendation(userId)
        );
    }

    @Operation(
            summary = "Get Activity Recommendation",
            description = "Retrieve the AI recommendation associated with a specific activity"
    )
    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendation(
            @PathVariable String activityId) {

        return ResponseEntity.ok(
                recommendationService.getActivityRecommendation(activityId)
        );
    }
}