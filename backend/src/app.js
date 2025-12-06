// Express app setup
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problem');
const submissionRoutes = require('./routes/submissions');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

// Swagger docs (optional - only if docs exist)
try {
  const swaggerDocument = YAML.load('../docs/api-swagger.yaml');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.log('Swagger docs not found, skipping...');
}

module.exports = app;