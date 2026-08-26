package com.kapaq.dto.peticion;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductoRequest {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120)
    private String nombre;

    private String emoji;

    @NotNull(message = "La categoría es obligatoria")
    private Integer categoriaId;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private BigDecimal precio;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private Boolean refrigerado;
}
