// Submissions routes
const express = require('express');
const { createSubmission, getUserSubmissions, getSubmissionById } = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createSubmission);
router.get('/my', protect, getUserSubmissions);
router.get('/:id', protect, getSubmissionById);

module.exports = router;