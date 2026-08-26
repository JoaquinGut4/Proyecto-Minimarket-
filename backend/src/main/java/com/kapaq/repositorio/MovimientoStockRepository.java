package com.kapaq.repositorio;

import com.kapaq.entidad.MovimientoStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Integer> {
    List<MovimientoStock> findAllByOrderByCreadoEnDesc();
    List<MovimientoStock> findByProductoIdOrderByCreadoEnDesc(Integer productoId);
}
