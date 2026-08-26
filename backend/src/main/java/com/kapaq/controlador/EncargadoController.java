package com.kapaq.controlador;

import com.kapaq.configuracion.ApiResponse;
import com.kapaq.dto.peticion.EncargadoRequest;
import com.kapaq.dto.peticion.LoginRequest;
import com.kapaq.dto.peticion.ToggleActivoRequest;
import com.kapaq.dto.respuesta.EncargadoResponse;
import com.kapaq.dto.respuesta.LoginResponse;
import com.kapaq.servicio.EncargadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/encargados")
@RequiredArgsConstructor
public class EncargadoController {

    private final EncargadoService encargadoService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar() {
        List<EncargadoResponse> data = encargadoService.listar();
        return ApiResponse.success(data);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse data = encargadoService.login(request);
        return ApiResponse.success(data);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@Valid @RequestBody EncargadoRequest request) {
        EncargadoResponse data = encargadoService.crear(request);
        return ApiResponse.created(data);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> toggleActivo(
            @PathVariable Integer id,
            @Valid @RequestBody ToggleActivoRequest request) {
        String mensaje = encargadoService.toggleActivo(id, request);
        return ApiResponse.message(mensaje);
    }
}
