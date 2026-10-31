const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre del director es obligatorio'],
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

directorSchema.pre('save', function () {
    this.fechaActualizacion = new Date();
});

module.exports = mongoose.model('Director', directorSchema);
