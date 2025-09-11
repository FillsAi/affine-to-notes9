# Notes9 Mac Development Setup Guide

This guide walks Mac users through setting up the Notes9 development environment locally and with Docker.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Development Setup](#docker-development-setup)
- [Running the Application](#running-the-application)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### 1. Install Homebrew (if not already installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and Yarn

```bash
# Install Node.js (version 18.16.1 or higher, but less than 23.0.0)
brew install node@20

# Install Yarn via Corepack (recommended)
corepack enable
```

### 3. Install Docker

**Option A: Docker Desktop (Recommended)**

1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Install and start Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

**Option B: Using Homebrew**

```bash
brew install --cask docker
```

### 4. Install Rust (for native modules)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 5. Install Additional Development Tools

```bash
# Git (if not already installed)
brew install git

# Build essentials
xcode-select --install
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-notes9-repository-url>
cd affine-to-notes9
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Set Up Supporting Services

You can either:

**Option A: Use Docker for supporting services (Recommended)**

```bash
# Start PostgreSQL, Redis, and Search services
docker-compose -f docker-compose.local.yml up -d postgres redis indexer mailhog
```

**Option B: Install services locally**

```bash
# PostgreSQL with pgvector extension
brew install postgresql@16
brew install pgvector

# Redis
brew install redis

# Start services
brew services start postgresql@16
brew services start redis
```

### 4. Configure Environment

```bash
# Copy environment file
cp docker.env.example docker.env

# Edit docker.env with your AWS credentials (if needed)
# For local development, you can use placeholder values
```

### 5. Build Native Modules

```bash
yarn affine @affine/server-native build
```

### 6. Initialize Database

```bash
yarn affine @affine/server init
```

### 7. Start Development Servers

Open two terminal windows:

**Terminal 1 (Backend):**

```bash
yarn affine @affine/server dev
```

**Terminal 2 (Frontend):**

```bash
yarn affine @affine/web dev
```

## Docker Development Setup

### 1. Clone the Repository

```bash
git clone <your-notes9-repository-url>
cd affine-to-notes9
```

### 2. Configure Environment

```bash
# Copy and edit environment file
cp docker.env.example docker.env
```

Edit `docker.env` with your AWS credentials:

```bash
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
```

### 3. Start All Services

```bash
# Start all services including web and backend
docker-compose -f docker-compose.local.yml up -d
```

### 4. Alternative: Use the Startup Script

```bash
# Make the script executable
chmod +x scripts/start-local.sh

# Run the startup script
./scripts/start-local.sh
```

## Notes9 AI API Integration

The docker-compose setup includes an AI API placeholder. To integrate your notes9-api (Literature Intelligence Assistant):

1. **Replace the placeholder service** in `docker-compose.local.yml`:

   ```yaml
   ai-api:
     build:
       context: ../agno-notes9-api # Path to your notes9-api project
       dockerfile: Dockerfile
     container_name: notes9_ai_api
     ports:
       - '8001:8001'
     environment:
       - NODE_ENV=development
   ```

2. **Features included in notes9-api:**
   - 📚 Literature Intelligence Assistant
   - 📝 Smart Notebook & Data Handling
   - ⏰ Scheduling & Timers
   - 🧪 Smart LIMS with Shopping Assistant

## Running the Application

### Access Points

- **Frontend (Web App):** http://localhost:8080
- **Backend API:** http://localhost:3010
- **GraphQL Playground:** http://localhost:3010/graphql
- **Mail Service (MailHog):** http://localhost:8025
- **AI API Placeholder:** http://localhost:8001 (replace with notes9-api)

### Development Workflow

1. **Making Changes:**

   - Frontend changes: Edit files in `packages/frontend/`
   - Backend changes: Edit files in `packages/backend/`
   - Both will auto-reload during development

2. **Database Management:**

   ```bash
   # Reset database
   yarn affine @affine/server db:reset

   # Run migrations
   yarn affine @affine/server db:migrate
   ```

3. **Testing:**

   ```bash
   # Run all tests
   yarn test

   # Run specific package tests
   yarn affine @affine/server test
   yarn affine @affine/web test
   ```

## Useful Commands

### Development Commands

```bash
# Start development (both frontend and backend)
yarn dev:full

# Build for production
yarn build

# Lint code
yarn lint
yarn lint:fix

# Type checking
yarn typecheck

# Clean build artifacts
yarn clean

# Update dependencies
yarn install
```

### Docker Commands

```bash
# View running containers
docker-compose -f docker-compose.local.yml ps

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Stop services
docker-compose -f docker-compose.local.yml down

# Restart a specific service
docker-compose -f docker-compose.local.yml restart backend

# Rebuild and start
docker-compose -f docker-compose.local.yml up -d --build
```

### Database Commands

```bash
# Connect to PostgreSQL
docker exec -it affine_postgres_local psql -U affine -d affine

# Backup database
docker exec affine_postgres_local pg_dump -U affine affine > backup.sql

# Restore database
docker exec -i affine_postgres_local psql -U affine affine < backup.sql
```

## Troubleshooting

### Common Issues

#### 1. Port Conflicts

If you see port already in use errors:

```bash
# Find and kill processes using the ports
lsof -ti:3010 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:5433 | xargs kill -9
```

#### 2. Node Version Issues

```bash
# Check your Node version
node --version

# Should be 18.16.1+ but less than 23.0.0
# If not, install the correct version:
brew unlink node
brew install node@20
brew link node@20
```

#### 3. Rust Compilation Errors

```bash
# Update Rust
rustup update

# Clean and rebuild
rm -rf packages/backend/native/target
yarn affine @affine/server-native build
```

#### 4. Docker Issues

```bash
# Restart Docker Desktop
# Or reset Docker to factory defaults

# Clear Docker cache
docker system prune -a

# Rebuild containers
docker-compose -f docker-compose.local.yml down
docker-compose -f docker-compose.local.yml up -d --build
```

#### 5. Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.local.yml ps postgres

# Reset database
docker-compose -f docker-compose.local.yml down postgres
docker volume rm affine-to-notes9_postgres_data
docker-compose -f docker-compose.local.yml up -d postgres
```

#### 6. Permission Issues

```bash
# Fix file permissions (if needed)
sudo chown -R $(whoami) .
chmod +x scripts/start-local.sh
```

### Performance Tips

1. **Increase Node.js Memory:**

   ```bash
   export NODE_OPTIONS="--max-old-space-size=8192"
   ```

2. **Use SSD for better performance**

3. **Close unnecessary applications during development**

4. **For Docker setup, allocate more resources to Docker Desktop:**
   - Go to Docker Desktop → Settings → Resources
   - Increase Memory to at least 8GB
   - Increase CPU to at least 4 cores

### Getting Help

- **Project Documentation:** Check the `docs/` folder in this repository
- **Implementation Guide:** [implementation-guide.md](./001.implementation-guide.md)
- **Auth0 Integration:** [auth0-integration-plan.md](./004.auth0-integration-plan.md)
- **AWS Deployment:** [aws-deployment-guide.md](./aws-deployment-guide.md)

### Environment Variables Reference

| Variable                     | Description                  | Default                                            |
| ---------------------------- | ---------------------------- | -------------------------------------------------- |
| `DATABASE_URL`               | PostgreSQL connection string | `postgresql://affine:affine@localhost:5433/affine` |
| `REDIS_SERVER_HOST`          | Redis host                   | `localhost`                                        |
| `REDIS_SERVER_PORT`          | Redis port                   | `6380`                                             |
| `AFFINE_SERVER_EXTERNAL_URL` | Backend URL                  | `http://localhost:3010`                            |
| `NODE_ENV`                   | Environment mode             | `development`                                      |
| `AWS_ACCESS_KEY_ID`          | AWS S3 access key            | Required for file uploads                          |
| `AWS_SECRET_ACCESS_KEY`      | AWS S3 secret key            | Required for file uploads                          |

---

## What's Next?

After setup, you can:

1. **Explore the codebase:** Start with `packages/frontend/core` for UI components
2. **Read project docs:** Check out the implementation guides in the `docs/` folder
3. **Set up AI integration:** Replace the AI placeholder with your notes9-api service (Literature Intelligence Assistant)
4. **Deploy:** Check the [AWS deployment guide](./aws-deployment-guide.md) when ready

Happy coding! 🚀
