package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Activity API",
        description = "Endpoints for tracking and retrieving fitness activities"
)
@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @Operation(
            summary = "Track Activity",
            description = "Creates a new fitness activity and publishes it to RabbitMQ for AI recommendation processing"
    )
    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(
            @RequestBody ActivityRequest request,
            @RequestHeader("X-User-ID") String userId
    ) {

        if (userId != null) {
            request.setUserId(userId);
        }

        return ResponseEntity.ok(
                activityService.trackActivity(request)
        );
    }

    @Operation(
            summary = "Get User Activities",
            description = "Fetch all activities belonging to the currently logged-in user"
    )
    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @RequestHeader("X-User-ID") String userId
    ) {

        return ResponseEntity.ok(
                activityService.getUserActivities(userId)
        );
    }

    @Operation(
            summary = "Get Activity By ID",
            description = "Fetch detailed information for a specific activity"
    )
    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(
            @PathVariable String activityId
    ) {

        return ResponseEntity.ok(
                activityService.getActivityById(activityId)
        );
    }
}