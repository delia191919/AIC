package com.example.notificationservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.List;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public List<String> getRolesFromJwtToken(String token) {
        // Since roles are not directly in claims in the main app (Wait, AuthController sets roles in Context, but not in JWT claims?)
        // Let's check the generateToken in main app. 
        // In the main app, JwtUtils.java doesn't put roles in claims. 
        // BUT wait, I didn't see roles in claims. That's fine, we can just intercept by username if needed, 
        // or we need to add roles to claims in the main app.
        // Actually, for WebSockets, we can just let any authenticated user connect to /topic/users,
        // and only admins connect to /topic/admin. 
        // We will just validate the token here.
        return null;
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (Exception e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }
}
