package com.kapaq.repositorio;

import com.kapaq.entidad.Meta;
import com.kapaq.entidad.Meta.TipoMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Integer> {
    Optional<Meta> findByTipo(TipoMeta tipo);
}
