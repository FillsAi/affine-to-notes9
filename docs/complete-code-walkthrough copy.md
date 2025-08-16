# Complete Code Walkthrough - AFFiNE Air-Gap Application

> **Written for beginners - no coding knowledge required**

## Table of Contents

1. [What This Application Is](#what-this-application-is)
2. [Programming Languages Used](#programming-languages-used)
3. [System Architecture Overview](#system-architecture-overview)
4. [Frontend Components](#frontend-components)
5. [Backend Components](#backend-components)
6. [BlockSuite - The Editor Engine](#blocksuite---the-editor-engine)
7. [Database and Storage](#database-and-storage)
8. [Development Tools and Build System](#development-tools-and-build-system)
9. [Testing Infrastructure](#testing-infrastructure)
10. [Infrastructure Services](#infrastructure-services)
11. [Security and Air-Gap Features](#security-and-air-gap-features)
12. [How Everything Works Together](#how-everything-works-together)

---

## What This Application Is

**AFFiNE** is a digital workspace application, similar to Microsoft Word combined with Microsoft PowerPoint and a digital notebook. Think of it as:

- **A document editor**: Where you can write text documents with formatting
- **A drawing canvas**: Where you can draw diagrams, sketches, and visual content
- **A planning tool**: Where you can organize tasks, create databases, and manage projects
- **A collaboration platform**: Where multiple people can work on the same documents together

This particular version has been modified to work **completely offline** (air-gapped) for security reasons, meaning it doesn't connect to the internet at all.

---

## Programming Languages Used

### TypeScript (Primary Language)

**What it is**: TypeScript is JavaScript with extra features that help prevent bugs and make code easier to understand.

**Example**: Instead of writing:

```javascript
// Regular JavaScript - can cause errors
function addNumbers(a, b) {
  return a + b;
}
```

TypeScript lets you write:

```typescript
// TypeScript - specifies that a and b must be numbers
function addNumbers(a: number, b: number): number {
  return a + b;
}
```

**Used for**:

- All frontend user interfaces (what you see on screen)
- Backend server logic
- BlockSuite editor components
- Build tools and scripts

### Rust (Performance Language)

**What it is**: Rust is a programming language designed to be extremely fast and safe. It's used for parts of the application that need to handle lots of data quickly.

**Example**: Rust code for text processing:

```rust
// Rust code - very fast and memory-safe
pub fn process_text(input: &str) -> String {
    input.chars().map(|c| c.to_uppercase()).collect()
}
```

**Used for**:

- Native system operations (file handling, system access)
- Y-Octo CRDT system (handles real-time collaboration)
- Document processing and parsing
- High-performance data operations

### SQL (Database Language)

**What it is**: SQL is a language for talking to databases - storing, retrieving, and organizing data.

**Example**:

```sql
-- Find all users with their workspaces
SELECT users.name, workspaces.title
FROM users
JOIN workspaces ON users.id = workspaces.owner_id;
```

**Used for**:

- Storing user accounts
- Saving documents and workspace data
- Managing permissions and access control

### HTML/CSS (Web Display Languages)

**What it is**: HTML creates the structure of web pages, CSS makes them look good.

**Example**:

```html
<!-- HTML creates the structure -->
<div class="document-editor">
  <h1>My Document Title</h1>
  <p>Document content goes here</p>
</div>
```

```css
/* CSS makes it look nice */
.document-editor {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: white;
}
```

**Used for**:

- Web interface styling
- Document formatting
- User interface components

---

## System Architecture Overview

The application is built with a **client-server architecture**:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│    Backend      │────│   Database      │
│  (User sees)    │    │   (Server)      │    │   (Storage)     │
│  localhost:8080 │    │ localhost:3010  │    │ localhost:5433  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │    Redis     │ │   Search    │ │    Mail    │
        │   (Cache)    │ │  (Indexer)  │ │ (Testing)  │
        │ localhost:   │ │ localhost:  │ │ localhost: │
        │    6380      │ │    9308     │ │    8025    │
        └──────────────┘ └─────────────┘ └────────────┘
```

### What Each Component Does:

1. **Frontend**: The part users interact with - buttons, text boxes, menus
2. **Backend**: The server that processes requests and manages data
3. **Database**: Where all the data is permanently stored
4. **Cache (Redis)**: Temporary storage for faster access
5. **Search**: Helps you find content quickly
6. **Mail**: For sending notifications (testing only in this setup)

---

## Frontend Components

The frontend is built using **React**, a popular library for creating user interfaces.

### Main Frontend Applications

#### 1. Web Application (`packages/frontend/apps/web/`)

**What it is**: The main web version that runs in your browser.

**Key Components**:

- **Router**: Controls which page you see based on the URL
- **Workspaces**: Different projects or documents you're working on
- **Editor**: Where you actually edit documents
- **Sidebar**: Navigation menu and tools

#### 2. Desktop Application (`packages/frontend/apps/electron/`)

**What it is**: The standalone desktop app version (like Microsoft Word as a desktop program).

**Technology**: Built with **Electron**, which lets web applications run as desktop programs.

#### 3. Mobile Applications

- **iOS App** (`packages/frontend/apps/ios/`): For iPhones and iPads
- **Android App** (`packages/frontend/apps/android/`): For Android devices

### Core Frontend Packages

#### Component Library (`packages/frontend/component/`)

**What it is**: A collection of reusable user interface pieces.

**Think of it like**: LEGO blocks for building user interfaces. Instead of recreating a button every time, developers use the pre-built button component.

**Example Components**:

- Buttons, text inputs, menus
- Modal dialogs (popup windows)
- Icons and graphics
- Form controls

**Key Technologies**:

- **React**: For building interactive components
- **Radix UI**: Pre-built, accessible interface components
- **Emotion**: For styling components
- **Storybook**: Tool for testing and documenting components

#### Core Application Logic (`packages/frontend/core/`)

**What it is**: The main business logic and functionality of the application.

**Key Modules**:

- **Authentication**: User login and security
- **Workspace Management**: Creating and organizing workspaces
- **Document Editing**: The core editor functionality
- **Collaboration**: Real-time editing with multiple users
- **Data Synchronization**: Keeping data in sync across devices

**Key Technologies**:

- **Jotai**: State management (remembering what's happening in the app)
- **SWR**: Data fetching and caching
- **React Router**: Navigation between pages
- **GraphQL**: For communicating with the backend

---

## Backend Components

The backend is built using **NestJS**, a Node.js framework that helps organize server code.

### Server Package (`packages/backend/server/`)

**What it is**: The main server that handles all requests from the frontend.

#### Core Modules:

##### Authentication System (`src/core/auth/`)

**What it does**: Manages user accounts, login, and security.

**Key Features**:

- User registration and login
- Password encryption (using Argon2 algorithm)
- Session management
- Access control and permissions

##### Document Storage (`src/core/doc/`)

**What it does**: Manages how documents are stored and retrieved.

**Key Features**:

- Document creation and editing
- Version history
- File attachments
- Document sharing and permissions

##### Workspace Management (`src/core/workspaces/`)

**What it does**: Handles different workspaces (think of them as different projects).

**Key Features**:

- Creating new workspaces
- Managing workspace members
- Workspace settings and configurations
- Access control

##### GraphQL API (`src/base/graphql/`)

**What it is**: GraphQL is a way for the frontend to request specific data from the backend.

**Example GraphQL Query**:

```graphql
query GetWorkspace($id: String!) {
  workspace(id: $id) {
    id
    name
    members {
      name
      email
    }
  }
}
```

This says: "Get me the workspace with this ID, and include its name and all member names and emails."

#### Plugin System

The server uses a plugin architecture where different features are separate modules:

- **OAuth Plugin**: For third-party login (disabled in air-gap mode)
- **Payment Plugin**: For handling subscriptions (disabled in air-gap mode)
- **Copilot Plugin**: For AI features (placeholder in air-gap mode)
- **Indexer Plugin**: For search functionality

### Native Packages (`packages/backend/native/`)

**What it is**: High-performance code written in Rust for speed-critical operations.

**Key Functions**:

- File processing and parsing
- Document conversion
- System-level operations
- Performance-critical data processing

---

## BlockSuite - The Editor Engine

BlockSuite is the heart of the editing experience. It's a separate system that handles all document editing.

### What BlockSuite Does

**Think of it like**: The engine in a car. You don't see it directly, but it powers everything you do when editing documents.

### Key Concepts

#### Blocks

**What they are**: Everything in a document is a "block" - a paragraph is a block, an image is a block, a table is a block.

**Example Block Types**:

- **Paragraph Block**: Regular text
- **Heading Block**: Titles and headers
- **List Block**: Bulleted or numbered lists
- **Image Block**: Pictures and graphics
- **Table Block**: Data in rows and columns
- **Code Block**: Programming code with syntax highlighting

#### CRDT (Conflict-free Replicated Data Type)

**What it is**: A technology that allows multiple people to edit the same document simultaneously without conflicts.

**Real-world example**:

- Person A types "Hello" at the beginning of a sentence
- Person B types "World" at the end of the same sentence
- CRDT ensures both changes are preserved: "Hello [original text] World"

#### Y-Octo

**What it is**: The Rust-based CRDT implementation that powers real-time collaboration.

**Key Features**:

- Ultra-fast performance
- Thread-safe operations
- Compatible with Yjs (the JavaScript version)
- Handles complex document operations

### BlockSuite Architecture

```
┌─────────────────┐
│   BlockSuite    │
├─────────────────┤
│ • Blocks        │ ── Different types of content
│ • Widgets       │ ── Interactive tools and menus
│ • Fragments     │ ── Reusable UI pieces
│ • GFX          │ ── Graphics and drawing tools
│ • Inlines      │ ── Text formatting and links
└─────────────────┘
```

#### Block Categories:

1. **Content Blocks** (`blocksuite/affine/blocks/`):

   - Paragraph, heading, list
   - Image, attachment, embed
   - Database, table
   - Code, LaTeX (mathematical formulas)

2. **Widgets** (`blocksuite/affine/widgets/`):

   - Toolbar (formatting options)
   - Drag handles (for moving blocks)
   - Slash menu (quick commands like "/table")
   - Zoom controls

3. **Graphics (GFX)** (`blocksuite/affine/gfx/`):
   - Drawing tools (brush, shapes)
   - Mind maps
   - Connectors and arrows
   - Text annotations

---

## Database and Storage

### Primary Database: PostgreSQL with pgvector

**What PostgreSQL is**: A powerful, reliable database system that stores all the application data.

**What pgvector is**: An extension that adds support for AI-related vector operations (used for features like semantic search).

**What gets stored**:

- User accounts and profiles
- Workspaces and their settings
- Document content and metadata
- File attachments and uploads
- User permissions and access rights
- Activity logs and history

**Example Database Tables**:

```sql
-- Users table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    password_hash VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE workspaces (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    owner_id VARCHAR REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Caching: Redis

**What Redis is**: A fast, in-memory storage system used for temporary data.

**What it stores**:

- User sessions (who's logged in)
- Frequently accessed data
- Cache of database queries
- Real-time collaboration state

**Why it's needed**: Redis is much faster than the main database for frequently accessed data.

### Search Engine: Manticore Search

**What it does**: Provides fast, full-text search across all documents and content.

**Example**: When you search for "project timeline", it quickly finds all documents containing those words.

**Features**:

- Full-text search
- Fuzzy matching (finds "timeline" even if you type "timelne")
- Ranking results by relevance
- Real-time indexing (new content is immediately searchable)

---

## Development Tools and Build System

### The AFFiNE CLI Tool (`tools/cli/`)

**What it is**: A command-line tool that automates common development tasks.

**Key Commands**:

```bash
# Start development server
yarn affine @affine/web dev

# Build for production
yarn affine @affine/web build

# Run tests
yarn affine test

# Clean build files
yarn affine clean
```

### Build System: Webpack

**What Webpack does**: Takes all the source code files and packages them into files that browsers can understand.

**Process**:

1. **TypeScript → JavaScript**: Converts TypeScript to regular JavaScript
2. **Module Bundling**: Combines many small files into fewer, larger files
3. **Asset Processing**: Optimizes images, fonts, and other resources
4. **Code Splitting**: Creates separate files for different parts of the app
5. **Minification**: Makes files smaller for faster loading

### Package Management: Yarn Workspaces

**What it is**: A system for managing multiple related packages in one repository.

**Structure**:

```
affine-to-notes9/
├── packages/
│   ├── frontend/
│   │   ├── core/           ← Main frontend logic
│   │   ├── component/      ← UI components
│   │   └── apps/
│   │       ├── web/        ← Web app
│   │       ├── electron/   ← Desktop app
│   │       └── mobile/     ← Mobile app
│   ├── backend/
│   │   ├── server/         ← Main server
│   │   └── native/         ← Rust components
│   └── common/             ← Shared utilities
└── blocksuite/             ← Editor engine
```

**Benefits**:

- Shared dependencies (don't duplicate common libraries)
- Easy to make changes across related packages
- Consistent versioning and builds

### TypeScript Configuration

**What TypeScript provides**:

- **Type Safety**: Catches errors before code runs
- **IntelliSense**: Smart code completion and suggestions
- **Refactoring**: Safe code restructuring
- **Documentation**: Types serve as documentation

**Example Configuration** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2022", // Use modern JavaScript features
    "module": "ESNext", // Use latest module system
    "strict": true, // Enable all strict checks
    "jsx": "react-jsx", // Support React components
    "moduleResolution": "node" // How to find imported modules
  }
}
```

---

## Testing Infrastructure

### Testing Framework: Playwright

**What Playwright is**: A tool that automatically controls browsers to test the application like a real user would.

**What it tests**:

- User workflows (login, create document, edit, save)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile responsiveness
- Performance and loading times

**Example Test**:

```typescript
test('user can create a new document', async ({ page }) => {
  // Go to the application
  await page.goto('http://localhost:8080');

  // Click the "New Document" button
  await page.click('[data-testid="new-document"]');

  // Type some content
  await page.fill('[data-testid="editor"]', 'Hello, World!');

  // Verify the content was saved
  await expect(page.locator('[data-testid="document-title"]')).toContainText('Untitled');
});
```

### Test Categories

#### 1. Local Tests (`tests/affine-local/`)

**What they test**: The basic application running locally without cloud features.

#### 2. Desktop Tests (`tests/affine-desktop/`)

**What they test**: The Electron desktop application.

#### 3. Mobile Tests (`tests/affine-mobile/`)

**What they test**: Touch interactions and mobile-specific features.

#### 4. BlockSuite Tests (`tests/blocksuite/`)

**What they test**: The editor functionality and document operations.

#### 5. Cloud Tests (Disabled in Air-Gap)

**What they would test**: Cloud synchronization and collaboration features.

### Unit Testing: Vitest

**What Vitest is**: A tool for testing individual functions and components in isolation.

**Example Unit Test**:

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
  it('formats dates correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });
});
```

---

## Infrastructure Services

### Docker Services (`docker-compose.local.yml`)

**What Docker is**: A system that packages applications and their dependencies into containers that can run anywhere.

**Services in the Air-Gap Setup**:

#### PostgreSQL Database

```yaml
postgres:
  image: pgvector/pgvector:pg16 # Database with AI vector support
  ports: ['5433:5432'] # Runs on port 5433 (avoiding conflicts)
  environment:
    POSTGRES_USER: affine
    POSTGRES_PASSWORD: affine
    POSTGRES_DB: affine
```

#### Redis Cache

```yaml
redis:
  image: redis:latest # Fast in-memory storage
  ports: ['6380:6379'] # Runs on port 6380 (avoiding conflicts)
```

#### Manticore Search

```yaml
indexer:
  image: manticoresearch/manticore:10.1.0 # Search engine
  ports: ['9308:9308'] # Search service port
```

#### MailHog (Development Mail)

```yaml
mailhog:
  image: mailhog/mailhog:latest # Catches emails for testing
  ports:
    - '1025:1025' # SMTP port (sending emails)
    - '8025:8025' # Web UI (viewing emails)
```

#### AI Placeholder

```yaml
ai-api:
  image: alpine:latest # Lightweight Linux container
  command: echo "AI service placeholder" # Just displays a message
  ports: ['8001:8001'] # Ready for future AI integration
```

### Environment Configuration

**Environment Variables**: Settings that configure how the application runs.

**Key Variables**:

```bash
# Database connection
DATABASE_URL=postgresql://affine:affine@localhost:5433/affine

# Cache connection
REDIS_SERVER_HOST=localhost
REDIS_SERVER_PORT=6380

# Security settings (Air-gap mode)
TELEMETRY_ENABLED=false          # No analytics/tracking
OAUTH_GOOGLE_ENABLED=false       # No external login
LOCAL_WORKSPACE_ENABLED=true     # Enable local-only workspaces

# AI integration (ready for future)
AI_ENABLED=true
AI_BASE_URL=http://localhost:8001
```

---

## Security and Air-Gap Features

### What "Air-Gap" Means

**Air-Gap**: The application is completely isolated from the internet - no external connections whatsoever.

**Why this matters**:

- Prevents data leaks to external services
- Ensures complete privacy
- Meets strict security requirements
- Protects sensitive research or business data

### Security Implementations

#### 1. Telemetry Removal

**What was removed**: All analytics, tracking, and data collection.

**Before (Cloud Version)**:

```typescript
// Sent usage data to external services
mixpanel.track('user_action', { data });
sentry.captureException(error);
```

**After (Air-Gap Version)**:

```typescript
// No-operation (no-op) - does nothing
const mixpanel = new Proxy({}, { get: () => () => {} });
const sentry = { captureException: () => {} };
```

#### 2. OAuth Provider Removal

**What was removed**: Google, GitHub, Apple login options.

**Before**:

```typescript
const BUILD_IN_SERVERS = [
  {
    id: 'affine-cloud',
    baseUrl: 'https://app.affine.pro',
    oauthProviders: [OAuthProviderType.Google, OAuthProviderType.GitHub],
  },
];
```

**After**:

```typescript
const BUILD_IN_SERVERS = [
  {
    id: 'local-server',
    baseUrl: 'http://localhost:3010',
    oauthProviders: [], // No external authentication
  },
];
```

#### 3. Service Provider Stubbing

**What was done**: External services were replaced with local-only versions.

**Examples**:

- **CustomerIO** (email marketing): Disabled
- **Stripe** (payments): Disabled
- **Cloud storage**: Replaced with local file storage
- **CDNs**: All assets served locally

#### 4. Local Authentication

**How it works**: Users create accounts and log in using only local credentials.

**Features**:

- Local password storage (encrypted with Argon2)
- Session management via local Redis
- No external identity verification
- User data stays completely local

---

## How Everything Works Together

### 1. Starting the Application

**Step 1: Infrastructure Services**

```bash
# Start supporting services
docker-compose -f docker-compose.local.yml up -d
```

This starts:

- PostgreSQL database (port 5433)
- Redis cache (port 6380)
- Manticore search (port 9308)
- MailHog for email testing (port 8025)

**Step 2: Backend Server**

```bash
# Start the NestJS server
yarn affine @affine/server dev
```

This starts:

- GraphQL API server (port 3010)
- WebSocket connections for real-time collaboration
- File upload and storage handling
- Authentication and user management

**Step 3: Frontend Application**

```bash
# Start the React frontend
yarn affine @affine/web dev
```

This starts:

- React development server (port 8080)
- Hot reloading for development
- Webpack bundling and compilation
- Service worker for offline functionality

### 2. User Workflow Example

#### Creating a New Document

1. **User Action**: User clicks "New Document"
2. **Frontend**: React component sends GraphQL mutation
3. **Backend**: NestJS server processes the request
4. **Database**: PostgreSQL stores the new document record
5. **Cache**: Redis caches frequently accessed data
6. **Search**: Manticore indexes the new document
7. **Editor**: BlockSuite initializes the editor with Y-Octo
8. **Collaboration**: WebSocket enables real-time editing

#### Real-time Collaboration Flow

1. **User A** types in the editor
2. **Y-Octo** (Rust) processes the change as a CRDT operation
3. **WebSocket** sends the change to the server
4. **Server** broadcasts to all connected users
5. **User B's editor** receives and applies the change
6. **BlockSuite** updates the display for User B
7. **Database** eventually stores the final state

### 3. Data Flow Architecture

```
User Input
    ↓
React Components (Frontend)
    ↓
State Management (Jotai)
    ↓
GraphQL/WebSocket (Communication)
    ↓
NestJS Controllers (Backend)
    ↓
Service Layer (Business Logic)
    ↓
Database Layer (PostgreSQL/Redis)
```

### 4. File Structure Example

When you create a document, here's what happens across the codebase:

```
packages/frontend/core/src/
├── components/
│   └── workspace/
│       └── new-document-button.tsx     ← UI button
├── modules/
│   └── doc/
│       └── services/
│           └── doc-service.ts          ← Document logic
└── graphql/
    └── mutations/
        └── create-document.ts          ← API request

packages/backend/server/src/
├── core/
│   └── doc/
│       ├── resolvers/
│       │   └── doc.resolver.ts         ← GraphQL handler
│       └── services/
│           └── doc.service.ts          ← Business logic
└── models/
    └── doc.model.ts                    ← Database model

blocksuite/affine/blocks/
├── root/
│   └── root-model.ts                   ← Document structure
└── paragraph/
    └── paragraph-model.ts              ← Text content
```

### 5. Key Technologies Summary

| Technology     | Purpose                     | Example Use                      |
| -------------- | --------------------------- | -------------------------------- |
| **TypeScript** | Main development language   | All application logic            |
| **Rust**       | High-performance operations | Y-Octo collaboration engine      |
| **React**      | User interface              | All frontend components          |
| **NestJS**     | Backend framework           | API server and business logic    |
| **PostgreSQL** | Primary database            | User data, documents, workspaces |
| **Redis**      | Caching and sessions        | Fast data access, user sessions  |
| **Manticore**  | Search engine               | Document and content search      |
| **Docker**     | Service containerization    | Local development environment    |
| **Webpack**    | Build system                | Compile and bundle frontend code |
| **Playwright** | End-to-end testing          | Automated user workflow testing  |
| **Vitest**     | Unit testing                | Test individual functions        |
| **GraphQL**    | API communication           | Frontend-backend data exchange   |
| **WebSocket**  | Real-time communication     | Live collaboration               |
| **Y-Octo/Yjs** | CRDT implementation         | Conflict-free document editing   |

### 6. Development Workflow

```
Developer writes TypeScript code
    ↓
Webpack compiles and bundles
    ↓
Development server serves files
    ↓
Browser loads and runs application
    ↓
User interacts with React components
    ↓
Components communicate with backend
    ↓
Backend processes and stores data
    ↓
Changes sync across all connected users
```

---

## Conclusion

This AFFiNE air-gap application is a sophisticated, modern web application that provides:

- **Complete offline functionality** - no internet required
- **Real-time collaboration** - multiple users can edit simultaneously
- **Rich document editing** - text, images, tables, drawings, and more
- **High performance** - using Rust for speed-critical operations
- **Strong security** - no external connections or data leaks
- **Cross-platform support** - web, desktop, and mobile applications
- **Extensible architecture** - ready for AI and advanced features

The codebase demonstrates modern software engineering practices with:

- **Type safety** through TypeScript
- **Modular architecture** with clear separation of concerns
- **Comprehensive testing** for reliability
- **Performance optimization** through caching and efficient data structures
- **Security-first design** with air-gap isolation
- **Developer-friendly tooling** for easy development and deployment

Whether you're new to programming or an experienced developer, this codebase serves as an excellent example of how to build a complex, collaborative application with modern web technologies while maintaining security and performance standards.
