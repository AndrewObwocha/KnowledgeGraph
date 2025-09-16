package com.andrew.knowledge_graph.controller;

import com.andrew.knowledge_graph.repository.UserRepository;
import com.andrew.knowledge_graph.util.JwtUtil;
import com.andrew.knowledge_graph.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    /**
     * Registers a new user.
     * @param request Map containing "username" and "password"
     * @return Success message or error if username exists
     */
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        final String username = request.get("username");
        final String password = request.get("password");
        
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        
        final User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    /**
     * Authenticates the user and returns JWT tokens.
     * @param request Map containing "username" and "password"
     * @return JSON with access and refresh tokens or error message
     */
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {  
        final String username = request.get("username");
        final String password = request.get("password");
        final Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
        
        final String accessToken = jwtUtil.generateAccessToken(username);
        final String refreshToken = jwtUtil.generateRefreshToken(username);
        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken
        ));
    }

    @PostMapping("/refresh")
    /**
     * Refreshes the access token using a valid refresh token.
     * @param request Map containing "refreshToken" and "username"
     * @return JSON with new access token or error message
     */
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        final String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing refresh token"));
        }

        final String username = jwtUtil.extractClaim(refreshToken, "sub");

        if (refreshToken == null || !jwtUtil.isTokenValid(refreshToken, username)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
        }

        final String newAccessToken = jwtUtil.generateAccessToken(username);
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }
}