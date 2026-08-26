package com.kapaq.dto.respuesta;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovimientoResponse {
    private Integer id;
    private String encargado;
    private LocalDateTime fecha;
    private String producto;
    private String emoji;
    private String tipo;
    private Integer cantidad;
    private BigDecimal precioRef;
    private Integer pedidoId;
    private String observacion;
}
