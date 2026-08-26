SET @password_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = (SELECT DATABASE()) AND TABLE_NAME = 'encargados' AND COLUMN_NAME = 'password');
SET @sql = IF(@password_exists = 1,
  'ALTER TABLE encargados CHANGE COLUMN password password_hash VARCHAR(255) NOT NULL DEFAULT ''$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy''',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE encargados SET rol = UPPER(rol);

ALTER TABLE encargados
  MODIFY COLUMN rol ENUM('ADMIN','ENCARGADO') NOT NULL DEFAULT 'ENCARGADO';
