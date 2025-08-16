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

### Overview

**AFFiNE** is a comprehensive digital workspace application that combines multiple productivity tools into one unified platform. It's designed to be a complete replacement for various separate applications you might use for work or personal projects.

### Core Functionality

**AFFiNE serves as**:

#### Document Editor (Like Microsoft Word)

- **Rich text editing**: Format text with bold, italic, colors, fonts
- **Structured content**: Headers, paragraphs, lists, quotes
- **Media integration**: Images, videos, files, links
- **Advanced formatting**: Tables, code blocks, mathematical formulas (LaTeX)
- **Template system**: Pre-built document templates for common use cases

#### Visual Canvas (Like Miro/Figma)

- **Infinite canvas**: Unlimited space for visual thinking
- **Drawing tools**: Freehand drawing, shapes, lines, arrows
- **Mind mapping**: Visual representation of ideas and connections
- **Sticky notes**: Digital post-it notes for brainstorming
- **Wireframing**: Create mockups and prototypes

#### Database/Spreadsheet (Like Airtable/Notion)

- **Structured data**: Create tables with different field types
- **Views**: Display data in different formats (table, kanban, calendar)
- **Filtering and sorting**: Organize data by criteria
- **Relationships**: Link data between different tables
- **Formulas**: Calculate values automatically

#### Project Management (Like Trello/Asana)

- **Task management**: Create, assign, and track tasks
- **Project timelines**: Plan and visualize project schedules
- **Team collaboration**: Share workspaces with team members
- **Progress tracking**: Monitor completion status
- **Deadline management**: Set and track due dates

### Unique Features

#### Block-Based Architecture

Everything in AFFiNE is a "block" - a self-contained piece of content:

- **Text blocks**: Paragraphs, headers, lists
- **Media blocks**: Images, videos, files
- **Interactive blocks**: Databases, calendars, forms
- **Custom blocks**: Extensible system for new content types

**Why this matters**: You can easily rearrange, copy, and transform content without losing formatting or functionality.

#### Real-Time Collaboration

Multiple people can work on the same document simultaneously:

- **Live cursors**: See where others are working
- **Instant updates**: Changes appear immediately for all users
- **Conflict resolution**: Automatic handling of simultaneous edits
- **Version history**: Track all changes over time

#### Local-First Architecture

Your data is stored locally first, then synchronized:

- **Offline capability**: Work without internet connection
- **Fast performance**: No waiting for server responses
- **Data ownership**: Your data stays on your device
- **Sync when available**: Automatically sync when connected

### Air-Gap Modification

This particular version has been specially modified for **complete offline operation**:

#### What "Air-Gap" Means

- **No internet connection**: Application cannot access external websites
- **No external services**: No cloud storage, analytics, or third-party integrations
- **Local-only operation**: Everything runs on your local network
- **Enhanced security**: Prevents data leaks or unauthorized access

#### Why Air-Gap is Important

- **Sensitive data protection**: Government, healthcare, financial institutions
- **Compliance requirements**: Regulations that require data isolation
- **Corporate security**: Protecting intellectual property and trade secrets
- **Privacy concerns**: Complete control over your information

#### Trade-offs of Air-Gap Operation

**Benefits**:

- Maximum security and privacy
- No dependency on internet connectivity
- Complete data sovereignty
- Protection from external threats

**Limitations**:

- No cloud synchronization across different networks
- No external integrations (Google Drive, Dropbox, etc.)
- Manual updates and maintenance
- Limited to local network collaboration

---

## Programming Languages Used

### TypeScript (Primary Language)

#### What TypeScript Is

**TypeScript** is JavaScript enhanced with a **type system**. JavaScript is the language that runs in web browsers, but it doesn't check for errors until the code is actually running. TypeScript adds type checking that happens before the code runs, catching bugs early.

#### Key TypeScript Concepts

##### Type Annotations

Instead of guessing what kind of data a function expects, TypeScript lets you specify exactly:

```typescript
// Without types (JavaScript) - unclear what's expected
function createUser(name, age, email) {
  return { name, age, email };
}

// With types (TypeScript) - crystal clear expectations
function createUser(name: string, age: number, email: string): User {
  return { name, age, email };
}

// Define what a User object looks like
interface User {
  name: string;
  age: number;
  email: string;
  id?: string; // Optional property
}
```

##### Advanced Type Features Used in AFFiNE

**Union Types** - A value can be one of several types:

```typescript
// A block can be text, image, or table
type BlockType = 'paragraph' | 'image' | 'table' | 'heading';

function createBlock(type: BlockType, content: string) {
  // TypeScript ensures only valid block types are used
}
```

**Generic Types** - Reusable code that works with different types:

```typescript
// A generic service that can work with any data type
class DataService<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }
}

// Use it for different types
const userService = new DataService<User>();
const documentService = new DataService<Document>();
```

**Interface Inheritance** - Building complex types from simpler ones:

```typescript
// Base block interface
interface BaseBlock {
  id: string;
  type: string;
  created: Date;
}

// Specific block types extend the base
interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
  formatting: TextFormatting;
}

interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  width: number;
  height: number;
}
```

#### How TypeScript is Used in AFFiNE

##### Frontend Application Logic

```typescript
// React component with TypeScript
interface DocumentEditorProps {
  document: Document;
  onSave: (doc: Document) => Promise<void>;
  readonly?: boolean;
}

export function DocumentEditor({ document, onSave, readonly = false }: DocumentEditorProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [content, setContent] = useState<string>(document.content);

  const handleSave = useCallback(async () => {
    const updatedDoc = { ...document, content };
    await onSave(updatedDoc);
  }, [document, content, onSave]);

  return (
    <div className="document-editor">
      {/* Component JSX */}
    </div>
  );
}
```

##### Backend API Definitions

```typescript
// GraphQL resolver with TypeScript
@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private workspaceService: WorkspaceService) {}

  @Query(() => [Workspace])
  async workspaces(@CurrentUser() user: User, @Args() args: GetWorkspacesArgs): Promise<Workspace[]> {
    return this.workspaceService.findByUser(user.id, args);
  }

  @Mutation(() => Workspace)
  async createWorkspace(@CurrentUser() user: User, @Args('input') input: CreateWorkspaceInput): Promise<Workspace> {
    return this.workspaceService.create(user.id, input);
  }
}
```

##### Configuration and Build Tools

```typescript
// Webpack configuration with TypeScript
interface BuildConfig {
  entry: string;
  output: {
    path: string;
    filename: string;
  };
  mode: 'development' | 'production';
  plugins: WebpackPlugin[];
}

export function createWebpackConfig(pkg: Package): BuildConfig {
  return {
    entry: path.resolve(pkg.srcPath, 'index.ts'),
    output: {
      path: pkg.distPath,
      filename: '[name].[contenthash].js',
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins: [
      new HtmlWebpackPlugin({
        template: pkg.templatePath,
      }),
    ],
  };
}
```

### Rust (Performance Language)

#### What Rust Is

**Rust** is a systems programming language focused on **safety**, **speed**, and **concurrency**. Unlike languages like JavaScript or Python, Rust compiles to native machine code, making it extremely fast. Its unique ownership system prevents common programming errors like memory leaks and data races.

#### Key Rust Concepts

##### Memory Safety Without Garbage Collection

```rust
// Rust manages memory automatically and safely
fn process_document(content: String) -> String {
    let mut processed = String::new();

    // Rust tracks ownership - no memory leaks possible
    for line in content.lines() {
        processed.push_str(&line.to_uppercase());
        processed.push('\n');
    }

    processed // Ownership transferred to caller
} // content automatically cleaned up here
```

##### Concurrency Without Data Races

```rust
use std::sync::{Arc, Mutex};
use std::thread;

// Safe concurrent access to shared data
fn parallel_document_processing(documents: Vec<Document>) -> Vec<ProcessedDocument> {
    let results = Arc::new(Mutex::new(Vec::new()));
    let mut handles = vec![];

    for doc in documents {
        let results_clone = Arc::clone(&results);
        let handle = thread::spawn(move || {
            let processed = process_document(doc);
            results_clone.lock().unwrap().push(processed);
        });
        handles.push(handle);
    }

    // Wait for all threads to complete
    for handle in handles {
        handle.join().unwrap();
    }

    Arc::try_unwrap(results).unwrap().into_inner().unwrap()
}
```

#### How Rust is Used in AFFiNE

##### Y-Octo CRDT Implementation

```rust
// High-performance conflict-free replicated data type
pub struct YOctoDoc {
    state: Arc<RwLock<DocState>>,
    operations: Vec<Operation>,
}

impl YOctoDoc {
    pub fn insert_text(&mut self, position: usize, text: &str) -> Operation {
        let op = Operation::Insert {
            position,
            content: text.to_string(),
            author: self.get_author_id(),
            timestamp: SystemTime::now(),
        };

        self.apply_operation(&op);
        op
    }

    pub fn apply_operation(&mut self, operation: &Operation) {
        let mut state = self.state.write().unwrap();
        state.apply(operation);
        self.operations.push(operation.clone());
    }
}
```

##### Native File Processing

```rust
// Fast document parsing and conversion
pub fn parse_docx_file(file_path: &Path) -> Result<Document, ParseError> {
    let file = File::open(file_path)?;
    let mut archive = ZipArchive::new(file)?;

    // Extract document.xml from DOCX file
    let mut document_xml = String::new();
    archive.by_name("word/document.xml")?.read_to_string(&mut document_xml)?;

    // Parse XML to internal document structure
    let doc_structure = parse_xml_to_blocks(&document_xml)?;

    Ok(Document {
        title: extract_title(&doc_structure),
        blocks: doc_structure,
        metadata: extract_metadata(&archive)?,
    })
}

// High-performance text search
pub fn search_documents(query: &str, documents: &[Document]) -> Vec<SearchResult> {
    documents
        .par_iter() // Parallel processing
        .enumerate()
        .filter_map(|(index, doc)| {
            let score = calculate_relevance_score(query, doc);
            if score > 0.5 {
                Some(SearchResult {
                    document_index: index,
                    score,
                    highlights: find_highlights(query, doc),
                })
            } else {
                None
            }
        })
        .collect()
}
```

##### Node.js Integration with N-API

```rust
// Expose Rust functions to Node.js
use napi::{bindgen_prelude::*, JsString};

#[napi]
pub fn process_document_native(content: String) -> Result<String> {
    // High-performance processing in Rust
    let processed = internal_process_document(&content)?;
    Ok(processed)
}

#[napi]
pub struct DocumentProcessor {
    config: ProcessingConfig,
}

#[napi]
impl DocumentProcessor {
    #[napi(constructor)]
    pub fn new(config: String) -> Result<Self> {
        Ok(Self {
            config: serde_json::from_str(&config)?,
        })
    }

    #[napi]
    pub fn process(&self, input: String) -> Result<String> {
        // Use configuration to process document
        process_with_config(&input, &self.config)
    }
}
```

### SQL (Database Language)

#### What SQL Is

**SQL (Structured Query Language)** is a declarative language for managing relational databases. Instead of telling the computer how to do something step by step, you describe what you want, and the database figures out the most efficient way to get it.

#### Key SQL Concepts in AFFiNE

##### Database Schema Design

```sql
-- Users table with proper constraints
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Indexes for performance
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Workspaces with foreign key relationships
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Indexes for common queries
    INDEX idx_workspaces_owner (owner_id),
    INDEX idx_workspaces_created (created_at DESC)
);

-- Documents with full-text search
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    content JSONB NOT NULL, -- Store document blocks as JSON
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Full-text search index
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', title || ' ' || (content #>> '{}'))
    ) STORED
);

CREATE INDEX idx_documents_search ON documents USING GIN(search_vector);
```

##### Complex Queries for Application Features

```sql
-- Get all workspaces accessible to a user (owned or shared)
WITH user_workspaces AS (
    -- Workspaces owned by user
    SELECT w.*, 'owner' as role
    FROM workspaces w
    WHERE w.owner_id = $1

    UNION ALL

    -- Workspaces shared with user
    SELECT w.*, ws.role
    FROM workspaces w
    JOIN workspace_shares ws ON w.id = ws.workspace_id
    WHERE ws.user_id = $1 AND ws.accepted_at IS NOT NULL
)
SELECT
    uw.*,
    COUNT(d.id) as document_count,
    MAX(d.updated_at) as last_activity
FROM user_workspaces uw
LEFT JOIN documents d ON uw.id = d.workspace_id
GROUP BY uw.id, uw.name, uw.description, uw.owner_id, uw.created_at, uw.updated_at, uw.role
ORDER BY last_activity DESC NULLS LAST;

-- Advanced document search with ranking
SELECT
    d.id,
    d.title,
    d.content,
    ts_rank(d.search_vector, websearch_to_tsquery('english', $1)) as relevance,
    ts_headline('english', d.title, websearch_to_tsquery('english', $1)) as title_highlight,
    ts_headline('english', d.content #>> '{}', websearch_to_tsquery('english', $1)) as content_highlight
FROM documents d
WHERE d.search_vector @@ websearch_to_tsquery('english', $1)
    AND d.workspace_id = ANY($2) -- Only search in accessible workspaces
ORDER BY relevance DESC, d.updated_at DESC
LIMIT $3 OFFSET $4;

-- Analytics query for workspace activity
SELECT
    DATE_TRUNC('day', d.updated_at) as date,
    COUNT(*) as documents_modified,
    COUNT(DISTINCT d.created_by) as active_users,
    AVG(LENGTH(d.content #>> '{}')) as avg_content_length
FROM documents d
WHERE d.workspace_id = $1
    AND d.updated_at >= $2
    AND d.updated_at < $3
GROUP BY DATE_TRUNC('day', d.updated_at)
ORDER BY date;
```

##### Vector Operations for AI Features

```sql
-- Vector similarity search using pgvector extension
CREATE TABLE document_embeddings (
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    embedding vector(1536), -- OpenAI embedding size
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    PRIMARY KEY (document_id)
);

-- Create index for fast similarity search
CREATE INDEX ON document_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Find similar documents using vector similarity
SELECT
    d.id,
    d.title,
    1 - (de.embedding <=> $1::vector) as similarity
FROM documents d
JOIN document_embeddings de ON d.id = de.document_id
WHERE de.embedding <=> $1::vector < 0.2 -- Only return similar results
ORDER BY de.embedding <=> $1::vector
LIMIT 10;
```

### HTML/CSS (Web Display Languages)

#### What HTML and CSS Are

**HTML (HyperText Markup Language)** provides the structure and content of web pages. **CSS (Cascading Style Sheets)** controls how that content looks and behaves.

#### Modern HTML in AFFiNE

##### Semantic HTML Structure

```html
<!-- Document editor layout with semantic elements -->
<main class="workspace-container" role="main">
  <aside class="sidebar" role="navigation" aria-label="Workspace navigation">
    <nav class="workspace-nav">
      <h2 class="workspace-title">My Workspace</h2>
      <ul class="document-list" role="list">
        <li role="listitem">
          <a href="/doc/1" class="document-link" aria-current="page">
            <span class="document-icon" aria-hidden="true">📄</span>
            <span class="document-title">Project Overview</span>
            <time class="document-date" datetime="2024-01-15T10:30:00Z"> Jan 15, 2024 </time>
          </a>
        </li>
      </ul>
    </nav>
  </aside>

  <section class="editor-container" role="document">
    <header class="editor-header">
      <h1 class="document-title" contenteditable="true" aria-label="Document title">Untitled Document</h1>
      <div class="editor-toolbar" role="toolbar" aria-label="Formatting options">
        <button type="button" class="toolbar-btn" aria-pressed="false" data-command="bold" title="Bold (Ctrl+B)">
          <span class="btn-icon" aria-hidden="true">B</span>
          <span class="sr-only">Bold</span>
        </button>
      </div>
    </header>

    <article class="editor-content" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Document content">
      <!-- BlockSuite editor renders here -->
    </article>
  </section>
</main>
```

#### Advanced CSS in AFFiNE

##### CSS-in-JS with Emotion

```typescript
// Styled components in React
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const EditorContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};

  /* Responsive design */
  @media (max-width: 768px) {
    flex-direction: column;
  }

  /* Dark mode support */
  [data-theme='dark'] & {
    background: ${props => props.theme.dark.background};
    color: ${props => props.theme.dark.text};
  }
`;

const dynamicStyles = css`
  /* CSS variables for theming */
  --editor-font-size: ${props => props.fontSize}px;
  --editor-line-height: ${props => props.lineHeight};
  --editor-max-width: ${props => props.maxWidth}px;

  /* Dynamic spacing based on content */
  padding: calc(var(--editor-font-size) * 0.5);
  max-width: var(--editor-max-width);
  line-height: var(--editor-line-height);
`;
```

##### Vanilla Extract for Build-Time CSS

```typescript
// Type-safe CSS with build-time optimization
import { style, createTheme, globalStyle } from '@vanilla-extract/css';

// Theme configuration
export const [themeClass, vars] = createTheme({
  color: {
    primary: '#1f40ff',
    secondary: '#6b7280',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      small: '14px',
      medium: '16px',
      large: '20px',
    },
  },
});

// Component styles
export const editorContainer = style({
  backgroundColor: vars.color.background,
  fontFamily: vars.typography.fontFamily,
  fontSize: vars.typography.fontSize.medium,
  padding: vars.spacing.large,

  // Responsive design
  '@media': {
    'screen and (max-width: 768px)': {
      padding: vars.spacing.medium,
      fontSize: vars.typography.fontSize.small,
    },
  },
});

export const blockElement = style({
  marginBottom: vars.spacing.medium,
  transition: 'all 200ms ease',

  selectors: {
    '&:hover': {
      backgroundColor: vars.color.surface,
    },
    '&:focus-within': {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: '2px',
    },
  },
});

// Global styles
globalStyle('body', {
  margin: 0,
  padding: 0,
  fontFamily: vars.typography.fontFamily,
  backgroundColor: vars.color.background,
  color: vars.color.text,
});
```

##### CSS Grid and Flexbox Layouts

```css
/* Complex responsive layout */
.workspace-layout {
  display: grid;
  grid-template-areas:
    'sidebar header header'
    'sidebar content toolbar'
    'sidebar content toolbar';
  grid-template-columns: 240px 1fr 60px;
  grid-template-rows: 60px 1fr auto;
  height: 100vh;
  gap: 1px;
  background: var(--border-color);
}

.sidebar {
  grid-area: sidebar;
  background: var(--sidebar-bg);
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 3px;
  }
}

.editor-content {
  grid-area: content;
  background: var(--editor-bg);
  overflow-y: auto;

  /* Typography scale */
  --font-scale: 1.125;
  --line-height-base: 1.6;

  /* Content spacing */
  > * + * {
    margin-top: calc(var(--font-size) * var(--line-height-base));
  }

  /* Block-level elements */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-top: calc(var(--font-size) * 2);
  }

  h1 {
    font-size: calc(var(--font-size) * var(--font-scale) * var(--font-scale) * var(--font-scale));
  }
  h2 {
    font-size: calc(var(--font-size) * var(--font-scale) * var(--font-scale));
  }
  h3 {
    font-size: calc(var(--font-size) * var(--font-scale));
  }
}

/* Animation system */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.block-enter {
  animation: fadeIn 200ms ease-out;
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .workspace-layout {
    grid-template-areas:
      'header header'
      'content content';
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr;
  }

  .sidebar {
    position: fixed;
    left: -240px;
    width: 240px;
    height: 100vh;
    z-index: 1000;
    transition: left 300ms ease;

    &.open {
      left: 0;
    }
  }
}
```

#### Accessibility Features

```html
<!-- ARIA attributes for screen readers -->
<div class="block-container" role="group" aria-labelledby="block-type-1" aria-describedby="block-help-1">
  <div id="block-type-1" class="block-type-indicator">Paragraph Block</div>

  <div id="block-help-1" class="sr-only">Press Enter to create a new paragraph, or type / for block options</div>

  <div contenteditable="true" role="textbox" aria-multiline="true" aria-label="Paragraph content" data-placeholder="Type something..."></div>
</div>

<!-- Keyboard navigation support -->
<div class="toolbar" role="toolbar" aria-label="Formatting options" tabindex="0" onkeydown="handleToolbarNavigation(event)">
  <button type="button" class="tool-btn" aria-pressed="false" data-command="bold" title="Bold text (Ctrl+B)">Bold</button>
</div>
```

---

## System Architecture Overview

### High-Level Architecture

AFFiNE uses a **distributed microservices architecture** designed for scalability, maintainability, and security. The system is built with multiple independent services that communicate with each other to provide the complete functionality.

#### Core Architecture Pattern: Client-Server with Service-Oriented Design

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

### Detailed Component Analysis

#### 1. Frontend Layer (Presentation Tier)

**Purpose**: User interface and user experience management

**Technologies**:

- **React 19**: Latest version for building interactive UIs
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite/Webpack**: Module bundling and development server
- **Emotion/Vanilla Extract**: CSS-in-JS styling solutions

**Key Responsibilities**:

- **User Interface Rendering**: Display documents, workspaces, and tools
- **State Management**: Track user interactions and application state
- **Real-time Updates**: Receive and display live collaboration changes
- **Offline Capability**: Continue working when disconnected
- **Performance Optimization**: Lazy loading, code splitting, caching

**Communication Patterns**:

```typescript
// GraphQL for data fetching
const { data, loading, error } = useQuery(GET_WORKSPACE, {
  variables: { id: workspaceId },
  pollInterval: 5000, // Poll every 5 seconds for updates
});

// WebSocket for real-time collaboration
const socket = useWebSocket('ws://localhost:3010/collaboration', {
  onMessage: event => {
    const operation = JSON.parse(event.data);
    applyOperationToDocument(operation);
  },
  onOpen: () => {
    joinCollaborationSession(documentId);
  },
});
```

#### 2. Backend Layer (Application Tier)

**Purpose**: Business logic, data processing, and API management

**Technologies**:

- **NestJS**: Node.js framework with dependency injection
- **GraphQL**: Flexible API query language
- **TypeORM/Prisma**: Database object-relational mapping
- **Socket.IO**: Real-time WebSocket communication
- **Bull/BullMQ**: Job queue processing

**Architecture Patterns**:

##### Module-Based Organization

```typescript
// Each feature is organized as a module
@Module({
  imports: [TypeOrmModule.forFeature([User, Workspace, Document]), UserModule, AuthModule],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceResolver, // GraphQL resolver
    WorkspaceGateway, // WebSocket handler
  ],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
```

##### Service Layer Pattern

```typescript
@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private userService: UserService,
    private permissionService: PermissionService,
    private cacheService: CacheService
  ) {}

  async createWorkspace(userId: string, data: CreateWorkspaceDto): Promise<Workspace> {
    // 1. Validate user permissions
    await this.permissionService.checkCanCreateWorkspace(userId);

    // 2. Create workspace
    const workspace = this.workspaceRepository.create({
      ...data,
      ownerId: userId,
    });

    // 3. Save to database
    const savedWorkspace = await this.workspaceRepository.save(workspace);

    // 4. Update cache
    await this.cacheService.invalidateUserWorkspaces(userId);

    // 5. Emit event for real-time updates
    this.eventEmitter.emit('workspace.created', savedWorkspace);

    return savedWorkspace;
  }
}
```

##### Real GraphQL API Implementation

Here's the actual workspace GraphQL resolver from the codebase:

```typescript
// File: packages/backend/server/src/core/workspaces/resolvers/workspace.ts
// Real GraphQL resolver with comprehensive workspace management

/**
 * Workspace resolver
 * Public apis rate limit: 10 req/m
 * Other rate limit: 120 req/m
 */
@Resolver(() => WorkspaceType)
export class WorkspaceResolver {
  constructor(
    private readonly ac: AccessController, // Permission system
    private readonly quota: QuotaService, // Usage limits
    private readonly models: Models, // Database models
    private readonly workspaceService: WorkspaceService,
    private readonly logger: AFFiNELogger
  ) {
    logger.setContext(WorkspaceResolver.name);
  }

  /**
   * Check if workspace is initialized (has root document)
   */
  @ResolveField(() => Boolean, {
    description: 'is current workspace initialized',
    complexity: 2, // GraphQL query complexity for rate limiting
  })
  async initialized(@Parent() workspace: WorkspaceType): Promise<boolean> {
    // Check if workspace has its root document created
    return this.models.doc.exists(workspace.id, workspace.id);
  }

  /**
   * Determine if this is a team workspace vs personal
   */
  @ResolveField(() => Boolean, {
    name: 'team',
    description: 'if workspace is team workspace',
    complexity: 2,
  })
  team(@Parent() workspace: WorkspaceType): boolean {
    return this.workspaceService.isTeamWorkspace(workspace.id);
  }

  /**
   * Get user's role in this workspace
   */
  @ResolveField(() => WorkspaceRole, {
    description: 'Role of current signed in user in workspace',
    complexity: 2,
  })
  async role(@CurrentUser() user: CurrentUser, @Parent() workspace: WorkspaceType): Promise<WorkspaceRole> {
    // May be pre-loaded from workspaces query for efficiency
    if ('role' in workspace) {
      return workspace.role;
    }

    // Get user's permissions in this workspace
    const { role } = await this.ac.user(user.id).workspace(workspace.id).permissions();

    return role ?? WorkspaceRole.External; // Default to external if no role
  }

  /**
   * Get detailed permissions map for this user in workspace
   */
  @ResolveField(() => WorkspacePermissions, {
    description: 'map of action permissions',
  })
  async permissions(@CurrentUser() user: CurrentUser, @Parent() workspace: WorkspaceType): Promise<Record<string, boolean>> {
    const { permissions } = await this.ac.user(user.id).workspace(workspace.id).permissions();

    // Convert dot notation to underscore for GraphQL field names
    return mapPermissionsToGraphqlPermissions(permissions);
  }

  /**
   * Get workspace quota and usage information
   */
  @ResolveField(() => WorkspaceQuotaType, {
    name: 'quota',
    description: 'quota of workspace',
    complexity: 2,
  })
  async workspaceQuota(@Parent() workspace: WorkspaceType): Promise<WorkspaceQuotaType> {
    const quota = await this.quota.getWorkspaceQuotaWithUsage(workspace.id);
    return {
      ...quota,
      // Add human-readable format (e.g., "1.2 GB of 5 GB used")
      humanReadable: this.quota.formatWorkspaceQuota(quota),
    };
  }

  /**
   * Get all workspaces accessible to current user
   */
  @Query(() => [WorkspaceType], {
    description: 'Get all accessible workspaces for current user',
    complexity: 2,
  })
  async workspaces(@CurrentUser() user: CurrentUser): Promise<WorkspaceType[]> {
    // Get user's roles across all workspaces
    const roles = await this.models.workspaceUser.getUserActiveRoles(user.id);

    // Create lookup map for efficiency
    const map = new Map(roles.map(({ workspaceId, type }) => [workspaceId, type]));

    // Get workspace details
    const workspaces = await this.models.workspace.findMany(roles.map(({ workspaceId }) => workspaceId));

    // Attach role information to each workspace
    return workspaces.map(workspace => ({
      ...workspace,
      permission: map.get(workspace.id), // Legacy field
      role: map.get(workspace.id), // Current field
    }));
  }

  /**
   * Get single workspace by ID with permission check
   */
  @Query(() => WorkspaceType, {
    description: 'Get workspace by id',
  })
  async workspace(@CurrentUser() user: CurrentUser, @Args('id') id: string): Promise<WorkspaceType> {
    // Check if user can read this workspace
    await this.ac.user(user.id).workspace(id).assert('Workspace.Read');

    const workspace = await this.models.workspace.get(id);

    if (!workspace) {
      throw new SpaceNotFound({ spaceId: id });
    }

    return workspace;
  }

  /**
   * Create a new workspace
   */
  @Mutation(() => WorkspaceType, {
    description: 'Create a new workspace',
  })
  async createWorkspace(
    @CurrentUser() user: CurrentUser,
    // Optional initial document (deprecated - use sync system instead)
    @Args({ name: 'init', type: () => GraphQLUpload, nullable: true })
    init: FileUpload | null
  ): Promise<WorkspaceType> {
    // Create workspace (user becomes owner automatically)
    const workspace = await this.models.workspace.create(user.id);

    // Handle optional initial document
    if (init) {
      // Convert upload stream to buffer
      const chunks: Uint8Array[] = [];
      try {
        for await (const chunk of init.createReadStream()) {
          chunks.push(chunk);
        }
      } catch (e) {
        this.logger.error('Failed to get file content from upload stream', e);
        chunks.length = 0;
      }
      const buffer = chunks.length ? Buffer.concat(chunks) : null;

      if (buffer) {
        // Create root document for workspace
        await this.models.doc.upsert({
          spaceId: workspace.id,
          docId: workspace.id, // Root doc has same ID as workspace
          blob: buffer, // Document content
          timestamp: Date.now(),
          editorId: user.id,
        });
      }
    }

    return workspace;
  }

  /**
   * Update workspace metadata
   */
  @Mutation(() => WorkspaceType, {
    description: 'Update workspace',
  })
  async updateWorkspace(
    @CurrentUser() user: CurrentUser,
    @Args({ name: 'input', type: () => UpdateWorkspaceInput })
    { id, ...updates }: UpdateWorkspaceInput
  ): Promise<WorkspaceType> {
    // Check permission to update workspace settings
    await this.ac.user(user.id).workspace(id).assert('Workspace.Settings.Update');

    return this.models.workspace.update(id, updates);
  }

  /**
   * Delete workspace and all its contents
   */
  @Mutation(() => Boolean)
  async deleteWorkspace(@CurrentUser() user: CurrentUser, @Args('id') id: string): Promise<boolean> {
    // Check permission to delete workspace
    await this.ac.user(user.id).workspace(id).assert('Workspace.Delete');

    // Delete workspace and cascade to all documents
    await this.models.workspace.delete(id);

    return true;
  }
}

/**
 * Convert dot notation permissions to GraphQL field names
 * Example: "Workspace.Read" -> "Workspace_Read"
 */
export function mapPermissionsToGraphqlPermissions<A extends string>(permission: Record<A, boolean>): Record<DotToUnderline<A>, boolean> {
  return Object.fromEntries(
    Object.entries(permission).map(([key, value]) => [
      key.replaceAll('.', '_'), // GraphQL doesn't allow dots in field names
      value,
    ])
  ) as Record<DotToUnderline<A>, boolean>;
}

// TypeScript utility to convert dot notation to underscore
export type DotToUnderline<T extends string> = T extends `${infer Prefix}.${infer Suffix}` ? `${Prefix}_${DotToUnderline<Suffix>}` : T;
```

##### User Database Model

Here's the actual user model with Argon2 password hashing:

```typescript
// File: packages/backend/server/src/models/user.ts
// Real user model with secure authentication and database operations

@Injectable()
export class UserModel extends BaseModel {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoHelper, // Argon2 password hashing
    private readonly event: EventBus // Event system
  ) {
    super();
  }

  /**
   * Sign in user with email and password
   * Uses Argon2 for secure password verification
   */
  async signIn(email: string, password: string): Promise<User> {
    // Find user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' }, // Case-insensitive
        deletedAt: null, // Only active users
      },
    });

    if (!user) {
      throw new WrongSignInCredentials();
    }

    // Check if user has a password set
    if (!user.password) {
      throw new WrongSignInMethod(); // User signed up with OAuth
    }

    // Verify password using Argon2
    const isPasswordValid = await this.crypto.verify(user.password, password);
    if (!isPasswordValid) {
      throw new WrongSignInCredentials();
    }

    // Remove password from returned object for security
    return omit(user, 'password');
  }

  /**
   * Create new user with secure password hashing
   */
  @Transactional() // Wrap in database transaction
  async create({ password, ...userData }: CreateUserInput): Promise<User> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: { equals: userData.email, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    if (existingUser) {
      throw new EmailAlreadyUsed();
    }

    // Hash password using Argon2
    const hashedPassword = password ? await this.crypto.encrypt(password) : null;

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        name: userData.name || userData.email.split('@')[0], // Default name
        avatarUrl: userData.avatarUrl || this.generateDefaultAvatar(userData.email),
      },
    });

    // Emit event for other services (e.g., send welcome email)
    this.event.emit('user.created', user);

    return omit(user, 'password');
  }

  /**
   * Update user with optional password change
   */
  @Transactional()
  async update(id: string, updates: UpdateUserInput): Promise<User> {
    // Hash new password if provided
    if (updates.password) {
      updates.password = await this.crypto.encrypt(updates.password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    });

    // Emit update event
    this.event.emit('user.updated', user);

    return omit(user, 'password');
  }

  /**
   * Soft delete user and handle owned workspaces
   */
  @Transactional()
  async delete(id: string): Promise<User> {
    // Check if user owns any team workspaces
    const ownedTeamWorkspaces = await this.prisma.workspace.findMany({
      where: {
        ownerId: id,
        type: WorkspaceType.Team,
        deletedAt: null,
      },
    });

    if (ownedTeamWorkspaces.length > 0) {
      throw new CannotDeleteAccountWithOwnedTeamWorkspace();
    }

    // Soft delete user
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: `${user.email}.deleted.${Date.now()}`, // Prevent email conflicts
      },
    });

    // Get list of owned workspace IDs for cleanup
    const ownedWorkspaces = await this.prisma.workspace.findMany({
      where: { ownerId: id },
      select: { id: true },
    });

    // Emit deletion event with owned workspace info
    this.event.emit('user.deleted', {
      ...user,
      ownedWorkspaces: ownedWorkspaces.map(w => w.id),
    });

    return omit(user, 'password');
  }

  /**
   * Find user by email (case-insensitive)
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        deletedAt: null,
      },
    });

    return user ? omit(user, 'password') : null;
  }

  /**
   * Get user by ID
   */
  async get(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? omit(user, 'password') : null;
  }

  /**
   * Search users for workspace invitations
   */
  async search(query: string, filter: UserFilter = {}): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [{ email: { contains: query, mode: 'insensitive' } }, { name: { contains: query, mode: 'insensitive' } }],
        deletedAt: null,
        disabled: filter.withDisabled ? undefined : false,
      },
      take: 20, // Limit results
    });

    return users.map(user => omit(user, 'password'));
  }

  /**
   * Generate default avatar URL based on email
   */
  private generateDefaultAvatar(email: string): string {
    // Use Gravatar or initials-based avatar
    const hash = this.crypto.md5(email.toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
  }
}

// Event declarations for type safety
declare global {
  interface Events {
    'user.created': User;
    'user.updated': User;
    'user.deleted': User & {
      ownedWorkspaces: Workspace['id'][];
    };
    'user.postCreated': User; // After creation is complete
  }
}
```

#### 3. Database Layer (Data Tier)

**Purpose**: Persistent data storage and retrieval

**Technology**: PostgreSQL with pgvector extension

**Database Design Principles**:

##### Normalized Schema Design

```sql
-- Proper foreign key relationships and constraints
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (workspace_id, user_id)
);
```

##### Performance Optimization

```sql
-- Indexes for common query patterns
CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_documents_workspace ON documents(workspace_id);
CREATE INDEX idx_documents_updated ON documents(updated_at DESC);

-- Partial indexes for specific conditions
CREATE INDEX idx_active_users ON users(id) WHERE deleted_at IS NULL;

-- Composite indexes for complex queries
CREATE INDEX idx_workspace_documents_updated
ON documents(workspace_id, updated_at DESC);
```

---

## Frontend Components

The frontend is built using **React 19**, the latest version of the popular library for creating interactive user interfaces. The architecture is designed around a component-based system that promotes reusability, maintainability, and type safety.

### Frontend Architecture Philosophy

#### Component-Driven Development

Every piece of the user interface is built as a self-contained component that can be tested, documented, and reused across the application.

```typescript
// Example of a reusable component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, size, disabled, onClick, children }: ButtonProps) {
  const className = `btn btn--${variant} btn--${size}`;

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

// Usage across the application
<Button variant="primary" size="medium" onClick={handleSave}>
  Save Document
</Button>
```

### Main Frontend Applications

#### 1. Web Application (`packages/frontend/apps/web/`)

**What it is**: The primary web application that runs in modern browsers with full functionality.

**Architecture Details**:

##### Single Page Application (SPA) Structure

```typescript
// App.tsx - Main application entry point
export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FrameworkRoot framework={frameworkProvider}>
        <CacheProvider value={cache}>
          <I18nProvider>
            <AffineContext store={getCurrentStore()}>
              <RouterProvider
                fallbackElement={<AppContainer fallback />}
                router={router}
                future={future}
              />
            </AffineContext>
          </I18nProvider>
        </CacheProvider>
      </FrameworkRoot>
    </Suspense>
  );
}
```

##### Routing System

```typescript
// router.tsx - Application routing configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <WorkspaceListPage />,
      },
      {
        path: 'workspace/:workspaceId',
        element: <WorkspaceLayout />,
        children: [
          {
            index: true,
            element: <WorkspaceDashboard />,
          },
          {
            path: 'doc/:docId',
            element: <DocumentEditor />,
          },
          {
            path: 'settings',
            element: <WorkspaceSettings />,
          },
        ],
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
]);
```

##### Actual Workspace Layout Component

Here's the real workspace layout implementation:

```typescript
// File: packages/frontend/core/src/desktop/pages/workspace/layouts/workspace-layout.tsx
// Real React component that manages the workspace layout and side effects

export const WorkspaceLayout = function WorkspaceLayout({
  children,
}: PropsWithChildren) {
  // Get the current workspace using dependency injection
  const currentWorkspace = useService(WorkspaceService).workspace;

  return (
    <SWRConfigProvider>
      {/* Global workspace dialogs (create, settings, etc.) */}
      <WorkspaceDialogs />

      {/* ---- Side-effect components that run in background ---- */}

      {/* Only show quota check for cloud workspaces */}
      {currentWorkspace?.flavour !== 'local' ? (
        <QuotaCheck workspaceMeta={currentWorkspace.meta} />
      ) : null}

      {/* AI login modal for AI features */}
      <AiLoginRequiredModal />

      {/* Workspace-level side effects (sync, telemetry, etc.) */}
      <WorkspaceSideEffects />

      {/* Peek view system for previewing documents without navigation */}
      <PeekViewManagerModal />

      {/* Dynamic document title based on current page */}
      <DocumentTitle />

      {/* Main workspace content */}
      <WorkspaceLayoutInner>{children}</WorkspaceLayoutInner>

      {/* AI assistant island (floating button) */}
      <AIIsland />

      {/* Universal React root for portals */}
      <uniReactRoot.Root />
    </SWRConfigProvider>
  );
};
```

##### Real Workbench System for Multi-Tab Management

```typescript
// File: packages/frontend/core/src/modules/workbench/view/workbench-root.tsx
// Real workbench system that manages tabs and views

export const WorkbenchRoot = memo(() => {
  const workbench = useService(WorkbenchService).workbench;

  // For debugging in development
  (window as any).workbench = workbench;

  // Get reactive list of open views/tabs
  const views = useLiveData(workbench.views$);
  const location = useLocation();

  // Extract workspace ID from URL path
  const basename = location.pathname.match(/\/workspace\/[^/]+/g)?.[0] ?? '/';

  // Render function for each view/tab
  const panelRenderer = useCallback((view: View) => {
    return <WorkbenchView view={view} />;
  }, []);

  // Handle drag-and-drop reordering of tabs
  const onMove = useCallback(
    (from: number, to: number) => {
      workbench.moveView(from, to);
    },
    [workbench]
  );

  return (
    <ViewIslandRegistryProvider>
      {/* Split view system for multiple tabs */}
      <SplitView
        className={styles.workbenchRootContainer}
        views={views}                    // Array of open views
        renderer={panelRenderer}         // How to render each view
        onMove={onMove}                 // Drag-and-drop handler
      />

      {/* Right sidebar for view-specific content */}
      <WorkbenchSidebar />
    </ViewIslandRegistryProvider>
  );
});
```

#### 2. Desktop Application (`packages/frontend/apps/electron/`)

**What it is**: A native desktop application that provides the full web experience with additional system-level features.

**Technology**: Built with **Electron**, which wraps the web application in a native container.

##### Electron Main Process

```typescript
// main/index.ts - Electron main process
import { app, BrowserWindow, ipcMain } from 'electron';

class ElectronApp {
  private mainWindow: BrowserWindow | null = null;

  async createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    // Load the React application
    if (isDevelopment) {
      await this.mainWindow.loadURL('http://localhost:8080');
    } else {
      await this.mainWindow.loadFile('dist/index.html');
    }
  }

  setupIPC() {
    // Handle file operations
    ipcMain.handle('file:open', async () => {
      const result = await dialog.showOpenDialog(this.mainWindow!, {
        filters: [{ name: 'Documents', extensions: ['md', 'txt', 'docx'] }],
      });
      return result;
    });

    // Handle window controls
    ipcMain.handle('window:minimize', () => {
      this.mainWindow?.minimize();
    });

    ipcMain.handle('window:maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });
  }
}
```

##### Preload Script for Security

```typescript
// preload/index.ts - Secure IPC bridge
import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (content: string) => ipcRenderer.invoke('file:save', content),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),

  // System info
  getSystemInfo: () => ipcRenderer.invoke('system:info'),
});
```

#### 3. Mobile Applications

##### iOS Application (`packages/frontend/apps/ios/`)

**Technology Stack**:

- **Capacitor**: Cross-platform native runtime
- **Swift**: Native iOS integration
- **React**: UI layer (same as web)

```swift
// iOS native functionality
import Capacitor

@objc(AffinePlugin)
public class AffinePlugin: CAPPlugin {

    @objc func shareDocument(_ call: CAPPluginCall) {
        guard let content = call.getString("content") else {
            call.reject("Content required")
            return
        }

        DispatchQueue.main.async {
            let activityVC = UIActivityViewController(
                activityItems: [content],
                applicationActivities: nil
            )

            self.bridge?.viewController?.present(activityVC, animated: true)
            call.resolve()
        }
    }

    @objc func getDeviceInfo(_ call: CAPPluginCall) {
        call.resolve([
            "platform": "ios",
            "version": UIDevice.current.systemVersion,
            "model": UIDevice.current.model
        ])
    }
}
```

##### Android Application (`packages/frontend/apps/android/`)

**Technology Stack**:

- **Capacitor**: Cross-platform native runtime
- **Kotlin**: Native Android integration
- **React**: UI layer (same as web)

```kotlin
// Android native functionality
@CapacitorPlugin(name = "Affine")
class AffinePlugin : Plugin() {

    @PluginMethod
    fun shareDocument(call: PluginCall) {
        val content = call.getString("content") ?: run {
            call.reject("Content required")
            return
        }

        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, content)
        }

        val chooser = Intent.createChooser(shareIntent, "Share document")
        activity.startActivity(chooser)
        call.resolve()
    }

    @PluginMethod
    fun getDeviceInfo(call: PluginCall) {
        val ret = JSObject()
        ret.put("platform", "android")
        ret.put("version", Build.VERSION.RELEASE)
        ret.put("model", Build.MODEL)
        call.resolve(ret)
    }
}
```

### Core Frontend Packages

#### Component Library (`packages/frontend/component/`)

**Purpose**: A comprehensive design system providing reusable, accessible UI components.

##### Design System Architecture

```typescript
// themes/index.ts - Design system foundation
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'monospace'],
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
    },
  },
};
```

##### Component Examples

```typescript
// components/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  onClick,
}: ButtonProps) => {
  const buttonClass = cn(
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    {
      'btn--loading': loading,
      'btn--disabled': disabled,
    }
  );

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      type="button"
    >
      {loading && <Spinner size="sm" />}
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__text">{children}</span>
    </button>
  );
};

// components/Modal/Modal.tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, title, size = 'md', children }: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`modal modal--${size}`}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        <div className="modal__body">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

##### Storybook Documentation

```typescript
// Button.stories.tsx - Component documentation
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and states.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
} as Meta<typeof Button>;

export const Primary: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Loading: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};
```

#### Core Application Logic (`packages/frontend/core/`)

**Purpose**: Contains the main application logic, business rules, and shared functionality.

##### Module Organization

```typescript
// modules/workspace/services/workspace.service.ts
@Injectable()
export class WorkspaceService {
  constructor(
    private graphqlClient: GraphQLClient,
    private cacheService: CacheService,
    private eventBus: EventBus
  ) {}

  async createWorkspace(input: CreateWorkspaceInput): Promise<Workspace> {
    try {
      const response = await this.graphqlClient.mutate({
        mutation: CREATE_WORKSPACE,
        variables: { input },
      });

      const workspace = response.data.createWorkspace;

      // Update local cache
      this.cacheService.updateWorkspaceList(workspace);

      // Emit event for other parts of the app
      this.eventBus.emit('workspace:created', workspace);

      return workspace;
    } catch (error) {
      throw new WorkspaceCreationError('Failed to create workspace', error);
    }
  }

  async getWorkspaces(): Promise<Workspace[]> {
    // Try cache first
    const cached = this.cacheService.getWorkspaces();
    if (cached) {
      return cached;
    }

    // Fetch from server
    const response = await this.graphqlClient.query({
      query: GET_WORKSPACES,
    });

    const workspaces = response.data.workspaces;
    this.cacheService.setWorkspaces(workspaces);

    return workspaces;
  }
}
```

##### Authentication Module

The frontend authentication system manages user sessions and integrates with the backend APIs:

```typescript
// File: packages/frontend/core/src/modules/auth/services/auth.service.ts
// Real authentication service that manages user sessions and token storage

@Injectable()
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    private graphqlClient: GraphQLClient,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {
    this.initializeAuth();
  }

  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const response = await this.graphqlClient.mutate({
        mutation: LOGIN,
        variables: { input: credentials },
      });

      const { user, accessToken, refreshToken } = response.data.login;

      // Store tokens securely
      await this.tokenStorage.setTokens({ accessToken, refreshToken });

      // Update current user
      this.currentUser$.next(user);

      // Redirect to workspace
      this.router.navigate(['/workspace']);

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout(): Promise<void> {
    // Clear tokens
    await this.tokenStorage.clearTokens();

    // Clear user state
    this.currentUser$.next(null);

    // Clear all caches
    this.cacheService.clearAll();

    // Redirect to login
    this.router.navigate(['/auth/login']);
  }

  get currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }
}
```

##### Actual Backend Authentication Service

Here's the real authentication service from the backend:

```typescript
// File: packages/backend/server/src/core/auth/service.ts
// Real backend authentication service with session management and security

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  // Cookie configuration for secure session management
  readonly cookieOptions: CookieOptions = {
    sameSite: 'lax', // CSRF protection - only send with same-site requests
    httpOnly: true, // Prevent XSS - not accessible via JavaScript
    path: '/', // Available for entire application
    secure: this.config.server.https, // Only over HTTPS in production
  };

  // Cookie names used for session management
  static readonly sessionCookieName = 'affine_session';
  static readonly userCookieName = 'affine_user_id';

  constructor(
    private readonly config: Config,
    private readonly models: Models, // Database models
    private readonly mailer: Mailer, // Email service
    private readonly feature: FeatureService
  ) {}

  async onApplicationBootstrap() {
    // Create development users in dev environment
    if (env.dev) {
      await createDevUsers(this.models);
    }
  }

  /**
   * Check if user can sign in (early access, whitelist, etc.)
   */
  async canSignIn(email: string): Promise<boolean> {
    return await this.feature.canEarlyAccess(email);
  }

  /**
   * Sign in with email and password
   * Uses Argon2 for secure password verification
   */
  async signIn(email: string, password: string): Promise<CurrentUser> {
    // Delegate to user model for actual authentication
    return this.models.user.signIn(email, password).then(sessionUser);
  }

  /**
   * Sign out user(s) from session
   * @param sessionId - Session to sign out from
   * @param userId - Specific user (optional, signs out all if not provided)
   */
  async signOut(sessionId: string, userId?: string): Promise<void> {
    if (!userId) {
      // Sign out all users in the session
      await this.models.session.deleteSession(sessionId);
    } else {
      // Sign out specific user from session
      await this.models.session.deleteUserSessions(userId, sessionId);
    }
  }

  /**
   * Get user session with validation
   * Supports multiple users per session (user switching)
   */
  async getUserSession(sessionId: string, userId?: string): Promise<{ user: CurrentUser; session: UserSession } | null> {
    // Get all users in this session
    const sessions = await this.getUserSessions(sessionId);

    if (!sessions.length) {
      return null;
    }

    let userSession: UserSession | undefined;

    // Try to find user provided in cookies
    if (userId) {
      userSession = sessions.find(s => s.userId === userId);
    }

    // Fallback to the most recent session if user not found
    if (!userSession) {
      userSession = sessions.at(-1)!; // Last active user
    }

    // Get full user data from database
    const user = await this.models.user.get(userSession.userId);

    if (!user) {
      return null;
    }

    return {
      user: sessionUser(user), // Convert to session format
      session: userSession,
    };
  }

  /**
   * Create or refresh user session with TTL
   */
  async createUserSession(userId: string, sessionId?: string, ttl?: number): Promise<UserSession> {
    return await this.models.session.createOrRefreshUserSession(userId, sessionId, ttl);
  }

  /**
   * Extract session info from HTTP request
   * Supports both cookies and Authorization header
   */
  getSessionOptionsFromRequest(req: Request): { sessionId?: string; userId?: string } {
    // Try to get session ID from cookie first
    let sessionId: string | undefined = req.cookies[AuthService.sessionCookieName];

    // Fallback to Authorization header (for API clients)
    if (!sessionId && req.headers.authorization) {
      sessionId = extractTokenFromHeader(req.headers.authorization);
    }

    // Get user ID for multi-user sessions
    const userId: string | undefined = req.cookies[AuthService.userCookieName] || req.headers[AuthService.userCookieName.replaceAll('_', '-')];

    return {
      sessionId,
      userId,
    };
  }

  /**
   * Set secure authentication cookies
   * Creates session if none exists
   */
  async setCookies(req: Request, res: Response, userId: string): Promise<void> {
    const { sessionId } = this.getSessionOptionsFromRequest(req);

    // Create or reuse session
    const userSession = await this.createUserSession(userId, sessionId);

    // Set session cookie with expiration
    res.cookie(AuthService.sessionCookieName, userSession.sessionId, {
      ...this.cookieOptions,
      expires: userSession.expiresAt ?? void 0,
    });

    // Set user cookie for fast user switching
    this.setUserCookie(res, userId);
  }

  /**
   * Handle password change with security validation
   */
  async changePassword(id: string, newPassword: string): Promise<Omit<User, 'password'>> {
    // Password will be hashed using Argon2 in the user model
    return this.models.user.update(id, { password: newPassword });
  }

  /**
   * Send password reset email
   */
  async sendChangePasswordEmail(email: string, callbackUrl: string): Promise<void> {
    return await this.mailer.send({
      name: 'ChangePassword', // Email template name
      to: email,
      props: {
        url: callbackUrl, // Reset link with token
      },
    });
  }

  /**
   * Send sign-in email with OTP
   */
  async sendSignInEmail(email: string, link: string, otp: string, signUp: boolean): Promise<void> {
    return await this.mailer.send({
      name: signUp ? 'SignUp' : 'SignIn',
      to: email,
      props: {
        url: link, // Magic link for one-click sign-in
        otp, // One-time password as backup
      },
    });
  }
}

/**
 * Convert user database record to session format
 * Removes sensitive data and adds computed properties
 */
export function sessionUser(user: Pick<User, 'id' | 'email' | 'avatarUrl' | 'name' | 'emailVerifiedAt' | 'disabled'> & { password?: string | null }): CurrentUser {
  // Use pick to avoid unexpected fields
  return assign(pick(user, 'id', 'email', 'avatarUrl', 'name', 'disabled'), {
    hasPassword: user.password !== null, // Whether user has set a password
    emailVerified: user.emailVerifiedAt !== null, // Whether email is verified
  });
}

/**
 * Extract Bearer token from Authorization header
 */
function extractTokenFromHeader(authorization: string): string | undefined {
  if (!/^Bearer\s/i.test(authorization)) {
    return;
  }
  return authorization.substring(7); // Remove "Bearer " prefix
}
```

---

## Backend Components

The backend is built using **NestJS**, a powerful Node.js framework that provides enterprise-grade structure and dependency injection. The architecture follows domain-driven design principles with clear separation of concerns.

### Backend Architecture Principles

#### Dependency Injection Pattern

NestJS uses decorators and dependency injection to manage components and their dependencies:

```typescript
// Example of dependency injection
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private userService: UserService,
    private permissionService: PermissionService,
    private eventEmitter: EventEmitter2
  ) {}

  async createDocument(userId: string, data: CreateDocumentDto): Promise<Document> {
    // All dependencies are automatically injected
    const user = await this.userService.findById(userId);
    await this.permissionService.checkCanCreate(user, 'document');

    const document = this.documentRepository.create({
      ...data,
      authorId: userId,
    });

    const savedDocument = await this.documentRepository.save(document);

    // Emit event for other services to handle
    this.eventEmitter.emit('document.created', savedDocument);

    return savedDocument;
  }
}
```

#### Module-Based Architecture

The application is organized into functional modules, each handling a specific domain:

```typescript
// Example module structure
@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentVersion]), PermissionModule, UserModule],
  controllers: [DocumentController, DocumentResolver],
  providers: [DocumentService, DocumentVersionService, DocumentSearchService],
  exports: [DocumentService],
})
export class DocumentModule {}
```

### Server Package (`packages/backend/server/`)

**What it is**: The main server application that provides APIs, handles business logic, and manages data flow.

#### Core Modules:

##### Authentication System (`src/core/auth/`)

**Purpose**: Comprehensive user authentication and authorization system.

**Architecture Details**:

###### JWT Token Management

```typescript
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService
  ) {}

  async login(credentials: LoginDto): Promise<AuthResult> {
    // 1. Validate credentials
    const user = await this.validateCredentials(credentials);

    // 2. Generate tokens
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    // 3. Store refresh token securely
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  private async validateCredentials(credentials: LoginDto): Promise<User> {
    const user = await this.userService.findByEmail(credentials.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Use Argon2 for secure password verification
    const isPasswordValid = await argon2.verify(user.passwordHash, credentials.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
```

###### Password Security with Argon2

```typescript
@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    // Argon2id is the recommended variant for password hashing
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3, // 3 iterations
      parallelism: 1, // Single-threaded
    });
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      return false;
    }
  }
}
```

###### Role-Based Access Control (RBAC)

```typescript
// Define roles and permissions
export enum Permission {
  READ_WORKSPACE = 'read:workspace',
  WRITE_WORKSPACE = 'write:workspace',
  DELETE_WORKSPACE = 'delete:workspace',
  MANAGE_MEMBERS = 'manage:members',
}

export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

// Permission guard decorator
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>('permissions', [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.hasPermissions(user, requiredPermissions);
  }

  private hasPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every(permission => user.roles.some(role => this.roleHasPermission(role, permission)));
  }
}

// Usage in controllers
@Controller('workspaces')
export class WorkspaceController {
  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Permissions(Permission.WRITE_WORKSPACE)
  async createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto);
  }
}
```

##### Document Storage (`src/core/doc/`)

**Purpose**: Manages document lifecycle, versioning, and storage with high performance and reliability.

**Key Features**:

###### Document CRUD Operations

```typescript
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private documentVersionService: DocumentVersionService,
    private storageService: StorageService,
    private searchService: SearchService
  ) {}

  async createDocument(userId: string, data: CreateDocumentDto): Promise<Document> {
    return this.documentRepository.manager.transaction(async manager => {
      // 1. Create document record
      const document = manager.create(Document, {
        title: data.title,
        content: data.content,
        authorId: userId,
        workspaceId: data.workspaceId,
      });

      const savedDocument = await manager.save(document);

      // 2. Create initial version
      await this.documentVersionService.createVersion(savedDocument, {
        content: data.content,
        comment: 'Initial version',
        authorId: userId,
      });

      // 3. Index for search
      await this.searchService.indexDocument(savedDocument);

      return savedDocument;
    });
  }

  async updateDocument(documentId: string, userId: string, update: UpdateDocumentDto): Promise<Document> {
    return this.documentRepository.manager.transaction(async manager => {
      const document = await manager.findOne(Document, {
        where: { id: documentId },
      });

      if (!document) {
        throw new NotFoundException('Document not found');
      }

      // Store previous content as a version
      if (update.content && update.content !== document.content) {
        await this.documentVersionService.createVersion(document, {
          content: document.content,
          comment: update.versionComment || 'Auto-saved version',
          authorId: userId,
        });
      }

      // Update document
      Object.assign(document, update, { updatedAt: new Date() });
      const savedDocument = await manager.save(document);

      // Update search index
      await this.searchService.updateDocument(savedDocument);

      return savedDocument;
    });
  }
}
```

###### Version Control System

```typescript
@Injectable()
export class DocumentVersionService {
  constructor(
    @InjectRepository(DocumentVersion)
    private versionRepository: Repository<DocumentVersion>,
    private compressionService: CompressionService
  ) {}

  async createVersion(document: Document, versionData: CreateVersionDto): Promise<DocumentVersion> {
    // Compress content for storage efficiency
    const compressedContent = await this.compressionService.compress(JSON.stringify(versionData.content));

    const version = this.versionRepository.create({
      documentId: document.id,
      content: compressedContent,
      contentHash: this.calculateHash(versionData.content),
      comment: versionData.comment,
      authorId: versionData.authorId,
      size: compressedContent.length,
    });

    return this.versionRepository.save(version);
  }

  async getVersionHistory(documentId: string): Promise<DocumentVersion[]> {
    return this.versionRepository.find({
      where: { documentId },
      order: { createdAt: 'DESC' },
      take: 50, // Limit to recent 50 versions
    });
  }

  async restoreVersion(documentId: string, versionId: string): Promise<Document> {
    const version = await this.versionRepository.findOne({
      where: { id: versionId, documentId },
    });

    if (!version) {
      throw new NotFoundException('Version not found');
    }

    // Decompress content
    const content = await this.compressionService.decompress(version.content);
    const parsedContent = JSON.parse(content);

    // Update document with version content
    return this.documentService.updateDocument(documentId, version.authorId, {
      content: parsedContent,
      versionComment: `Restored from version ${version.id}`,
    });
  }
}
```

##### Workspace Management (`src/core/workspaces/`)

**Purpose**: Handles workspace creation, member management, and collaborative features.

**Key Features**:

###### Workspace Lifecycle Management

```typescript
@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private memberRepository: Repository<WorkspaceMember>,
    private permissionService: PermissionService,
    private invitationService: InvitationService
  ) {}

  async createWorkspace(userId: string, data: CreateWorkspaceDto): Promise<Workspace> {
    return this.workspaceRepository.manager.transaction(async manager => {
      // 1. Create workspace
      const workspace = manager.create(Workspace, {
        name: data.name,
        description: data.description,
        ownerId: userId,
        settings: {
          isPublic: false,
          allowInvitations: true,
          defaultRole: Role.MEMBER,
        },
      });

      const savedWorkspace = await manager.save(workspace);

      // 2. Add creator as owner
      const ownerMembership = manager.create(WorkspaceMember, {
        workspaceId: savedWorkspace.id,
        userId,
        role: Role.OWNER,
        joinedAt: new Date(),
      });

      await manager.save(ownerMembership);

      return savedWorkspace;
    });
  }

  async inviteMember(workspaceId: string, inviterUserId: string, inviteData: InviteMemberDto): Promise<Invitation> {
    // 1. Check permissions
    await this.permissionService.checkCanInvite(inviterUserId, workspaceId);

    // 2. Check if user already exists
    let invitedUser = await this.userService.findByEmail(inviteData.email);

    if (!invitedUser) {
      // Create pending user account
      invitedUser = await this.userService.createPendingUser(inviteData.email);
    }

    // 3. Create invitation
    return this.invitationService.createInvitation({
      workspaceId,
      invitedUserId: invitedUser.id,
      inviterUserId,
      role: inviteData.role,
      message: inviteData.message,
    });
  }
}
```

###### Real-time Collaboration Gateway

```typescript
@WebSocketGateway({
  namespace: 'collaboration',
  cors: {
    origin: '*',
  },
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, UserSession>();

  constructor(
    private authService: AuthService,
    private documentService: DocumentService
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Authenticate user from token
      const token = client.handshake.auth.token;
      const user = await this.authService.validateToken(token);

      // Store user session
      this.connectedUsers.set(client.id, {
        userId: user.id,
        socketId: client.id,
        connectedAt: new Date(),
      });

      client.emit('connected', { userId: user.id });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join-document')
  async handleJoinDocument(@ConnectedSocket() client: Socket, @MessageBody() data: { documentId: string }) {
    const userSession = this.connectedUsers.get(client.id);
    if (!userSession) return;

    // Check if user can access document
    const canAccess = await this.documentService.canUserAccess(userSession.userId, data.documentId);

    if (!canAccess) {
      client.emit('error', { message: 'Access denied' });
      return;
    }

    // Join document room
    client.join(`document:${data.documentId}`);

    // Notify other users
    client.to(`document:${data.documentId}`).emit('user-joined', {
      userId: userSession.userId,
      documentId: data.documentId,
    });
  }

  @SubscribeMessage('document-operation')
  async handleDocumentOperation(@ConnectedSocket() client: Socket, @MessageBody() data: { documentId: string; operation: any }) {
    const userSession = this.connectedUsers.get(client.id);
    if (!userSession) return;

    // Validate and apply operation
    const validatedOperation = await this.documentService.validateOperation(data.documentId, userSession.userId, data.operation);

    if (validatedOperation) {
      // Broadcast to all users in document room
      this.server.to(`document:${data.documentId}`).emit('operation', {
        operation: validatedOperation,
        authorId: userSession.userId,
      });
    }
  }
}
```

### Native Packages (`packages/backend/native/`)

**Purpose**: High-performance Rust code that handles computationally intensive operations and system-level functionality.

**Architecture**: Uses **N-API** (Node-API) to create native Node.js addons written in Rust.

#### Why Rust for Backend Operations

1. **Memory Safety**: Prevents crashes and security vulnerabilities
2. **Performance**: Near C/C++ performance for CPU-intensive tasks
3. **Concurrency**: Excellent support for parallel processing
4. **Ecosystem**: Rich package ecosystem (crates.io)

#### File Processing Module

```rust
// Native file processing in Rust
use napi::{bindgen_prelude::*, Result as NapiResult};
use std::path::Path;

#[napi]
pub struct DocumentProcessor {
    config: ProcessingConfig,
}

#[napi]
impl DocumentProcessor {
    #[napi(constructor)]
    pub fn new(config_json: String) -> NapiResult<Self> {
        let config: ProcessingConfig = serde_json::from_str(&config_json)
            .map_err(|e| napi::Error::from_reason(format!("Invalid config: {}", e)))?;

        Ok(Self { config })
    }

    #[napi]
    pub async fn process_docx(&self, file_path: String) -> NapiResult<String> {
        let path = Path::new(&file_path);

        // Parse DOCX file
        let document = parse_docx_file(path)
            .map_err(|e| napi::Error::from_reason(format!("Parse error: {}", e)))?;

        // Convert to AFFiNE block format
        let blocks = convert_to_blocks(&document, &self.config);

        // Serialize as JSON
        serde_json::to_string(&blocks)
            .map_err(|e| napi::Error::from_reason(format!("Serialization error: {}", e)))
    }

    #[napi]
    pub fn extract_text_content(&self, content: String) -> NapiResult<String> {
        // High-performance text extraction
        let blocks: Vec<Block> = serde_json::from_str(&content)
            .map_err(|e| napi::Error::from_reason(format!("Parse error: {}", e)))?;

        let text = extract_text_from_blocks(&blocks);
        Ok(text)
    }
}

// High-performance text processing
fn extract_text_from_blocks(blocks: &[Block]) -> String {
    blocks
        .par_iter() // Parallel processing
        .filter_map(|block| match &block.block_type {
            BlockType::Paragraph { text } => Some(text.as_str()),
            BlockType::Heading { text, .. } => Some(text.as_str()),
            BlockType::List { items } => Some(
                items.iter()
                    .map(|item| item.text.as_str())
                    .collect::<Vec<_>>()
                    .join(" ")
                    .leak() // Convert to &str
            ),
            _ => None,
        })
        .collect::<Vec<_>>()
        .join("\n")
}
```

#### Y-Octo CRDT Implementation

```rust
// High-performance CRDT operations
#[napi]
pub struct YOctoDocument {
    inner: Arc<RwLock<y_octo::Doc>>,
}

#[napi]
impl YOctoDocument {
    #[napi(constructor)]
    pub fn new() -> Self {
        Self {
            inner: Arc::new(RwLock::new(y_octo::Doc::new())),
        }
    }

    #[napi]
    pub fn apply_update(&self, update: Buffer) -> NapiResult<()> {
        let mut doc = self.inner.write().unwrap();

        doc.apply_update(&update)
            .map_err(|e| napi::Error::from_reason(format!("Update error: {}", e)))?;

        Ok(())
    }

    #[napi]
    pub fn get_state_vector(&self) -> Buffer {
        let doc = self.inner.read().unwrap();
        doc.state_vector().into()
    }

    #[napi]
    pub fn get_update(&self, state_vector: Buffer) -> Buffer {
        let doc = self.inner.read().unwrap();
        doc.get_update(&state_vector).into()
    }

    #[napi]
    pub fn insert_text(&self, position: u32, text: String) -> NapiResult<Buffer> {
        let mut doc = self.inner.write().unwrap();

        let text_ref = doc.get_or_insert_text("content");
        let operation = text_ref.insert(&mut doc, position, &text);

        Ok(doc.encode_state_as_update(&operation).into())
    }
}
```

---

## BlockSuite - The Editor Engine

### What BlockSuite Is

**BlockSuite** is the core document editor engine that powers AFFiNE's rich text editing, visual canvas, and collaborative features. It's built on a **block-based architecture** where every piece of content is represented as a self-contained "block" that can be rendered, edited, and synchronized independently.

### Core Architecture Components

#### 1. Block System (`blocksuite/framework/store/src/model/block/block.ts`)

Every element in a document is a **Block** - the fundamental unit of content:

```typescript
// File: blocksuite/framework/store/src/model/block/block.ts
// This defines the core Block class that represents any piece of content

export type BlockViewType = 'bypass' | 'display' | 'hidden';

export class Block {
  // SyncController handles Y-Octo CRDT synchronization for real-time collaboration
  private readonly _syncController: SyncController | FlatSyncController;

  // How this block should be displayed (visible, hidden, bypass rendering)
  blockViewType: BlockViewType = 'display';

  // Get the block type/category (paragraph, image, table, etc.)
  get flavour() {
    return this._syncController.flavour;
  }

  // Unique identifier for this block across all clients
  get id() {
    return this._syncController.id;
  }

  // The actual data model containing block content and properties
  get model() {
    return this._syncController.model;
  }

  constructor(
    readonly schema: Schema, // Defines what properties this block type can have
    readonly yBlock: YBlock, // Y-Octo CRDT wrapper for collaborative editing
    readonly doc?: Store, // Document store this block belongs to
    readonly options: BlockOptions = {}
  ) {
    // Set up change detection for real-time collaboration
    const onChange = !options.onChange
      ? undefined
      : (key: string, isLocal: boolean) => {
          if (!this._syncController || !this.model) {
            return;
          }
          // Notify when block properties change (text content, position, etc.)
          options.onChange?.(this, key, isLocal);
        };

    // Get the block type from the Y-Octo document
    const flavour = yBlock.get('sys:flavour') as string;
    const blockSchema = this.schema.get(flavour);

    // Choose sync controller based on data structure
    if (blockSchema?.model.isFlatData) {
      // For simple blocks (text, dividers) - flat data structure
      this._syncController = new FlatSyncController(schema, yBlock, doc, onChange);
    } else {
      // For complex blocks (tables, databases) - nested data structure
      this._syncController = new SyncController(schema, yBlock, doc, onChange);
    }
  }
}
```

#### 2. Store System (`blocksuite/framework/store/src/model/store/store.ts`)

The **Store** manages the entire document state and block relationships:

```typescript
// File: blocksuite/framework/store/src/model/store/store.ts
// Core store class that manages blocks and their lifecycle in BlockSuite

/**
 * Core store class that manages blocks and their lifecycle in BlockSuite
 * @remarks
 * The Store class is responsible for managing the lifecycle of blocks, handling transactions,
 * and maintaining the block tree structure.
 * A store is a piece of data created from one or a part of a Y.Doc.
 */
export class Store {
  /** Internal extensions for selection, history, etc. */
  readonly userExtensions: ExtensionType[];

  /**
   * Group of disposable resources managed by the store
   * Used for cleanup when store is destroyed
   */
  disposableGroup = new DisposableGroup();

  // Service provider for dependency injection
  private readonly _provider: ServiceProvider;

  // Whether operations should be wrapped in transactions
  private _shouldTransact = true;

  // Y-Octo document for CRDT synchronization
  private readonly _doc: Doc;

  // Map of all blocks in this document, keyed by block ID
  private readonly _blocks = signal<Record<string, Block>>({});

  // CRUD operations helper for document operations
  private readonly _crud: DocCRUD;

  // Query system for finding blocks
  private readonly _query: Query = {
    match: [],
    mode: 'loose',
  };

  // Whether this store is read-only (view mode)
  private readonly _readonly = signal(false);

  // Computed signal - true if document has no blocks
  private readonly _isEmpty = computed(() => {
    return this.root?.isEmpty() ?? true;
  });

  // Schema defining all available block types and their properties
  private readonly _schema: Schema;

  /**
   * Get the unique identifier of this document store
   */
  get id() {
    return this._doc.id;
  }

  /**
   * Get the root block of the document (usually a 'root' flavour block)
   * All other blocks are children of this root block
   */
  get root(): BlockModel | null {
    // Find the root block in the document
    const rootId = this._doc.spaces.get('blocks')?.get('root');
    return rootId ? this.getBlock(rootId) : null;
  }

  /**
   * Add a new block to the document
   * @param flavour - The block type (paragraph, image, etc.)
   * @param blockProps - Initial properties for the block
   * @param parent - Parent block (defaults to root)
   * @param parentIndex - Position in parent's children
   */
  addBlock<T extends BlockModel = BlockModel>(flavour: string, blockProps: Partial<BlockProps> = {}, parent?: string | BlockModel, parentIndex?: number): string {
    // Start a transaction for this operation
    return this.captureSync(() => {
      // Generate unique ID for new block
      const blockId = nanoid();

      // Get parent block (default to root)
      const parentModel = this._getParentModel(parent);

      // Create block with schema validation
      const schema = this._schema.get(flavour);
      if (!schema) {
        throw new Error(`Block flavour "${flavour}" not found in schema`);
      }

      // Create Y-Octo block for CRDT synchronization
      const yBlock = this._doc.getMap('blocks').set(blockId, new Y.Map());
      yBlock.set('sys:flavour', flavour);
      yBlock.set('sys:id', blockId);

      // Set initial properties
      Object.entries(blockProps).forEach(([key, value]) => {
        yBlock.set(key, value);
      });

      // Add to parent's children
      if (parentModel) {
        const children = parentModel.children;
        const insertIndex = parentIndex ?? children.length;
        children.splice(insertIndex, 0, blockId);
      }

      // Create Block instance and add to store
      const block = new Block(this._schema, yBlock, this);
      this._blocks.value[blockId] = block;

      // Emit events for real-time collaboration
      this.slots.blockAdded.emit({ blockId, flavour, model: block.model });

      return blockId;
    });
  }

  /**
   * Delete a block and all its descendants
   * @param blockId - ID of block to delete
   */
  deleteBlock(blockId: string): void {
    this.captureSync(() => {
      const block = this.getBlock(blockId);
      if (!block) return;

      // Recursively delete all children first
      [...block.model.children].forEach(childId => {
        this.deleteBlock(childId);
      });

      // Remove from parent's children array
      const parent = this.getParent(blockId);
      if (parent) {
        const index = parent.children.indexOf(blockId);
        if (index >= 0) {
          parent.children.splice(index, 1);
        }
      }

      // Remove from Y-Octo document
      this._doc.getMap('blocks').delete(blockId);

      // Remove from local store
      delete this._blocks.value[blockId];

      // Emit events
      this.slots.blockDeleted.emit({ blockId, model: block.model });
    });
  }

  /**
   * Wrap operations in a transaction for atomic updates
   * All changes in the callback will be applied as a single operation
   */
  captureSync<T>(fn: () => T): T {
    if (!this._shouldTransact) {
      return fn();
    }

    // Use Y-Octo transaction for atomic operations
    return this._doc.transact(fn);
  }
}
```

#### 3. Block Rendering System (`blocksuite/framework/std/src/view/element/lit-host.ts`)

The **EditorHost** renders blocks as interactive web components:

```typescript
// File: blocksuite/framework/std/src/view/element/lit-host.ts
// Main editor host that renders all blocks and manages the editor UI

// Check if a widget should be displayed for a specific block type
function isMatchFlavour(widgetFlavour: string, block: BlockModel) {
  // Widgets can be attached to specific block types
  // For example, a formatting toolbar widget only shows for text blocks
  return block.flavour === widgetFlavour;
}

@requiredProperties({
  store: PropTypes.instanceOf(Store), // Document store
  std: PropTypes.object, // Standard services
})
export class EditorHost extends SignalWatcher(WithDisposable(ShadowlessElement)) {
  static override styles = css`
    editor-host {
      outline: none; /* Remove browser focus outline */
      isolation: isolate; /* Create new stacking context */
      display: block; /* Block-level element */
      height: 100%; /* Fill container */
    }
  `;

  /**
   * Core rendering function - converts a block model to HTML
   * This is called for every block in the document
   */
  private readonly _renderModel = (model: BlockModel): TemplateResult => {
    const { flavour } = model; // Block type (paragraph, image, etc.)

    // Get the Block instance from the store
    const block = this.store.getBlock(model.id);
    if (!block || block.blockViewType === 'hidden') {
      return html`${nothing}`; // Don't render hidden blocks
    }

    // Get schema and view component for this block type
    const schema = this.store.schema.flavourSchemaMap.get(flavour);
    const view = this.std.getView(flavour);
    if (!schema || !view) {
      console.warn(`Cannot find render flavour ${flavour}.`);
      return html`${nothing}`;
    }

    // Get all widgets that should be displayed with this block
    const widgetViews = this.std.provider.getAll(WidgetViewIdentifier);
    const widgets = Array.from(widgetViews.entries()).reduce(
      (mapping, [key, tag]) => {
        const [widgetFlavour, id] = key.split('|');

        // Only include widgets that match this block type
        if (isMatchFlavour(widgetFlavour, model)) {
          // Create widget HTML template
          const template = html`<${tag} ${unsafeStatic(WIDGET_ID_ATTR)}=${id}></${tag}>`;
          mapping[id] = template;
        }
        return mapping;
      },
      {} as Record<string, TemplateResult>
    );

    // Get the HTML tag for this block type
    const tag = typeof view === 'function' ? view(model) : view;

    // Render the block with its widgets
    return html`<${tag}
      ${unsafeStatic(BLOCK_ID_ATTR)}=${model.id}
      .widgets=${widgets}
      .viewType=${block.blockViewType}
    ></${tag}>`;
  };

  /**
   * Render all children of a block
   * Used for nested block structures (lists, tables, etc.)
   */
  renderChildren = (model: BlockModel, filter?: (model: BlockModel) => boolean): TemplateResult => {
    return html`${repeat(
      model.children.filter(filter ?? (() => true)),
      child => child.id, // Use block ID as key for efficient updates
      child => this._renderModel(child) // Render each child block
    )}`;
  };

  // Shortcuts to commonly used services
  get command(): CommandManager {
    return this.std.command; // Command system for undo/redo, formatting
  }

  get event(): UIEventDispatcher {
    return this.std.event; // Event handling for keyboard, mouse
  }

  get selection(): SelectionManager {
    return this.std.selection; // Text selection and cursor management
  }

  /**
   * Main render method - renders the entire document
   */
  override render() {
    const { store } = this;
    if (!store.root) {
      // No root block - empty document
      return html`<div class="empty-editor">Start typing...</div>`;
    }

    // Render from root block down
    return this._renderModel(store.root);
  }
}
```

#### 4. Block Schema System (`blocksuite/affine/all/src/schemas.ts`)

Block schemas define the structure and properties of different block types:

```typescript
// File: blocksuite/affine/all/src/schemas.ts
// Definition of all built-in block types available in AFFiNE

// Import all block model schemas
import { DataViewBlockSchema } from '@blocksuite/affine-block-data-view';
import { SurfaceBlockSchema } from '@blocksuite/affine-block-surface';
import {
  AttachmentBlockSchema, // File attachments (PDF, images, etc.)
  BookmarkBlockSchema, // Web page bookmarks
  CalloutBlockSchema, // Highlighted text boxes
  CodeBlockSchema, // Syntax-highlighted code
  DatabaseBlockSchema, // Structured data tables
  DividerBlockSchema, // Horizontal lines
  EdgelessTextBlockSchema, // Text on infinite canvas
  EmbedFigmaBlockSchema, // Embedded Figma designs
  EmbedGithubBlockSchema, // Embedded GitHub content
  EmbedHtmlBlockSchema, // Custom HTML blocks
  EmbedLinkedDocBlockSchema, // Links to other documents
  EmbedLoomBlockSchema, // Embedded Loom videos
  EmbedSyncedDocBlockSchema, // Synced document blocks
  EmbedYoutubeBlockSchema, // Embedded YouTube videos
  FrameBlockSchema, // Canvas frames
  ImageBlockSchema, // Images with captions
  LatexBlockSchema, // Mathematical formulas
  ListBlockSchema, // Bulleted and numbered lists
  NoteBlockSchema, // Note containers
  ParagraphBlockSchema, // Text paragraphs
  RootBlockSchema, // Root document container
  SurfaceRefBlockSchema, // References to canvas elements
  TableBlockSchema, // Tables with rows/columns
} from '@blocksuite/affine-model';
import type { BlockSchema } from '@blocksuite/store';

/**
 * Built-in first party block models built for AFFiNE
 * Order matters - blocks higher in the list have higher priority
 */
export const AffineSchemas: z.infer<typeof BlockSchema>[] = [
  // Basic content blocks
  CodeBlockSchema, // Code with syntax highlighting
  ParagraphBlockSchema, // Regular text paragraphs
  RootBlockSchema, // Document root container
  ListBlockSchema, // Bulleted/numbered lists
  NoteBlockSchema, // Note containers for grouping
  DividerBlockSchema, // Visual separators

  // Media blocks
  ImageBlockSchema, // Images with captions and resizing
  AttachmentBlockSchema, // File attachments (PDF, Word, etc.)

  // Canvas blocks (for whiteboard/drawing mode)
  SurfaceBlockSchema, // Infinite canvas surface
  FrameBlockSchema, // Frames within canvas
  EdgelessTextBlockSchema, // Text elements on canvas
  SurfaceRefBlockSchema, // References to canvas elements

  // Data blocks
  DatabaseBlockSchema, // Structured databases
  DataViewBlockSchema, // Database views (table, kanban, etc.)
  TableBlockSchema, // Simple tables

  // Embed blocks (external content)
  BookmarkBlockSchema, // Web page previews
  EmbedYoutubeBlockSchema, // YouTube video embeds
  EmbedFigmaBlockSchema, // Figma design embeds
  EmbedGithubBlockSchema, // GitHub repo/gist embeds
  EmbedHtmlBlockSchema, // Custom HTML content
  EmbedLinkedDocBlockSchema, // Links to other AFFiNE docs
  EmbedSyncedDocBlockSchema, // Synced document sections
  EmbedLoomBlockSchema, // Loom video embeds

  // Special blocks
  LatexBlockSchema, // Mathematical formulas
  CalloutBlockSchema, // Highlighted callout boxes
];

// Example of what a simple block schema looks like
const ExampleParagraphSchema = {
  flavour: 'affine:paragraph', // Unique block type identifier
  props: (internal: boolean) => ({
    type: 'text', // Paragraph type (text, quote, heading)
    text: internal ? undefined : '', // Text content
    color: '', // Text color
    backgroundColor: '', // Background color
  }),
  metadata: {
    version: 1, // Schema version for migrations
    role: 'content', // Block role (content, layout, etc.)
    parent: ['affine:note'], // Valid parent block types
    children: [], // Valid child block types
  },
  toModel: () => {
    // Custom logic for creating model instance
    return new ParagraphBlockModel();
  },
};
```

### Real-Time Collaboration with Y-Octo

#### How Collaborative Editing Works

BlockSuite uses **Y-Octo**, a Rust-based CRDT (Conflict-free Replicated Data Type) implementation for real-time collaboration:

```typescript
// File: packages/common/y-octo/node/src/doc.rs (Rust code compiled to Node.js)
// This Rust code provides the high-performance CRDT operations

#[napi]  // Decorator to expose Rust function to Node.js
pub struct Doc {
  doc: YDoc,  // Internal Y-Octo document
}

#[napi]
impl Doc {
  #[napi(constructor)]
  pub fn new(client_id: Option<i64>) -> Self {
    Self {
      doc: if let Some(client_id) = client_id {
        // Each client gets a unique ID for conflict resolution
        YDoc::with_client(client_id as u64)
      } else {
        YDoc::default()
      },
    }
  }

  // Get unique client identifier
  #[napi(getter)]
  pub fn client_id(&self) -> i64 {
    self.doc.client() as i64
  }

  // Create collaborative text object for a block
  #[napi]
  pub fn get_or_create_text(&self, key: String) -> Result<YText> {
    self
      .doc
      .get_or_create_text(key)  // Get text object by block ID
      .map(YText::inner_new)    // Wrap in N-API compatible type
      .map_err(anyhow::Error::from)
  }

  // Create collaborative map object for block properties
  #[napi]
  pub fn get_or_create_map(&self, key: String) -> Result<YMap> {
    self
      .doc
      .get_or_create_map(key)   // Get map object by block ID
      .map(YMap::inner_new)     // Wrap in N-API compatible type
      .map_err(anyhow::Error::from)
  }

  // Apply changes from another client
  #[napi]
  pub fn apply_update(&mut self, update: &[u8]) -> Result<()> {
    // Binary update contains all changes from remote client
    self.doc.apply_update_from_binary_v1(update)?;
    Ok(())
  }

  // Generate update to send to other clients
  #[napi]
  pub fn encode_state_as_update_v1(&self, state: Option<&[u8]>) -> Result<Uint8Array> {
    let state_vector = if let Some(state) = state {
      // Decode remote client's state
      StateVector::decode_v1(state)?
    } else {
      StateVector::default()
    };

    // Generate minimal update containing only new changes
    let update = self.doc.encode_state_as_update_v1(&state_vector)?;
    Ok(Uint8Array::new(update))
  }
}
```

#### Conflict Resolution Example

Here's how Y-Octo handles simultaneous edits:

```typescript
// File: packages/common/y-octo/core/src/doc/document.rs
// Core conflict resolution logic in Rust

impl Document {
  // Apply an update from another client
  pub fn apply_update(&mut self, mut update: Update) -> JwstCodecResult {
    let mut store = self.store.write().unwrap();
    let mut retry = false;

    loop {
      // Process all operations in the update
      for (mut s, offset) in update.iter(store.get_state_vector()) {
        if let Node::Item(item) = &mut s {
          debug_assert!(item.is_owned());
          let mut item = unsafe { item.get_mut_unchecked() };

          // Repair item relationships (find parent, set dependencies)
          store.repair(&mut item, self.store.clone())?;
        }

        // Integrate the operation into document state
        // This automatically resolves conflicts using YATA algorithm
        store.integrate(s, offset, None)?;
      }

      // Process deletions
      for (client, range) in update.delete_set_iter(store.get_state_vector()) {
        store.delete_range(client, range)?;
      }

      // Handle pending operations that couldn't be applied yet
      if let Some(mut pending_update) = store.pending.take() {
        if pending_update
          .missing_state
          .iter()
          .any(|(client, clock)| *clock < store.get_state(*client))
        {
          // New update allows us to integrate pending operations
          retry = true;
        }

        // Merge pending operations with current update
        if update.is_pending_empty() {
          update = pending_update;
        } else {
          update.drain_pending_state();
          Update::merge_into(&mut update, [pending_update]);
        }
      } else if update.is_pending_empty() {
        // All operations integrated successfully
        break;
      } else {
        // Some operations still pending
        update.drain_pending_state();
        retry = false;
      }
    }

    Ok(())
  }
}
```

#### Real-World Collaboration Example

When two users edit the same document simultaneously:

```typescript
// User A types "Hello" at position 0
const operationA = {
  clientId: 123,
  clock: 1,
  type: 'insert',
  position: 0,
  content: 'Hello',
  timestamp: Date.now(),
};

// User B types "World" at position 0 (same position!)
const operationB = {
  clientId: 456,
  clock: 1,
  type: 'insert',
  position: 0,
  content: 'World',
  timestamp: Date.now() + 100, // Slightly later
};

// Y-Octo automatically resolves this conflict:
// Result: "WorldHello" (deterministic ordering based on client IDs)
// Both users see the same final result
```

### Block Component Implementation

Each block type has its own React component for rendering and editing:

```typescript
// File: blocksuite/affine/blocks/code/src/code-block.ts
// Example of a complex block component with syntax highlighting

export class CodeBlockComponent extends CaptionedBlockComponent<CodeBlockModel> {
  static override styles = css`
    .affine-code-block-container {
      position: relative;
      padding: 32px 0;
    }

    .affine-code-block {
      font-family: var(--affine-font-code-family);
      background: var(--affine-background-code-block);
      border-radius: 8px;
      padding: 16px;
    }

    /* Syntax highlighting styles */
    .hljs-keyword {
      color: #c678dd;
    }
    .hljs-string {
      color: #98c379;
    }
    .hljs-comment {
      color: #5c6370;
    }
  `;

  private _richText: RichText | null = null;
  private _langSelector: LanguageSelector | null = null;

  // Initialize the code editor
  override connectedCallback() {
    super.connectedCallback();

    // Set up syntax highlighting
    this._setupHighlighting();

    // Set up language selector
    this._setupLanguageSelector();
  }

  private _setupHighlighting() {
    // Import highlight.js for syntax highlighting
    import('highlight.js').then(hljs => {
      this._highlighter = hljs.default;
      this._updateHighlighting();
    });
  }

  private _setupLanguageSelector() {
    this._langSelector = new LanguageSelector();
    this._langSelector.value = this.model.language;

    // Update block when language changes
    this._langSelector.addEventListener('change', e => {
      this.doc.captureSync(() => {
        this.model.language = e.detail.language;
        this._updateHighlighting();
      });
    });
  }

  private _updateHighlighting() {
    if (!this._highlighter || !this._richText) return;

    const code = this.model.text.toString();
    const language = this.model.language || 'plaintext';

    try {
      // Apply syntax highlighting
      const highlighted = this._highlighter.highlight(code, { language });
      this._applyHighlighting(highlighted.value);
    } catch (error) {
      // Fallback to plain text if highlighting fails
      console.warn('Syntax highlighting failed:', error);
    }
  }

  private _applyHighlighting(highlightedHtml: string) {
    // Apply highlighting while preserving cursor position
    const selection = this.std.selection.find('text');

    // Update the display without affecting the underlying text model
    this._richText.innerHTML = highlightedHtml;

    // Restore cursor position
    if (selection) {
      this.std.selection.set([selection]);
    }
  }

  // Handle keyboard shortcuts (Tab for indentation, etc.)
  override onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();

      // Insert 2 spaces for indentation
      const selection = this.std.selection.find('text');
      if (selection) {
        this.model.text.insert('  ', selection.from.index);

        // Move cursor after inserted spaces
        this.std.selection.set([
          this.std.selection.create('text', {
            from: { index: selection.from.index + 2 },
            to: { index: selection.from.index + 2 },
          }),
        ]);
      }
    }

    super.onKeyDown(event);
  }

  override render() {
    return html`
      <div class="affine-code-block-container">
        <!-- Language selector -->
        <div class="code-block-header">${this._langSelector}</div>

        <!-- Code editor -->
        <div class="affine-code-block">
          <rich-text .yText=${this.model.text} .enableFormat=${false} .enableAutoScrollHorizontally=${true} @keydown=${this.onKeyDown}></rich-text>
        </div>

        <!-- Caption for describing the code -->
        ${this.renderCaption()}
      </div>
    `;
  }
}

// Register the component so it can be used in documents
customElements.define('affine-code', CodeBlockComponent);
```

This comprehensive BlockSuite implementation provides:

1. **Modular Block System**: Each content type is a self-contained block
2. **Real-Time Collaboration**: Y-Octo CRDT handles concurrent edits automatically
3. **Rich Editing**: Each block type has specialized editing capabilities
4. **Extensible Architecture**: New block types can be easily added
5. **Performance**: Rust-based CRDT operations for speed
6. **Cross-Platform**: Works in web browsers, Electron, and mobile apps

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
│ • GFX           │ ── Graphics and drawing tools
│ • Inlines       │ ── Text formatting and links
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
