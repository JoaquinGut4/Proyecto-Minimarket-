package com.kapaq.dto.peticion;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ToggleActivoRequest {
    @NotNull(message = "Falta campo activo")
    private Boolean activo;
}
