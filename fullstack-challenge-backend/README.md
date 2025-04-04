Backend Challenge - Weather API
Este es el backend para la aplicación del challenge, construido con Node.js y Express. Proporciona autenticación de usuarios (registro e inicio de sesión) y endpoints para obtener información meteorológica de diferentes ciudades, utilizando las APIs de Reservamos y OpenWeatherMap.

Características
*   Autenticación de Usuarios: Registro (signup) y Login (login) usando JWT (JSON Web Tokens).
*   Protección de Rutas: Las rutas de clima requieren un token JWT válido.
    
    API de Clima:
*   Obtener clima actual para una o varias ciudades por nombre.
*   Obtener pronóstico del tiempo (diario simplificado) por coordenadas geográficas.
*   Obtener detalles de ubicación y clima actual por coordenadas geográficas.
    
    Integración de APIs Externas:
*   Reservamos API: Para obtener coordenadas (latitud, longitud) a partir del nombre de una ciudad.
*   OpenWeatherMap API: Para obtener datos del clima actual y pronóstico.
*   Caching: Implementación de caché en memoria (usando node-cache) para reducir las llamadas a las APIs externas de clima y mejorar el rendimiento.
*   Manejo de Errores: Middlewares centralizados para manejar errores 404 (Not Found) y errores generales del servidor (500).
*   Variables de Entorno: Configuración segura y flexible usando archivos .env.
*   Base de Datos: MongoDB con Mongoose para almacenar información de usuarios.
*   CORS: Configurado para permitir peticiones desde un origen específico.
    
    Tech Stack
*   Lenguaje: Node.js
*   Framework: Express.js
*   Base de Datos: MongoDB
*   ODM: Mongoose
*   Autenticación: JSON Web Tokens (jsonwebtoken), bcrypt para hashing de contraseñas.
*   Peticiones HTTP: axios
*   Caching: node-cache
*   Variables de Entorno: dotenv
*   CORS: cors


Estructura del Proyecto
.
├── src/
│   ├── config/
│   │   └── database.js         # Configuración y conexión a MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js    # Lógica para signup y login
│   │   └── weather.controller.js # Lógica para endpoints de clima
│   ├── middleware/
│   │   ├── auth.middleware.js    # Middleware para verificar JWT (protect)
│   │   └── error.middleware.js   # Middlewares para manejo de errores (404, 500)
│   ├── models/
│   │   └── User.model.js         # Esquema/Modelo Mongoose para Usuarios
│   ├── routes/
│   │   ├── auth.routes.js        # Rutas para /api/auth/*
│   │   └── weather.routes.js     # Rutas para /api/weather/*
│   ├── services/
│   │   └── weather.service.js    # Lógica para interactuar con APIs externas y caché
│   ├── utils/                    # (Carpeta opcional, puede estar vacía si no se usa)
│   │   └── cache.js              # (En tu código, la caché está en weather.service.js)
│   └── server.js               # Punto de entrada, configuración de Express, middlewares, rutas
├── .env                        # Archivo para variables de entorno (¡NO SUBIR A GIT!)
├── .gitignore                  # Archivos/carpetas ignorados por Git
├── package.json                # Dependencias y scripts del proyecto
├── package-lock.json           # Versiones exactas de las dependencias
└── README.md                   # Este archivo

Prerrequisitos
Node.js (v14 o superior recomendado)
npm o yarn
Una instancia de MongoDB (localmente o en un servicio como MongoDB Atlas)
Una API Key de OpenWeatherMap
Instalación y Configuración
Clona el repositorio:

Bash
git clone <tu-repositorio-url>
cd <nombre-del-directorio>
Instala las dependencias:

Bash
npm install
# o si usas yarn
# yarn install
Crea el archivo de variables de entorno:
Crea un archivo llamado .env en la raíz del proyecto.

Configura las variables de entorno en .env:

Fragmento de código

# Base de Datos
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority # Reemplaza con tu connection string de MongoDB

# Autenticación
JWT_SECRET=TU_SECRETO_JWT_SUPER_SEGURO_Y_LARGO # Cambia esto por una cadena aleatoria y segura

# APIs Externas
OPENWEATHER_API_KEY=TU_API_KEY_DE_OPENWEATHERMAP # Reemplaza con tu API key

# Servidor (Opcional, por defecto 5001)
PORT=5001

# Caché (Opcional, por defecto 900 segundos = 15 minutos)
CACHE_TTL_SECONDS=900

# Entorno (Opcional, útil para logs/errores)
NODE_ENV=development

# CORS (Opcional, define el origen permitido si no es el default localhost:5173)
# CORS_ORIGIN=https://tu-frontend-desplegado.com

IMPORTANTE: 
Añade .env a tu archivo .gitignore para evitar subirlo accidentalmente a tu repositorio Git.
Ejecutando la Aplicación
Modo Desarrollo (con recarga automática si tienes nodemon):

Bash
npm run dev
(Necesitas añadir "dev": "nodemon src/server.js" a la sección scripts de tu package.json)

Modo Producción / Normal:

Bash
npm start
(Necesitas añadir "start": "node src/server.js" a la sección scripts de tu package.json)

El servidor se ejecutará en http://localhost:5001 (o el puerto que hayas definido en PORT).

API Endpoints
Health Check:

GET /api/health
Respuesta: { "status": "UP", "message": "Server is running" }
Autenticación (/api/auth)

POST /signup
Body: { "username": "testuser", "password": "password123" }
Respuesta (Éxito 201): { "token": "...", "user": { "id": "...", "username": "testuser" }, "message": "User created successfully!" }
Respuesta (Error): { "message": "..." } (Status 400, 409, 500)
POST /login
Body: { "username": "testuser", "password": "password123" }
Respuesta (Éxito 200): { "token": "...", "user": { "id": "...", "username": "testuser" }, "message": "Login successful!" }
Respuesta (Error): { "message": "..." } (Status 400, 401, 500)
Clima (/api/weather) - Requieren Autenticación (Header: Authorization: Bearer <tu_token_jwt>)

GET /cities?names=<city1>,<city2>,...
Query Params: names (string): Nombres de ciudades separados por comas.
Ejemplo: /api/weather/cities?names=Monterrey,Guadalajara,Berlin
Respuesta (Éxito 200): Array de objetos, uno por ciudad:
JSON

[
  {
    "cityName": "Monterrey",
    "coordinates": { "lat": 25.6751, "lon": -100.3185 },
    "currentWeather": { /* ... Objeto de OpenWeatherMap ... */ }
  },
  {
    "cityName": "Guadalajara",
    "coordinates": { "lat": 20.6767, "lon": -103.3475 },
    "currentWeather": { /* ... Objeto de OpenWeatherMap ... */ }
  },
  {
     "cityName": "CiudadInexistente",
     "coordinates": null,
     "currentWeather": null,
     // O podría incluir un campo "error" si falló específicamente
  }
]
GET /forecast?lat=<latitude>&lon=<longitude>
Query Params: lat (number), lon (number).
Ejemplo: /api/weather/forecast?lat=25.6751&lon=-100.3185
Respuesta (Éxito 200): Array con el pronóstico diario simplificado:
JSON

[
  { "date": "2025-04-05", "temp_min": 15.2, "temp_max": 28.5, "condition": "Clear", "icon": "01d" },
  { "date": "2025-04-06", "temp_min": 16.0, "temp_max": 29.1, "condition": "Clouds", "icon": "03d" },
  // ... hasta 5-7 días
]
GET /details-by-coords?lat=<latitude>&lon=<longitude>
Query Params: lat (number), lon (number).
Ejemplo: /api/weather/details-by-coords?lat=25.6751&lon=-100.3185
Respuesta (Éxito 200): Objeto con detalles de ubicación y clima actual:
JSON

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




Variables de Entorno Requeridas
-------------------------------

MONGODB_URI:
    Descripción: Connection String para tu base de datos MongoDB.
    Ejemplo: mongodb+srv://user:pass@cluster.mongodb.net/myDatabase
    Obligatoria: Sí

JWT_SECRET:
    Descripción: Secreto para firmar y verificar los JSON Web Tokens. Debe ser seguro.
    Ejemplo: una_frase_secreta_muy_larga_y_aleatoria_aqui
    Obligatoria: Sí

OPENWEATHER_API_KEY:
    Descripción: Tu API Key obtenida de OpenWeatherMap para acceder a su API de clima.
    Ejemplo: abcdef1234567890abcdef1234567890
    Obligatoria: Sí

PORT:
    Descripción: Puerto en el que correrá el servidor.
    Ejemplo: 5001 (Default)
    Obligatoria: No

CACHE_TTL_SECONDS:
    Descripción: Tiempo de vida (en segundos) para los datos en caché.
    Ejemplo: 900 (Default = 15 minutos)
    Obligatoria: No

NODE_ENV:
    Descripción: Define el entorno de ejecución ('development' o 'production').
    Ejemplo: development
    Obligatoria: SI

CORS_ORIGIN:
    Descripción: URL del frontend permitida por CORS. Si no se define, usa el valor por defecto en server.js.
    Ejemplo: https://tu-frontend.com
    Obligatoria: SI


## Cómo Usé la IA 🤖

Este proyecto no se construyó en solitario. Conté con la asistencia de herramientas de **Inteligencia Artificial (IA)** como un valioso **compañero de código y consultor técnico**. La IA fue un recurso clave en diversas etapas del desarrollo:

* **Depuración Acelerada:** Para resolver rápidamente esos molestos **errores de sintaxis** o pequeños despistes lógicos que a veces nos frenan.
* **Código de Calidad:** Consulté a la IA para aplicar **buenas prácticas** de desarrollo en Node.js y Express. Esto incluyó desde la estructuración modular del proyecto (carpetas `controllers`, `services`, `middleware`, etc.) hasta el manejo seguro de contraseñas (`bcrypt`) y la implementación correcta de JWT.
* **Chispa Creativa y Diseño:** Cuando necesitaba explorar opciones o desbloquear ideas, la IA funcionó como un 'brainstorming partner'. Ayudó a definir enfoques para la **implementación del caché**, la **estructura de las respuestas** de la API y la **organización general de la lógica** del backend.
* **Refinamiento y Optimización:** Sugerencias puntuales para mejorar la legibilidad, eficiencia y mantenibilidad del código en diferentes módulos.
* **Documentación Clara:** ¡Incluso colaboró en la redacción y estructuración de partes de este mismo `README.md` para que fuera lo más claro y completo posible!

En esencia, la IA fue una herramienta para **potenciar la productividad**, **asegurar la calidad** y **validar decisiones de diseño**, permitiéndome enfocar más energía en la lógica central de la aplicación y entregar un resultado más robusto.