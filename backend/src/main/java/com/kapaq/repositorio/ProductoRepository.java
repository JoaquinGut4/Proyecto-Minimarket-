package com.kapaq.repositorio;

import com.kapaq.entidad.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByActivoTrueOrderByCategoriaNombre();

    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria c WHERE p.activo = true AND c.nombre = :categoria ORDER BY c.nombre, p.nombre")
    List<Producto> findByCategoriaNombre(@Param("categoria") String categoria);

    @Query("SELECT p FROM Producto p JOIN FETCH p.categoria c WHERE p.activo = true AND LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%')) ORDER BY c.nombre, p.nombre")
    List<Producto> buscarPorNombre(@Param("q") String q);

    List<Producto> findByStockLessThanEqualAndActivoTrue(Integer stock);
}
