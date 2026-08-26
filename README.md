# 🛒 Minimarket Kapaq

Sistema de gestión para minimarket con tienda pública, panel administrativo y control de inventario.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | Java 21 + Spring Boot 3.x + Maven |
| **Frontend** | Angular 18 + TypeScript |
| **Base de Datos** | MySQL 8 (Docker) |
| **Migraciones** | Flyway |
| **Seguridad** | Spring Security + BCrypt |

## Estructura del Proyecto

```
Minimarket Kapaq/
├── backend/                    # Spring Boot API REST
│   ├── pom.xml
│   ├── Dockerfile
│   ├── src/main/java/com/kapaq/
│   │   ├── config/             # Security, CORS
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── repository/         # JPA repositories
│   │   ├── entity/             # JPA entities
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── mapper/             # Entity-DTO mappers
│   │   └── exception/          # Global exception handler
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/       # Flyway migrations
├── frontend/                   # Angular SPA
│   ├── package.json
│   ├── Dockerfile
│   └── src/app/
│       ├── core/               # Services, guards, interceptors
│       ├── shared/             # Models, utilities
│       └── features/           # Feature modules
├── database/                   # SQL scripts & docs
├── docker-compose.yml          # MySQL + Backend
└── README.md
```

## Requisitos

- Docker y Docker Compose
- Java 21 (para desarrollo local)
- Node.js 20+ (para desarrollo local)
- Maven 3.9+ (para desarrollo local)

## Ejecución Rápida con Docker

```bash
# 1. Clonar el repositorio
cd "Minimarket Kapaq"

# 2. Iniciar todos los servicios
docker compose up -d

# 3. Verificar que los servicios estén corriendo
docker compose ps

# 4. Acceder a la aplicación
#    Frontend: http://localhost (si se configura)
#    Backend API: http://localhost:8080
#    MySQL: localhost:3306
```

## Ejecución en Desarrollo

### 1. Base de Datos

```bash
docker compose up -d mysql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # Configurar variables de entorno
./mvnw spring-boot:run
```

Si no tienes Maven wrapper:
```bash
mvn spring-boot:run
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
# Abrir http://localhost:4200
```

## Variables de Entorno

### Backend (`.env`)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `8080` | Puerto del servidor |
| `DB_HOST` | `localhost` | Host de MySQL |
| `DB_PORT` | `3306` | Puerto de MySQL |
| `DB_NAME` | `kapaq_db` | Nombre de la base de datos |
| `DB_USER` | `root` | Usuario de MySQL |
| `DB_PASSWORD` | `JOAQUIN123` | Contraseña de MySQL |

### Docker Compose

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DB_ROOT_PASSWORD` | `root_password` | Contraseña root de MySQL |
| `DB_USER` | `kapaq_user` | Usuario de aplicación |
| `DB_PASSWORD` | `kapaq_password` | Contraseña de aplicación |
| `DB_NAME` | `kapaq_db` | Nombre de la base de datos |

## API Endpoints

### Health
- `GET /api/health` - Estado del servidor

### Categorías
- `GET /api/categorias` - Listar categorías activas

### Productos
- `GET /api/productos` - Listar productos (filtros: `?categoria=`, `?q=`)
- `GET /api/productos/{id}` - Detalle de producto
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar stock/precio
- `DELETE /api/productos/{id}` - Desactivar producto

### Encargados
- `GET /api/encargados` - Listar encargados
- `POST /api/encargados/login` - Iniciar sesión
- `POST /api/encargados` - Registrar encargado
- `PATCH /api/encargados/{id}` - Activar/desactivar

### Pedidos
- `POST /api/pedidos/verificar-stock` - Verificar disponibilidad
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos` - Listar pedidos (`?estado=`)
- `GET /api/pedidos/{id}` - Detalle con items
- `PATCH /api/pedidos/{id}/entregar` - Entregar pedido
- `PATCH /api/pedidos/{id}/devolver` - Devolver pedido

### Movimientos
- `GET /api/movimientos` - Historial de movimientos (`?producto_id=`)

### Reportes
- `GET /api/reportes/resumen` - Dashboard resumen
- `GET /api/reportes/tendencias` - Top productos y métodos de pago
- `GET /api/reportes/actividades` - Actividades recientes
- `GET /api/reportes/ventas` - Ventas por día/semana/mes
- `GET /api/reportes/notas-credito` - Notas de crédito
- `GET /api/reportes/metas` - Obtener metas
- `PUT /api/reportes/metas/{tipo}` - Actualizar meta

## Formato de Respuesta

```json
// Éxito
{
  "ok": true,
  "data": { ... }
}

// Error
{
  "ok": false,
  "error": "Mensaje de error",
  "detail": "Detalle técnico (opcional)"
}
```

## Cambios Respecto al Proyecto Original

### Base de Datos
- Se agregó `password_hash` en `encargados` (BCrypt, no texto plano)
- Se agregó `rol` (`ADMIN` o `ENCARGADO`) en `encargados`
- Se agregó la tabla `metas` (dia, semana, mes)

### Backend
- Migración de Node.js + Express a Java + Spring Boot
- Arquitectura por capas (controller, service, repository, entity, dto)
- Validación con Bean Validation
- Manejo de errores global con `@ControllerAdvice`
- Formato de respuesta uniforme `{ ok, data }`
- Contraseñas hasheadas con BCrypt
- Migraciones automáticas con Flyway

### Frontend
- Migración de HTML+JS vanilla a Angular 18
- Componentes standalone
- Servicios separados por dominio
- Guards para proteger rutas admin
- Interceptors para manejo de errores HTTP
- Reactive Forms donde aplica

## Pruebas

```bash
cd backend
./mvnw test
```

## Licencia

MIT
