package com.kapaq.configuracion;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.LinkedHashMap;
import java.util.Map;

// Clase utilitaria para construir respuestas HTTP estandarizadas.
public class ApiResponse {

    private ApiResponse() {}

    // Retorna 200 OK con datos
    public static <T> ResponseEntity<Map<String, Object>> success(T data) {
        return ResponseEntity.ok(Map.of("ok", true, "data", data));
    }

    // Retorna 201 Created con datos
    public static <T> ResponseEntity<Map<String, Object>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true, "data", data));
    }

    // Retorna 200 OK con un mensaje
    public static ResponseEntity<Map<String, Object>> message(String mensaje) {
        return ResponseEntity.ok(Map.of("ok", true, "mensaje", mensaje));
    }

    // Retorna 400 Bad Request con un error
    public static ResponseEntity<Map<String, Object>> error(String error) {
        return ResponseEntity.badRequest().body(Map.of("ok", false, "error", error));
    }

    // Retorna 200 OK con el resultado de la verificación de stock
    public static ResponseEntity<Map<String, Object>> verificarStock(Map<String, Object> result) {
        boolean ok = (boolean) result.get("ok");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", ok);
        if (ok) {
            body.put("mensaje", result.get("mensaje"));
        } else {
            body.put("problemas", result.get("problemas"));
        }
        return ResponseEntity.ok(body);
    }
}
