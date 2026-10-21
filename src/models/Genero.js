const mongoose = require('mongoose');

const generoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del género es obligatorio'],
        unique: true,
        trim: true
    },
    estado: {
        type: String,
        required: [true, 'El estado es obligatorio'],
        enum: {
            values: ['Activo', 'Inactivo'],
            message: 'El estado debe ser Activo o Inactivo'
        },
        default: 'Activo'
    },
    descripcion: {
        type: String,
        trim: true,
        default: ''
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

// Middleware para actualizar fechaActualizacion antes de guardar
generoSchema.pre('save', function (next) {
    this.fechaActualizacion = new Date();
    next();
});

module.exports = mongoose.model('Genero', generoSchema);
