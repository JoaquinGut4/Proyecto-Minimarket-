package com.kapaq.configuracion;

import com.kapaq.entidad.Encargado;
import com.kapaq.repositorio.EncargadoRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final EncargadoRepository encargadoRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        // Si no hay header Authorization, continúa sin autenticar
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7);
            Claims claims = jwtUtil.validate(token);
            Integer userId = Integer.parseInt(claims.getSubject());
            String rol = claims.get("rol", String.class);

            // Verifica que el encargado exista y esté activo
            Encargado encargado = encargadoRepository.findById(userId).orElse(null);
            if (encargado == null || !encargado.getActivo()) {
                filterChain.doFilter(request, response);
                return;
            }

            List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + rol)
            );

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(encargado, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception e) {
            log.warn("JWT inválido: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
