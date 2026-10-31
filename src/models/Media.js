const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    serial: {
        type: String,
        required: [true, 'El serial es obligatorio'],
        unique: true,
        trim: true
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    sinopsis: {
        type: String,
        required: [true, 'La sinopsis es obligatoria'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'La URL de la película/serie es obligatoria'],
        unique: true,
        trim: true
    },
    imagen: {
        type: String,
        trim: true,
        default: ''
    },
    anoEstreno: {
        type: Number,
        required: [true, 'El año de estreno es obligatorio']
    },
    genero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genero',
        required: [true, 'El género principal es obligatorio']
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director',
        required: [true, 'El director principal es obligatorio']
    },
    productora: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Productora',
        required: [true, 'La productora es obligatoria']
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tipo',
        required: [true, 'El tipo multimedia es obligatorio']
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

mediaSchema.pre('save', function () {
    this.fechaActualizacion = new Date();
});

module.exports = mongoose.model('Media', mediaSchema);
