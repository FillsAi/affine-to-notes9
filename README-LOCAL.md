# 🔒 AFFiNE Air-Gap Deployment Guide

> **Complete offline, secure research platform** - Transform AFFiNE into a fully air-gapped system with zero external dependencies.

[![Security](https://img.shields.io/badge/Security-Air--Gap-green.svg)](.)
[![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen.svg)](.)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](.)

## 🎯 **What This Is**

This is a **completely air-gapped version of AFFiNE** - a secure, offline-first collaborative workspace with no external connections. Perfect for:

- 🔬 **Research Environments**: Secure labs and sensitive data
- 🏢 **Enterprise Security**: Companies with strict data policies
- 🏛️ **Government/Healthcare**: HIPAA, GDPR, compliance requirements
- 🛡️ **High-Security Environments**: Defense, finance, classified work

### **🔒 Security Features**

- ✅ **Zero External Connections**: No internet required after setup
- ✅ **No Telemetry**: All tracking, analytics, and reporting disabled
- ✅ **Local Authentication**: No cloud providers or OAuth
- ✅ **Offline Operation**: Works completely disconnected
- ✅ **Data Sovereignty**: All data stays on your infrastructure

---

## 🚀 **Quick Start (5 Minutes)**

### **Prerequisites**

```bash
# Required software
✅ Docker & Docker Compose
✅ Node.js 18+
✅ Yarn package manager
✅ 4GB+ RAM, 10GB+ storage
```

### **One-Command Setup**

```bash
# 1. Clone and navigate
git clone <this-repo>
cd affine-to-notes9

# 2. Run automated setup
./scripts/start-local.sh

# 3. Access your secure AFFiNE
# Frontend: http://localhost:8080
# Backend:  http://localhost:3010
```

**That's it!** Your secure, air-gapped AFFiNE is ready.

---

## 📋 **Manual Setup (If Needed)**

### **Step 1: Start Infrastructure**

```bash
# Start all supporting services
docker-compose -f docker-compose.local.yml up -d

# Verify services are running
docker-compose -f docker-compose.local.yml ps
```

### **Step 2: Install Dependencies**

```bash
# Install Node.js dependencies
yarn install

# Build native packages (required for Rust components)
yarn affine @affine/server-native build
```

### **Step 3: Setup Database**

```bash
# Initialize database with tables and default users
yarn affine @affine/server init
```

### **Step 4: Start Services**

```bash
# Terminal 1: Start backend API
DATABASE_URL=postgresql://affine:affine@localhost:5433/affine \
REDIS_SERVER_HOST=localhost \
REDIS_SERVER_PORT=6380 \
yarn affine @affine/server dev

# Terminal 2: Start frontend
yarn affine @affine/web dev
```

### **Step 5: Access & Test**

- **Frontend**: http://localhost:8080
- **Login**: Use `dev@affine.pro` / password: `dev`

---

## 🌐 **Service Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│    Backend      │────│   PostgreSQL    │
│  localhost:8080 │    │ localhost:3010  │    │ localhost:5433  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │    Redis     │ │   Search    │ │    Mail    │
        │ localhost:   │ │ localhost:  │ │ localhost: │
        │    6380      │ │    9308     │ │    8025    │
        └──────────────┘ └─────────────┘ └────────────┘
```

### **Service Details**

| Service            | Port | Purpose                 | Status     |
| ------------------ | ---- | ----------------------- | ---------- |
| **Frontend**       | 8080 | React web application   | ✅ Running |
| **Backend**        | 3010 | NestJS API server       | ✅ Running |
| **PostgreSQL**     | 5433 | Primary database        | ✅ Running |
| **Redis**          | 6380 | Caching & sessions      | ✅ Running |
| **Search**         | 9308 | Manticore search engine | ✅ Running |
| **Mail**           | 8025 | Local email (MailHog)   | ✅ Running |
| **AI Placeholder** | 8001 | Future AI integration   | ✅ Ready   |

---

## 👥 **User Management**

### **Default Test Users**

Ready-to-use accounts for testing:

| Email             | Password | Role         |
| ----------------- | -------- | ------------ |
| `dev@affine.pro`  | `dev`    | Developer    |
| `pro@affine.pro`  | `pro`    | Professional |
| `team@affine.pro` | `team`   | Team Lead    |

### **Creating New Users**

1. Open http://localhost:8080
2. Click "Sign Up"
3. Use any email format (no verification needed)
4. Password: minimum 8 characters

---

## 🔧 **Development & Customization**

### **Environment Variables**

Create `.env.local` for custom configuration:

```bash
# Database
DATABASE_URL=postgresql://affine:affine@localhost:5433/affine

# Redis
REDIS_SERVER_HOST=localhost
REDIS_SERVER_PORT=6380

# Security (Air-gap settings)
TELEMETRY_ENABLED=false
OAUTH_GOOGLE_ENABLED=false
STRIPE_API_KEY=""

# Features
LOCAL_WORKSPACE_ENABLED=true
AI_ENABLED=true
AI_BASE_URL=http://localhost:8001
```

### **Useful Commands**

```bash
# Service Management
docker-compose -f docker-compose.local.yml up -d    # Start services
docker-compose -f docker-compose.local.yml down     # Stop services
docker-compose -f docker-compose.local.yml logs     # View logs

# Database Management
yarn affine @affine/server prisma studio           # Database GUI
yarn affine @affine/server seed                    # Add sample data
yarn affine @affine/server prisma migrate reset    # Reset database

# Development
yarn affine @affine/web build                      # Build frontend
yarn affine @affine/server test                    # Run tests
```

### **File Structure**

```
affine-to-notes9/
├── 📁 docs/                           # Documentation
│   ├── 📄 001.implementation-guide.md  # Technical details
│   └── 📄 002.air-gap-tasks.md        # Task checklist
├── 📁 packages/
│   ├── 📁 frontend/                   # React frontend (modified)
│   └── 📁 backend/                    # NestJS backend (modified)
├── 📄 docker-compose.local.yml        # Local services
├── 📄 README-LOCAL.md                 # This file
└── 📁 scripts/
    └── 📄 start-local.sh              # Automated setup
```

---

## 🤖 **AI Integration (Future)**

### **Current Status**

- ✅ **AI Placeholder**: Running at http://localhost:8001
- ✅ **Integration Points**: Prepared in frontend
- ✅ **API Endpoints**: Designed and documented

### **Planned AI Features**

1. **📚 Literature Intelligence Assistant**

   - PubMed search and analysis
   - Paper summarization
   - Citation management

2. **📝 Smart Notebook & Data Handling**

   - Voice input processing
   - Image analysis
   - Data visualization

3. **⏰ Scheduling & Timers**

   - Calendar integration
   - Protocol timers
   - Task automation

4. **🧪 Smart LIMS Integration**
   - Inventory tracking
   - Shopping assistance
   - Lab protocol management

### **Integration Steps**

```bash
# 1. Replace AI placeholder in docker-compose.local.yml
ai-api:
  build: ../agno-notes9-api  # Your AI backend
  ports:
    - "8001:8000"

# 2. Connect frontend to AI endpoints
# 3. Test AI features integration
```

---

## 🔍 **Troubleshooting**

### **Common Issues & Solutions**

#### **🚨 "No server found" Error**

```bash
# Check if backend is running
curl http://localhost:3010/info

# If not running, restart backend
yarn affine @affine/server dev
```

#### **🚨 Database Connection Failed**

```bash
# Check PostgreSQL container
docker-compose -f docker-compose.local.yml ps postgres

# Restart if needed
docker-compose -f docker-compose.local.yml restart postgres
```

#### **🚨 Port Already in Use**

```bash
# Find what's using the port
lsof -i :8080  # or :3010, :5433, etc.

# Kill the process or change ports in docker-compose.local.yml
```

#### **🚨 Native Build Errors**

```bash
# Install Rust if missing
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Rebuild native packages
yarn affine @affine/server-native build
```

#### **🚨 Frontend Won't Load**

```bash
# Check if webpack dev server is running
curl http://localhost:8080

# Clear cache and restart
rm -rf node_modules/.cache
yarn affine @affine/web dev
```

### **Health Check Commands**

```bash
# Quick system status
./scripts/health-check.sh  # (if exists)

# Manual health checks
curl http://localhost:8080     # Frontend
curl http://localhost:3010     # Backend
curl http://localhost:8025     # Mail UI
docker-compose -f docker-compose.local.yml ps  # All services
```

---

## 🛡️ **Security Verification**

### **Air-Gap Validation**

```bash
# 1. Disconnect from internet
sudo ifconfig en0 down  # or unplug ethernet

# 2. Test full functionality
# - Create workspace
# - Add documents
# - Upload files
# - Search content

# 3. Verify no external calls
# Check network logs - should show only localhost traffic
```

### **Security Features Verified**

- ✅ **No External DNS**: All services use localhost
- ✅ **No Telemetry**: Analytics completely disabled
- ✅ **No OAuth**: All external auth removed
- ✅ **No Cloud APIs**: Stripe, CustomerIO, etc. disabled
- ✅ **Local Storage**: All data in local PostgreSQL

---

## 📈 **Performance & Scaling**

### **System Requirements**

| Component   | Minimum        | Recommended |
| ----------- | -------------- | ----------- |
| **RAM**     | 4GB            | 8GB+        |
| **Storage** | 10GB           | 50GB+       |
| **CPU**     | 2 cores        | 4+ cores    |
| **Network** | None (air-gap) | Local only  |

### **Performance Tips**

```bash
# Optimize PostgreSQL
# Edit postgresql.conf for your hardware

# Monitor resource usage
docker stats

# Scale Redis if needed
# Increase memory limit in docker-compose.local.yml
```

---

## 🚀 **Production Deployment**

### **Production Checklist**

- [ ] **SSL/TLS**: Configure HTTPS certificates
- [ ] **Backup Strategy**: Database & file backups
- [ ] **Monitoring**: Log aggregation and alerts
- [ ] **User Management**: Create proper admin accounts
- [ ] **Resource Limits**: Set appropriate Docker limits
- [ ] **Security Audit**: Penetration testing
- [ ] **Documentation**: Update for your environment

### **Production Configuration**

```yaml
# docker-compose.prod.yml example
services:
  postgres:
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      POSTGRES_PASSWORD: ${SECURE_PASSWORD}

  affine-backend:
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: ${SECURE_DATABASE_URL}
```

---

## 📚 **Documentation**

### **Additional Resources**

- 📄 **[Implementation Guide](docs/001.implementation-guide.md)**: Complete technical details
- 📄 **[Task Checklist](docs/002.air-gap-tasks.md)**: Development roadmap
- 🌐 **[Original AFFiNE Docs](https://docs.affine.pro)**: Upstream documentation
- 🔧 **[Docker Compose Reference](https://docs.docker.com/compose/)**: Service configuration

### **Support**

- 🐛 **Issues**: Create GitHub issue with logs
- 💬 **Questions**: Check troubleshooting section first
- 🔒 **Security**: Report security issues privately

---

## 🎉 **Success!**

You now have a **completely secure, air-gapped AFFiNE instance** running locally!

### **What You Can Do Now:**

1. ✅ **Create Workspaces**: Organize your research projects
2. ✅ **Add Documents**: Rich text editing with blocks
3. ✅ **Upload Files**: Secure local file storage
4. ✅ **Collaborate**: Multi-user workspaces (local users)
5. ✅ **Search**: Full-text search across all content
6. 🔄 **Integrate AI**: Ready for your AI backend

### **Next Steps:**

- 🤖 Replace AI placeholder with your notes9-api
- 🧪 Integrate ELN/LIMS components
- 📊 Add custom research workflows
- 🔐 Deploy to production environment

---

**🔒 Your data is secure, your research is private, and your platform is ready for innovation!**

_Need help? Check the troubleshooting section or review the detailed implementation guide._
