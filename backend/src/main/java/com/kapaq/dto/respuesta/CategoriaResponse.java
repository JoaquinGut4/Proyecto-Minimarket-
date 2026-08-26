package com.kapaq.dto.respuesta;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CategoriaResponse {
    private Integer id;
    private String nombre;
    private String emoji;
    private Boolean activo;
}
