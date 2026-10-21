const Genero = require('../models/Genero');
const Media = require('../models/Media');

// Obtener todos los géneros
const getGeneros = async (req, res) => {
    try {
        const { estado } = req.query;
        const filter = {};
        if (estado) {
            filter.estado = estado;
        }
        const generos = await Genero.find(filter).sort({ fechaCreacion: -1 });
        return res.status(200).json({
            ok: true,
            total: generos.length,
            data: generos
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al consultar géneros',
            error: error.message
        });
    }
};

// Obtener un género por ID
const getGeneroById = async (req, res) => {
    try {
        const { id } = req.params;
        const genero = await Genero.findById(id);
        if (!genero) {
            return res.status(404).json({
                ok: false,
                message: `No se encontró ningún género con el ID: ${id}`
            });
        }
        return res.status(200).json({
            ok: true,
            data: genero
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al buscar el género',
            error: error.message
        });
    }
};

// Crear un género
const createGenero = async (req, res) => {
    try {
        const { nombre, estado, descripcion } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                ok: false,
                message: 'El campo nombre es obligatorio'
            });
        }

        const existeGenero = await Genero.findOne({ nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') } });
        if (existeGenero) {
            return res.status(400).json({
                ok: false,
                message: `El género con nombre "${nombre}" ya existe`
            });
        }

        const nuevoGenero = new Genero({
            nombre: nombre.trim(),
            estado: estado || 'Activo',
            descripcion: descripcion || '',
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        const generoGuardado = await nuevoGenero.save();
        return res.status(201).json({
            ok: true,
            message: 'Género creado exitosamente',
            data: generoGuardado
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al crear el género',
            error: error.message
        });
    }
};

// Actualizar un género
const updateGenero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, descripcion } = req.body;

        const genero = await Genero.findById(id);
        if (!genero) {
            return res.status(404).json({
                ok: false,
                message: `No se encontró ningún género con el ID: ${id}`
            });
        }

        if (nombre && nombre.trim() !== '') {
            const nombreDuplicado = await Genero.findOne({
                _id: { $ne: id },
                nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') }
            });
            if (nombreDuplicado) {
                return res.status(400).json({
                    ok: false,
                    message: `Ya existe otro género con el nombre "${nombre}"`
                });
            }
            genero.nombre = nombre.trim();
        }

        if (estado !== undefined) {
            if (!['Activo', 'Inactivo'].includes(estado)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El estado debe ser "Activo" o "Inactivo"'
                });
            }
            genero.estado = estado;
        }

        if (descripcion !== undefined) {
            genero.descripcion = descripcion;
        }

        genero.fechaActualizacion = new Date();
        const generoActualizado = await genero.save();

        return res.status(200).json({
            ok: true,
            message: 'Género actualizado exitosamente',
            data: generoActualizado
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar el género',
            error: error.message
        });
    }
};

// Eliminar un género
const deleteGenero = async (req, res) => {
    try {
        const { id } = req.params;

        const genero = await Genero.findById(id);
        if (!genero) {
            return res.status(404).json({
                ok: false,
                message: `No se encontró ningún género con el ID: ${id}`
            });
        }

        // Validar si está en uso en Media
        const enUso = await Media.findOne({ genero: id });
        if (enUso) {
            return res.status(400).json({
                ok: false,
                message: 'No se puede eliminar el género porque está asociado a una o más películas/series (Media)'
            });
        }

        await Genero.findByIdAndDelete(id);
        return res.status(200).json({
            ok: true,
            message: 'Género eliminado exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el género',
            error: error.message
        });
    }
};

module.exports = {
    getGeneros,
    getGeneroById,
    createGenero,
    updateGenero,
    deleteGenero
};
