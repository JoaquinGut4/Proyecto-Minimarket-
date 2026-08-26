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
@Table(name = "metas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private TipoMeta tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encargado_id", nullable = false)
    private Encargado encargado;

    @Column(name = "creado_en", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime creadoEn = LocalDateTime.now();

    @Column(name = "actualizado_en", nullable = false)
    @Builder.Default
    private LocalDateTime actualizadoEn = LocalDateTime.now();

    public enum TipoMeta { DIA, SEMANA, MES, MANANA }
}
