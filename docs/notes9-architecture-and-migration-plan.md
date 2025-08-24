# Notes9 Architecture & Migration Plan

## 🚨 Current Issue: Backend Server Not Running

You're getting `net::ERR_CONNECTION_REFUSED` because the backend server isn't running on port 3010.

**Quick Fix:**

```bash
# Navigate to backend server
cd packages/backend/server

# Install dependencies
yarn install

# Build native bindings
yarn affine @affine/server-native build

# Start the server
yarn dev
```

---

## 🏗️ Current Architecture Overview

### Frontend → Backend Communication

```
Frontend (React/TypeScript)
    ↓
GraphQL API (localhost:3010/graphql)
    ↓
NestJS Backend Server
    ↓
PostgreSQL Database + Redis Cache
    ↓
AWS S3 Storage (Blobs, Avatars, AI)
```

### Key Components

1. **Frontend (React/TypeScript)**

   - Port: 8080 (default)
   - Connects to backend via GraphQL
   - Real-time collaboration via WebSocket
   - Local-first with Y-OCTO CRDT

2. **Backend Server (NestJS)**

   - Port: 3010 (configurable via `AFFINE_SERVER_PORT`)
   - GraphQL endpoint: `/graphql`
   - Auth endpoint: `/api/auth/session`
   - WebSocket for real-time sync

3. **Database Layer**

   - **PostgreSQL**: Primary data storage
   - **Redis**: Caching, sessions, pub/sub
   - **Prisma ORM**: Database abstraction

4. **Storage Layer**
   - **AWS S3**: File storage (avatars, blobs, AI data)
   - **Local File System**: Development mode

---

## 🔄 Y-OCTO CRDT: The Collaboration Engine

### What is Y-OCTO?

- **High-performance CRDT** (Conflict-free Replicated Data Type)
- **Compatible with Yjs** - can interop with web browsers
- **Local-first architecture** - works offline, syncs when online
- **Thread-safe** - handles concurrent edits seamlessly

### How It Works

```
User A Makes Edit    User B Makes Edit
      ↓                    ↓
  Y-OCTO Doc          Y-OCTO Doc
      ↓                    ↓
    Update             Update
      ↓                    ↓
      WebSocket ←→ Server ←→ WebSocket
      ↓                    ↓
  PostgreSQL         Redis Cache
```

### Data Flow

1. **Local Edits**: User makes changes → Y-OCTO generates updates
2. **Sync Protocol**: Updates sent to server via WebSocket
3. **Server Processing**: Server validates and stores updates in PostgreSQL
4. **Broadcast**: Server broadcasts updates to other connected clients
5. **Merge**: Other clients receive and apply updates to their local Y-OCTO doc

### CRDT Benefits

- **No Conflicts**: Automatic conflict resolution
- **Eventual Consistency**: All clients converge to same state
- **Offline Support**: Works without network connection
- **Real-time**: Instant updates across all clients

---

## 🗄️ Database Schema & Configuration

### PostgreSQL Setup

**Current Configuration** (from package.json):

```bash
DATABASE_URL="postgresql://affine:affine@localhost:5433/affine"
```

**Key Database Models:**

- `User`: User accounts and profiles
- `Workspace`: Document containers
- `Update`: Y-OCTO CRDT updates (the actual document changes)
- `Snapshot`: Document snapshots for faster loading
- `Session`: User authentication sessions

### Docker PostgreSQL Setup

```bash
# Create Docker PostgreSQL
docker run -d \
  --name notes9-postgres \
  -e POSTGRES_DB=notes9 \
  -e POSTGRES_USER=notes9 \
  -e POSTGRES_PASSWORD=notes9 \
  -p 5433:5432 \
  postgres:15-alpine

# Update environment variable
export DATABASE_URL="postgresql://notes9:notes9@localhost:5433/notes9"
```

### Redis Setup

```bash
# Create Docker Redis
docker run -d \
  --name notes9-redis \
  -p 6380:6379 \
  redis:7-alpine

# Environment variables
export REDIS_SERVER_HOST="localhost"
export REDIS_SERVER_PORT="6380"
```

---

## 🚀 Migration Plan: AFFiNE Cloud → Notes9 Cloud

### Phase 1: Local Development Setup ✅ (Current)

**Status**: You've already completed the frontend rebranding!

**Next Steps**:

1. Start backend server (fix current connection issues)
2. Set up local PostgreSQL + Redis in Docker
3. Configure environment variables

### Phase 2: Cloud Infrastructure Setup

#### 2.1 AWS Infrastructure

```
┌─────────────────────────────────────────┐
│              AWS Account                │
│  ┌─────────────────────────────────────┐│
│  │           Production                ││
│  │  • ECS Fargate (Backend)            ││
│  │  • RDS PostgreSQL                   ││
│  │  • ElastiCache Redis                ││
│  │  • S3 Buckets                       ││
│  │  • CloudFront CDN                   ││
│  │  • Route 53 DNS                     ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │           Staging                   ││
│  │  • Same as production (smaller)     ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

#### 2.2 Required AWS Services

- **ECS Fargate**: Container hosting for backend
- **RDS PostgreSQL**: Managed database with pgvector extension
- **ElastiCache Redis**: Managed Redis cluster
- **S3 Buckets**:
  - `notes9-avatars` (user avatars)
  - `notes9-blobs` (file attachments)
  - `notes9-copilot` (AI data)
- **CloudFront**: CDN for static assets
- **Route 53**: DNS management
- **ACM**: SSL certificates
- **VPC**: Network security

### Phase 3: Backend Configuration Changes

#### 3.1 Environment Variables Update

```bash
# Domain Configuration
AFFINE_SERVER_EXTERNAL_URL="https://api.notes9.com"
AFFINE_SERVER_HOST="api.notes9.com"
AFFINE_SERVER_HTTPS=true

# Database
DATABASE_URL="postgresql://notes9:password@notes9-db.cluster-xyz.us-east-1.rds.amazonaws.com:5432/notes9"

# Redis
REDIS_SERVER_HOST="notes9-cache.xyz.cache.amazonaws.com"
REDIS_SERVER_PORT="6379"

# Storage (Already configured!)
AFFINE_STORAGES_AVATAR_STORAGE='{"provider":"aws-s3","bucket":"notes9-avatars",...}'
AFFINE_STORAGES_BLOB_STORAGE='{"provider":"aws-s3","bucket":"notes9-blobs",...}'
AFFINE_COPILOT_STORAGE='{"provider":"aws-s3","bucket":"notes9-copilot",...}'
```

#### 3.2 Dockerfile Optimization

```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3010
CMD ["node", "dist/index.js"]
```

### Phase 4: Data Migration Strategy

#### 4.1 Migration Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AFFiNE Data   │ => │  Migration Tool │ => │   Notes9 Data   │
│                 │    │                 │    │                 │
│ • Users         │    │ • Data Extract  │    │ • Users         │
│ • Workspaces    │    │ • Transform     │    │ • Workspaces    │
│ • Documents     │    │ • Load          │    │ • Documents     │
│ • Updates       │    │ • Validate      │    │ • Updates       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 4.2 Migration Steps

1. **Export**: Extract data from current system
2. **Transform**: Convert data formats if needed
3. **Load**: Import into Notes9 database
4. **Validate**: Verify data integrity
5. **Cutover**: Switch users to new system

### Phase 5: Frontend Deployment

#### 5.1 Build Configuration

```json
{
  "build": {
    "NEXT_PUBLIC_API_URL": "https://api.notes9.com",
    "NEXT_PUBLIC_WS_URL": "wss://api.notes9.com"
  }
}
```

#### 5.2 Deployment Options

- **Vercel**: Easy deployment with automatic CI/CD
- **AWS Amplify**: Integrated with AWS ecosystem
- **AWS S3 + CloudFront**: Static hosting with CDN

---

## 📋 Execution Checklist

### Immediate Actions (Fix Current Issues)

- [ ] **Start Backend Server**

  ```bash
  cd packages/backend/server
  yarn dev
  ```

- [ ] **Verify Database Connection**

  ```bash
  # Check if PostgreSQL is running
  docker ps | grep postgres

  # Test connection
  psql postgresql://affine:affine@localhost:5433/affine -c "SELECT 1;"
  ```

- [ ] **Check Redis Connection**

  ```bash
  # Check if Redis is running
  docker ps | grep redis

  # Test connection
  redis-cli -h localhost -p 6380 ping
  ```

### Short Term (1-2 weeks)

- [ ] **Set up Docker Compose** for local development
- [ ] **Configure AWS S3 buckets** with proper permissions
- [ ] **Test data flow** end-to-end locally
- [ ] **Set up CI/CD pipeline**
- [ ] **Create staging environment**

### Medium Term (2-4 weeks)

- [ ] **Deploy to AWS staging**
- [ ] **Performance testing**
- [ ] **Security audit**
- [ ] **Data migration testing**
- [ ] **User acceptance testing**

### Long Term (1-2 months)

- [ ] **Production deployment**
- [ ] **Data migration execution**
- [ ] **DNS cutover**
- [ ] **Monitor and optimize**

---

## 🔧 Quick Start Commands

### Start Full Development Stack

```bash
# Terminal 1: Start Backend
cd packages/backend/server
yarn dev

# Terminal 2: Start Frontend
cd packages/frontend/core
yarn dev

# Terminal 3: Start Database (if not running)
docker-compose up postgres redis
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Update database URL
echo "DATABASE_URL=postgresql://notes9:notes9@localhost:5433/notes9" >> .env
```

---

## 📊 Monitoring & Observability

### Key Metrics to Track

- **Response Time**: GraphQL query performance
- **WebSocket Connections**: Real-time collaboration health
- **Database Performance**: Query execution times
- **CRDT Sync Success Rate**: Document synchronization reliability
- **Error Rates**: Application and infrastructure errors

### Tools

- **Grafana**: Metrics visualization
- **Prometheus**: Metrics collection
- **Sentry**: Error tracking
- **CloudWatch**: AWS infrastructure monitoring

---

This architecture supports your local-first, collaborative document system while maintaining high performance and scalability for your Notes9 cloud deployment.
