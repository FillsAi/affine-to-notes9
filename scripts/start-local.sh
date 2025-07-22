#!/bin/bash

# AFFiNE Local Air-Gap Startup Script

echo "🚀 Starting AFFiNE Local Air-Gap Environment"
echo "============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if required commands exist
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install Node.js and Yarn first."
    exit 1
fi

# Start supporting services
echo "📦 Starting supporting services (PostgreSQL, Redis, Search)..."
docker-compose -f docker-compose.local.yml up -d postgres redis indexer mailhog

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if .env.local exists, if not copy it
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local .env.local
fi

echo "✅ Supporting services are running!"
echo ""
echo "🔧 Next steps for development:"
echo "1. Install dependencies: yarn install"
echo "2. Build native packages: yarn affine @affine/server-native build"
echo "3. Setup database: yarn affine @affine/server init"
echo "4. Start backend: yarn affine @affine/server dev"
echo "5. Start frontend: yarn affine @affine/web dev"
echo ""
echo "🌐 URLs:"
echo "- Frontend: http://localhost:8080"
echo "- Backend API: http://localhost:3010"
echo "- GraphQL: http://localhost:3010/graphql"
echo "- AI Placeholder: http://localhost:8001"
echo "- Mail UI: http://localhost:8025"
echo ""
echo "🤖 To replace AI placeholder with notes9-api:"
echo "   Update docker-compose.local.yml ai-api service"
echo ""

# Check if user wants to continue with development setup
read -p "Continue with automatic setup? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Installing dependencies..."
    yarn install
    
    echo "🏗️ Building native packages..."
    yarn affine @affine/server-native build
    
    echo "🗄️ Setting up database..."
    yarn affine @affine/server init
    
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start development:"
    echo "Terminal 1: yarn affine @affine/server dev"
    echo "Terminal 2: yarn affine @affine/web dev"
fi 