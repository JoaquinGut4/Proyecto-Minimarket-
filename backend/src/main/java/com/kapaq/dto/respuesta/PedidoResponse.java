package com.kapaq.dto.respuesta;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PedidoResponse {
    private Integer id;
    private String codigoRecojo;
    private String telefonoCliente;
    private String metodoPago;
    private BigDecimal total;
    private String estado;
    private String encargado;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}
