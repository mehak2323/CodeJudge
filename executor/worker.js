// Worker that listens to queue and executes code
require('dotenv').config();
const { addJob } = require('../backend/src/services/queueService');  // Shared or duplicate

// This runs in separate container, pulls from Redis queue
const executionQueue = new Queue('code execution', { redis: { port: 6379, host: 'redis' } });

executionQueue.process(async (job) => {
  // Implementation same as in queueService.js above
  console.log('Processing job:', job.data);
  // Execute and update DB
});