const Tipo = require('../models/Tipo');
const Media = require('../models/Media');

const getTipos = async (req, res) => {
    try {
        const tipos = await Tipo.find().sort({ fechaCreacion: -1 });
        return res.status(200).json({
            ok: true,
            total: tipos.length,
            data: tipos
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al consultar tipos',
            error: error.message
        });
    }
};

const getTipoById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipo = await Tipo.findById(id);
        if (!tipo) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro el tipo con ID: ${id}`
            });
        }
        return res.status(200).json({
            ok: true,
            data: tipo
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al buscar el tipo',
            error: error.message
        });
    }
};

const createTipo = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                ok: false,
                message: 'El nombre del tipo es obligatorio'
            });
        }

        const existe = await Tipo.findOne({ nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') } });
        if (existe) {
            return res.status(400).json({
                ok: false,
                message: `El tipo con nombre "${nombre}" ya existe`
            });
        }

        const nuevoTipo = new Tipo({
            nombre: nombre.trim(),
            descripcion: descripcion || '',
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        const tipoGuardado = await nuevoTipo.save();
        return res.status(201).json({
            ok: true,
            message: 'Tipo creado exitosamente',
            data: tipoGuardado
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al crear el tipo',
            error: error.message
        });
    }
};

const updateTipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const tipo = await Tipo.findById(id);
        if (!tipo) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro el tipo con ID: ${id}`
            });
        }

        if (nombre && nombre.trim() !== '') {
            const duplicado = await Tipo.findOne({
                _id: { $ne: id },
                nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') }
            });
            if (duplicado) {
                return res.status(400).json({
                    ok: false,
                    message: `Ya existe otro tipo con el nombre "${nombre}"`
                });
            }
            tipo.nombre = nombre.trim();
        }

        if (descripcion !== undefined) {
            tipo.descripcion = descripcion;
        }

        tipo.fechaActualizacion = new Date();
        const tipoActualizado = await tipo.save();

        return res.status(200).json({
            ok: true,
            message: 'Tipo actualizado exitosamente',
            data: tipoActualizado
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar el tipo',
            error: error.message
        });
    }
};

const deleteTipo = async (req, res) => {
    try {
        const { id } = req.params;

        const tipo = await Tipo.findById(id);
        if (!tipo) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro el tipo con ID: ${id}`
            });
        }

        const enUso = await Media.findOne({ tipo: id });
        if (enUso) {
            return res.status(400).json({
                ok: false,
                message: 'No se puede eliminar el tipo porque esta asociado a una o mas producciones'
            });
        }

        await Tipo.findByIdAndDelete(id);
        return res.status(200).json({
            ok: true,
            message: 'Tipo eliminado exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el tipo',
            error: error.message
        });
    }
};

module.exports = {
    getTipos,
    getTipoById,
    createTipo,
    updateTipo,
    deleteTipo
};
