package com.kapaq.entidad;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_stock")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovimientoStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encargado_id", nullable = false)
    private Encargado encargado;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_ref", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @Column(length = 255)
    private String observacion;

    @Column(name = "creado_en", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime creadoEn = LocalDateTime.now();

    public enum TipoMovimiento { venta, devolucion, ajuste, ingreso }
}
