package com.kapaq.servicio;

import com.kapaq.dto.respuesta.CategoriaResponse;
import com.kapaq.entidad.Categoria;
import com.kapaq.repositorio.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findByActivoTrueOrderByNombre()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private CategoriaResponse toResponse(Categoria c) {
        return CategoriaResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .emoji(c.getEmoji())
                .activo(c.getActivo())
                .build();
    }
}
