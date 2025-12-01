// Controllers for managing problems
const Problem = require('../models/problem');

// In problemController createProblem
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();
// const uploadToS3 = async (file) => {
//   const params = { Bucket: process.env.S3_BUCKET, Key: `problems/${Date.now()}.jpg`, Body: file };
//   const { Location } = await s3.upload(params).promise();
//   return Location;
// };

const getProblems = async (req, res) => {
  try {
    const { difficulty, tags } = req.query;
    let query = {};
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: tags.split(',') };
    const problems = await Problem.find(query).sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    // Hide hiddenTestCases for non-admins
    const safeProblem = { ...problem.toObject() };
    if (req.user.role !== 'admin') delete safeProblem.hiddenTestCases;
    res.json(safeProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProblems, getProblemById, createProblem, updateProblem, deleteProblem };