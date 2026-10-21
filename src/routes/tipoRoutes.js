const express = require('express');
const router = express.Router();
const {
    getTipos,
    getTipoById,
    createTipo,
    updateTipo,
    deleteTipo
} = require('../controllers/tipoController');

router.get('/', getTipos);
router.get('/:id', getTipoById);
router.post('/', createTipo);
router.put('/:id', updateTipo);
router.delete('/:id', deleteTipo);

module.exports = router;
