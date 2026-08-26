package com.kapaq.dto.peticion;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificarStockRequest {

    @NotEmpty(message = "Debe haber al menos un item")
    @Valid
    private List<ItemVerificar> items;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ItemVerificar {
        @NotNull(message = "El producto_id es obligatorio")
        private Integer productoId;

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        private Integer cantidad;
    }
}
