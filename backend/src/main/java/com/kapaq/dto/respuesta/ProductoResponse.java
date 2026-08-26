package com.kapaq.dto.respuesta;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductoResponse {
    private Integer id;
    private String nombre;
    private String emoji;
    private String categoria;
    private String catEmoji;
    private BigDecimal precio;
    private Integer stock;
    private Boolean refrigerado;
    private Boolean activo;
}
