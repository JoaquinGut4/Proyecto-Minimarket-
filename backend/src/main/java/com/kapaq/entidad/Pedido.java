package com.kapaq.entidad;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "codigo_recojo", nullable = false, unique = true, length = 6)
    private String codigoRecojo;

    @Column(name = "telefono_cliente", nullable = false, length = 15)
    private String telefonoCliente;

    @Column(name = "metodo_pago", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MetodoPago metodoPago = MetodoPago.reserva;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EstadoPedido estado = EstadoPedido.pendiente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encargado_id")
    private Encargado encargado;

    @Column(name = "creado_en", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime creadoEn = LocalDateTime.now();

    @Column(name = "actualizado_en", nullable = false)
    @Builder.Default
    private LocalDateTime actualizadoEn = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetallePedido> items = new ArrayList<>();

    public enum MetodoPago { yape, plin, efectivo, reserva }
    public enum EstadoPedido { pendiente, entregado, devuelto, cancelado }
}
