package com.kapaq.controlador;

import com.kapaq.configuracion.ApiResponse;
import com.kapaq.dto.peticion.MetaRequest;
import com.kapaq.servicio.ReporteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/tendencias")
    public ResponseEntity<Map<String, Object>> tendencias() {
        Map<String, Object> data = reporteService.tendencias();
        return ApiResponse.success(data);
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Object>> resumen() {
        Map<String, Object> data = reporteService.resumen();
        return ApiResponse.success(data);
    }

    @GetMapping("/actividades")
    public ResponseEntity<Map<String, Object>> actividades() {
        List<Map<String, Object>> data = reporteService.actividades();
        return ApiResponse.success(data);
    }

    @GetMapping("/ventas")
    public ResponseEntity<Map<String, Object>> ventas() {
        Map<String, Object> data = reporteService.ventasPeriodo();
        return ApiResponse.success(data);
    }

    @GetMapping("/notas-credito")
    public ResponseEntity<Map<String, Object>> notasCredito() {
        List<Map<String, Object>> data = reporteService.notasCredito();
        return ApiResponse.success(data);
    }

    @GetMapping("/metas")
    public ResponseEntity<Map<String, Object>> getMetas() {
        List<Map<String, Object>> data = reporteService.getMetas();
        return ApiResponse.success(data);
    }

    @PutMapping("/metas/{tipo}")
    public ResponseEntity<Map<String, Object>> updateMeta(
            @PathVariable String tipo,
            @Valid @RequestBody MetaRequest request) {
        Map<String, Object> data = reporteService.updateMeta(tipo, request);
        return ApiResponse.success(data);
    }
}
