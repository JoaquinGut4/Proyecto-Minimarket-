package com.kapaq.repositorio;

import com.kapaq.entidad.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    List<Categoria> findByActivoTrueOrderByNombre();
}
