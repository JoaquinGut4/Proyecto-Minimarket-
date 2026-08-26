package com.kapaq.controlador;

import com.kapaq.configuracion.ApiResponse;
import com.kapaq.dto.peticion.ProductoRequest;
import com.kapaq.dto.peticion.ProductoUpdateRequest;
import com.kapaq.dto.respuesta.ProductoResponse;
import com.kapaq.servicio.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String q) {
        List<ProductoResponse> data = productoService.listar(categoria, q);
        return ApiResponse.success(data);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> detalle(@PathVariable Integer id) {
        ProductoResponse data = productoService.detalle(id);
        return ApiResponse.success(data);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@Valid @RequestBody ProductoRequest request) {
        ProductoResponse data = productoService.crear(request);
        return ApiResponse.created(data);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProductoUpdateRequest request) {
        ProductoResponse data = productoService.actualizar(id, request);
        return ApiResponse.success(data);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> desactivar(@PathVariable Integer id) {
        productoService.desactivar(id);
        return ApiResponse.message("Producto desactivado");
    }
}
