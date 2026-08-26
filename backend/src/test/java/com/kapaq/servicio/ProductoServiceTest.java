package com.kapaq.servicio;

import com.kapaq.dto.peticion.ProductoRequest;
import com.kapaq.entidad.Categoria;
import com.kapaq.entidad.Encargado;
import com.kapaq.entidad.Producto;
import com.kapaq.excepcion.ResourceNotFoundException;
import com.kapaq.repositorio.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock private ProductoRepository productoRepository;
    @Mock private CategoriaRepository categoriaRepository;
    @Mock private MovimientoStockRepository movimientoStockRepository;
    @Mock private EncargadoRepository encargadoRepository;

    private ProductoService productoService;

    @BeforeEach
    void setUp() {
        productoService = new ProductoService(productoRepository, categoriaRepository,
                movimientoStockRepository, encargadoRepository);
    }

    @Test
    void crear_shouldSaveAndReturnProducto() {
        Categoria cat = Categoria.builder().id(1).nombre("Bebidas").emoji("🥤").build();
        when(categoriaRepository.findById(1)).thenReturn(Optional.of(cat));

        Producto saved = Producto.builder().id(1).nombre("Coca Cola").precio(BigDecimal.valueOf(5.5))
                .stock(20).categoria(cat).activo(true).build();
        when(productoRepository.save(any())).thenReturn(saved);

        ProductoRequest request = ProductoRequest.builder()
                .nombre("Coca Cola").categoriaId(1)
                .precio(BigDecimal.valueOf(5.5)).stock(20).build();

        var response = productoService.crear(request);

        assertThat(response.getNombre()).isEqualTo("Coca Cola");
        assertThat(response.getPrecio()).isEqualByComparingTo(BigDecimal.valueOf(5.5));
        assertThat(response.getCategoria()).isEqualTo("Bebidas");
    }

    @Test
    void detalle_shouldThrowWhenNotFound() {
        when(productoRepository.findById(999)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productoService.detalle(999))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void desactivar_shouldSetActivoFalse() {
        Producto p = Producto.builder().id(1).activo(true).build();
        when(productoRepository.findById(1)).thenReturn(Optional.of(p));
        when(productoRepository.save(any())).thenReturn(p);

        productoService.desactivar(1);

        assertThat(p.getActivo()).isFalse();
        verify(productoRepository).save(p);
    }
}
