# API REST - Sistema de Gestión de Películas y Series
**Institución Universitaria Digital de Antioquia (IU Digital)**  
**Asignatura:** Proyecto Integrado II / Ingeniería Web II  
**Tecnologías:** Node.js, Express, MongoDB (Mongoose), Postman

---

## 📌 Descripción del Proyecto
Este proyecto corresponde al desarrollo de una **API REST monolítica desacoplada** para la gestión y administración de producciones audiovisuales (películas y series) para la plataforma web de entretenimiento de la IU Digital.

La API implementa operaciones CRUD completas y reglas de negocio para los cinco (5) módulos requeridos:
1. **Género**: Clasificación temática de los contenidos (Acción, Aventura, Ciencia Ficción, Drama, Terror, etc.).
2. **Director**: Directores principales de las producciones.
3. **Productora**: Casas productoras (Warner Bros, Universal, Paramount, etc.).
4. **Tipo**: Clasificación del formato multimedia (Película, Serie, Cortometraje, etc.).
5. **Media (Películas y Series)**: Gestión integral de producciones con validación de relaciones activas.

---

## 🏗️ Arquitectura y Estructura del Código

Se utilizó el patrón de diseño **MVC (Modelo - Vista - Controlador)** adaptado para APIs REST:

```
Proyecto Integrado II/
├── src/
│   ├── config/
│   │   └── db.js                  # Conexión a MongoDB vía Mongoose
│   ├── models/                    # Esquemas de datos (Mongoose)
│   │   ├── Genero.js
│   │   ├── Director.js
│   │   ├── Productora.js
│   │   ├── Tipo.js
│   │   └── Media.js
│   ├── controllers/               # Lógica de negocio y manejo de peticiones
│   │   ├── generoController.js
│   │   ├── directorController.js
│   │   ├── productoraController.js
│   │   ├── tipoController.js
│   │   └── mediaController.js
│   ├── routes/                    # Enrutadores Express (endpoints REST)
│   │   ├── generoRoutes.js
│   │   ├── directorRoutes.js
│   │   ├── productoraRoutes.js
│   │   ├── tipoRoutes.js
│   │   └── mediaRoutes.js
│   ├── utils/
│   │   └── seed.js                # Script de datos iniciales de prueba
│   ├── app.js                     # Configuración de Express y middlewares
│   └── index.js                   # Punto de entrada y arranque del servidor
├── postman/
│   └── Peliculas_API_IU_Digital.postman_collection.json # Colección de pruebas
├── docs/
│   └── DOCUMENTO_ENTREGA_PROYECTO.md  # Informe formal en Normas APA
├── .env.example                   # Plantilla de variables de entorno
├── .env                           # Configuración local / Atlas
├── .gitignore                     # Exclusión de node_modules y .env
├── package.json                   # Dependencias y scripts
└── README.md                      # Documentación general
```

---

## ⚙️ Reglas de Negocio Implementadas

- **Unicidad:** El nombre del género, el nombre de la productora, el nombre del tipo, el serial de la producción y la URL de la película son valores únicos.
- **Relaciones con entidades activas:** Al crear o actualizar un registro en **Media**:
  - El **Género** debe existir y su estado debe ser `Activo`.
  - El **Director** debe existir y su estado debe ser `Activo`.
  - La **Productora** debe existir y su estado debe ser `Activo`.
  - El **Tipo** debe existir registrado en el sistema.
- **Integridad referencial en eliminación:** No es posible eliminar un Género, Director, Productora o Tipo si se encuentra asignado a una producción existente en el módulo de Media.

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar el repositorio o abrir la carpeta
```bash
git clone <url-de-tu-repositorio>
cd "Proyecto Integrado II"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (`.env`)
Edita el archivo `.env` en la raíz del proyecto. Puedes usar MongoDB Atlas (en la nube) o MongoDB Local:

```env
PORT=4000

# Opción A: MongoDB Atlas (Nube - Recomendado para la entrega):
# MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.abcde.mongodb.net/peliculas_db?retryWrites=true&w=majority

# Opción B: MongoDB Local:
MONGO_URI=mongodb://127.0.0.1:27017/peliculas_db
```

### 4. Poblar datos iniciales de prueba (Opcional pero recomendado)
Crea datos base (géneros, directores, productoras, tipos y una película de prueba):
```bash
npm run seed
```

### 5. Iniciar la aplicación
- **Modo Desarrollo (con recarga automática):**
  ```bash
  npm run dev
  ```
- **Modo Producción:**
  ```bash
  npm start
  ```

El servidor estará escuchando en `http://localhost:4000/`.

---

## 📡 Endpoints de la API REST

### Base URL: `http://localhost:4000/api`

| Módulo | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Raíz** | `GET` | `/` | Información del estado de la API y rutas |
| **Género** | `GET` | `/api/generos` | Listar todos los géneros (filtro opcional `?estado=Activo`) |
| | `GET` | `/api/generos/:id` | Obtener género por ID |
| | `POST` | `/api/generos` | Crear nuevo género |
| | `PUT` | `/api/generos/:id` | Actualizar género por ID |
| | `DELETE` | `/api/generos/:id` | Eliminar género por ID |
| **Director** | `GET` | `/api/directores` | Listar todos los directores |
| | `GET` | `/api/directores/:id` | Obtener director por ID |
| | `POST` | `/api/directores` | Crear nuevo director |
| | `PUT` | `/api/directores/:id` | Actualizar director por ID |
| | `DELETE` | `/api/directores/:id` | Eliminar director por ID |
| **Productora** | `GET` | `/api/productoras` | Listar todas las productoras |
| | `GET` | `/api/productoras/:id` | Obtener productora por ID |
| | `POST` | `/api/productoras` | Crear nueva productora |
| | `PUT` | `/api/productoras/:id` | Actualizar productora por ID |
| | `DELETE` | `/api/productoras/:id` | Eliminar productora por ID |
| **Tipo** | `GET` | `/api/tipos` | Listar todos los tipos multimedia |
| | `GET` | `/api/tipos/:id` | Obtener tipo por ID |
| | `POST` | `/api/tipos` | Crear nuevo tipo |
| | `PUT` | `/api/tipos/:id` | Actualizar tipo por ID |
| | `DELETE` | `/api/tipos/:id` | Eliminar tipo por ID |
| **Media** | `GET` | `/api/medias` | Listar películas y series (con relaciones pobladas) |
| | `GET` | `/api/medias/:id` | Obtener película/serie por ID |
| | `POST` | `/api/medias` | Registrar película o serie (valida relaciones activas) |
| | `PUT` | `/api/medias/:id` | Actualizar película o serie |
| | `DELETE` | `/api/medias/:id` | Eliminar película o serie |

---

## 🧪 Pruebas con Postman

1. Abre **Postman**.
2. Haz clic en **Import** y selecciona el archivo:
   `postman/Peliculas_API_IU_Digital.postman_collection.json`.
3. La colección ya incluye todas las peticiones organizadas por carpetas y scripts automáticos que capturan los `ID` generados en variables para encadenar las pruebas.

---

## 📹 Guion para el Video Explicativo (3 a 5 minutos)

1. **Presentación (0:00 - 0:30):**
   - Saludo al docente y nombrar a los integrantes del equipo de trabajo.
   - Indicar el objetivo de la actividad (API REST con Node.js, Express y MongoDB para la IU Digital).
2. **Arquitectura y Código (0:30 - 1:30):**
   - Mostrar la estructura de carpetas en VS Code (`models`, `controllers`, `routes`, `config`).
   - Resaltar la regla de negocio en `mediaController.js` (solo permitir géneros, directores y productoras activos).
3. **Demostración Práctica en Postman (1:30 - 4:00):**
   - Probar `POST /api/generos`, `POST /api/directores`, `POST /api/productoras`, `POST /api/tipos`.
   - Probar creación de una película en `POST /api/medias`.
   - Demostrar la validación de rechazo (código `400`) al intentar crear una película con un género o director inactivo.
   - Probar consultas `GET /api/medias` mostrando el resultado con `.populate()`.
   - Probar actualización con `PUT`.
4. **Conclusión y Despedida (4:00 - 4:30):**
   - Confirmar el cumplimiento del 100% de la rúbrica y despedida.
