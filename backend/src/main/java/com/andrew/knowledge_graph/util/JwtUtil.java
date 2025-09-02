package com.andrew.knowledge_graph.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    private final Key key = Jwts.SIG.HS256.key().build();
    private final long accessTokenValidity = 1000 * 60 * 15; // 15 minutes

    public String generateAccessToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenValidity))
                .signWith(key)
                .compact();
    }

    public String validateToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (JwtException e) {
            return null;
        }
    }
}
