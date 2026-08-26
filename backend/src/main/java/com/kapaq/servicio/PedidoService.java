package com.kapaq.servicio;

import com.kapaq.dto.peticion.DevolverRequest;
import com.kapaq.dto.peticion.EntregarRequest;
import com.kapaq.dto.peticion.PedidoRequest;
import com.kapaq.dto.peticion.VerificarStockRequest;
import com.kapaq.dto.respuesta.PedidoDetalleResponse;
import com.kapaq.dto.respuesta.PedidoResponse;
import com.kapaq.entidad.DetallePedido;
import com.kapaq.entidad.Encargado;
import com.kapaq.entidad.MovimientoStock;
import com.kapaq.entidad.NotaCredito;
import com.kapaq.entidad.Pedido;
import com.kapaq.entidad.Producto;
import com.kapaq.excepcion.BusinessException;
import com.kapaq.excepcion.ResourceNotFoundException;
import com.kapaq.repositorio.DetallePedidoRepository;
import com.kapaq.repositorio.EncargadoRepository;
import com.kapaq.repositorio.MovimientoStockRepository;
import com.kapaq.repositorio.NotaCreditoRepository;
import com.kapaq.repositorio.PedidoRepository;
import com.kapaq.repositorio.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final ProductoRepository productoRepository;
    private final EncargadoRepository encargadoRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final NotaCreditoRepository notaCreditoRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> verificarStock(VerificarStockRequest request) {
        // Verifica disponibilidad de cada producto antes de crear el pedido
        List<Map<String, Object>> problemas = new ArrayList<>();
        for (var item : request.getItems()) {
            Producto p = productoRepository.findById(item.getProductoId()).orElse(null);
            if (p == null || !p.getActivo() || p.getStock() < item.getCantidad()) {
                Map<String, Object> prob = new LinkedHashMap<>();
                prob.put("producto_id", item.getProductoId());
                prob.put("nombre", p != null ? p.getNombre() : "Desconocido");
                prob.put("stock_disponible", p != null ? p.getStock() : 0);
                prob.put("solicitado", item.getCantidad());
                problemas.add(prob);
            }
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ok", problemas.isEmpty());
        if (!problemas.isEmpty()) {
            result.put("problemas", problemas);
        } else {
            result.put("mensaje", "Stock disponible para todos los productos");
        }
        return result;
    }

    @Transactional
    public PedidoDetalleResponse crear(PedidoRequest request) {
        log.info("Creando pedido: {} items, total={}", request.getItems().size(), request.getTotal());
        // Valida stock suficiente para cada item
        for (var item : request.getItems()) {
            Producto p = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new BusinessException("Producto id=" + item.getProductoId() + " no encontrado"));
            if (p.getStock() < item.getCantidad()) {
                log.warn("Stock insuficiente: producto={}, disponible={}, solicitado={}",
                        p.getNombre(), p.getStock(), item.getCantidad());
                throw new BusinessException("Stock insuficiente para producto " + p.getNombre());
            }
        }

        Pedido pedido = Pedido.builder()
                .codigoRecojo(request.getCodigoRecojo())
                .telefonoCliente(request.getTelefonoCliente())
                .metodoPago(Pedido.MetodoPago.valueOf(request.getMetodoPago() != null ? request.getMetodoPago() : "reserva"))
                .total(request.getTotal())
                .build();

        List<DetallePedido> items = new ArrayList<>();
        for (var itemReq : request.getItems()) {
            Producto p = productoRepository.findById(itemReq.getProductoId()).orElseThrow();
            DetallePedido dp = DetallePedido.builder()
                    .pedido(pedido)
                    .producto(p)
                    .cantidad(itemReq.getCantidad())
                    .precioUnit(itemReq.getPrecioUnit())
                    .build();
            items.add(dp);
        }
        pedido.setItems(items);
        pedido = pedidoRepository.save(pedido);

        return toDetalleResponse(pedido);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(String estado) {
        List<Pedido> pedidos;
        if (estado != null && !estado.isBlank()) {
            pedidos = pedidoRepository.findByEstadoOrderByCreadoEnDesc(
                    Pedido.EstadoPedido.valueOf(estado));
        } else {
            pedidos = pedidoRepository.findAllByOrderByCreadoEnDesc();
        }
        return pedidos.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PedidoDetalleResponse detalle(Integer id) {
        return pedidoRepository.findById(id)
                .map(this::toDetalleResponse)
                .orElseThrow(() -> {
                    log.warn("Pedido no encontrado: id={}", id);
                    return new ResourceNotFoundException("Pedido no encontrado");
                });
    }

    @Transactional
    public String entregar(Integer id, EntregarRequest request) {
        log.info("Entregando pedido: id={}, encargadoId={}", id, request.getEncargadoId());
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Pedido no encontrado para entrega: id={}", id);
                    return new ResourceNotFoundException("Pedido no encontrado");
                });

        if (pedido.getEstado() != Pedido.EstadoPedido.pendiente) {
            log.warn("Pedido no está pendiente: id={}, estado={}", id, pedido.getEstado());
            throw new BusinessException("El pedido no está en estado pendiente");
        }

        Encargado encargado = encargadoRepository.findById(request.getEncargadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Encargado no encontrado"));

        pedido.setEstado(Pedido.EstadoPedido.entregado);
        pedido.setEncargado(encargado);
        pedido.setActualizadoEn(java.time.LocalDateTime.now());
        pedidoRepository.save(pedido);

        // Descuenta stock y registra movimiento de venta por cada item
        for (var item : pedido.getItems()) {
            Producto p = item.getProducto();
            p.setStock(p.getStock() - item.getCantidad());
            productoRepository.save(p);

            MovimientoStock mov = MovimientoStock.builder()
                    .producto(p)
                    .encargado(encargado)
                    .tipo(MovimientoStock.TipoMovimiento.venta)
                    .cantidad(-item.getCantidad())
                    .precioRef(item.getPrecioUnit())
                    .pedido(pedido)
                    .build();
            movimientoStockRepository.save(mov);
        }
        return "Pedido entregado y stock actualizado";
    }

    @Transactional
    public String devolver(Integer id, DevolverRequest request) {
        log.info("Devolviendo pedido: id={}, encargadoId={}, motivo={}", id, request.getEncargadoId(), request.getMotivo());
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Pedido no encontrado para devolución: id={}", id);
                    return new ResourceNotFoundException("Pedido no encontrado");
                });

        if (pedido.getEstado() != Pedido.EstadoPedido.pendiente
                && pedido.getEstado() != Pedido.EstadoPedido.entregado) {
            log.warn("Pedido no puede ser devuelto: id={}, estado={}", id, pedido.getEstado());
            throw new BusinessException("El pedido no puede ser devuelto");
        }

        Encargado encargado = encargadoRepository.findById(request.getEncargadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Encargado no encontrado"));

        pedido.setEstado(Pedido.EstadoPedido.devuelto);
        pedido.setEncargado(encargado);
        pedido.setActualizadoEn(java.time.LocalDateTime.now());
        pedidoRepository.save(pedido);

        // Restaura stock y registra movimiento de devolución
        for (var item : pedido.getItems()) {
            Producto p = item.getProducto();
            p.setStock(p.getStock() + item.getCantidad());
            productoRepository.save(p);

            MovimientoStock mov = MovimientoStock.builder()
                    .producto(p)
                    .encargado(encargado)
                    .tipo(MovimientoStock.TipoMovimiento.devolucion)
                    .cantidad(item.getCantidad())
                    .precioRef(item.getPrecioUnit())
                    .pedido(pedido)
                    .observacion(request.getMotivo() != null ? request.getMotivo() : "Devolución")
                    .build();
            movimientoStockRepository.save(mov);
        }

        // Genera nota de crédito asociada a la devolución
        NotaCredito nc = NotaCredito.builder()
                .pedido(pedido)
                .encargado(encargado)
                .monto(pedido.getTotal())
                .motivo(request.getMotivo() != null ? request.getMotivo() : "Sin motivo especificado")
                .build();
        notaCreditoRepository.save(nc);
        log.info("Pedido devuelto: id={}, codigo={}, notaCrédito generada", id, pedido.getCodigoRecojo());
        return "Devolución registrada y Nota de Crédito generada";
    }

    private PedidoResponse toResponse(Pedido p) {
        return PedidoResponse.builder()
                .id(p.getId())
                .codigoRecojo(p.getCodigoRecojo())
                .telefonoCliente(p.getTelefonoCliente())
                .metodoPago(p.getMetodoPago().name())
                .total(p.getTotal())
                .estado(p.getEstado().name())
                .encargado(p.getEncargado() != null ? p.getEncargado().getNombre() : null)
                .creadoEn(p.getCreadoEn())
                .actualizadoEn(p.getActualizadoEn())
                .build();
    }

    private PedidoDetalleResponse toDetalleResponse(Pedido p) {
        List<PedidoDetalleResponse.DetalleItem> items = p.getItems().stream()
                .map(dp -> PedidoDetalleResponse.DetalleItem.builder()
                        .producto(dp.getProducto().getNombre())
                        .emoji(dp.getProducto().getEmoji())
                        .cantidad(dp.getCantidad())
                        .precioUnit(dp.getPrecioUnit())
                        .subtotal(dp.getPrecioUnit().multiply(BigDecimal.valueOf(dp.getCantidad())))
                        .build())
                .collect(Collectors.toList());

        return PedidoDetalleResponse.builder()
                .id(p.getId())
                .codigoRecojo(p.getCodigoRecojo())
                .telefonoCliente(p.getTelefonoCliente())
                .metodoPago(p.getMetodoPago().name())
                .total(p.getTotal())
                .estado(p.getEstado().name())
                .encargado(p.getEncargado() != null ? p.getEncargado().getNombre() : null)
                .creadoEn(p.getCreadoEn())
                .actualizadoEn(p.getActualizadoEn())
                .items(items)
                .build();
    }
}
