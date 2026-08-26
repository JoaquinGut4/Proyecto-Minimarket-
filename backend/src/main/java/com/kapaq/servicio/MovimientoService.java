package com.kapaq.servicio;

import com.kapaq.dto.respuesta.MovimientoResponse;
import com.kapaq.entidad.MovimientoStock;
import com.kapaq.repositorio.MovimientoStockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovimientoService {

    private final MovimientoStockRepository movimientoStockRepository;

    @Transactional(readOnly = true)
    public List<MovimientoResponse> listar(Integer productoId) {
        List<MovimientoStock> movimientos;
        if (productoId != null) {
            movimientos = movimientoStockRepository.findByProductoIdOrderByCreadoEnDesc(productoId);
        } else {
            movimientos = movimientoStockRepository.findAllByOrderByCreadoEnDesc();
        }
        return movimientos.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private MovimientoResponse toResponse(MovimientoStock m) {
        return MovimientoResponse.builder()
                .id(m.getId())
                .encargado(m.getEncargado().getNombre())
                .fecha(m.getCreadoEn())
                .producto(m.getProducto().getNombre())
                .emoji(m.getProducto().getEmoji())
                .tipo(m.getTipo().name())
                .cantidad(m.getCantidad())
                .precioRef(m.getPrecioRef())
                .pedidoId(m.getPedido() != null ? m.getPedido().getId() : null)
                .observacion(m.getObservacion())
                .build();
    }
}
