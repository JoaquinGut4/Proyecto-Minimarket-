package com.kapaq.servicio;

import com.kapaq.dto.peticion.*;
import com.kapaq.entidad.*;
import com.kapaq.excepcion.BusinessException;
import com.kapaq.excepcion.ResourceNotFoundException;
import com.kapaq.repositorio.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock private PedidoRepository pedidoRepository;
    @Mock private DetallePedidoRepository detallePedidoRepository;
    @Mock private ProductoRepository productoRepository;
    @Mock private EncargadoRepository encargadoRepository;
    @Mock private MovimientoStockRepository movimientoStockRepository;
    @Mock private NotaCreditoRepository notaCreditoRepository;

    private PedidoService pedidoService;

    @BeforeEach
    void setUp() {
        pedidoService = new PedidoService(pedidoRepository, detallePedidoRepository,
                productoRepository, encargadoRepository,
                movimientoStockRepository, notaCreditoRepository);
    }

    @Test
    void verificarStock_shouldReturnOkWhenStockAvailable() {
        VerificarStockRequest request = VerificarStockRequest.builder()
                .items(List.of(
                        VerificarStockRequest.ItemVerificar.builder().productoId(1).cantidad(2).build()
                ))
                .build();

        Producto p = Producto.builder().id(1).nombre("Test").stock(10).activo(true).build();
        when(productoRepository.findById(1)).thenReturn(Optional.of(p));

        var result = pedidoService.verificarStock(request);

        assertThat(result.get("ok")).isEqualTo(true);
    }

    @Test
    void verificarStock_shouldReturnProblemsWhenInsufficientStock() {
        VerificarStockRequest request = VerificarStockRequest.builder()
                .items(List.of(
                        VerificarStockRequest.ItemVerificar.builder().productoId(1).cantidad(20).build()
                ))
                .build();

        Producto p = Producto.builder().id(1).nombre("Test").stock(5).activo(true).build();
        when(productoRepository.findById(1)).thenReturn(Optional.of(p));

        var result = pedidoService.verificarStock(request);

        assertThat(result.get("ok")).isEqualTo(false);
    }

    @Test
    void crear_shouldThrowWhenStockInsufficient() {
        PedidoRequest request = PedidoRequest.builder()
                .codigoRecojo("A1234")
                .telefonoCliente("999888777")
                .total(BigDecimal.TEN)
                .items(List.of(
                        PedidoRequest.ItemPedido.builder().productoId(1).cantidad(10).precioUnit(BigDecimal.ONE).build()
                ))
                .build();

        Producto p = Producto.builder().id(1).nombre("Test").stock(5).activo(true).build();
        when(productoRepository.findById(1)).thenReturn(Optional.of(p));

        assertThatThrownBy(() -> pedidoService.crear(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Stock insuficiente");
    }

    @Test
    void entregar_shouldThrowWhenPedidoNotPendiente() {
        Pedido pedido = Pedido.builder().id(1)
                .estado(Pedido.EstadoPedido.entregado)
                .build();
        when(pedidoRepository.findById(1)).thenReturn(Optional.of(pedido));

        EntregarRequest request = new EntregarRequest();
        request.setEncargadoId(1);

        assertThatThrownBy(() -> pedidoService.entregar(1, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("no está en estado pendiente");
    }
}
