package com.fitness.userservice.controller;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
@Tag(
        name = "User API",
        description = "Endpoints for user registration and validation"
)
public class UserController {

    private final UserService userService;

    @Operation(
            summary = "Get User Profile",
            description = "Fetch user details by user ID"
    )
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                userService.getUserProfile(userId)
        );
    }

    @Operation(
            summary = "Register User",
            description = "Register a new user in the system"
    )
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(
                userService.register(request)
        );
    }

    @Operation(
            summary = "Validate User",
            description = "Check whether a user exists"
    )
    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(
            @PathVariable String userId) {

        return ResponseEntity.ok(
                userService.existByUserId(userId)
        );
    }
}