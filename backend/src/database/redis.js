// Redis client setup for queuing submissions
const Redis = require('redis');
const client = Redis.createClient({ 
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.log('Redis connected'));
client.on('ready', () => console.log('Redis ready'));

// Connect with error handling
client.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});

module.exports = client;