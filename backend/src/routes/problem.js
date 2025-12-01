// Problems routes
const express = require('express');
const { getProblems, getProblemById, createProblem, updateProblem, deleteProblem } = require('../controllers/problemController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const router = express.Router();

router.get('/', getProblems);
router.get('/:id', getProblemById);
router.post('/', protect, admin, createProblem);
router.put('/:id', protect, admin, updateProblem);
router.delete('/:id', protect, admin, deleteProblem);

module.exports = router;