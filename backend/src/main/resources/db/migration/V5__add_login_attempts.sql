ALTER TABLE encargados
    ADD COLUMN intentos_fallidos INT NOT NULL DEFAULT 0,
    ADD COLUMN bloqueado_hasta DATETIME NULL;
