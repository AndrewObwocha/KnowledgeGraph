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
    private final String EXPECTED_ISSUER = "https://localhost:8080";

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuer(EXPECTED_ISSUER)
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
            String subject = extractClaim(token, "sub");
            return username.equals(subject) && !isTokenExpired(token);
        } catch (JwtException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                                .verifyWith((SecretKey) key)
                                .requireIssuer(EXPECTED_ISSUER)
                                .build()
                                .parseSignedClaims(token)
                                .getPayload()
                                .getExpiration();
        
                                return expiration.before(new Date());
    }

    public String extractClaim (String token, String claimKey) {
        try {
            return Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .requireIssuer(EXPECTED_ISSUER)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get(claimKey, String.class);
        } catch (JwtException e) {
            System.err.println("Failed to extract claim '" + claimKey + "'. Error: " + e.getMessage());
            return null;
        }
    }
}