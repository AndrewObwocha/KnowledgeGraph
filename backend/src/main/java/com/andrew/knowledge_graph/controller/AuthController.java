package com.andrew.knowledge_graph.controller;

import com.andrew.knowledge_graph.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        String username = jwtUtil.validateToken(refreshToken);
        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid refresh token"));
        }
        String newAccessToken = jwtUtil.generateAccessToken(username);
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }
}