package com.kapaq.dto.peticion;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductoUpdateRequest {
    private BigDecimal precio;
    private Integer stock;

    @NotNull(message = "Falta encargado_id")
    private Integer encargadoId;

    private String observacion;
}
