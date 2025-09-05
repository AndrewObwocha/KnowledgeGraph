package com.andrew.knowledge_graph.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;



@Component
public class JwtUtil {
    private final long accessTokenValidity = 1000 * 60 * 15; // 15 minutes
    private final long refreshTokenValidity = 1000 * 60 * 60 * 24; // 24 hours
    private final Key key = Jwts.SIG.HS256.key().build();
    private final String EXPECTED_ISSUER = "https://localhost:8000";
    private final String EXPECTED_AUDIENCE = "https://localhost:5173";

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenValidity))
                .signWith(key)
                .compact();
    }

    public boolean isTokenValid(String token, String username) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .requireSubject(username)
                    .requireIssuer(EXPECTED_ISSUER)
                    .requireAudience(EXPECTED_AUDIENCE)
                    .build()
                    .parseSignedClaims(token);
            
            return true;

        } catch (JwtException e) {
            return false;
        }
    }

    public String extractClaim (String token, String claim) {
        try {
            return Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get(claim, String.class);
        } catch (JwtException e) {
            return null;
        }
    }
}