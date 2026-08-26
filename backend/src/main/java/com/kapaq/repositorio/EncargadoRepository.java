package com.kapaq.repositorio;

import com.kapaq.entidad.Encargado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EncargadoRepository extends JpaRepository<Encargado, Integer> {
    Optional<Encargado> findByDniAndActivoTrue(String dni);
    boolean existsByDni(String dni);
}
