package com.kapaq.servicio;

import com.kapaq.dto.peticion.MetaRequest;
import com.kapaq.entidad.Encargado;
import com.kapaq.entidad.Meta;
import com.kapaq.entidad.Pedido;
import com.kapaq.excepcion.BusinessException;
import com.kapaq.excepcion.ResourceNotFoundException;
import com.kapaq.repositorio.EncargadoRepository;
import com.kapaq.repositorio.MetaRepository;
import com.kapaq.repositorio.PedidoRepository;
import com.kapaq.repositorio.ProductoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReporteService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final MetaRepository metaRepository;
    private final EncargadoRepository encargadoRepository;

    @PersistenceContext
    private EntityManager em;

    @Transactional(readOnly = true)
    public Map<String, Object> tendencias() {
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);

        // Top 10 productos más vendidos en los últimos 30 días
        @SuppressWarnings("unchecked")
        List<Object[]> topRows = em.createNativeQuery(
                "SELECT pr.id, pr.nombre, pr.emoji, SUM(dp.cantidad) AS total_vendido, SUM(dp.subtotal) AS ingreso_total " +
                "FROM detalle_pedido dp " +
                "JOIN pedidos pd ON pd.id = dp.pedido_id " +
                "JOIN productos pr ON pr.id = dp.producto_id " +
                "WHERE pd.estado = 'entregado' AND pd.creado_en >= :monthAgo " +
                "GROUP BY pr.id, pr.nombre, pr.emoji ORDER BY total_vendido DESC LIMIT 10")
                .setParameter("monthAgo", monthAgo)
                .getResultList();

        List<Map<String, Object>> productos = new ArrayList<>();
        for (Object[] row : topRows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", row[0]);
            m.put("nombre", row[1]);
            m.put("emoji", row[2]);
            m.put("total_vendido", row[3]);
            m.put("ingreso_total", row[4]);
            productos.add(m);
        }

        // Distribución de métodos de pago en pedidos entregados
        @SuppressWarnings("unchecked")
        List<Object[]> metRows = em.createNativeQuery(
                "SELECT metodo_pago, COUNT(*) AS total_pedidos, SUM(total) AS total_monto " +
                "FROM pedidos WHERE estado = 'entregado' " +
                "GROUP BY metodo_pago ORDER BY total_monto DESC")
                .getResultList();

        List<Map<String, Object>> metodosPago = new ArrayList<>();
        for (Object[] row : metRows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("metodo_pago", row[0]);
            m.put("total_pedidos", row[1]);
            m.put("total_monto", row[2]);
            metodosPago.add(m);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("productos", productos);
        result.put("metodos_pago", metodosPago);
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> resumen() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime startOfNextDay = startOfDay.plusDays(1);

        long ventasCount = pedidoRepository.countEntregadosBetween(startOfDay, startOfNextDay);
        BigDecimal ventasMonto = pedidoRepository.sumVentasBetween(startOfDay, startOfNextDay);
        long pendientes = pedidoRepository.countByEstadoAndCreadoEnBetween(
                Pedido.EstadoPedido.pendiente, LocalDateTime.MIN, LocalDateTime.MAX);
        long stockBajo = productoRepository.findByStockLessThanEqualAndActivoTrue(5).size();

        Map<String, Object> ventasHoy = new LinkedHashMap<>();
        ventasHoy.put("total", ventasCount);
        ventasHoy.put("monto", ventasMonto);

        Map<String, Object> pendientesMap = new LinkedHashMap<>();
        pendientesMap.put("total", pendientes);

        Map<String, Object> stockBajoMap = new LinkedHashMap<>();
        stockBajoMap.put("total", stockBajo);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ventas_hoy", ventasHoy);
        result.put("pendientes", pendientesMap);
        result.put("stock_bajo", stockBajoMap);

        Map<String, Object> topVendedor = getTopVendedor(startOfDay, startOfNextDay);
        result.put("top_vendedor", topVendedor);

        return result;
    }

    // Obtiene el encargado con más entregas en un período
    private Map<String, Object> getTopVendedor(LocalDateTime start, LocalDateTime end) {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
                "SELECT e.nombre, COUNT(p.id) AS entregados " +
                "FROM pedidos p JOIN encargados e ON e.id = p.encargado_id " +
                "WHERE p.estado = 'entregado' AND p.creado_en >= :start AND p.creado_en < :end " +
                "GROUP BY e.id, e.nombre ORDER BY entregados DESC LIMIT 1")
                .setParameter("start", start)
                .setParameter("end", end)
                .getResultList();

        if (rows.isEmpty()) return null;

        Object[] row = rows.get(0);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("nombre", row[0]);
        m.put("entregados", row[1]);
        return m;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> ventasPeriodo() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfNextDay = startOfDay.plusDays(1);

        LocalDateTime startOfWeek = today.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).atStartOfDay();
        LocalDateTime startOfNextWeek = startOfWeek.plusWeeks(1);

        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime startOfNextMonth = startOfMonth.plusMonths(1);

        Map<String, Object> dia = buildPeriodo(startOfDay, startOfNextDay);
        Map<String, Object> semana = buildPeriodo(startOfWeek, startOfNextWeek);
        Map<String, Object> mes = buildPeriodo(startOfMonth, startOfNextMonth);

        LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();
        LocalDateTime startOfDayAfterTomorrow = startOfTomorrow.plusDays(1);
        Map<String, Object> manana = buildPeriodo(startOfTomorrow, startOfDayAfterTomorrow);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("dia", dia);
        result.put("semana", semana);
        result.put("mes", mes);
        result.put("manana", manana);
        return result;
    }

    // Construye datos de ventas vs meta para un período específico
    private Map<String, Object> buildPeriodo(LocalDateTime start, LocalDateTime end) {
        long count = pedidoRepository.countEntregadosBetween(start, end);
        BigDecimal monto = pedidoRepository.sumVentasBetween(start, end);

        Meta.TipoMeta tipo;
        if (end.minusDays(1).toLocalDate().equals(LocalDate.now())) tipo = Meta.TipoMeta.DIA;
        else if (end.minusDays(7).toLocalDate().equals(LocalDate.now())) tipo = Meta.TipoMeta.SEMANA;
        else if (start.toLocalDate().equals(LocalDate.now().plusDays(1))) tipo = Meta.TipoMeta.MANANA;
        else tipo = Meta.TipoMeta.MES;

        BigDecimal meta = metaRepository.findByTipo(tipo)
                .map(Meta::getMonto).orElse(BigDecimal.ZERO);

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("total_pedidos", count);
        m.put("monto", monto);
        m.put("meta", meta);
        return m;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> actividades() {
        // Últimas 30 actividades (pedidos, movimientos, notas de crédito) en los últimos 7 días
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Map<String, Object>> result = new ArrayList<>();

        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
                "SELECT 'pedido' AS tipo, id, codigo_recojo AS referencia, " +
                "CONCAT('Nuevo pedido: ', codigo_recojo) AS descripcion, " +
                "creado_en AS fecha, NULL AS encargado " +
                "FROM pedidos WHERE creado_en >= :weekAgo " +
                "UNION ALL " +
                "SELECT 'movimiento' AS tipo, ms.id, pr.nombre AS referencia, " +
                "CONCAT(ms.tipo, ' de ', pr.nombre) AS descripcion, " +
                "ms.creado_en AS fecha, e.nombre AS encargado " +
                "FROM movimientos_stock ms " +
                "JOIN productos pr ON pr.id = ms.producto_id " +
                "JOIN encargados e ON e.id = ms.encargado_id " +
                "WHERE ms.creado_en >= :weekAgo " +
                "UNION ALL " +
                "SELECT 'nota_credito' AS tipo, nc.id, pd.codigo_recojo AS referencia, " +
                "CONCAT('Nota de crédito por S/ ', nc.monto) AS descripcion, " +
                "nc.creado_en AS fecha, e.nombre AS encargado " +
                "FROM notas_credito nc " +
                "JOIN pedidos pd ON pd.id = nc.pedido_id " +
                "JOIN encargados e ON e.id = nc.encargado_id " +
                "WHERE nc.creado_en >= :weekAgo " +
                "ORDER BY fecha DESC LIMIT 30")
                .setParameter("weekAgo", weekAgo)
                .getResultList();

        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("tipo", row[0]);
            m.put("id", row[1]);
            m.put("referencia", row[2]);
            m.put("descripcion", row[3]);
            m.put("fecha", row[4]);
            m.put("encargado", row[5]);
            result.add(m);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> notasCredito() {
        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(
                "SELECT nc.id, nc.pedido_id, pd.codigo_recojo, e.nombre AS encargado, " +
                "e.id AS encargado_id, nc.monto, nc.motivo, nc.creado_en " +
                "FROM notas_credito nc " +
                "JOIN encargados e ON e.id = nc.encargado_id " +
                "JOIN pedidos pd ON pd.id = nc.pedido_id " +
                "ORDER BY nc.creado_en DESC")
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", row[0]);
            m.put("pedido_id", row[1]);
            m.put("codigo_recojo", row[2]);
            m.put("encargado", row[3]);
            m.put("encargado_id", row[4]);
            m.put("monto", row[5]);
            m.put("motivo", row[6]);
            m.put("creado_en", row[7]);
            result.add(m);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMetas() {
        List<Meta> metas = metaRepository.findAll();
        return metas.stream().map(m -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", m.getId());
            map.put("tipo", m.getTipo().name());
            map.put("monto", m.getMonto());
            map.put("encargado_id", m.getEncargado().getId());
            map.put("creado_en", m.getCreadoEn());
            return map;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> updateMeta(String tipo, MetaRequest request) {
        log.info("Actualizando meta: tipo={}, encargadoId={}, monto={}", tipo, request.getEncargadoId(), request.getMonto());
        Meta.TipoMeta tipoMeta;
        try {
            tipoMeta = Meta.TipoMeta.valueOf(tipo.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Tipo inválido. Use: DIA, SEMANA, MES o MANANA");
        }

        Encargado encargado = encargadoRepository.findById(request.getEncargadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Encargado no encontrado"));

        // Crea o actualiza la meta según el tipo
        Meta meta = metaRepository.findByTipo(tipoMeta).orElse(null);
        if (meta == null) {
            meta = Meta.builder()
                    .tipo(tipoMeta)
                    .monto(request.getMonto())
                    .encargado(encargado)
                    .build();
        } else {
            meta.setMonto(request.getMonto());
            meta.setEncargado(encargado);
        }
        meta = metaRepository.save(meta);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", meta.getId());
        result.put("tipo", meta.getTipo().name());
        result.put("monto", meta.getMonto());
        result.put("encargado_id", meta.getEncargado().getId());
        result.put("creado_en", meta.getCreadoEn());
        return result;
    }
}
