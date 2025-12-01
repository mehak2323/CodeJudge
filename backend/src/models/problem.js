// Problem model with test cases (hidden ones encrypted or stored separately)
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  constraints: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  sampleInput: { type: String, required: true },
  sampleOutput: { type: String, required: true },
  hiddenTestCases: [{ input: String, output: String, points: Number }],  // Admin-only
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);