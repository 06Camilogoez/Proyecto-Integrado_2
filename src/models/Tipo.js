const mongoose = require('mongoose');

const tipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del tipo es obligatorio'],
        unique: true,
        trim: true
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

tipoSchema.pre('save', function () {
    this.fechaActualizacion = new Date();
});

module.exports = mongoose.model('Tipo', tipoSchema);
