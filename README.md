# API REST - Sistema de Gestion de Peliculas y Series
Institucion Universitaria Digital de Antioquia (IU Digital)  
Asignatura: Proyecto Integrado II / Ingenieria Web II  
Tecnologias: Node.js, Express, MongoDB (Mongoose), Postman

---

## Descripcion del Proyecto
Desarrollo de una API REST para la administracion de peliculas y series de la plataforma web de la IU Digital.

Modulos implementados:
1. Genero: Clasificacion tematica (Accion, Aventura, Ciencia Ficcion, Drama, Terror, etc.).
2. Director: Directores principales de las producciones.
3. Productora: Productoras asociadas (Warner Bros, Universal, Paramount, etc.).
4. Tipo: Formato del contenido (Pelicula, Serie, etc.).
5. Media: Gestion de peliculas y series con validacion de entidades activas.

---

## Estructura del Proyecto

```
Proyecto Integrado II/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Genero.js
│   │   ├── Director.js
│   │   ├── Productora.js
│   │   ├── Tipo.js
│   │   └── Media.js
│   ├── controllers/
│   │   ├── generoController.js
│   │   ├── directorController.js
│   │   ├── productoraController.js
│   │   ├── tipoController.js
│   │   └── mediaController.js
│   ├── routes/
│   │   ├── generoRoutes.js
│   │   ├── directorRoutes.js
│   │   ├── productoraRoutes.js
│   │   ├── tipoRoutes.js
│   │   └── mediaRoutes.js
│   ├── utils/
│   │   └── seed.js
│   ├── app.js
│   └── index.js
├── postman/
│   └── Peliculas_API_IU_Digital.postman_collection.json
├── docs/
│   └── DOCUMENTO_ENTREGA_PROYECTO.md
├── .env.example
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Reglas de Negocio

- Nombres unicos para Genero, Productora y Tipo.
- Serial y URL unicos para Media.
- Para crear o actualizar un registro en Media:
  - El Genero debe existir y tener estado Activo.
  - El Director debe existir y tener estado Activo.
  - La Productora debe existir y tener estado Activo.
  - El Tipo debe existir registrado en el sistema.
- Integridad referencial: No se puede eliminar un Genero, Director, Productora o Tipo si esta asociado a una pelicula o serie.

---

## Instalacion y Ejecucion

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd "Proyecto Integrado II"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (.env)
Configurar el puerto y la cadena de conexion en `.env`:
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/peliculas_db
```

### 4. Cargar datos iniciales (opcional)
```bash
npm run seed
```

### 5. Iniciar la aplicacion
- Desarrollo:
  ```bash
  npm run dev
  ```
- Produccion:
  ```bash
  npm start
  ```

---

## Endpoints de la API

Base URL: `http://localhost:4000/api`

| Modulo | Metodo | Endpoint | Descripcion |
| :--- | :--- | :--- | :--- |
| Info | GET | / | Informacion general de la API |
| Genero | GET | /api/generos | Listar generos |
| Genero | GET | /api/generos/:id | Consultar genero por ID |
| Genero | POST | /api/generos | Crear genero |
| Genero | PUT | /api/generos/:id | Actualizar genero |
| Genero | DELETE | /api/generos/:id | Eliminar genero |
| Director | GET | /api/directores | Listar directores |
| Director | GET | /api/directores/:id | Consultar director por ID |
| Director | POST | /api/directores | Crear director |
| Director | PUT | /api/directores/:id | Actualizar director |
| Director | DELETE | /api/directores/:id | Eliminar director |
| Productora | GET | /api/productoras | Listar productoras |
| Productora | GET | /api/productoras/:id | Consultar productora por ID |
| Productora | POST | /api/productoras | Crear productora |
| Productora | PUT | /api/productoras/:id | Actualizar productora |
| Productora | DELETE | /api/productoras/:id | Eliminar productora |
| Tipo | GET | /api/tipos | Listar tipos |
| Tipo | GET | /api/tipos/:id | Consultar tipo por ID |
| Tipo | POST | /api/tipos | Crear tipo |
| Tipo | PUT | /api/tipos/:id | Actualizar tipo |
| Tipo | DELETE | /api/tipos/:id | Eliminar tipo |
| Media | GET | /api/medias | Listar peliculas/series |
| Media | GET | /api/medias/:id | Consultar por ID |
| Media | POST | /api/medias | Crear pelicula/serie |
| Media | PUT | /api/medias/:id | Actualizar pelicula/serie |
| Media | DELETE | /api/medias/:id | Eliminar pelicula/serie |

---

## Pruebas en Postman

Importar el archivo `postman/Peliculas_API_IU_Digital.postman_collection.json` en Postman para ejecutar las peticiones de cada modulo.

---

## Guion del Video Explicativo

1. Presentacion: Nombrar a los integrantes del equipo y objetivo de la entrega.
2. Arquitectura: Mostrar organizacion de carpetas en el editor.
3. Demostracion en Postman:
   - Crear y listar registros de Genero, Director, Productora y Tipo.
   - Crear una pelicula en Media verificando que tome las relaciones activas.
   - Mostrar el error 400 al intentar asignar un director o genero inactivo.
   - Actualizar y consultar con populate.
4. Cierre del video.
