INSERT INTO categorias (nombre, emoji)
SELECT * FROM (SELECT 'Cereales', '🌾') AS tmp WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Cereales') LIMIT 1;
INSERT INTO categorias (nombre, emoji)
SELECT * FROM (SELECT 'Verduras', '🥦') AS tmp WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Verduras') LIMIT 1;
INSERT INTO categorias (nombre, emoji)
SELECT * FROM (SELECT 'Frutas', '🍎') AS tmp WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Frutas') LIMIT 1;
INSERT INTO categorias (nombre, emoji)
SELECT * FROM (SELECT 'P. Limpieza', '🧴') AS tmp WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'P. Limpieza') LIMIT 1;
INSERT INTO categorias (nombre, emoji)
SELECT * FROM (SELECT 'Bebidas', '🥤') AS tmp WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Bebidas') LIMIT 1;
INSERT INTO categorias (nombre, emoji)
SELECT * FROM (SELECT 'Lácteos', '🥛') AS tmp WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Lácteos') LIMIT 1;
INSERT INTO categorias (nombre, emoji)
SELECT * FROM (SELECT 'Especias', '🌶') AS tmp WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Especias') LIMIT 1;

INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Arroz Costeño 1kg', '🌾', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 4.50, 40, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Arroz Costeño 1kg');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Avena 3 Ositos 200g', '🌾', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 2.80, 25, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Avena 3 Ositos 200g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Fideos Don Vittorio', '🍝', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 3.20, 35, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Fideos Don Vittorio');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Aceite Primor 1L', '🫙', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 7.90, 22, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Aceite Primor 1L');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Brócoli Fresco', '🥦', (SELECT id FROM categorias WHERE nombre = 'Verduras'), 2.00, 15, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Brócoli Fresco');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Tomate Italiano', '🍅', (SELECT id FROM categorias WHERE nombre = 'Verduras'), 1.50, 30, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Tomate Italiano');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Manzana Delicious', '🍎', (SELECT id FROM categorias WHERE nombre = 'Frutas'), 1.00, 50, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Manzana Delicious');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Plátano de Isla', '🍌', (SELECT id FROM categorias WHERE nombre = 'Frutas'), 0.50, 60, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Plátano de Isla');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Detergente Ariel 1kg', '🧴', (SELECT id FROM categorias WHERE nombre = 'P. Limpieza'), 9.90, 12, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Detergente Ariel 1kg');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Lejía Clorox 500ml', '🧼', (SELECT id FROM categorias WHERE nombre = 'P. Limpieza'), 3.50, 18, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Lejía Clorox 500ml');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Inca Kola 1.5L', '🥤', (SELECT id FROM categorias WHERE nombre = 'Bebidas'), 5.50, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Inca Kola 1.5L');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Agua San Mateo 625ml', '💧', (SELECT id FROM categorias WHERE nombre = 'Bebidas'), 1.20, 45, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Agua San Mateo 625ml');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Leche Gloria 1L', '🥛', (SELECT id FROM categorias WHERE nombre = 'Lácteos'), 5.20, 3, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Leche Gloria 1L');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Yogur Laive 500g', '🥛', (SELECT id FROM categorias WHERE nombre = 'Lácteos'), 4.80, 8, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Yogur Laive 500g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Pimienta Negra 50g', '🌶', (SELECT id FROM categorias WHERE nombre = 'Especias'), 1.80, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Pimienta Negra 50g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Comino Molido 50g', '🌿', (SELECT id FROM categorias WHERE nombre = 'Especias'), 1.50, 15, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Comino Molido 50g');
