# How Everything Works - Complete Explanation

> **Written for complete beginners - no coding knowledge required**

## What This Software Is

This is **notes9** - a software application for writing notes, drawing diagrams, and planning projects. Think of it like Microsoft Word, but it can also handle drawings like Microsoft Paint, and organize your thoughts like a digital notebook.

The version you're running is called "affine-to-notes9" and it's been specially modified to work completely offline (air-gapped) for security reasons.

## What You Just Saw Running

When you ran the command `yarn affine @affine/web dev`, you started a **development server**. Here's exactly what happened:

### Step 1: The Command Breakdown

- `yarn` = A tool that manages software packages (like an app store manager for code)
- `affine` = The main command that controls this software
- `@affine/web` = Tells the system you want to run the web version (the version that runs in your browser)
- `dev` = Short for "development" - this runs a test version for developers to work on

### Step 2: What Started Running

The system started several programs at once:

1. **Main Web Application**: This runs on `http://localhost:8080`

   - This is the actual AFFiNE app you can open in your web browser
   - It includes the note editor, drawing tools, and planning features

2. **Background Worker Programs**: These handle heavy tasks like:
   - **PDF Worker**: Handles PDF file processing
   - **Workspace Profile Worker**: Manages your different workspaces/projects
   - **Turbo Painter Worker**: Handles drawing and graphics
   - **NBStore Worker**: Manages your data storage

### Step 3: The Compilation Process

The terminal output showed "webpack compiled successfully" multiple times. This means:

- The system took all the code files (written in TypeScript)
- Converted them into a format your web browser can understand
- Created optimized versions for better performance
- Put them in the right locations for the web server to serve

## The Docker Compose Setup (The Other Running Services)

Before you started the web application, you had Docker Compose running other services. Here's what each one does:

### 1. PostgreSQL Database (`postgres`)

- **What it is**: A database - think of it like a filing cabinet for your data
- **What it stores**: Your notes, drawings, project information, and settings
- **Port**: 5433 (the "address" other programs use to talk to it)
- **Login**: Username "affine", Password "affine", Database name "affine"

### 2. Redis Cache (`redis`)

- **What it is**: A super-fast temporary storage system
- **What it does**: Stores frequently used information for quick access
- **Port**: 6380
- **Why it's needed**: Makes the app faster by not having to look up the same information repeatedly

### 3. Search Indexer (`indexer`)

- **What it is**: A search engine for your content
- **What it does**: Allows you to quickly find specific notes or information
- **Port**: 9308
- **Technology**: Uses Manticore Search (similar to Google's search technology)

### 4. Mail Service (`mailhog`)

- **What it is**: A fake email server for testing
- **What it does**: Catches any emails the system tries to send (like password reset emails)
- **Ports**: 1025 (for sending emails), 8025 (for viewing emails in a web interface)
- **Why it's fake**: Since this is air-gapped, real emails can't be sent out

### 5. AI API Placeholder (`ai-api`)

- **What it is**: A placeholder for future AI features
- **What it does**: Currently just displays messages about AI features that will be added later
- **Port**: 8001
- **Current status**: Not functional - just a placeholder that prints messages

## Where Your Data Is Actually Stored

Besides PostgreSQL, notes9 uses multiple storage systems to keep your data safe and make everything work efficiently:

### 1. **Docker Volumes** (Permanent Storage Containers)

- **postgres_data**: Stores all your PostgreSQL database files
- **manticoresearch_data**: Stores the search index files
- **Location**: These are managed by Docker and stored permanently on your computer
- **What happens**: Even when you stop Docker, this data is preserved

### 2. **Browser Storage** (In Your Web Browser)

When you use the web version, data is also stored in your browser:

- **localStorage**: App settings, preferences, workspace information
- **sessionStorage**: Temporary data that disappears when you close the browser
- **IndexedDB**: Document content, images, and large files (works like a database in your browser)
- **Location**: Inside your browser's data folder

### 3. **Redis Memory** (Fast Temporary Storage)

- **What it stores**: Frequently accessed information, session data, cache
- **How it works**: Keeps data in computer memory (RAM) for super-fast access
- **What happens when stopped**: Data disappears (that's normal - it's just a cache)

### 4. **Search Index Files**

- **What it stores**: Searchable versions of all your content
- **Location**: In the manticoresearch_data Docker volume
- **Why it exists**: Allows you to quickly find any word or phrase in your notes

### 5. **File System Storage** (Regular Computer Files)

The system also creates regular files on your computer:

- **Configuration files**: Settings and preferences
- **Temporary files**: Used during processing
- **Log files**: Records of what the system has been doing

### 6. **Different Storage for Different Platforms**

The system automatically chooses the best storage method based on what you're using:

- **Web browser**: Uses IndexedDB and localStorage
- **Desktop app**: Uses SQLite database files
- **Mobile app**: Uses SQLite database files

## How Everything Connects Together

```
Your Web Browser (localhost:8080)
    ↓
Main notes9 Application
    ↓
Background Workers (handling heavy tasks)
    ↓
Multiple Storage Systems:
│
├── PostgreSQL Database (main data)
├── Redis Cache (fast access)
├── Manticore Search (finding content)
├── Browser Storage (settings & local data)
├── Docker Volumes (permanent storage)
└── File System (config & temporary files)
    ↓
Email System (MailHog) - handles notifications
    ↓
AI System (Placeholder) - future smart features
```

## What Each Piece Does in Simple Terms

### The Web Application

- **Purpose**: The main program you interact with
- **What you see**: The interface with buttons, menus, and editing areas
- **What it does**: Lets you create notes, draw pictures, organize projects

### The Database

- **Purpose**: Permanent storage for everything you create
- **What it stores**: Every note you write, every drawing you make, all your settings
- **How it works**: Like a digital filing cabinet that never forgets

### The Cache

- **Purpose**: Makes everything run faster
- **How it works**: Remembers things you use often so it doesn't have to look them up every time
- **Example**: If you open the same note 10 times, it remembers it after the first time

### The Search Engine

- **Purpose**: Helps you find things quickly
- **How it works**: Reads all your content and creates an index (like the index at the back of a book)
- **Example**: Type "meeting notes" and it finds all notes containing those words

### The Email System

- **Purpose**: Handles notifications and system emails
- **Why it's special**: It's fake - emails stay on your computer instead of going to the internet
- **Security benefit**: No data leaves your computer

### The AI Placeholder

- **Purpose**: Reserved space for smart features
- **Current state**: Just displays messages, doesn't do anything yet
- **Future plans**: Will provide intelligent assistance with your notes and projects

## The File Structure Explained

This project is organized into folders:

- **`blocksuite/`**: The core editing technology (handles text, drawings, etc.)
- **`packages/`**: Different parts of the application
  - **`frontend/`**: What you see and interact with
  - **`backend/`**: Behind-the-scenes logic
  - **`common/`**: Shared code used everywhere
- **`tools/`**: Utilities for building and managing the software
- **`tests/`**: Automated testing to make sure everything works
- **`docs/`**: Documentation like this file

## Why This Setup is Secure (Air-Gapped)

This version has been specially modified to work without any internet connection:

1. **No External Calls**: The software doesn't try to contact any external websites or services
2. **Local Database**: All your data stays on your computer
3. **Fake Email**: Emails are captured locally instead of being sent out
4. **Self-Contained**: Everything needed to run is included in this package

## How to Use This Information

Now that you understand how everything works:

1. **The main application** is what you'll use daily (at http://localhost:8080)
2. **The database and other services** run in the background - you don't need to interact with them directly
3. **All your data** is stored safely on your computer with no internet access required
4. **The system is ready** for future AI enhancements when they're added

## Where Is Your Data Actually Located on Your Computer?

Here are the exact locations where your data is stored:

### Docker Volume Storage

- **Location**: Usually in `/var/lib/docker/volumes/` (on Mac/Linux) or Docker Desktop's data directory
- **postgres_data volume**: Contains all your notes, projects, and user data
- **manticoresearch_data volume**: Contains search indexes for finding your content
- **Important**: This data persists even when Docker is stopped

### Browser Storage (When using web interface)

- **Location**: Inside your browser's profile folder
- **Chrome/Edge**: `~/Library/Application Support/Google/Chrome/Default/` (Mac) or `%APPDATA%\Google\Chrome\User Data\Default\` (Windows)
- **Firefox**: `~/Library/Application Support/Firefox/Profiles/` (Mac) or `%APPDATA%\Mozilla\Firefox\Profiles\` (Windows)
- **What's stored**: App settings, preferences, local document cache

### Application Files

- **Project files**: Everything in your `affine-to-notes9` folder
- **Configuration**: Settings and preferences
- **Logs**: System activity records

## What Happens When You Stop Everything

When you stop the development server (`yarn affine @affine/web dev`):

- ✅ **Your data is SAFE**: All notes and content remain in the database
- ✅ **Docker volumes persist**: Database and search index files are preserved
- ❌ **Web interface stops**: You can't access the app until you restart it
- ❌ **Background workers stop**: Document processing stops temporarily

When you stop Docker Compose (`docker-compose down`):

- ✅ **Your data is SAFE**: Docker volumes are preserved
- ❌ **Database becomes unavailable**: The web app can't access your data
- ❌ **Search stops working**: The search index becomes unavailable
- ❌ **Cache is cleared**: Redis cache is reset (this is normal)

### To Restart Everything:

1. **Start Docker services**: `docker-compose -f docker-compose.local.yml up -d`
2. **Start web application**: `yarn affine @affine/web dev`

### Your Data Is Always Safe Because:

- Database files are stored in Docker volumes (permanent)
- Browser storage is independent of the application
- Configuration files remain in your project folder
- Nothing is stored temporarily unless specifically designed to be (like Redis cache)

## Common Questions

**Q: Is my data safe?**
A: Yes, everything is stored locally on your computer with no internet access.

**Q: Can I access this from another computer?**
A: No, it only works on the computer where it's installed (localhost).

**Q: What if I want to make changes?**
A: The development server automatically updates when code files are changed.

**Q: Why are there so many parts?**
A: Modern applications are built with separate components for security, performance, and maintainability.

## Complete List: Where Your Data Is Stored Besides PostgreSQL

**Short Answer**: Your data is stored in 6 different places for different purposes:

1. **PostgreSQL Database** → Your main notes, projects, and user information
2. **Docker Volumes** → Permanent storage containers for database files and search indexes
3. **Redis Cache** → Temporary fast-access storage for recently used data
4. **Browser Storage** → Settings and local cache in your web browser (localStorage, IndexedDB)
5. **Search Index** → Organized versions of your content for quick searching (Manticore)
6. **File System** → Configuration files, logs, and temporary files on your computer

**Important**: All of this is stored locally on your computer - nothing goes to the internet.

## Summary

You're running a complete, offline version of notes9 that includes:

- A note-taking and drawing application
- Multiple storage systems working together
- A database for your content
- A search engine for finding information
- Browser storage for settings and cache
- Background services for performance
- Security features for air-gapped operation

All of this runs on your computer without needing any internet connection, keeping your data completely private and secure. Your data is stored in multiple places to ensure it's fast, searchable, and always available when you need it.
