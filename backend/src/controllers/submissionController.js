// Controllers for submissions and history
const Submission = require('../models/submission');
const User = require('../models/user');
const queueService = require('../services/queueService');

const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const submission = await Submission.create({
      userId: req.user._id,
      problemId,
      code,
      language,
    });
    // Queue the execution job
    await queueService.addJob('executeSubmission', { submissionId: submission._id });
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id })
      .populate('problemId', 'title')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problemId', 'title sampleInput sampleOutput hiddenTestCases')
      .populate('userId', 'username');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubmission, getUserSubmissions, getSubmissionById };