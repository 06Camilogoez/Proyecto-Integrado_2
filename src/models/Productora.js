const mongoose = require('mongoose');

const productoraSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la productora es obligatorio'],
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
    slogan: {
        type: String,
        trim: true,
        default: ''
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

productoraSchema.pre('save', function () {
    this.fechaActualizacion = new Date();
});

module.exports = mongoose.model('Productora', productoraSchema);
