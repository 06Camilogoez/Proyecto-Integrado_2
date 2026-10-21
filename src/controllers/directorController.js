const Director = require('../models/Director');
const Media = require('../models/Media');

const getDirectores = async (req, res) => {
    try {
        const { estado } = req.query;
        const filter = {};
        if (estado) {
            filter.estado = estado;
        }
        const directores = await Director.find(filter).sort({ fechaCreacion: -1 });
        return res.status(200).json({
            ok: true,
            total: directores.length,
            data: directores
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al consultar directores',
            error: error.message
        });
    }
};

const getDirectorById = async (req, res) => {
    try {
        const { id } = req.params;
        const director = await Director.findById(id);
        if (!director) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro el director con ID: ${id}`
            });
        }
        return res.status(200).json({
            ok: true,
            data: director
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al buscar el director',
            error: error.message
        });
    }
};

const createDirector = async (req, res) => {
    try {
        const { nombres, estado } = req.body;

        if (!nombres || nombres.trim() === '') {
            return res.status(400).json({
                ok: false,
                message: 'El campo nombres es obligatorio'
            });
        }

        const nuevoDirector = new Director({
            nombres: nombres.trim(),
            estado: estado || 'Activo',
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        const directorGuardado = await nuevoDirector.save();
        return res.status(201).json({
            ok: true,
            message: 'Director creado exitosamente',
            data: directorGuardado
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al crear el director',
            error: error.message
        });
    }
};

const updateDirector = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, estado } = req.body;

        const director = await Director.findById(id);
        if (!director) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro el director con ID: ${id}`
            });
        }

        if (nombres && nombres.trim() !== '') {
            director.nombres = nombres.trim();
        }

        if (estado !== undefined) {
            if (!['Activo', 'Inactivo'].includes(estado)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El estado debe ser Activo o Inactivo'
                });
            }
            director.estado = estado;
        }

        director.fechaActualizacion = new Date();
        const directorActualizado = await director.save();

        return res.status(200).json({
            ok: true,
            message: 'Director actualizado exitosamente',
            data: directorActualizado
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar el director',
            error: error.message
        });
    }
};

const deleteDirector = async (req, res) => {
    try {
        const { id } = req.params;

        const director = await Director.findById(id);
        if (!director) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro el director con ID: ${id}`
            });
        }

        const enUso = await Media.findOne({ director: id });
        if (enUso) {
            return res.status(400).json({
                ok: false,
                message: 'No se puede eliminar el director porque esta asociado a una o mas producciones'
            });
        }

        await Director.findByIdAndDelete(id);
        return res.status(200).json({
            ok: true,
            message: 'Director eliminado exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el director',
            error: error.message
        });
    }
};

module.exports = {
    getDirectores,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector
};
