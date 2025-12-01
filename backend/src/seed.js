// backend/src/seed.js - Run once: node seed.js
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Problem = require('./models/problem');
connectDB();
Problem.create({ title: 'Hello World', description: 'Print hello', /* ... */ });