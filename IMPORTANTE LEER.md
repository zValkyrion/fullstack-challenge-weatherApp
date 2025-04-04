# 🌦️ Fullstack Challenge - Weather App

Este repositorio contiene tanto el **Frontend (construido con React)** como el **Backend (API construida con Node.js/Express)** para una aplicación de clima completa.

## 📋 Descripción General

Este proyecto demuestra habilidades de desarrollo full-stack con:
- **Frontend**: Aplicación moderna en React con diseño responsive
- **Backend**: API RESTful construida con Node.js y Express
- **Base de datos**: Integración con MongoDB para persistencia de datos
- **Datos meteorológicos**: Integración con la API de Reservamos y OpenWeatherMap

## 📂 Estructura del Repositorio

El proyecto está organizado como un monorepo con la siguiente estructura:

```
.
├── fullstack-challenge-backend/   # Código fuente de la API Backend
├── fullstack-challenge-frontend/  # Código fuente de la Aplicación Frontend (React)
├── .gitignore                     # Archivos ignorados por Git
└── README.md                      # Esta guía principal
```

Cada directorio del proyecto contiene su propio README detallado con instrucciones específicas.

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar ambos proyectos localmente.

### Prerrequisitos

- **Node.js** (v14+ recomendado)
- **npm** o yarn
- **Git**
- **MongoDB** (instancia local o en la nube)
- **API Keys** para OpenWeatherMap (ver README del backend)

### Instalación

Necesitas instalar las dependencias para **cada** proyecto por separado:

#### 1. Dependencias del Backend:
```bash
cd fullstack-challenge-backend
npm install
```

#### 2. Dependencias del Frontend:
```bash
cd fullstack-challenge-frontend
npm install
```

### ⚙️ Configuración (Variables de Entorno)

Ambos proyectos requieren archivos `.env` para variables sensibles:

#### Backend:
1. Crea un archivo `.env` dentro de `fullstack-challenge-backend/`
2. Consulta el README del backend para conocer las variables requeridas
3. Recomendación: Revisa el archivo `.env.example` incluido como plantilla

#### Frontend:
1. Crea un archivo `.env` dentro de `fullstack-challenge-frontend/`
2. Configura principalmente la URL de la API backend (`VITE_API_URL`)
3. Revisa el archivo `.env.example` incluido como referencia

> ⚠️ **IMPORTANTE:** Los archivos `.env` contienen información sensible. **Nunca los subas a Git ni los compartas directamente**. Asegúrate de que estén incluidos en `.gitignore`.

### 🖥️ Ejecución

Para ejecutar la aplicación completa, necesitarás iniciar ambos servidores **en terminales separadas**:

#### Iniciar el Backend:
```bash
cd fullstack-challenge-backend
npm run dev
# El servidor normalmente se ejecutará en http://localhost:5001
```

#### Iniciar el Frontend:
```bash
cd fullstack-challenge-frontend
npm run dev
# La aplicación normalmente se ejecutará en http://localhost:5173
```

## 📖 Documentación Detallada

**Cada carpeta del proyecto contiene su propio archivo `README.md` con instrucciones detalladas** sobre:

- Configuración específica
- Estructura interna
- Scripts disponibles
- Endpoints de API (backend)
- Componentes y estructura (frontend)

➡️ **Consulta estos READMEs para obtener todos los detalles técnicos de cada parte del proyecto.**
