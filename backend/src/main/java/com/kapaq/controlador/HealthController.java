package com.kapaq.controlador;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @PersistenceContext
    private EntityManager em;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        try {
            // Verifica conectividad con MySQL ejecutando SELECT 1
            em.createNativeQuery("SELECT 1").getSingleResult();
            return ResponseEntity.ok(Map.of(
                "ok", true,
                "mensaje", "Servidor activo",
                "db", "kapaq_db conectada"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of(
                "ok", false,
                "error", "Base de datos no disponible",
                "detail", e.getMessage()
            ));
        }
    }
}
