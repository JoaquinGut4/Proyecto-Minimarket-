package com.kapaq.controlador;

import com.kapaq.configuracion.ApiResponse;
import com.kapaq.dto.peticion.DevolverRequest;
import com.kapaq.dto.peticion.EntregarRequest;
import com.kapaq.dto.peticion.PedidoRequest;
import com.kapaq.dto.peticion.VerificarStockRequest;
import com.kapaq.dto.respuesta.PedidoDetalleResponse;
import com.kapaq.dto.respuesta.PedidoResponse;
import com.kapaq.servicio.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping("/verificar-stock")
    public ResponseEntity<Map<String, Object>> verificarStock(@Valid @RequestBody VerificarStockRequest request) {
        Map<String, Object> result = pedidoService.verificarStock(request);
        return ApiResponse.verificarStock(result);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crear(@Valid @RequestBody PedidoRequest request) {
        PedidoDetalleResponse data = pedidoService.crear(request);
        return ApiResponse.created(data);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(@RequestParam(required = false) String estado) {
        List<PedidoResponse> data = pedidoService.listar(estado);
        return ApiResponse.success(data);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> detalle(@PathVariable Integer id) {
        PedidoDetalleResponse data = pedidoService.detalle(id);
        return ApiResponse.success(data);
    }

    @PatchMapping("/{id}/entregar")
    public ResponseEntity<Map<String, Object>> entregar(
            @PathVariable Integer id,
            @Valid @RequestBody EntregarRequest request) {
        String mensaje = pedidoService.entregar(id, request);
        return ApiResponse.message(mensaje);
    }

    @PatchMapping("/{id}/devolver")
    public ResponseEntity<Map<String, Object>> devolver(
            @PathVariable Integer id,
            @Valid @RequestBody DevolverRequest request) {
        String mensaje = pedidoService.devolver(id, request);
        return ApiResponse.message(mensaje);
    }
}
