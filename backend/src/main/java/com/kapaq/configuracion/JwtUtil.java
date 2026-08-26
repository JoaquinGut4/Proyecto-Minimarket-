package com.kapaq.configuracion;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key; // Clave secreta para firmar tokens
    private final long expiration; // Tiempo de expiración en ms

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    // Genera un token JWT con userId, dni, rol y nombre en los claims.
    public String generate(Integer userId, String dni, String rol, String nombre) {
        Date now = new Date();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("dni", dni)
                .claim("rol", rol)
                .claim("nombre", nombre)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(key)
                .compact();
    }

    // Valida un token y devuelve sus claims.
    public Claims validate(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
