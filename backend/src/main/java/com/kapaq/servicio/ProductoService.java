package com.kapaq.servicio;

import com.kapaq.dto.peticion.ProductoRequest;
import com.kapaq.dto.peticion.ProductoUpdateRequest;
import com.kapaq.dto.respuesta.ProductoResponse;
import com.kapaq.entidad.Categoria;
import com.kapaq.entidad.Encargado;
import com.kapaq.entidad.MovimientoStock;
import com.kapaq.entidad.Producto;
import com.kapaq.excepcion.ResourceNotFoundException;
import com.kapaq.repositorio.CategoriaRepository;
import com.kapaq.repositorio.EncargadoRepository;
import com.kapaq.repositorio.MovimientoStockRepository;
import com.kapaq.repositorio.ProductoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final EncargadoRepository encargadoRepository;

    @Transactional(readOnly = true)
    public List<ProductoResponse> listar(String categoria, String q) {
        List<Producto> productos;
        if (categoria != null && !categoria.equals("Todos")) {
            productos = productoRepository.findByCategoriaNombre(categoria);
        } else if (q != null && !q.isBlank()) {
            productos = productoRepository.buscarPorNombre(q);
        } else {
            productos = productoRepository.findByActivoTrueOrderByCategoriaNombre();
        }
        return productos.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductoResponse detalle(Integer id) {
        return productoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> {
                    log.warn("Producto no encontrado: id={}", id);
                    return new ResourceNotFoundException("Producto no encontrado");
                });
    }

    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        log.info("Creando producto: nombre={}, categoriaId={}", request.getNombre(), request.getCategoriaId());
        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        Producto p = Producto.builder()
                .nombre(request.getNombre())
                .emoji(request.getEmoji() != null ? request.getEmoji() : "📦")
                .categoria(categoria)
                .precio(request.getPrecio())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .refrigerado(request.getRefrigerado() != null ? request.getRefrigerado() : false)
                .build();
        p = productoRepository.save(p);
        log.info("Producto creado: id={}, nombre={}", p.getId(), p.getNombre());
        return toResponse(p);
    }

    @Transactional
    public ProductoResponse actualizar(Integer id, ProductoUpdateRequest request) {
        log.info("Actualizando producto: id={}, encargadoId={}", id, request.getEncargadoId());
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Producto no encontrado para actualizar: id={}", id);
                    return new ResourceNotFoundException("Producto no encontrado");
                });

        Encargado encargado = encargadoRepository.findById(request.getEncargadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Encargado no encontrado"));

        BigDecimal nuevoPrecio = request.getPrecio() != null ? request.getPrecio() : p.getPrecio();
        Integer nuevoStock = request.getStock() != null ? request.getStock() : p.getStock();
        Integer diferencia = nuevoStock - p.getStock();

        p.setPrecio(nuevoPrecio);
        p.setStock(nuevoStock);
        p = productoRepository.save(p);

        // Registra el movimiento de stock por el ajuste manual
        MovimientoStock mov = MovimientoStock.builder()
                .producto(p)
                .encargado(encargado)
                .tipo(MovimientoStock.TipoMovimiento.ajuste)
                .cantidad(diferencia)
                .precioRef(nuevoPrecio)
                .observacion(request.getObservacion() != null ? request.getObservacion() : "Ajuste manual")
                .build();
        movimientoStockRepository.save(mov);

        log.info("Producto actualizado: id={}, stock={}, precio={}", id, nuevoStock, nuevoPrecio);
        return toResponse(p);
    }

    @Transactional
    public void desactivar(Integer id) {
        log.info("Desactivando producto: id={}", id);
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Producto no encontrado para desactivar: id={}", id);
                    return new ResourceNotFoundException("Producto no encontrado");
                });
        p.setActivo(false);
        productoRepository.save(p);
        log.info("Producto desactivado: id={}", id);
    }

    private ProductoResponse toResponse(Producto p) {
        return ProductoResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .emoji(p.getEmoji())
                .categoria(p.getCategoria().getNombre())
                .catEmoji(p.getCategoria().getEmoji())
                .precio(p.getPrecio())
                .stock(p.getStock())
                .refrigerado(p.getRefrigerado())
                .activo(p.getActivo())
                .build();
    }
}
