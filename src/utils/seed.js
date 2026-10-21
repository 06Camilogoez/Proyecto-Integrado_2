require('dotenv').config();
const connectDB = require('../config/db');

const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const Media = require('../models/Media');

const seedData = async () => {
    try {
        await connectDB();

        await Media.deleteMany({});
        await Genero.deleteMany({});
        await Director.deleteMany({});
        await Productora.deleteMany({});
        await Tipo.deleteMany({});

        const generos = await Genero.insertMany([
            { nombre: 'Accion', estado: 'Activo', descripcion: 'Peliculas de accion' },
            { nombre: 'Aventura', estado: 'Activo', descripcion: 'Peliculas de aventura' },
            { nombre: 'Ciencia Ficcion', estado: 'Activo', descripcion: 'Peliculas de ciencia ficcion' },
            { nombre: 'Drama', estado: 'Activo', descripcion: 'Peliculas de drama' },
            { nombre: 'Terror', estado: 'Activo', descripcion: 'Peliculas de terror' },
            { nombre: 'Comedia Clasica', estado: 'Inactivo', descripcion: 'Genero inactivo para pruebas' }
        ]);

        const directores = await Director.insertMany([
            { nombres: 'Christopher Nolan', estado: 'Activo' },
            { nombres: 'Steven Spielberg', estado: 'Activo' },
            { nombres: 'Denis Villeneuve', estado: 'Activo' },
            { nombres: 'Director Retirado', estado: 'Inactivo' }
        ]);

        const productoras = await Productora.insertMany([
            {
                nombre: 'Warner Bros. Pictures',
                estado: 'Activo',
                slogan: 'The Stuff That Dreams Are Made Of',
                descripcion: 'Productora de cine y television'
            },
            {
                nombre: 'Universal Pictures',
                estado: 'Activo',
                slogan: 'A Comcast Company',
                descripcion: 'Estudios cinematograficos'
            },
            {
                nombre: 'Paramount Pictures',
                estado: 'Activo',
                slogan: 'The Mountain of Entertainment',
                descripcion: 'Compania de produccion'
            },
            {
                nombre: 'Productora Inactiva',
                estado: 'Inactivo',
                slogan: 'Sin operaciones',
                descripcion: 'Productora inactiva para pruebas'
            }
        ]);

        const tipos = await Tipo.insertMany([
            { nombre: 'Pelicula', descripcion: 'Largometraje individual' },
            { nombre: 'Serie', descripcion: 'Produccion por episodios' },
            { nombre: 'Documental', descripcion: 'Produccion documental' }
        ]);

        const generoSciFi = generos.find(g => g.nombre === 'Ciencia Ficcion');
        const directorNolan = directores.find(d => d.nombres === 'Christopher Nolan');
        const prodWarner = productoras.find(p => p.nombre === 'Warner Bros. Pictures');
        const tipoPelicula = tipos.find(t => t.nombre === 'Pelicula');

        await Media.create({
            serial: 'MED-2026-001',
            titulo: 'Inception',
            sinopsis: 'Un ladron de secretos corporativos a traves de tecnologia de suenos.',
            url: 'https://cuevana-iudigital.edu.co/ver/inception-2010',
            imagen: 'https://image.tmdb.org/t/p/w500/o29UqKvfR1yFj6Z6V6iH7c17GvD.jpg',
            anoEstreno: 2010,
            genero: generoSciFi._id,
            director: directorNolan._id,
            productora: prodWarner._id,
            tipo: tipoPelicula._id
        });

        console.log('Datos iniciales cargados');
        process.exit(0);
    } catch (error) {
        console.error('Error al cargar datos:', error);
        process.exit(1);
    }
};

seedData();
