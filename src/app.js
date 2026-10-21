const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importar rutas
const generoRoutes = require('./routes/generoRoutes');
const directorRoutes = require('./routes/directorRoutes');
const productoraRoutes = require('./routes/productoraRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ruta raíz con documentación interactiva del estado de la API
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        nombre: 'API REST - Sistema de Gestión de Películas y Series',
        institucion: 'Institución Universitaria Digital de Antioquia (IU Digital)',
        asignatura: 'Proyecto Integrado II / Ingeniería Web II',
        version: '1.0.0',
        estado: 'Activo y en funcionamiento',
        modulos: {
            generos: {
                ruta: '/api/generos',
                metodos: ['GET', 'POST', 'PUT /:id', 'DELETE /:id', 'GET /:id']
            },
            directores: {
                ruta: '/api/directores',
                metodos: ['GET', 'POST', 'PUT /:id', 'DELETE /:id', 'GET /:id']
            },
            productoras: {
                ruta: '/api/productoras',
                metodos: ['GET', 'POST', 'PUT /:id', 'DELETE /:id', 'GET /:id']
            },
            tipos: {
                ruta: '/api/tipos',
                metodos: ['GET', 'POST', 'PUT /:id', 'DELETE /:id', 'GET /:id']
            },
            medias: {
                ruta: '/api/medias',
                metodos: ['GET', 'POST', 'PUT /:id', 'DELETE /:id', 'GET /:id'],
                descripcion: 'Películas y series con validación de relaciones activas'
            }
        }
    });
});

// Registrar rutas de la API
app.use('/api/generos', generoRoutes);
app.use('/api/directores', directorRoutes);
app.use('/api/productoras', productoraRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/medias', mediaRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Manejador global de errores (500)
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({
        ok: false,
        message: 'Ocurrió un error interno en el servidor',
        error: err.message
    });
});

module.exports = app;
