package com.kapaq.repositorio;

import com.kapaq.entidad.NotaCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface NotaCreditoRepository extends JpaRepository<NotaCredito, Integer> {
}
