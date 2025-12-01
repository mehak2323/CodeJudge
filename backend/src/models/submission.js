// Submission model for tracking user attempts
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ['cpp', 'python', 'java', 'javascript'], required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Wrong Answer', 'Runtime Error', 'TLE', 'MLE'], default: 'Pending' },
  executionTime: { type: Number },  // in ms
  memoryUsed: { type: Number },  // in MB
  output: { type: String },
  testResults: [{ testId: String, passed: Boolean, output: String }],
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);