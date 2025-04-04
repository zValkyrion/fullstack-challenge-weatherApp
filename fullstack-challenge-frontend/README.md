# WeatherApp - Frontend (React) ☀️

Interfaz de usuario para WeatherApp, una aplicación web para consultar el clima con autenticación de usuarios, construida con React, Vite y Tailwind CSS.

## Tabla de Contenidos

* [Introducción](#introducción)
* [Características](#características)
* [Cómo Funciona](#cómo-funciona)
    * [Flujo de Autenticación](#flujo-de-autenticación)
    * [Routing](#routing)
    * [Manejo de Estado](#manejo-de-estado)
    * [Estilos](#estilos)
    * [Animaciones](#animaciones)
* [Estructura del Proyecto](#estructura-del-proyecto)
* [Componentes Principales](#componentes-principales)
* [Tecnologías Utilizadas](#tecnologías-utilizadas)
* [Prerrequisitos](#prerrequisitos)
* [Instalación](#instalación)
* [Configuración (.env)](#configuración-env)
* [Scripts Disponibles](#scripts-disponibles)
* [Despliegue (Deployment)](#despliegue-deployment)

## Introducción

Este proyecto es el frontend de WeatherApp, diseñado para interactuar con un [backend de autenticación]([URL_DEL_REPO_BACKEND_AQUÍ]). Permite a los usuarios ver pronósticos meteorológicos detallados para diferentes ubicaciones una vez autenticados. Se utilizó Vite para un desarrollo rápido y Tailwind CSS (v4 Alpha) para un diseño moderno basado en utilidades.

## Características ✨

* **Autenticación Completa:** Flujo de Registro (Signup), Inicio de Sesión (Login) y Cierre de Sesión (Logout).
* **Gestión de Sesión:** Persistencia del estado de autenticación.
* **Rutas Protegidas:** Acceso restringido a páginas principales (Home, Detalles de Ciudad) solo para usuarios logueados.
* **Página Principal (Home):** Muestra multiples pronosticos basados en ciudades.
* **Vista Detallada de Ciudad:** Muestra pronóstico extendido basado en coordenadas.
* **Notificaciones:** Feedback visual al usuario mediante `react-hot-toast`.
* **Página 404 Personalizada:** Una pantalla temática y amigable para rutas no encontradas.
* **Diseño Responsivo:** Adaptable a diferentes dispositivos gracias a Tailwind CSS.
* **Animaciones:** Transiciones entre páginas usando `framer-motion`.
* **Componentes Reutilizables:** Creación de componentes como `Button`, `Input`, `Alert`, `Spinner` para consistencia.

## Cómo Funciona ⚙️

La aplicación sigue una arquitectura basada en componentes de React.

### Flujo de Autenticación

1. El estado de autenticación (`isAuthenticated`, `user`, `isLoading`, `error`) se gestiona globalmente mediante React Context (`AuthContext` en `src/contexts/AuthContext.jsx`).
2. Las páginas `LoginPage` y `SignupPage` utilizan el hook `useAuth` para llamar a las funciones `login` y `signup` del contexto.
3. Estas funciones del contexto realizan llamadas a la API del backend (definida por `VITE_API_BASE_URL`).
4. El componente `ProtectedRoute` envuelve las rutas que requieren autenticación, verifica `isAuthenticated` del contexto y redirige a `/login` si el usuario no está logueado.
5. La `Navbar` muestra condicionalmente el saludo y botón de logout o los botones de login/signup basándose en `isAuthenticated`.
6. El logout llama a la función `logout` del contexto, que probablemente elimina el token/sesión y actualiza el estado.

### Routing

* Se utiliza `react-router-dom` (v6) para manejar la navegación del lado del cliente.
* Las rutas se definen en `src/App.jsx` dentro del componente `<Routes>`.
* Se usan rutas dinámicas como `/city/:lat/:lon` para mostrar detalles específicos.
* La ruta comodín `path="*"` captura cualquier URL no coincidente y muestra el componente `NotFoundPage`.

### Manejo de Estado

* El estado global de autenticación se maneja con `AuthContext`.
* El estado local de los componentes (ej. campos de formulario en `LoginPage`) se maneja con `useState`.
* El estado relacionado con la carga y errores de API (auth y clima) se maneja probablemente dentro del `AuthContext` y/o hooks personalizados.

### Estilos

* La aplicación utiliza **Tailwind CSS v4 Alpha**. Los estilos se aplican principalmente mediante clases de utilidad directamente en el JSX.
* No se requiere un archivo `tailwind.config.js` por defecto en v4 alpha, aunque se puede usar `@theme` dentro del CSS si se necesita configuración avanzada.
* Los colores personalizados (como `primary`, `primary-dark`) deben definirse mediante variables CSS en el archivo CSS principal (ej: `src/index.css`) o reemplazarse por colores estándar de Tailwind si no se definieron.
* Puede haber estilos globales base mínimos en `src/index.css`.
* Se añadieron skeletons para mejor visualizacion hacia el cliente.

### Animaciones

* `Framer Motion` se utiliza para animar las transiciones entre rutas. El componente `<AnimatePresence>` envuelve a `<Routes>` en `App.jsx`.

## Estructura del Proyecto 📁

```
weatherapp-frontend/
├── public/             # Archivos estáticos (favicon, etc.)
├── src/
│   ├── assets/         # Imágenes, fuentes, etc. (si aplica)
│   ├── components/     # Componentes reutilizables (Button, Navbar, Input, etc.)
│   ├── contexts/       # Contextos de React (AuthContext.jsx)
│   ├── hooks/          # Hooks personalizados (ej: useFetch - si aplica)
│   ├── pages/          # Componentes de página (HomePage, LoginPage, CityDetailPage, etc.)
│   ├── services/       # Lógica de llamadas API (si se separó)
│   ├── styles/         # CSS global o módulos (ej: index.css)
│   ├── App.jsx         # Componente raíz, configuración de rutas
│   └── main.jsx        # Punto de entrada de la aplicación, renderiza App
├── .env                # Variables de entorno (NO versionar)
├── .env.example        # Ejemplo de variables de entorno (versionar)
├── .gitignore          # Archivos/carpetas ignorados por Git
├── index.html          # Plantilla HTML principal (Vite)
├── package.json        # Dependencias y scripts del proyecto
├── README.md           # Este archivo
└── vite.config.js      # Configuración de Vite (si se personalizó)
```

## Componentes Principales 🧬

* **`App.jsx`:** Orquesta la aplicación, define el layout principal (Navbar, main, Footer) y configura el enrutamiento con `react-router-dom` y `AnimatePresence`.
* **`Navbar.jsx`:** Barra de navegación superior. Muestra el logo y, condicionalmente, acciones de usuario (Login/Signup o Saludo/Logout).
* **`HomePage.jsx`:** Página principal visible para usuarios autenticados. [Describe brevemente qué hace].
* **`LoginPage.jsx`:** Página con formulario para iniciar sesión. Maneja la entrada del usuario, la sumisión y muestra errores/notificaciones.
* **`SignupPage.jsx`:** Página con formulario para registrar nuevos usuarios.
* **`CityDetailPage.jsx`:** Muestra información detallada del clima para una ciudad específica obtenida de los parámetros de la URL (`:lat`, `:lon`).
* **`NotFoundPage.jsx`:** Página 404 personalizada y temática.
* **`Button.jsx`:** Botón reutilizable con variantes, tamaños, estados de carga/deshabilitado e iconos.
* **`Input.jsx`:** Campo de entrada reutilizable (usado en formularios).
* **`Alert.jsx`:** Componente para mostrar mensajes de alerta/error.
* **`Spinner.jsx`:** Indicador visual de carga.
* **`ProtectedRoute.jsx`:** Componente de orden superior (HOC) que protege rutas, redirigiendo si el usuario no está autenticado.
* **`AuthContext.jsx`:** (Dentro de `src/contexts/`) Proveedor de contexto que maneja el estado y la lógica de autenticación.

## Tecnologías Utilizadas 🚀

* **React:** v18+
* **Vite:** Bundler y servidor de desarrollo rápido.
* **React Router DOM:** v6 para enrutamiento del lado del cliente.
* **Tailwind CSS:** v4 Alpha para estilos utility-first.
* **Framer Motion:** Para animaciones declarativas.
* **React Hot Toast:** Para notificaciones toast.
* **React Icons:** Para iconos SVG.
* **React Context API:** Para manejo de estado global (autenticación).

## Prerrequisitos 📋

* Node.js (v18.x o superior)
* npm (v9.x o superior) o yarn
* Navegador web moderno

### APIs

* **Backend Propio:** El frontend realiza **todas** sus llamadas de red (autenticación, obtención de datos del clima, etc.) exclusivamente a su propio backend, cuya URL base se configura mediante la variable de entorno `VITE_API_BASE_URL`.
* **API Externa de Clima:** El frontend **no** interactúa directamente con la API externa de clima (OpenWeatherMap). Es responsabilidad del **backend** recibir las solicitudes de clima del frontend (a través de endpoints como `/api/weather/...`), llamar a la API externa usando su propia clave API (configurada en el backend), y devolver los datos formateados al frontend. Esto mantiene la clave API externa segura y fuera del código del cliente.

## 💡 Cómo Usé la IA en Este Proyecto

¡El desarrollo moderno a menudo implica colaboración, y en este proyecto, la Inteligencia Artificial fue una compañera valiosa! Utilicé modelos de lenguaje grandes (como Gemini de Google, Antropic Claude, Bolt y CHATGPT fueron los utilizados) como un asistente de desarrollo para diversas tareas:

* **🤖 Depuración Inteligente:** Seguido le pase molestos errores de sintaxis o pequeños fallos lógicos que a veces se me escapaban. La IA actuó como un segundo par de ojos, ayudando a identificar y corregir problemas rápidamente.

* **✨ Sugerencias y Buenas Prácticas:** Consulté a la IA para obtener recomendaciones sobre cómo estructurar componentes de React, refactorizar código para mayor legibilidad, y aplicar patrones comunes o buenas prácticas de desarrollo frontend.

* **💡 Brainstorming Creativo:** La IA sirvió como un compañero de brainstorming para explorar diferentes enfoques, desde conceptos para la página 404 hasta posibles mejoras en la experiencia de usuario.

* **🎨 Asistencia en Diseño y CSS:** Utilicé la IA para obtener ejemplos específicos de clases de Tailwind CSS, sugerencias para mejorar layouts (como arreglar espaciado entre inputs o el diseño de la navbar), y para generar ideas que ayudaran a modernizar la apariencia visual de la aplicación.

* **✍️ Generación de Documentación:** ¡Sí, esta misma sección y otras partes de este README fueron generadas y refinadas con ayuda de la IA! Un ejemplo práctico de cómo puede asistir más allá del código puro.

En esencia, la IA fue una herramienta para **acelerar el desarrollo, validar ideas, aprender nuevas técnicas y superar bloqueos**, complementando el esfuerzo y la toma de decisiones principal durante la creación del Challenge.

## Instalación ⚙️

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPO_FRONTEND_AQUÍ]
cd weatherapp-frontend
```

2. Instala dependencias:
```bash
npm install
```
o:
```bash
yarn install
```

## Configuración (.env) ⚙️

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade las siguientes variables (¡con el prefijo `VITE_`!):

```bash
# .env

# Clave API para el servicio de clima
# Obtenla de [OpenWeatherMap]
VITE_WEATHER_API_KEY=TU_API_KEY_DE_CLIMA_AQUI

# URL base de tu API backend para autenticación
VITE_API_BASE_URL=URL_DE_TU_BACKEND_AQUI
```

* Reemplaza los valores placeholder con tus claves y URLs reales.

## Scripts Disponibles

En el `package.json`, encontrarás (al menos) los siguientes scripts:

* `npm run dev` o `yarn dev`  
    Inicia el servidor de desarrollo con HMR en `http://localhost:5173`.

* `npm run build` o `yarn build`  
    Genera la build de producción optimizada en la carpeta `dist/`.

* `npm run preview` o `yarn preview`  
    Sirve localmente la build de producción desde la carpeta `dist/` para previsualizarla.

## Despliegue (Deployment)

*(Añade instrucciones específicas sobre cómo desplegar este frontend si tienes alguna preferencia o recomendación particular)*
