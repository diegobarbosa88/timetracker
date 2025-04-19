# Diseño de Base de Datos para Aplicación de Control de Horario

## Descripción General
Este documento describe la estructura de la base de datos para la aplicación móvil de control de horario. La aplicación permitirá a los empleados registrar sus entradas y salidas, y a los administradores gestionar y visualizar estos registros.

## Tablas Principales

### 1. Usuarios (Users)
Almacena información sobre todos los usuarios del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | Identificador único del usuario (clave primaria) |
| username | TEXT | Nombre de usuario para inicio de sesión |
| password | TEXT | Contraseña encriptada |
| full_name | TEXT | Nombre completo del empleado |
| email | TEXT | Correo electrónico |
| phone | TEXT | Número de teléfono |
| role | TEXT | Rol del usuario (admin, supervisor, empleado) |
| department | TEXT | Departamento al que pertenece |
| created_at | DATETIME | Fecha de creación del registro |
| updated_at | DATETIME | Fecha de última actualización |
| active | BOOLEAN | Estado activo/inactivo del usuario |

### 2. Registros de Tiempo (TimeRecords)
Almacena los registros de entrada y salida de los empleados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | Identificador único del registro (clave primaria) |
| user_id | INTEGER | ID del usuario (clave foránea) |
| check_in_time | DATETIME | Hora de entrada |
| check_out_time | DATETIME | Hora de salida (puede ser NULL si aún no ha salido) |
| check_in_location | TEXT | Coordenadas de geolocalización al entrar |
| check_out_location | TEXT | Coordenadas de geolocalización al salir |
| check_in_method | TEXT | Método de registro (geo, biométrico, manual) |
| check_out_method | TEXT | Método de registro (geo, biométrico, manual) |
| notes | TEXT | Notas adicionales |
| created_at | DATETIME | Fecha de creación del registro |
| updated_at | DATETIME | Fecha de última actualización |

### 3. Horarios (Schedules)
Define los horarios esperados para cada empleado.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | Identificador único del horario (clave primaria) |
| user_id | INTEGER | ID del usuario (clave foránea) |
| day_of_week | INTEGER | Día de la semana (0-6, donde 0 es domingo) |
| start_time | TIME | Hora de inicio programada |
| end_time | TIME | Hora de finalización programada |
| break_duration | INTEGER | Duración del descanso en minutos |
| created_at | DATETIME | Fecha de creación del registro |
| updated_at | DATETIME | Fecha de última actualización |

### 4. Ausencias (Absences)
Registra las ausencias planificadas (vacaciones, permisos, etc.).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | Identificador único de la ausencia (clave primaria) |
| user_id | INTEGER | ID del usuario (clave foránea) |
| start_date | DATE | Fecha de inicio de la ausencia |
| end_date | DATE | Fecha de finalización de la ausencia |
| type | TEXT | Tipo de ausencia (vacaciones, enfermedad, permiso) |
| status | TEXT | Estado (pendiente, aprobada, rechazada) |
| notes | TEXT | Notas o justificación |
| created_at | DATETIME | Fecha de creación del registro |
| updated_at | DATETIME | Fecha de última actualización |

### 5. Configuración (Settings)
Almacena la configuración general de la aplicación.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | Identificador único (clave primaria) |
| setting_key | TEXT | Nombre de la configuración |
| setting_value | TEXT | Valor de la configuración |
| description | TEXT | Descripción de la configuración |
| created_at | DATETIME | Fecha de creación del registro |
| updated_at | DATETIME | Fecha de última actualización |

## Relaciones

1. Un Usuario puede tener múltiples Registros de Tiempo (relación uno a muchos)
2. Un Usuario puede tener múltiples Horarios asignados (relación uno a muchos)
3. Un Usuario puede tener múltiples Ausencias registradas (relación uno a muchos)

## Índices Recomendados

- Índice en `user_id` en la tabla TimeRecords para búsquedas rápidas de registros por usuario
- Índice compuesto en `user_id` y `check_in_time` en TimeRecords para consultas de rango de fechas
- Índice en `user_id` en la tabla Schedules para búsquedas rápidas de horarios por usuario
- Índice en `user_id` en la tabla Absences para búsquedas rápidas de ausencias por usuario

## Consideraciones Adicionales

- Todos los campos de fecha y hora deben almacenarse en formato UTC
- Las contraseñas deben almacenarse utilizando algoritmos de hash seguros (bcrypt, Argon2)
- Se recomienda implementar soft delete para los registros (marcar como inactivos en lugar de eliminar)
- Los datos de geolocalización deben almacenarse en formato estándar (latitud,longitud)
