const express = require('express');
const router = express.Router();
const {
    getDirectores,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector
} = require('../controllers/directorController');

router.get('/', getDirectores);
router.get('/:id', getDirectorById);
router.post('/', createDirector);
router.put('/:id', updateDirector);
router.delete('/:id', deleteDirector);

module.exports = router;
