package com.kapaq.dto.respuesta;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EncargadoResponse {
    private Integer id;
    private String nombre;
    private String dni;
    private String telefono;
    private String rol;
    private Boolean activo;
}
