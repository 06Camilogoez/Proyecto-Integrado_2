const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');

// Obtener todas las producciones (Películas y series)
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
            message: 'Error al consultar producciones multimedia',
            error: error.message
        });
    }
};

// Obtener una producción por ID
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
                message: `No se encontró ninguna producción multimedia con el ID: ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            data: media
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al buscar la producción multimedia',
            error: error.message
        });
    }
};

// Validaciones auxiliares de negocio
const validarRelacionesActivas = async ({ generoId, directorId, productoraId, tipoId }) => {
    // 1. Validar Género (debe existir y estar Activo)
    if (generoId) {
        const genero = await Genero.findById(generoId);
        if (!genero) {
            return { valido: false, mensaje: `El género con ID ${generoId} no existe en el sistema` };
        }
        if (genero.estado !== 'Activo') {
            return { valido: false, mensaje: `El género "${genero.nombre}" se encuentra Inactivo. Solo se permiten géneros activos para crear o asignar a una producción` };
        }
    }

    // 2. Validar Director (debe existir y estar Activo)
    if (directorId) {
        const director = await Director.findById(directorId);
        if (!director) {
            return { valido: false, mensaje: `El director con ID ${directorId} no existe en el sistema` };
        }
        if (director.estado !== 'Activo') {
            return { valido: false, mensaje: `El director "${director.nombres}" se encuentra Inactivo. Solo se permiten directores activos para crear o asignar a una producción` };
        }
    }

    // 3. Validar Productora (debe existir y estar Activa)
    if (productoraId) {
        const productora = await Productora.findById(productoraId);
        if (!productora) {
            return { valido: false, mensaje: `La productora con ID ${productoraId} no existe en el sistema` };
        }
        if (productora.estado !== 'Activo') {
            return { valido: false, mensaje: `La productora "${productora.nombre}" se encuentra Inactiva. Solo se permiten productoras activas para crear o asignar a una producción` };
        }
    }

    // 4. Validar Tipo (debe existir en el sistema)
    if (tipoId) {
        const tipo = await Tipo.findById(tipoId);
        if (!tipo) {
            return { valido: false, mensaje: `El tipo multimedia con ID ${tipoId} no existe en el sistema` };
        }
    }

    return { valido: true };
};

// Crear nueva producción multimedia
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

        // Validaciones de campos obligatorios
        if (!serial || !titulo || !sinopsis || !url || !anoEstreno || !genero || !director || !productora || !tipo) {
            return res.status(400).json({
                ok: false,
                message: 'Los siguientes campos son requeridos: serial, titulo, sinopsis, url, anoEstreno, genero, director, productora, tipo'
            });
        }

        // Validar unicidad de Serial
        const existeSerial = await Media.findOne({ serial: serial.trim() });
        if (existeSerial) {
            return res.status(400).json({
                ok: false,
                message: `Ya existe una producción con el serial "${serial}"`
            });
        }

        // Validar unicidad de URL
        const existeUrl = await Media.findOne({ url: url.trim() });
        if (existeUrl) {
            return res.status(400).json({
                ok: false,
                message: `Ya existe una producción con la URL "${url}"`
            });
        }

        // Validar reglas de negocio sobre relaciones
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
            message: 'Producción multimedia creada exitosamente',
            data: mediaPoblada
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al crear la producción multimedia',
            error: error.message
        });
    }
};

// Actualizar producción multimedia
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
                message: `No se encontró ninguna producción con el ID: ${id}`
            });
        }

        // Validar unicidad de serial si se modifica
        if (serial && serial.trim() !== media.serial) {
            const serialDuplicado = await Media.findOne({ _id: { $ne: id }, serial: serial.trim() });
            if (serialDuplicado) {
                return res.status(400).json({
                    ok: false,
                    message: `Ya existe otra producción con el serial "${serial}"`
                });
            }
            media.serial = serial.trim();
        }

        // Validar unicidad de URL si se modifica
        if (url && url.trim() !== media.url) {
            const urlDuplicada = await Media.findOne({ _id: { $ne: id }, url: url.trim() });
            if (urlDuplicada) {
                return res.status(400).json({
                    ok: false,
                    message: `Ya existe otra producción con la URL "${url}"`
                });
            }
            media.url = url.trim();
        }

        // Validar relaciones activas si se actualizan
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
            message: 'Producción multimedia actualizada exitosamente',
            data: mediaPoblada
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar la producción multimedia',
            error: error.message
        });
    }
};

// Eliminar producción multimedia
const deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;

        const media = await Media.findById(id);
        if (!media) {
            return res.status(404).json({
                ok: false,
                message: `No se encontró ninguna producción con el ID: ${id}`
            });
        }

        await Media.findByIdAndDelete(id);
        return res.status(200).json({
            ok: true,
            message: 'Producción multimedia eliminada exitosamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la producción multimedia',
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
