require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const Media = require('../models/Media');

const seedData = async () => {
    try {
        await connectDB();
        console.log('[Seeder] Limpiando colecciones anteriores...');

        await Media.deleteMany({});
        await Genero.deleteMany({});
        await Director.deleteMany({});
        await Productora.deleteMany({});
        await Tipo.deleteMany({});

        console.log('[Seeder] Creando Géneros iniciales...');
        const generos = await Genero.insertMany([
            { nombre: 'Acción', estado: 'Activo', descripcion: 'Películas con alto contenido de emoción y acción.' },
            { nombre: 'Aventura', estado: 'Activo', descripcion: 'Historias de viajes, descubrimientos y desafíos.' },
            { nombre: 'Ciencia Ficción', estado: 'Activo', descripcion: 'Relatos basados en avances científicos e hipotéticos futuros.' },
            { nombre: 'Drama', estado: 'Activo', descripcion: 'Tramas con situaciones de conflicto emocional y humano.' },
            { nombre: 'Terror', estado: 'Activo', descripcion: 'Producciones destinadas a generar suspenso y miedo.' },
            { nombre: 'Comedia Clásica', estado: 'Inactivo', descripcion: 'Género temporalmente suspendido para pruebas de validación.' }
        ]);

        console.log('[Seeder] Creando Directores iniciales...');
        const directores = await Director.insertMany([
            { nombres: 'Christopher Nolan', estado: 'Activo' },
            { nombres: 'Steven Spielberg', estado: 'Activo' },
            { nombres: 'Denis Villeneuve', estado: 'Activo' },
            { nombres: 'Director Retirado', estado: 'Inactivo' }
        ]);

        console.log('[Seeder] Creando Productoras iniciales...');
        const productoras = await Productora.insertMany([
            {
                nombre: 'Warner Bros. Pictures',
                estado: 'Activo',
                slogan: 'The Stuff That Dreams Are Made Of',
                descripcion: 'Compañía productora y distribuidora de cine y televisión.'
            },
            {
                nombre: 'Universal Pictures',
                estado: 'Activo',
                slogan: 'A Comcast Company',
                descripcion: 'Uno de los estudios cinematográficos más antiguos de Estados Unidos.'
            },
            {
                nombre: 'Paramount Pictures',
                estado: 'Activo',
                slogan: 'The Mountain of Entertainment',
                descripcion: 'Firma estadounidense de producción cinematográfica.'
            },
            {
                nombre: 'Productora Inactiva Inc.',
                estado: 'Inactivo',
                slogan: 'Sin operaciones',
                descripcion: 'Productora para pruebas de rechazo de validación.'
            }
        ]);

        console.log('[Seeder] Creando Tipos iniciales...');
        const tipos = await Tipo.insertMany([
            { nombre: 'Película', descripcion: 'Producción audiovisual de largometraje individual.' },
            { nombre: 'Serie', descripcion: 'Producción audiovisual de múltiples episodios por temporadas.' },
            { nombre: 'Documental', descripcion: 'Producción informativa o testimonial.' }
        ]);

        console.log('[Seeder] Creando Producciones Media iniciales...');
        const generoSciFi = generos.find(g => g.nombre === 'Ciencia Ficción');
        const directorNolan = directores.find(d => d.nombres === 'Christopher Nolan');
        const prodWarner = productoras.find(p => p.nombre === 'Warner Bros. Pictures');
        const tipoPelicula = tipos.find(t => t.nombre === 'Película');

        await Media.create({
            serial: 'MED-2026-001',
            titulo: 'Inception',
            sinopsis: 'Un ladrón que roba secretos corporativos mediante el uso de la tecnología de compartir sueños tiene la tarea inversa de plantar una idea en la mente de un CEO.',
            url: 'https://cuevana-iudigital.edu.co/ver/inception-2010',
            imagen: 'https://image.tmdb.org/t/p/w500/o29UqKvfR1yFj6Z6V6iH7c17GvD.jpg',
            anoEstreno: 2010,
            genero: generoSciFi._id,
            director: directorNolan._id,
            productora: prodWarner._id,
            tipo: tipoPelicula._id
        });

        console.log('¡Datos iniciales sembrados con éxito en la base de datos!');
        process.exit(0);
    } catch (error) {
        console.error('[Seeder] Error al sembrar datos:', error);
        process.exit(1);
    }
};

seedData();
