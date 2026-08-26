SET @exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = (SELECT DATABASE()) AND TABLE_NAME = 'metas' AND COLUMN_NAME = 'creado_en');
SET @sql = IF(@exists = 0,
  'ALTER TABLE metas ADD COLUMN creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER actualizado_en',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE metas SET tipo = UPPER(tipo) WHERE tipo != UPPER(tipo);
ALTER TABLE metas MODIFY COLUMN tipo ENUM('DIA','SEMANA','MES') NOT NULL UNIQUE;

UPDATE encargados SET password_hash = '$2b$10$w3KtY9YX687qDhjMth8cFuCMmqaSt4Ik0.cZ3LrJbedc6GtLNErAS' WHERE password_hash NOT LIKE '$2a$%' AND password_hash NOT LIKE '$2b$%';
UPDATE encargados SET password_hash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE rol = 'ADMIN' AND password_hash NOT LIKE '$2a$%' AND password_hash NOT LIKE '$2b$%';
