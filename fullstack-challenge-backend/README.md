# Weather App - Backend (Node.js / Express)

Este es el backend para la aplicación Weather App, construido con Node.js y Express. Proporciona autenticación de usuarios (registro e inicio de sesión con JWT) y endpoints para obtener información meteorológica, utilizando las APIs de Reservamos (para geocodificación) y OpenWeatherMap (para datos del clima).

## ✨ Características

* **Autenticación de Usuarios:** Registro (`/signup`) y Login (`/login`) usando JSON Web Tokens (JWT).
* **Protección de Rutas:** Rutas de clima (`/api/weather/*`) requieren un token JWT válido en el header `Authorization`.
* **API de Clima:**
    * Obtener clima actual para una o varias ciudades por nombre.
    * Obtener pronóstico del tiempo diario simplificado por coordenadas geográficas.
    * Obtener detalles de ubicación y clima actual por coordenadas geográficas.
* **Integración de APIs Externas:**
    * Reservamos API: Para obtener coordenadas (lat, lon) desde nombres de ciudades.
    * OpenWeatherMap API: Para obtener datos del clima actual y pronóstico.
* **Caching:** Implementación de caché en memoria (`node-cache`) para respuestas de APIs de clima, reduciendo llamadas externas y mejorando el rendimiento.
* **Manejo de Errores:** Middlewares centralizados para errores 404 (Not Found) y errores generales (500).
* **Variables de Entorno:** Configuración segura mediante archivos `.env`.
* **Base de Datos:** MongoDB con Mongoose para persistencia de usuarios.
* **CORS:** Configurado para permitir peticiones desde orígenes específicos (configurable vía `.env`).

## 💻 Tech Stack

* **Lenguaje:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB
* **ODM:** Mongoose
* **Autenticación:** JSON Web Tokens (`jsonwebtoken`), `bcrypt` (hashing)
* **Peticiones HTTP:** `axios`
* **Caching:** `node-cache`
* **Variables de Entorno:** `dotenv`
* **CORS:** `cors`

## 📂 Estructura del Proyecto

```
.
├── src/
│   ├── config/
│   │   └── database.js         # Configuración y conexión a MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js  # Lógica para signup y login
│   │   └── weather.controller.js # Lógica para endpoints de clima
│   ├── middleware/
│   │   ├── auth.middleware.js  # Middleware para verificar JWT (protect)
│   │   └── error.middleware.js # Middlewares para manejo de errores (404, 500)
│   ├── models/
│   │   └── User.model.js       # Esquema/Modelo Mongoose para Usuarios
│   ├── routes/
│   │   ├── auth.routes.js      # Rutas para /api/auth/*
│   │   └── weather.routes.js   # Rutas para /api/weather/*
│   ├── services/
│   │   └── weather.service.js  # Lógica para interactuar con APIs externas y caché
│   ├── utils/                  # Helpers o utilidades generales (si aplica)
│   └── server.js               # Punto de entrada, config Express, middlewares, rutas
├── .env                        # Variables de entorno
├── .env.example                # Archivo de ejemplo para variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── package.json                # Dependencias y scripts
├── package-lock.json           # Lockfile de dependencias
└── README.md                   # Este archivo
```

## 🚀 Getting Started

### Prerrequisitos

* Node.js (v14 o superior recomendado)
* npm o yarn
* Una instancia de MongoDB (local o en la nube como MongoDB Atlas, se pueden conectar a la mía, la incluí en las variables de entorno)
* Una API Key válida de OpenWeatherMap

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/zValkyrion/fullstack-challenge-weatherApp.git
```

2. Navega a la carpeta del backend dentro del proyecto clonado:
```bash
cd fullstack-challenge-weatherApp/fullstack-challenge-backend
```

3. Instala las dependencias:
```bash
npm install
```
o si usas yarn:
```bash
yarn install
```

### Configuración

1. Crea el archivo de variables de entorno:
   Copia el archivo de ejemplo `.env.example` (si existe) o crea un archivo nuevo llamado `.env` en la raíz de la carpeta fullstack-challenge-backend.

```bash
cp .env.example .env  # O crea .env manualmente
```

2. Configura las variables en `.env`:
   Abre el archivo `.env` y rellena los valores necesarios.

| Variable            | Descripción                                             | Ejemplo                                       | Requerida | Default         |
| :------------------ | :------------------------------------------------------ | :-------------------------------------------- | :-------- | :-------------- |
| MONGODB_URI         | Connection String de tu base de datos MongoDB.          | mongodb+srv://user:pass@cluster...            | Sí        |                 |
| JWT_SECRET          | Secreto para firmar y verificar los JWT. Usa algo seguro.| un_secreto_muy_largo_y_aleatorio             | Sí        |                 |
| OPENWEATHER_API_KEY | Tu API Key de OpenWeatherMap.                           | abcdef1234567890abcdef1234567890              | Sí        |                 |
| PORT                | Puerto en el que correrá el servidor.                   | 5001                                          | No        | 5001            |
| CACHE_TTL_SECONDS   | Tiempo de vida (en segundos) para la caché de clima.    | 900                                           | No        | 900 (15 min)    |
| NODE_ENV            | Entorno de ejecución ('development' o 'production').    | development                                   | No        | development     |
| CORS_ORIGIN         | URL del frontend permitida por CORS (o * para cualquiera).| http://localhost:5173 o https://tu-frontend.com | No        | (Definido en server.js) |

## ▶️ Ejecutando la Aplicación

### Modo Desarrollo:

```bash
npm run dev
```
(Necesitas tener nodemon instalado globalmente o como dependencia de desarrollo: `npm install -g nodemon` o `npm install --save-dev nodemon`)

### Modo Producción / Normal:

```bash
npm start
```

El servidor se ejecutará en http://localhost:5001 (o el puerto definido en PORT).

## 📡 API Endpoints

Base URL: `http://localhost:PORT/api` (ej. `http://localhost:5001/api`)

**Autenticación:** Para las rutas protegidas, incluye el token JWT en el header `Authorization` de la petición:
```
Authorization: Bearer <tu_token_jwt>
```

### GET /health
- **Descripción:** Verifica si el servidor está activo.
- **Auth Requerida:** No
- **Respuesta (Éxito 200):**
```json
{
  "status": "UP",
  "message": "Server is running"
}
```

### /auth

#### POST /signup
- **Descripción:** Registra un nuevo usuario.
- **Auth Requerida:** No
- **Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```
- **Respuesta (Éxito 201):**
```json
{
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "605c...",
    "username": "testuser"
  },
  "message": "User created successfully!"
}
```
- **Respuesta (Error):** `{ "message": "..." }` (Status 400, 409, 500)

#### POST /login
- **Descripción:** Inicia sesión y obtiene un token JWT.
- **Auth Requerida:** No
- **Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```
- **Respuesta (Éxito 200):**
```json
{
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "605c...",
    "username": "testuser"
  },
  "message": "Login successful!"
}
```
- **Respuesta (Error):** `{ "message": "..." }` (Status 400, 401, 500)

### /weather (Requiere Autenticación)

#### GET /cities
- **Descripción:** Obtiene el clima actual para una o varias ciudades por nombre.
- **Query Parameters:**
  - `names` (string, requerido): Nombres de ciudades separados por comas.
- **Ejemplo:** `/api/weather/cities?names=Monterrey,Guadalajara,Berlin`
- **Respuesta (Éxito 200):** Array de objetos, uno por ciudad.
```json
[
  {
    "cityName": "Monterrey",
    "coordinates": { "lat": 25.6751, "lon": -100.3185 },
    "currentWeather": { /* Objeto completo de OpenWeatherMap */ }
  },
  {
    "cityName": "Guadalajara",
    "coordinates": { "lat": 20.6767, "lon": -103.3475 },
    "currentWeather": { /* Objeto completo de OpenWeatherMap */ }
  },
  {
    "cityName": "CiudadInexistente",
    "coordinates": null,
    "currentWeather": null,
    "error": "City not found or failed to fetch weather" // Puede incluir error
  }
]
```

#### GET /forecast
- **Descripción:** Obtiene el pronóstico diario simplificado para los próximos días basado en coordenadas.
- **Query Parameters:**
  - `lat` (number, requerido): Latitud.
  - `lon` (number, requerido): Longitud.
- **Ejemplo:** `/api/weather/forecast?lat=25.6751&lon=-100.3185`
- **Respuesta (Éxito 200):** Array con pronóstico diario.
```json
[
  { "date": "2025-04-05", "temp_min": 15.2, "temp_max": 28.5, "condition": "Clear", "icon": "01d" },
  { "date": "2025-04-06", "temp_min": 16.0, "temp_max": 29.1, "condition": "Clouds", "icon": "03d" },
  // ... hasta 5-7 días
]
```

#### GET /details-by-coords
- **Descripción:** Obtiene detalles de ubicación y clima actual por coordenadas.
- **Query Parameters:**
  - `lat` (number, requerido): Latitud.
  - `lon` (number, requerido): Longitud.
- **Ejemplo:** `/api/weather/details-by-coords?lat=25.6751&lon=-100.3185`
- **Respuesta (Éxito 200):** Objeto con detalles.
```json
{
  "location": {
     "name": "Monterrey",
     "country": "MX"
   },
   "current": {
     "temp_c": 27.5,
     "feelslike_c": 26.8,
     "humidity": 45,
     "condition": {
       "text": "Clear",
       "description": "clear sky",
       "icon": "https://openweathermap.org/img/wn/01d@2x.png",
       "code": 800
     },
     "wind_mps": 3.5
   }
 }
```

## 🤖 Cómo Usé la IA

Este proyecto no se construyó en solitario. Conté con la asistencia de herramientas de Inteligencia Artificial (IA) como un valioso compañero de código y consultor técnico. La IA fue un recurso clave en diversas etapas del desarrollo:

* **Depuración Acelerada:** Para resolver rápidamente errores de sintaxis o pequeños despistes lógicos.
* **Código de Calidad:** Consulté a la IA para aplicar buenas prácticas de desarrollo en Node.js y Express, incluyendo estructuración modular, manejo seguro de contraseñas (bcrypt) e implementación de JWT.
* **Chispa Creativa y Diseño:** Funcionó como un 'brainstorming partner' para definir enfoques en la implementación del caché, la estructura de las respuestas de la API y la organización general.
* **Refinamiento y Optimización:** Sugerencias puntuales para mejorar la legibilidad, eficiencia y mantenibilidad del código.
* **Documentación Clara:** Colaboró en la redacción y estructuración de partes de este mismo README.md para que fuera claro y completo.

En esencia, la IA fue una herramienta para potenciar la productividad, asegurar la calidad y validar decisiones de diseño, permitiéndome enfocar más energía en la lógica central de la aplicación.
