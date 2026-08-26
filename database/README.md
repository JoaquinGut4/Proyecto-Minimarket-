# Base de Datos - Kapaq Minimarket

## Esquema

La base de datos se llama `kapaq_db` y utiliza MySQL 8 con charset utf8mb4.

## Migraciones

Las migraciones están manejadas por **Flyway** y se encuentran en:

```
backend/src/main/resources/db/migration/
```

- `V1__initial_schema.sql` - Esquema inicial completo

## Tablas

| Tabla | Descripción |
|-------|-------------|
| `categorias` | Categorías de productos |
| `productos` | Catálogo de productos con stock y precio |
| `encargados` | Colaboradores con password_hash y rol |
| `pedidos` | Pedidos de clientes con código de recojo |
| `detalle_pedido` | Líneas de cada pedido |
| `movimientos_stock` | Historial de movimientos de inventario |
| `notas_credito` | Notas de crédito generadas en devoluciones |
| `metas` | Metas de ventas (dia, semana, mes) |

## Scripts Auxiliares

- `kapaq_schema_final.sql` - Schema original del proyecto Node.js (solo referencia)

## Ejecutar Migraciones Manualmente

```bash
# Conectarse a MySQL
mysql -u root -p -h localhost kapaq_db < backend/src/main/resources/db/migration/V1__initial_schema.sql
```

Las migraciones se ejecutan automáticamente al iniciar el backend Spring Boot.
