package com.kapaq.repositorio;

import com.kapaq.entidad.Pedido;
import com.kapaq.entidad.Pedido.EstadoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    List<Pedido> findByEstadoOrderByCreadoEnDesc(EstadoPedido estado);
    List<Pedido> findAllByOrderByCreadoEnDesc();

    long countByEstadoAndCreadoEnBetween(EstadoPedido estado, java.time.LocalDateTime start, java.time.LocalDateTime end);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.estado = 'entregado' AND p.creadoEn >= :start AND p.creadoEn < :end")
    long countEntregadosBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.estado = 'entregado' AND p.creadoEn >= :start AND p.creadoEn < :end")
    BigDecimal sumVentasBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
