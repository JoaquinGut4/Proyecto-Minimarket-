package com.kapaq.controlador;

import com.kapaq.configuracion.ApiResponse;
import com.kapaq.dto.respuesta.MovimientoResponse;
import com.kapaq.servicio.MovimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movimientos")
@RequiredArgsConstructor
public class MovimientoController {

    private final MovimientoService movimientoService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(
            @RequestParam(required = false) Integer productoId) {
        List<MovimientoResponse> data = movimientoService.listar(productoId);
        return ApiResponse.success(data);
    }
}
