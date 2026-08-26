package com.kapaq.dto.peticion;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginRequest {
    @NotBlank(message = "El DNI es obligatorio")
    private String dni;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
