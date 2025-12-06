// Worker that listens to queue and executes code
require('dotenv').config();
const Queue = require('bull');
const mongoose = require('mongoose');
const Submission = require('../backend/src/models/submission');
const Problem = require('../backend/src/models/problem');
const { executeCode } = require('../backend/src/services/dockerExecutor');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/codejudge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected in executor');
}).catch((err) => {
  console.error('MongoDB connection error in executor:', err);
  process.exit(1);
});

// This runs in separate container, pulls from Redis queue
const executionQueue = new Queue('code execution', { 
  redis: { 
    port: 6379, 
    host: process.env.REDIS_HOST || 'redis',
    url: process.env.REDIS_URL || 'redis://redis:6379'
  } 
});

executionQueue.process(async (job) => {
  try {
    const { submissionId } = job.data;
    const submission = await Submission.findById(submissionId).populate('problemId');
    if (!submission || !submission.problemId) {
      throw new Error('Invalid submission');
    }

    const testCases = submission.problemId.hiddenTestCases || [{ 
      input: submission.problemId.sampleInput, 
      output: submission.problemId.sampleOutput 
    }];
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const { output, error, timedOut } = await executeCode(
        submission.code, 
        submission.language, 
        testCases[i].input
      );
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
      const User = require('../backend/src/models/user');
      const user = await User.findById(submission.userId);
      if (user && !user.solvedProblems.includes(submission.problemId._id)) {
        user.solvedProblems.push(submission.problemId._id);
        await user.save();
      }
    }

    console.log(`Processed submission ${submissionId} with status: ${status}`);
  } catch (error) {
    console.error('Error processing job:', error);
    throw error;
  }
});

console.log('Executor worker started and listening for jobs...');