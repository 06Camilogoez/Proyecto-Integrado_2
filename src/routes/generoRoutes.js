const express = require('express');
const router = express.Router();
const {
    getGeneros,
    getGeneroById,
    createGenero,
    updateGenero,
    deleteGenero
} = require('../controllers/generoController');

router.get('/', getGeneros);
router.get('/:id', getGeneroById);
router.post('/', createGenero);
router.put('/:id', updateGenero);
router.delete('/:id', deleteGenero);

module.exports = router;
