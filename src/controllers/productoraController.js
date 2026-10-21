const Productora = require('../models/Productora');
const Media = require('../models/Media');

const getProductoras = async (req, res) => {
    try {
        const { estado } = req.query;
        const filter = {};
        if (estado) {
            filter.estado = estado;
        }
        const productoras = await Productora.find(filter).sort({ fechaCreacion: -1 });
        return res.status(200).json({
            ok: true,
            total: productoras.length,
            data: productoras
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al consultar productoras',
            error: error.message
        });
    }
};

const getProductoraById = async (req, res) => {
    try {
        const { id } = req.params;
        const productora = await Productora.findById(id);
        if (!productora) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro la productora con ID: ${id}`
            });
        }
        return res.status(200).json({
            ok: true,
            data: productora
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al buscar la productora',
            error: error.message
        });
    }
};

const createProductora = async (req, res) => {
    try {
        const { nombre, estado, slogan, descripcion } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                ok: false,
                message: 'El nombre de la productora es obligatorio'
            });
        }

        const existe = await Productora.findOne({ nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') } });
        if (existe) {
            return res.status(400).json({
                ok: false,
                message: `La productora con nombre "${nombre}" ya existe`
            });
        }

        const nuevaProductora = new Productora({
            nombre: nombre.trim(),
            estado: estado || 'Activo',
            slogan: slogan || '',
            descripcion: descripcion || '',
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        const productoraGuardada = await nuevaProductora.save();
        return res.status(201).json({
            ok: true,
            message: 'Productora creada exitosamente',
            data: productoraGuardada
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al crear la productora',
            error: error.message
        });
    }
};

const updateProductora = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado, slogan, descripcion } = req.body;

        const productora = await Productora.findById(id);
        if (!productora) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro la productora con ID: ${id}`
            });
        }

        if (nombre && nombre.trim() !== '') {
            const duplicado = await Productora.findOne({
                _id: { $ne: id },
                nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') }
            });
            if (duplicado) {
                return res.status(400).json({
                    ok: false,
                    message: `Ya existe otra productora con el nombre "${nombre}"`
                });
            }
            productora.nombre = nombre.trim();
        }

        if (estado !== undefined) {
            if (!['Activo', 'Inactivo'].includes(estado)) {
                return res.status(400).json({
                    ok: false,
                    message: 'El estado debe ser Activo o Inactivo'
                });
            }
            productora.estado = estado;
        }

        if (slogan !== undefined) {
            productora.slogan = slogan;
        }

        if (descripcion !== undefined) {
            productora.descripcion = descripcion;
        }

        productora.fechaActualizacion = new Date();
        const productoraActualizada = await productora.save();

        return res.status(200).json({
            ok: true,
            message: 'Productora actualizada exitosamente',
            data: productoraActualizada
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar la productora',
            error: error.message
        });
    }
};

const deleteProductora = async (req, res) => {
    try {
        const { id } = req.params;

        const productora = await Productora.findById(id);
        if (!productora) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro la productora con ID: ${id}`
            });
        }

        const enUso = await Media.findOne({ productora: id });
        if (enUso) {
            return res.status(400).json({
                ok: false,
                message: 'No se puede eliminar la productora porque esta asociada a una o mas producciones'
            });
        }

        await Productora.findByIdAndDelete(id);
        return res.status(200).json({
            ok: true,
            message: 'Productora eliminada exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la productora',
            error: error.message
        });
    }
};

module.exports = {
    getProductoras,
    getProductoraById,
    createProductora,
    updateProductora,
    deleteProductora
};
