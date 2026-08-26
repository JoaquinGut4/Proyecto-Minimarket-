ALTER TABLE metas MODIFY COLUMN tipo VARCHAR(10) NOT NULL UNIQUE;

INSERT INTO encargados (nombre, dni, telefono, password_hash, rol)
SELECT 'Admin', '12345678', '999000000', '$2a$10$bnSgMMu93uQ0MJhf.kqp9uGwhPQQi4LyfCouSOWA429NlIkNKvFIG', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM encargados WHERE dni = '12345678');

INSERT INTO encargados (nombre, dni, telefono, password_hash, rol)
SELECT 'Encargado Demo', '87654321', '999111111', '$2a$10$TkoIYOk5AJagoRxp67rPcOEMOitCO7d6UgF1Pcn.l2fgtvZF4bceS', 'ENCARGADO'
WHERE NOT EXISTS (SELECT 1 FROM encargados WHERE dni = '87654321');

SET @admin_id = (SELECT id FROM encargados WHERE dni = '12345678' LIMIT 1);

SET @tomorrow = DATE_ADD(CURDATE(), INTERVAL 1 DAY);

INSERT INTO pedidos (codigo_recojo, telefono_cliente, metodo_pago, total, estado, creado_en, actualizado_en)
SELECT 'MÑANA1', '999111222', 'reserva', 28.50, 'pendiente', CONCAT(@tomorrow, ' 10:30:00'), CONCAT(@tomorrow, ' 10:30:00')
WHERE NOT EXISTS (SELECT 1 FROM pedidos WHERE codigo_recojo = 'MÑANA1');

INSERT INTO pedidos (codigo_recojo, telefono_cliente, metodo_pago, total, estado, creado_en, actualizado_en)
SELECT 'MÑANA2', '999333444', 'reserva', 45.00, 'entregado', CONCAT(@tomorrow, ' 11:00:00'), CONCAT(@tomorrow, ' 11:30:00')
WHERE NOT EXISTS (SELECT 1 FROM pedidos WHERE codigo_recojo = 'MÑANA2');

INSERT INTO pedidos (codigo_recojo, telefono_cliente, metodo_pago, total, estado, creado_en, actualizado_en)
SELECT 'MÑANA3', '999555666', 'reserva', 12.80, 'pendiente', CONCAT(@tomorrow, ' 14:15:00'), CONCAT(@tomorrow, ' 14:15:00')
WHERE NOT EXISTS (SELECT 1 FROM pedidos WHERE codigo_recojo = 'MÑANA3');

INSERT INTO metas (tipo, monto, encargado_id, creado_en, actualizado_en)
SELECT 'MANANA', 100.00, @admin_id, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM metas WHERE tipo = 'MANANA') AND @admin_id IS NOT NULL;
