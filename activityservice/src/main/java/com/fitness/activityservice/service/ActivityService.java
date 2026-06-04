package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    public ActivityResponse trackActivity(ActivityRequest request) {

        log.info("========== ACTIVITY TRACKING STARTED ==========");
        log.info("Received activity request: {}", request);

        log.info("Validating user: {}", request.getUserId());

        boolean isValidUser = userValidationService.validateUser(request.getUserId());

        log.info("User validation result: {}", isValidUser);

        if (!isValidUser) {
            log.error("Invalid user detected: {}", request.getUserId());
            throw new RuntimeException("Invalid User: " + request.getUserId());
        }

        log.info("Building Activity object...");

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        log.info("Activity object built successfully");

        try {
            log.info("Saving activity to MongoDB...");

            Activity savedActivity = activityRepository.save(activity);

            log.info("Activity saved successfully!");
            log.info("Saved Activity ID: {}", savedActivity.getId());

            try {
                log.info("Publishing activity to RabbitMQ...");
                rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
                log.info("Activity published to RabbitMQ successfully!");
            } catch (Exception e) {
                log.error("Failed to publish activity to RabbitMQ", e);
            }

            log.info("========== ACTIVITY TRACKING COMPLETED ==========");

            return mapToResponse(savedActivity);

        } catch (Exception e) {
            log.error("FAILED WHILE SAVING ACTIVITY TO MONGODB", e);
            throw e;
        }
    }

    private ActivityResponse mapToResponse(Activity activity){
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }
}