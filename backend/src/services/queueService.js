// Redis-based job queue using Bull
const Queue = require('bull');
const redisClient = require('../config/redis');
const Submission = require('../models/submission');
const Problem = require('../models/problem');
const { executeCode } = require('./dockerExecutor');

const executionQueue = new Queue('code execution', { redis: { port: 6379, host: 'redis' } });

// Worker processor
executionQueue.process(async (job) => {
  const { submissionId } = job.data;
  const submission = await Submission.findById(submissionId).populate('problemId');
  if (!submission || !submission.problemId) throw new Error('Invalid submission');

  const testCases = submission.problemId.hiddenTestCases || [{ input: submission.problemId.sampleInput, output: submission.problemId.sampleOutput }];
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const { output, error, timedOut } = await executeCode(submission.code, submission.language, testCases[i].input);
    const passed = !timedOut && !error && output.trim() === testCases[i].output.trim();
    results.push({ testId: `test${i+1}`, passed, output });

    if (!passed) break;  // Early exit on failure for efficiency
  }

  // Update status
  let status = results.every(r => r.passed) ? 'Accepted' : 'Wrong Answer';
  if (results.some(r => r.timedOut)) status = 'TLE';
  if (results.some(r => r.error)) status = 'Runtime Error';

  await Submission.findByIdAndUpdate(submissionId, {
    status,
    testResults: results,
    executionTime: 1000,  // Placeholder; measure actual in prod
    memoryUsed: 50,  // Placeholder
    output: results[0]?.output || '',
  });

  // Update user solved count if accepted
  if (status === 'Accepted') {
    await submission.userId.solvedProblems.addToSet(submission.problemId._id);
    await submission.userId.save();
  }
});

const addJob = async (name, data) => {
  return executionQueue.add(name, data);
};

module.exports = { addJob };