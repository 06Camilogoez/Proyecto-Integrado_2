const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');

const getMedias = async (req, res) => {
    try {
        const medias = await Media.find()
            .populate('genero', 'nombre estado descripcion')
            .populate('director', 'nombres estado')
            .populate('productora', 'nombre estado slogan descripcion')
            .populate('tipo', 'nombre descripcion')
            .sort({ fechaCreacion: -1 });

        return res.status(200).json({
            ok: true,
            total: medias.length,
            data: medias
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al consultar producciones',
            error: error.message
        });
    }
};

const getMediaById = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findById(id)
            .populate('genero', 'nombre estado descripcion')
            .populate('director', 'nombres estado')
            .populate('productora', 'nombre estado slogan descripcion')
            .populate('tipo', 'nombre descripcion');

        if (!media) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro la produccion con ID: ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            data: media
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al buscar la produccion',
            error: error.message
        });
    }
};

const validarRelacionesActivas = async ({ generoId, directorId, productoraId, tipoId }) => {
    if (generoId) {
        const genero = await Genero.findById(generoId);
        if (!genero) {
            return { valido: false, mensaje: `El genero con ID ${generoId} no existe` };
        }
        if (genero.estado !== 'Activo') {
            return { valido: false, mensaje: `El genero "${genero.nombre}" no esta activo` };
        }
    }

    if (directorId) {
        const director = await Director.findById(directorId);
        if (!director) {
            return { valido: false, mensaje: `El director con ID ${directorId} no existe` };
        }
        if (director.estado !== 'Activo') {
            return { valido: false, mensaje: `El director "${director.nombres}" no esta activo` };
        }
    }

    if (productoraId) {
        const productora = await Productora.findById(productoraId);
        if (!productora) {
            return { valido: false, mensaje: `La productora con ID ${productoraId} no existe` };
        }
        if (productora.estado !== 'Activo') {
            return { valido: false, mensaje: `La productora "${productora.nombre}" no esta activa` };
        }
    }

    if (tipoId) {
        const tipo = await Tipo.findById(tipoId);
        if (!tipo) {
            return { valido: false, mensaje: `El tipo con ID ${tipoId} no existe` };
        }
    }

    return { valido: true };
};

const createMedia = async (req, res) => {
    try {
        const {
            serial,
            titulo,
            sinopsis,
            url,
            imagen,
            anoEstreno,
            genero,
            director,
            productora,
            tipo
        } = req.body;

        if (!serial || !titulo || !sinopsis || !url || !anoEstreno || !genero || !director || !productora || !tipo) {
            return res.status(400).json({
                ok: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const existeSerial = await Media.findOne({ serial: serial.trim() });
        if (existeSerial) {
            return res.status(400).json({
                ok: false,
                message: `El serial "${serial}" ya esta registrado`
            });
        }

        const existeUrl = await Media.findOne({ url: url.trim() });
        if (existeUrl) {
            return res.status(400).json({
                ok: false,
                message: `La URL "${url}" ya esta registrada`
            });
        }

        const validacion = await validarRelacionesActivas({
            generoId: genero,
            directorId: director,
            productoraId: productora,
            tipoId: tipo
        });

        if (!validacion.valido) {
            return res.status(400).json({
                ok: false,
                message: validacion.mensaje
            });
        }

        const nuevaMedia = new Media({
            serial: serial.trim(),
            titulo: titulo.trim(),
            sinopsis: sinopsis.trim(),
            url: url.trim(),
            imagen: imagen ? imagen.trim() : '',
            anoEstreno: Number(anoEstreno),
            genero,
            director,
            productora,
            tipo,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        const mediaGuardada = await nuevaMedia.save();
        const mediaPoblada = await Media.findById(mediaGuardada._id)
            .populate('genero', 'nombre estado descripcion')
            .populate('director', 'nombres estado')
            .populate('productora', 'nombre estado slogan descripcion')
            .populate('tipo', 'nombre descripcion');

        return res.status(201).json({
            ok: true,
            message: 'Produccion creada exitosamente',
            data: mediaPoblada
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al crear la produccion',
            error: error.message
        });
    }
};

const updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            serial,
            titulo,
            sinopsis,
            url,
            imagen,
            anoEstreno,
            genero,
            director,
            productora,
            tipo
        } = req.body;

        const media = await Media.findById(id);
        if (!media) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro la produccion con ID: ${id}`
            });
        }

        if (serial && serial.trim() !== media.serial) {
            const serialDuplicado = await Media.findOne({ _id: { $ne: id }, serial: serial.trim() });
            if (serialDuplicado) {
                return res.status(400).json({
                    ok: false,
                    message: `El serial "${serial}" ya pertenece a otra produccion`
                });
            }
            media.serial = serial.trim();
        }

        if (url && url.trim() !== media.url) {
            const urlDuplicada = await Media.findOne({ _id: { $ne: id }, url: url.trim() });
            if (urlDuplicada) {
                return res.status(400).json({
                    ok: false,
                    message: `La URL "${url}" ya pertenece a otra produccion`
                });
            }
            media.url = url.trim();
        }

        const validacion = await validarRelacionesActivas({
            generoId: genero,
            directorId: director,
            productoraId: productora,
            tipoId: tipo
        });

        if (!validacion.valido) {
            return res.status(400).json({
                ok: false,
                message: validacion.mensaje
            });
        }

        if (titulo !== undefined) media.titulo = titulo.trim();
        if (sinopsis !== undefined) media.sinopsis = sinopsis.trim();
        if (imagen !== undefined) media.imagen = imagen.trim();
        if (anoEstreno !== undefined) media.anoEstreno = Number(anoEstreno);
        if (genero !== undefined) media.genero = genero;
        if (director !== undefined) media.director = director;
        if (productora !== undefined) media.productora = productora;
        if (tipo !== undefined) media.tipo = tipo;

        media.fechaActualizacion = new Date();
        const mediaActualizada = await media.save();

        const mediaPoblada = await Media.findById(mediaActualizada._id)
            .populate('genero', 'nombre estado descripcion')
            .populate('director', 'nombres estado')
            .populate('productora', 'nombre estado slogan descripcion')
            .populate('tipo', 'nombre descripcion');

        return res.status(200).json({
            ok: true,
            message: 'Produccion actualizada exitosamente',
            data: mediaPoblada
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar la produccion',
            error: error.message
        });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.findById(id);
        if (!media) {
            return res.status(404).json({
                ok: false,
                message: `No se encontro la produccion con ID: ${id}`
            });
        }

        await Media.findByIdAndDelete(id);
        return res.status(200).json({
            ok: true,
            message: 'Produccion eliminada exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la produccion',
            error: error.message
        });
    }
};

module.exports = {
    getMedias,
    getMediaById,
    createMedia,
    updateMedia,
    deleteMedia
};
