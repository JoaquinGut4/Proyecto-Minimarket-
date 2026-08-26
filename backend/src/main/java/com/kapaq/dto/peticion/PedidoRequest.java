package com.kapaq.dto.peticion;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PedidoRequest {
    @NotBlank(message = "El código de recojo es obligatorio")
    private String codigoRecojo;

    @NotBlank(message = "El teléfono del cliente es obligatorio")
    private String telefonoCliente;

    private String metodoPago;

    @NotNull(message = "El total es obligatorio")
    private BigDecimal total;

    @NotEmpty(message = "Debe haber al menos un item")
    @Valid
    private List<ItemPedido> items;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ItemPedido {
        @NotNull(message = "El producto_id es obligatorio")
        private Integer productoId;

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        private Integer cantidad;

        @NotNull(message = "El precio_unit es obligatorio")
        private BigDecimal precioUnit;
    }
}
