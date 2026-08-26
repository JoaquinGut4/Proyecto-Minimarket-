CREATE TABLE categorias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(60)  NOT NULL UNIQUE,
  emoji     VARCHAR(10)  NOT NULL DEFAULT '📦',
  activo    TINYINT      NOT NULL DEFAULT 1,
  creado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE productos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nombre         VARCHAR(120)  NOT NULL,
  emoji          VARCHAR(10)   NOT NULL DEFAULT '📦',
  categoria_id   INT           NOT NULL,
  precio         DECIMAL(10,2) NOT NULL,
  stock          INT           NOT NULL DEFAULT 0,
  refrigerado    TINYINT       NOT NULL DEFAULT 0,
  activo         TINYINT       NOT NULL DEFAULT 1,
  creado_en      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prod_cat FOREIGN KEY (categoria_id) REFERENCES categorias(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE encargados (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  dni           CHAR(8)      NOT NULL UNIQUE,
  telefono      VARCHAR(15)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL DEFAULT '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  rol           ENUM('ADMIN','ENCARGADO') NOT NULL DEFAULT 'ENCARGADO',
  activo        TINYINT      NOT NULL DEFAULT 1,
  creado_en     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedidos (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  codigo_recojo    VARCHAR(6)    NOT NULL UNIQUE,
  telefono_cliente VARCHAR(15)   NOT NULL,
  metodo_pago      ENUM('yape','plin','efectivo','reserva') NOT NULL DEFAULT 'reserva',
  total            DECIMAL(10,2) NOT NULL,
  estado           ENUM('pendiente','entregado','devuelto','cancelado') NOT NULL DEFAULT 'pendiente',
  encargado_id     INT           NULL,
  creado_en        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedido_enc FOREIGN KEY (encargado_id) REFERENCES encargados(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_pedido (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id   INT           NOT NULL,
  producto_id INT           NOT NULL,
  cantidad    INT           NOT NULL,
  precio_unit DECIMAL(10,2) NOT NULL,
  subtotal    DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unit) STORED,
  CONSTRAINT fk_det_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  CONSTRAINT fk_det_prod   FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE movimientos_stock (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  producto_id  INT           NOT NULL,
  encargado_id INT           NOT NULL,
  tipo         ENUM('venta','devolucion','ajuste','ingreso') NOT NULL,
  cantidad     INT           NOT NULL,
  precio_ref   DECIMAL(10,2) NOT NULL,
  pedido_id    INT           NULL,
  observacion  VARCHAR(255)  NULL,
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_mov_prod FOREIGN KEY (producto_id)  REFERENCES productos(id),
  CONSTRAINT fk_mov_enc  FOREIGN KEY (encargado_id) REFERENCES encargados(id),
  CONSTRAINT fk_mov_ped  FOREIGN KEY (pedido_id)    REFERENCES pedidos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notas_credito (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id    INT           NOT NULL UNIQUE,
  encargado_id INT           NOT NULL,
  monto        DECIMAL(10,2) NOT NULL,
  motivo       VARCHAR(255)  NOT NULL,
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_nc_pedido FOREIGN KEY (pedido_id)    REFERENCES pedidos(id),
  CONSTRAINT fk_nc_enc    FOREIGN KEY (encargado_id) REFERENCES encargados(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE metas (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  tipo         ENUM('DIA','SEMANA','MES') NOT NULL UNIQUE,
  monto        DECIMAL(10,2) NOT NULL,
  encargado_id INT           NOT NULL,
  creado_en    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_meta_enc FOREIGN KEY (encargado_id) REFERENCES encargados(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes
CREATE INDEX idx_prod_cat   ON productos(categoria_id);
CREATE INDEX idx_prod_activ ON productos(activo);
CREATE INDEX idx_ped_estado ON pedidos(estado);
CREATE INDEX idx_ped_codigo ON pedidos(codigo_recojo);
CREATE INDEX idx_det_pedido ON detalle_pedido(pedido_id);
CREATE INDEX idx_det_prod   ON detalle_pedido(producto_id);
CREATE INDEX idx_mov_prod   ON movimientos_stock(producto_id);
CREATE INDEX idx_mov_fecha  ON movimientos_stock(creado_en);
