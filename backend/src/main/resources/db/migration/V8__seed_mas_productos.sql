INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Huevos (Unidad)', '🥚', (SELECT id FROM categorias WHERE nombre = 'Lácteos'), 0.70, 60, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Huevos (Unidad)');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Papel Higiénico Suave', '🧻', (SELECT id FROM categorias WHERE nombre = 'P. Limpieza'), 2.50, 30, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Papel Higiénico Suave');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Papel Higiénico Elite', '🧻', (SELECT id FROM categorias WHERE nombre = 'P. Limpieza'), 3.20, 25, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Papel Higiénico Elite');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Jabón Bolívar', '🧼', (SELECT id FROM categorias WHERE nombre = 'P. Limpieza'), 1.50, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Jabón Bolívar');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Detergente Bolívar 500g', '🧴', (SELECT id FROM categorias WHERE nombre = 'P. Limpieza'), 4.90, 15, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Detergente Bolívar 500g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Yogurt Gloria 500g', '🥛', (SELECT id FROM categorias WHERE nombre = 'Lácteos'), 5.00, 10, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Yogurt Gloria 500g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Shampoo Head & Shoulders', '🧴', (SELECT id FROM categorias WHERE nombre = 'P. Limpieza'), 12.90, 8, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Shampoo Head & Shoulders');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Mantequilla Laive 200g', '🧈', (SELECT id FROM categorias WHERE nombre = 'Lácteos'), 6.50, 12, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Mantequilla Laive 200g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Queso Fresco (kg)', '🧀', (SELECT id FROM categorias WHERE nombre = 'Lácteos'), 14.00, 5, 1
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Queso Fresco (kg)');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Café Instantáneo Nescafé 100g', '☕', (SELECT id FROM categorias WHERE nombre = 'Bebidas'), 8.50, 15, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Café Instantáneo Nescafé 100g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Café Instantáneo Kirma 100g', '☕', (SELECT id FROM categorias WHERE nombre = 'Bebidas'), 5.90, 18, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Café Instantáneo Kirma 100g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Atún Florida 170g', '🥫', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 4.20, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Atún Florida 170g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Atún Gloria 170g', '🥫', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 3.90, 22, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Atún Gloria 170g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Leche Evaporada Gloria 400g', '🥛', (SELECT id FROM categorias WHERE nombre = 'Lácteos'), 3.50, 25, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Leche Evaporada Gloria 400g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Sal de Mesa 500g', '🧂', (SELECT id FROM categorias WHERE nombre = 'Especias'), 1.20, 30, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Sal de Mesa 500g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Quinua 500g', '🌾', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 6.00, 15, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Quinua 500g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Vinagre 250ml', '🫗', (SELECT id FROM categorias WHERE nombre = 'Especias'), 1.80, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Vinagre 250ml');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Ajinomoto 100g', '🧂', (SELECT id FROM categorias WHERE nombre = 'Especias'), 2.20, 18, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Ajinomoto 100g');
INSERT INTO productos (nombre, emoji, categoria_id, precio, stock, refrigerado)
SELECT 'Harina Blanca Flor 1kg', '🌾', (SELECT id FROM categorias WHERE nombre = 'Cereales'), 4.00, 20, 0
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE nombre = 'Harina Blanca Flor 1kg');
