// Redis-based job queue using Bull
// This service only adds jobs to the queue - processing happens in executor worker
const Queue = require('bull');

const executionQueue = new Queue('code execution', { 
  redis: { 
    port: 6379, 
    host: process.env.REDIS_HOST || 'redis',
    url: process.env.REDIS_URL || 'redis://redis:6379'
  } 
});

const addJob = async (jobName, data) => {
  return executionQueue.add(jobName, data);
};

module.exports = { addJob };