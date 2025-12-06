# Online Judge Application - Setup Guide

## Overview
This is an Online Code Judge application with the following components:
- **Backend**: Node.js/Express API server
- **Frontend**: React application
- **Executor**: Worker service for code execution
- **MongoDB**: Database for problems, submissions, and users
- **Redis**: Queue service for job processing

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB (for local development, optional)
- Redis (for local development, optional)

## Environment Variables

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Backend Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
MONGO_URI=mongodb://mongo:27017/codejudge

# Redis Configuration
REDIS_URL=redis://redis:6379
REDIS_HOST=redis

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend API URL
REACT_APP_API_URL=http://localhost:5000/api

# AWS S3 Configuration (Optional - for file uploads)
S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

### Backend Environment Variables
Create `backend/.env` for local development:
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/codejudge
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend Environment Variables
Create `frontend/.env` for local development:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

## Docker Setup

### Using Docker Compose (Recommended)

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Start in detached mode:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes:**
   ```bash
   docker-compose down -v
   ```

### Services

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **API Docs**: http://localhost:5000/api-docs (if Swagger is configured)

## Local Development Setup

### Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (see environment variables above)

4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (see environment variables above)

4. Start the development server:
   ```bash
   npm start
   ```

### Executor (Worker)

1. Navigate to executor directory:
   ```bash
   cd executor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure MongoDB and Redis are running

4. Start the worker:
   ```bash
   npm start
   ```

## Language Docker Images

The application requires Docker images for code execution. You need to build these images:

### C++ Runner
```bash
cd shared/cpp
docker build -t codejudge/cpp:latest .
```

### Python Runner
Create a Python Dockerfile and build:
```bash
docker build -t codejudge/python:latest -f python.Dockerfile .
```

### Java Runner
Create a Java Dockerfile and build:
```bash
docker build -t codejudge/java:latest -f java.Dockerfile .
```

### JavaScript Runner
Create a JavaScript Dockerfile and build:
```bash
docker build -t codejudge/js:latest -f js.Dockerfile .
```

## Database Setup

### MongoDB

The database will be automatically initialized when the MongoDB container starts. The database name is `codejudge`.

### Seed Data (Optional)

To seed the database with sample problems:
```bash
cd backend
node src/seed.js
```

## Common Issues and Solutions

### Issue: Docker socket permission denied
**Solution**: Ensure Docker socket is accessible:
```bash
sudo chmod 666 /var/run/docker.sock
```

### Issue: MongoDB connection failed
**Solution**: 
- Check if MongoDB container is running: `docker-compose ps`
- Verify MONGO_URI in environment variables
- Check MongoDB logs: `docker-compose logs mongo`

### Issue: Redis connection failed
**Solution**:
- Check if Redis container is running: `docker-compose ps`
- Verify REDIS_URL in environment variables
- Check Redis logs: `docker-compose logs redis`

### Issue: Frontend can't connect to backend
**Solution**:
- Verify REACT_APP_API_URL is set correctly
- Check if backend is running on the correct port
- Ensure CORS is enabled in backend

### Issue: Code execution fails
**Solution**:
- Ensure language Docker images are built
- Check executor logs: `docker-compose logs executor`
- Verify Docker socket is mounted correctly

## Project Structure

```
OnlineJudge/
├── backend/           # Backend API server
│   ├── src/
│   │   ├── app.js    # Express app setup
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js     # Server entry point
│   └── Dockerfile
├── frontend/         # React frontend
│   ├── src/
│   └── Dockerfile
├── executor/         # Code execution worker
│   ├── worker.js
│   └── Dockerfile
├── shared/           # Shared Docker images for languages
├── docker-compose.yml
└── README.md
```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create problem (admin only)
- `POST /api/submissions` - Submit code
- `GET /api/submissions/my` - Get user's submissions
- `GET /api/submissions/:id` - Get submission by ID

## Security Notes

1. **JWT_SECRET**: Always use a strong, random secret in production
2. **Database**: Use strong passwords and restrict access in production
3. **Docker**: Ensure proper security settings for code execution containers
4. **CORS**: Configure CORS properly for production domains

## Production Deployment

1. Update all environment variables with production values
2. Use strong JWT_SECRET
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use production-grade MongoDB and Redis instances
6. Configure proper logging and monitoring
7. Set up backup strategies for database

