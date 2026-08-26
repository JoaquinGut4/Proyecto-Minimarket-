package com.kapaq.servicio;

import com.kapaq.configuracion.JwtUtil;
import com.kapaq.dto.peticion.EncargadoRequest;
import com.kapaq.dto.peticion.LoginRequest;
import com.kapaq.dto.peticion.ToggleActivoRequest;
import com.kapaq.dto.respuesta.EncargadoResponse;
import com.kapaq.dto.respuesta.LoginResponse;
import com.kapaq.entidad.Encargado;
import com.kapaq.excepcion.BusinessException;
import com.kapaq.excepcion.ResourceNotFoundException;
import com.kapaq.repositorio.EncargadoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EncargadoService {

    private final EncargadoRepository encargadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public List<EncargadoResponse> listar() {
        return encargadoRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        log.info("Intento de login: dni={}", request.getDni());
        Encargado e = encargadoRepository.findByDniAndActivoTrue(request.getDni())
                .orElseThrow(() -> {
                    log.warn("Login fallido - DNI no encontrado o inactivo: dni={}", request.getDni());
                    return new BusinessException("DNI o contraseña incorrecto");
                });

        // Verifica si la cuenta está bloqueada temporalmente
        if (e.getBloqueadoHasta() != null && e.getBloqueadoHasta().isAfter(java.time.LocalDateTime.now())) {
            log.warn("Login fallido - cuenta bloqueada hasta: {}, dni={}", e.getBloqueadoHasta(), request.getDni());
            throw new BusinessException("Cuenta bloqueada por demasiados intentos. Intenta nuevamente en 15 minutos");
        }

        if (!passwordEncoder.matches(request.getPassword(), e.getPasswordHash())) {
            e.setIntentosFallidos(e.getIntentosFallidos() + 1);
            log.warn("Login fallido - contraseña incorrecta: dni={}, intento {}/3", request.getDni(), e.getIntentosFallidos());

            // Bloquea tras 3 intentos fallidos por 15 minutos
            if (e.getIntentosFallidos() >= 3) {
                e.setBloqueadoHasta(java.time.LocalDateTime.now().plusMinutes(15));
                encargadoRepository.save(e);
                throw new BusinessException("Cuenta bloqueada por demasiados intentos. Intenta nuevamente en 15 minutos");
            }

            encargadoRepository.save(e);
            throw new BusinessException("DNI o contraseña incorrecto");
        }

        e.setIntentosFallidos(0);
        e.setBloqueadoHasta(null);
        encargadoRepository.save(e);

        String token = jwtUtil.generate(e.getId(), e.getDni(), e.getRol().name(), e.getNombre());

        log.info("Login exitoso: id={}, nombre={}, rol={}", e.getId(), e.getNombre(), e.getRol());
        return LoginResponse.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .dni(e.getDni())
                .telefono(e.getTelefono())
                .rol(e.getRol().name())
                .activo(e.getActivo())
                .token(token)
                .build();
    }

    @Transactional
    public EncargadoResponse crear(EncargadoRequest request) {
        log.info("Creando encargado: dni={}, nombre={}", request.getDni(), request.getNombre());
        if (encargadoRepository.existsByDni(request.getDni())) {
            log.warn("DNI ya registrado: dni={}", request.getDni());
            throw new BusinessException("El DNI ya está registrado");
        }

        String pwd = request.getPassword() != null ? request.getPassword() : "encargado";
        Encargado e = Encargado.builder()
                .nombre(request.getNombre())
                .dni(request.getDni())
                .telefono(request.getTelefono())
                .passwordHash(passwordEncoder.encode(pwd))
                .build();
        e = encargadoRepository.save(e);
        log.info("Encargado creado: id={}, dni={}", e.getId(), e.getDni());
        return toResponse(e);
    }

    @Transactional
    public String toggleActivo(Integer id, ToggleActivoRequest request) {
        log.info("Cambiando estado encargado: id={}, activo={}", id, request.getActivo());
        Encargado e = encargadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encargado no encontrado"));
        e.setActivo(request.getActivo());
        encargadoRepository.save(e);
        log.info("Estado encargado actualizado: id={}, activo={}", id, request.getActivo());
        return request.getActivo() ? "Colaborador activado" : "Colaborador desactivado";
    }

    private EncargadoResponse toResponse(Encargado e) {
        return EncargadoResponse.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .dni(e.getDni())
                .telefono(e.getTelefono())
                .rol(e.getRol().name())
                .activo(e.getActivo())
                .build();
    }
}
