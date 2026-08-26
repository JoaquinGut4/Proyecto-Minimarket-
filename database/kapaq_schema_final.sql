-- ═══════════════════════════════════════════════════════════════
-- ESQUEMA COMPLETO — Minimarket Kapaq
-- Base de datos: kapaq_db
-- Motor: MySQL / InnoDB / utf8mb4
-- ═══════════════════════════════════════════════════════════════

DROP DATABASE IF EXISTS kapaq_db;

CREATE DATABASE kapaq_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kapaq_db;

-- ═══════════════════════ TABLAS ═══════════════════════

-- Categorías de productos (ej: Lácteos, Bebidas)
CREATE TABLE categorias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(60)  NOT NULL UNIQUE,
  emoji     VARCHAR(10)  NOT NULL DEFAULT '📦', -- Icono visual de la categoría
  activo    TINYINT      NOT NULL DEFAULT 1,
  creado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Productos del catálogo (con stock, precio y tipo refrigerado)
CREATE TABLE productos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(120)  NOT NULL,
  emoji          VARCHAR(10)   NOT NULL DEFAULT '📦',
  categoria_id   INT           NOT NULL,
  precio         DECIMAL(10,2) NOT NULL,
  stock          INT           NOT NULL DEFAULT 0,
  refrigerado    TINYINT       NOT NULL DEFAULT 0, -- 1 = requiere cadena de frío
  activo         TINYINT       NOT NULL DEFAULT 1,
  creado_en      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_cat FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB;

-- Encargados (colaboradores que operan el sistema)
CREATE TABLE encargados (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  dni       CHAR(8)      NOT NULL UNIQUE,
  telefono  VARCHAR(15)  NOT NULL,
  activo    TINYINT      NOT NULL DEFAULT 1,
  creado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Pedidos realizados por clientes (con código de recojo)
CREATE TABLE pedidos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  codigo_recojo    VARCHAR(6)    NOT NULL UNIQUE,    -- Código de 4 dígitos para recoger en tienda
  telefono_cliente VARCHAR(15)   NOT NULL,
  metodo_pago      ENUM('yape','plin','efectivo') NOT NULL DEFAULT 'yape',
  total            DECIMAL(10,2) NOT NULL,
  estado           ENUM('pendiente','entregado','devuelto','cancelado') NOT NULL DEFAULT 'pendiente',
  encargado_id     INT           NULL,               -- Quién entregó o procesó el pedido
  creado_en        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedido_enc FOREIGN KEY (encargado_id) REFERENCES encargados(id)
) ENGINE=InnoDB;

-- Detalle (líneas) de cada pedido — productos, cantidades y precios
CREATE TABLE detalle_pedido (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id   INT           NOT NULL,
  producto_id INT           NOT NULL,
  cantidad    INT           NOT NULL,
  precio_unit DECIMAL(10,2) NOT NULL,
  subtotal    DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unit) STORED,
  CONSTRAINT fk_det_pedido FOREIGN KEY (pedido_id)   REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_det_prod   FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- Historial de movimientos de stock (ventas, devoluciones, ajustes, ingresos)
CREATE TABLE movimientos_stock (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  producto_id  INT           NOT NULL,
  encargado_id INT           NOT NULL,
  tipo         ENUM('venta','devolucion','ajuste','ingreso') NOT NULL,
  cantidad     INT           NOT NULL,            -- Negativo = sale, Positivo = entra
  precio_ref   DECIMAL(10,2) NOT NULL,            -- Precio de referencia al momento del movimiento
  pedido_id    INT           NULL,                -- Opcional: pedido asociado (ventas/devoluciones)
  observacion  VARCHAR(255)  NULL,
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mov_prod FOREIGN KEY (producto_id)  REFERENCES productos(id),
  CONSTRAINT fk_mov_enc  FOREIGN KEY (encargado_id) REFERENCES encargados(id),
  CONSTRAINT fk_mov_ped  FOREIGN KEY (pedido_id)    REFERENCES pedidos(id)
) ENGINE=InnoDB;

-- Notas de crédito generadas automáticamente al devolver un pedido
CREATE TABLE notas_credito (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id    INT           NOT NULL UNIQUE,
  encargado_id INT           NOT NULL,
  monto        DECIMAL(10,2) NOT NULL,
  motivo       VARCHAR(255)  NOT NULL,
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_nc_pedido FOREIGN KEY (pedido_id)    REFERENCES pedidos(id),
  CONSTRAINT fk_nc_enc    FOREIGN KEY (encargado_id) REFERENCES encargados(id)
) ENGINE=InnoDB;

-- ═══════════════════════ ÍNDICES ═══════════════════════
CREATE INDEX idx_prod_cat   ON productos(categoria_id);
CREATE INDEX idx_prod_activ ON productos(activo);
CREATE INDEX idx_ped_estado ON pedidos(estado);
CREATE INDEX idx_ped_codigo ON pedidos(codigo_recojo);
CREATE INDEX idx_det_pedido ON detalle_pedido(pedido_id);
CREATE INDEX idx_det_prod   ON detalle_pedido(producto_id);
CREATE INDEX idx_mov_prod   ON movimientos_stock(producto_id);
CREATE INDEX idx_mov_fecha  ON movimientos_stock(creado_en);

-- ═══════════════════════ VISTAS ═══════════════════════

-- Vista principal de productos con nombre de categoría
CREATE VIEW v_productos AS
SELECT
  p.id,
  p.nombre,
  p.emoji,
  c.nombre    AS categoria,
  c.emoji     AS cat_emoji,
  p.precio,
  p.stock,
  p.refrigerado,
  p.activo
FROM productos p
JOIN categorias c ON c.id = p.categoria_id;

-- Vista de pedidos con nombre del encargado que lo procesó
CREATE VIEW v_pedidos AS
SELECT
  pd.id,
  pd.codigo_recojo,
  pd.telefono_cliente,
  pd.metodo_pago,
  pd.total,
  pd.estado,
  pd.creado_en,
  pd.actualizado_en,
  e.nombre AS encargado
FROM pedidos pd
LEFT JOIN encargados e ON e.id = pd.encargado_id;

-- Vista del detalle de pedidos con datos del producto
CREATE VIEW v_detalle_pedidos AS
SELECT
  dp.pedido_id,
  pd.codigo_recojo,
  pd.estado,
  pr.nombre    AS producto,
  pr.emoji,
  dp.cantidad,
  dp.precio_unit,
  dp.subtotal
FROM detalle_pedido dp
JOIN pedidos   pd ON pd.id = dp.pedido_id
JOIN productos pr ON pr.id = dp.producto_id;

-- Vista de movimientos de stock con datos relacionados
CREATE VIEW v_movimientos AS
SELECT
  mv.id,
  e.nombre       AS encargado,
  mv.creado_en   AS fecha,
  pr.nombre      AS producto,
  pr.emoji,
  mv.tipo,
  mv.cantidad,
  mv.precio_ref,
  mv.pedido_id,
  mv.observacion
FROM movimientos_stock mv
JOIN productos  pr ON pr.id = mv.producto_id
JOIN encargados e  ON e.id  = mv.encargado_id;

-- Vista analítica: top productos más vendidos en los últimos 30 días
CREATE VIEW v_tendencias_venta AS
SELECT
  pr.id,
  pr.nombre,
  pr.emoji,
  SUM(dp.cantidad) AS total_vendido,
  SUM(dp.subtotal) AS ingreso_total
FROM detalle_pedido dp
JOIN pedidos   pd ON pd.id = dp.pedido_id
JOIN productos pr ON pr.id = dp.producto_id
WHERE pd.estado = 'entregado'
  AND pd.creado_en >= NOW() - INTERVAL 30 DAY
GROUP BY pr.id, pr.nombre, pr.emoji
ORDER BY total_vendido DESC;

-- ═══════════════════════ DATOS INICIALES (SEED) ═══════════════════════

-- 7 categorías de productos
INSERT INTO categorias (nombre, emoji) VALUES
  ('Cereales',    '🌾'),
  ('Verduras',    '🥦'),
  ('Frutas',      '🍎'),
  ('P. Limpieza', '🧴'),
  ('Bebidas',     '🥤'),
  ('Lácteos',     '🥛'),
  ('Especias',    '🌶');

-- 16 productos de ejemplo
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado) VALUES
  ('Arroz Costeño 1kg',    '🌾', 1, 4.50, 40, 0),
  ('Avena 3 Ositos 200g',  '🌾', 1, 2.80, 25, 0),
  ('Fideos Don Vittorio',  '🍝', 1, 3.20, 35, 0),
  ('Aceite Primor 1L',     '🫙', 1, 7.90, 22, 0),
  ('Brócoli Fresco',       '🥦', 2, 2.00, 15, 1),
  ('Tomate Italiano',      '🍅', 2, 1.50, 30, 0),
  ('Manzana Delicious',    '🍎', 3, 1.00, 50, 0),
  ('Plátano de Isla',      '🍌', 3, 0.50, 60, 0),
  ('Detergente Ariel 1kg', '🧴', 4, 9.90, 12, 0),
  ('Lejía Clorox 500ml',   '🧼', 4, 3.50, 18, 0),
  ('Inca Kola 1.5L',       '🥤', 5, 5.50, 20, 0),
  ('Agua San Mateo 625ml', '💧', 5, 1.20, 45, 0),
  ('Leche Gloria 1L',      '🥛', 6, 5.20,  3, 1),
  ('Yogur Laive 500g',     '🥛', 6, 4.80,  8, 1),
  ('Pimienta Negra 50g',   '🌶', 7, 1.80, 20, 0),
  ('Comino Molido 50g',    '🌿', 7, 1.50, 15, 0);

-- 2 encargados de prueba
INSERT INTO encargados (nombre, dni, telefono) VALUES
  ('Carlos Mendoza', '12345678', '987654321'),
  ('Ana Quispe',     '87654321', '912345678');

-- 3 pedidos de ejemplo (2 pendientes, 1 entregado)
INSERT INTO pedidos (codigo_recojo, telefono_cliente, metodo_pago, total, estado) VALUES
  ('4782', '987654321', 'yape',  14.50, 'pendiente'),
  ('3315', '912345678', 'plin',  20.60, 'pendiente'),
  ('9901', '956123456', 'yape',  11.40, 'entregado');

-- Detalle de los pedidos de ejemplo
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unit) VALUES
  (1, 1, 2, 4.50),
  (1, 11, 1, 5.50),
  (2, 13, 3, 5.20),
  (2, 7,  5, 1.00),
  (3, 15, 2, 1.80),
  (3, 12, 6, 1.20);

-- Asignar encargado al pedido entregado
UPDATE pedidos SET encargado_id = 1 WHERE id = 3;

-- Movimientos de stock generados por la venta del pedido #3
INSERT INTO movimientos_stock (producto_id, encargado_id, tipo, cantidad, precio_ref, pedido_id) VALUES
  (15, 1, 'venta', -2, 1.80, 3),
  (12, 1, 'venta', -6, 1.20, 3);

-- ═══════════════════════ VERIFICACIÓN FINAL ═══════════════════════
SELECT 'categorias'       AS tabla, COUNT(*) AS registros FROM categorias
UNION ALL
SELECT 'productos',                  COUNT(*) FROM productos
UNION ALL
SELECT 'encargados',                 COUNT(*) FROM encargados
UNION ALL
SELECT 'pedidos',                    COUNT(*) FROM pedidos
UNION ALL
SELECT 'detalle_pedido',             COUNT(*) FROM detalle_pedido
UNION ALL
SELECT 'movimientos_stock',          COUNT(*) FROM movimientos_stock;
