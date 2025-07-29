# FormBuilder Pro - Replit Configuration

## Overview

FormBuilder Pro is a comprehensive visual form builder application that allows users to create, customize, and manage forms through an intuitive drag-and-drop interface. The system provides enterprise-grade features including user management, role-based access control, API integrations, and multi-framework export capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Custom components built with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with support for both PostgreSQL and MySQL
- **Authentication**: Session-based auth with bcrypt password hashing
- **File Structure**: Clean separation between client, server, and shared code

### Database Design
- **Primary Database**: PostgreSQL (production) with MySQL support (local development)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Tables**:
  - `users` - User accounts with role-based permissions
  - `sessions` - Session storage for authentication
  - `forms` - Form definitions with JSON field storage
  - `formTemplates` - Reusable form templates

## Key Components

### Form Builder Engine
- **Drag & Drop Interface**: Built with @dnd-kit for component placement and reordering
- **Universal Configurator**: Dynamic property panel for all component types
- **Component Palette**: Collapsible sidebar with categorized form components
- **JSON Schema Validation**: Real-time validation of form structure
- **Multi-Framework Export**: Support for React, Vue, and Blazor code generation

### User Management System
- **Role-Based Access**: Admin and user roles with different permissions
- **Enhanced Authentication**: Email verification, password reset, 2FA support
- **Admin Panel**: User management interface for administrators
- **Session Management**: Secure session handling with PostgreSQL storage

### Data Integration
- **API Service**: External data source integration for dynamic form data
- **Data Source Manager**: Configuration interface for REST API connections
- **Authentication Support**: Bearer, API Key, Basic Auth, and custom headers
- **Response Mapping**: Flexible data transformation for form population

## Data Flow

1. **User Authentication**: Session-based authentication with secure cookie storage
2. **Form Creation**: Visual editor saves form definitions as JSON to database
3. **Component Configuration**: Real-time updates to form structure through properties panel
4. **Data Validation**: Client-side and server-side validation of form schemas
5. **Export Generation**: Server-side code generation for multiple frameworks
6. **Template Management**: Reusable form templates for rapid development

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Hook Form, React Query
- **UI Components**: Radix UI primitives for accessibility
- **Drag & Drop**: @dnd-kit for interactive form building
- **Database**: Drizzle ORM, @neondatabase/serverless, mysql2
- **Authentication**: bcryptjs, express-session, connect-pg-simple

### Development Tools
- **Build Tools**: Vite, esbuild, TypeScript
- **Code Quality**: ESLint configuration via Tailwind
- **Database Tools**: Drizzle Kit for schema management

### Email & Security
- **Email Service**: Nodemailer with multiple provider support
- **Two-Factor Auth**: Speakeasy for TOTP generation
- **Security**: Session security, password hashing, input validation

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit development environment
- **Local Development**: XAMPP support for local MySQL development
- **Hot Reload**: Vite development server with HMR support

### Production Deployment
- **Autoscale Deployment**: Configured for Replit's autoscale infrastructure
- **Build Process**: Vite build for client, esbuild for server bundling
- **Database**: PostgreSQL with Neon serverless for production
- **Port Configuration**: Express server on port 5000, mapped to external port 80

### Environment Configuration
- **Environment Variables**: Separate configs for development and production
- **Database Switching**: Automatic PostgreSQL/MySQL selection based on environment
- **Session Storage**: PostgreSQL-backed session store for production

## Changelog
- June 18, 2025: Initial setup
- June 18, 2025: Implemented ultra-advanced Construction Zone with Excel-like grid system
- June 18, 2025: Added role-based permission system for admin/user access control

## User Preferences

Preferred communication style: Simple, everyday language (French).
System Requirements: Admin users cannot access Construction Zone (read-only mode), users have full form building access.

## Recent Changes

✓ Ultra-professional Construction Zone with Excel-like grid capabilities integrated
✓ Role-based permission system implemented (admin vs user roles)
✓ Admin users see all forms with creator information and assignment capabilities
✓ User users have full access to form creation and editing tools
✓ Database schema updated to support form ownership and assignment tracking
✓ Interface fully translated to English (June 18, 2025)
✓ Form assignment functionality implemented for administrators
✓ Clean white/light design applied to 3D flip-flop cards
✓ Components navigation item removed for cleaner interface
✓ Analytics dashboard created with interactive charts and real-time metrics (June 18, 2025)
✓ Super Admin navigation item removed for cleaner interface (June 18, 2025)
✓ Interface terminology changed from "Form" to "Program" (June 18, 2025)
✓ Statistics modal replaced with 3 floating data icons in top-right (June 18, 2025)
✓ Dashboard interface optimized and fully translated to English (June 18, 2025)
✓ Statistics icons repositioned from right side to centered layout (June 18, 2025)
✓ Form cards now display creator's actual name/email instead of user ID (June 18, 2025)
✓ Removed "Dashboard" word and implemented functional search with filtering capabilities (June 18, 2025)
✓ Removed Guide button for cleaner interface design (June 18, 2025)
✓ System Overview section removed from admin panel per user request (June 19, 2025)
✓ Created Jira-style task board for users to manage assigned programs (June 19, 2025)
✓ Added status and priority fields to programs database schema (June 19, 2025)
✓ Implemented Kanban board with To Do, In Progress, Review, and Completed columns (June 19, 2025)
✓ Users can update task status, priority, and add comments on their assigned programs (June 19, 2025)
✓ Combined Admin Panel and Admin Management into unified Admin Dashboard (June 19, 2025)
✓ Implemented full drag-and-drop Kanban task board for users with @dnd-kit (June 19, 2025)
✓ Added task result submission system with file upload capabilities (June 19, 2025)
✓ Created sortable task cards with visual drag indicators and drop zones (June 19, 2025)
✓ Enhanced task management with priority updates and status tracking (June 19, 2025)
✓ Navigation bar now appears on all pages with fixed positioning (June 19, 2025)
✓ Updated all page layouts to accommodate fixed navbar with proper padding (June 19, 2025)
✓ Implemented advanced notification system with comprehensive workflow events (June 19, 2025)
✓ Added program assignment notifications for users and admins (June 19, 2025)
✓ Created task acceptance, status change, and result submission notifications (June 19, 2025)
✓ Enhanced notification bell with priority levels, unread counts, and real-time updates (June 19, 2025)
✓ Integrated notification service with all task management workflows (June 19, 2025)
✓ Updated logo to FormBuilder design with blue gradient and orange accent (June 19, 2025)
✓ Integrated new logo into navigation bar matching user's provided design (June 19, 2025)
✓ Updated dashboard interface to show "My Assigned Tasks" for regular users (June 19, 2025)
✓ Implemented user-specific form filtering to show only assigned tasks for non-admin users (June 19, 2025)
✓ Created comprehensive AI chatbot with Streamlit for DFM file processing (June 23, 2025)
✓ Implemented Delphi component mapping to modern JSON form configurations (June 23, 2025)
✓ Added OpenAI API integration for interactive AI discussions about form generation (June 23, 2025)
✓ Successfully processed complex DFM files with 11 fields and 18 operators from info files (June 23, 2025)
✓ Integrated AI chatbot into admin navbar with modal interface and streamlit integration (June 23, 2025)
✓ Created native AI Assistant page integrated directly into the web application (June 23, 2025)
✓ Implemented DFM file parser and JSON generator with component mapping in React (June 23, 2025)
✓ Added interactive chat interface with file upload and real-time JSON generation (June 23, 2025)
✓ Created comprehensive Import/Export system for programs with multiple format support (June 23, 2025)
✓ Implemented External Component Library with two import methods: JSON validation and step-by-step form (June 23, 2025)
✓ Added component palette management system for custom external components (June 23, 2025)
✓ Enhanced navigation with Component Library and Import/Export access for administrators (June 23, 2025)
✓ Removed "Composants" and "Import/Export" navigation items for cleaner admin interface (June 24, 2025)
✓ Created intelligent JSON validator with auto-correction and quality scoring system (June 23, 2025)
✓ Implemented comprehensive validation rules for form structure, field types, and data integrity (June 23, 2025)
✓ Added smart suggestions for performance optimization and accessibility improvements (June 23, 2025)
✓ Fixed BUYLONG generation with real JSON creation and automatic file download (June 24, 2025)
✓ Implemented complete Python/Streamlit AI system for real form generation from DFM and Info files (June 24, 2025)
✓ Created intelligent DFM parser that extracts Delphi components and converts them to JSON fields (June 24, 2025)
✓ Added comprehensive Info file parser for validation rules, entities, and field metadata (June 24, 2025)
✓ Integrated real AI assistant with chat interface and automatic BUYTYP generation based on user files (June 24, 2025)
✓ Modified AI to display JSON in chat instead of automatic download per user preference (June 24, 2025)
✓ Translated entire AI Assistant interface from French to English for better user experience (June 24, 2025)
✓ Removed Components and Import/Export navigation items from admin menu for cleaner interface (June 24, 2025)
✓ Enhanced AI Assistant to respond with friendly greetings and generate any program type on demand (June 24, 2025)
✓ Improved chat interface with contextual responses and instant program generation capabilities (June 24, 2025)
✓ Successfully updated component palette with Excel specifications for all field types (July 29, 2025)
✓ Enhanced GRIDLKP with Data Model, Main Property, Description Property settings per Excel specs (July 29, 2025)
✓ Added proper LSTLKP configuration with LoadDataInfo and ItemInfo properties (July 29, 2025)
✓ Updated SELECT with UserIntKey and OptionValues JSON format support (July 29, 2025)
✓ Enhanced CHECKBOX with EnabledWhen conditional logic and proper value handling (July 29, 2025)
✓ Added validation rules for DATEPICKER and DATEPKR components (July 29, 2025)
✓ Component palette now fully matches BUYTYP Excel specifications with proper field types and data properties (July 29, 2025)
✓ Implemented exact Excel property specifications for all component types (GRIDLKP, LSTLKP, SELECT, DATEPICKER, DATEPKR, CHECKBOX, RADIOGRP, GROUP) (July 29, 2025)
✓ Updated component properties with precise data types, validation rules, and conditional logic per Excel requirements (July 29, 2025)
✓ Enhanced properties panel to display proper French terminology and required field indicators (July 29, 2025)
✓ Successfully updated GRIDLKP with KeyColumn, ItemInfo, LoadDataInfo properties matching Excel specifications (July 29, 2025)
✓ Updated LSTLKP with LoadDataInfo and ItemInfo properties with proper JSON structure and descriptions (July 29, 2025)
✓ Enhanced SELECT component with Id, label, UserIntKey, OptionValues, and all Excel-specified properties (July 29, 2025)
✓ Updated DATEPICKER and DATEPKR with exact property specifications and French data type localization (July 29, 2025)
✓ Improved CHECKBOX with proper EnabledWhen conditional logic and correct French data types (July 29, 2025)
✓ Enhanced RADIOGRP with OptionValues and proper spacing/width configurations per Excel specs (July 29, 2025)
✓ Updated GROUP component with ChildFields array and proper container functionality (July 29, 2025)
✓ Created simplified component palette with organized categories: Lookup, Selection, Date & Time, Layout (July 29, 2025)
✓ All component properties now display exact Excel specifications with proper French descriptions (July 29, 2025)
✓ Updated component palette with comprehensive Excel specifications for all field types (GRIDLKP, LSTLKP, SELECT, DATEPICKER, DATEPKR, CHECKBOX, GROUP, RADIOGRP) (July 29, 2025)
✓ Enhanced component properties with precise data types, validation rules, and conditional logic per Excel requirements (July 29, 2025)
✓ Fixed all TypeScript errors and restored full drag-and-drop functionality in form builder (July 29, 2025)
✓ Implemented comprehensive French data type localization across all components using "Chaîne de caractères", "Booléen", "Nombre", "Objet", "Tableau d'Objets" (July 29, 2025)
✓ Updated component properties interface to include French dataType field for proper localization (July 29, 2025)
✓ Enhanced properties panel with visual data type badges showing French terminology (July 29, 2025)
✓ Reorganized component palette to focus on core business components: GRIDLKP, LSTLKP, SELECT, DATEPICKER, DATEPKR, CHECKBOX, RADIOGRP, GROUP (July 29, 2025)
✓ Streamlined component categories into Lookup Components, Date & Time, Selection Controls, and Container & Layout sections (July 29, 2025)
✓ Transformed Analytics page from admin-focused to user-specific personal dashboard (July 20, 2025)
✓ Replaced system-wide metrics with personalized statistics showing user's own programs and tasks (July 20, 2025)
✓ Updated all charts and metrics to display individual user data instead of global system statistics (July 20, 2025)
✓ Fixed all reference errors and implemented proper user-centric data filtering for Analytics (July 20, 2025)
✓ Created modern ChatGPT-style interface with conversation bubbles and interactive elements (July 7, 2025)
✓ Enhanced AI system prompt to specialize in financial program JSON generation (ACCADJ, BUYTYP, PRIMNT, SRCMNT) (July 7, 2025)
✓ Added comprehensive business context with proper field types (GRIDLKP, LSTLKP, SELECT, DATEPICKER, etc.) (July 7, 2025)
✓ Implemented intelligent suggestion buttons for quick program generation (July 7, 2025)
✓ Fixed authentication issues and improved API reliability for chat functionality (July 7, 2025)
✓ Enhanced AI system with real production templates from actual user program files (July 9, 2025)
✓ Added intelligent DFM file analysis with automatic question generation and Upload DFM button (July 9, 2025)
✓ Translated entire AI Assistant interface from French to English for better user experience (July 9, 2025)
✓ Implemented specialized API route /api/ai/analyze-dfm for processing DFM files with contextual questioning (July 9, 2025)
✓ Completely upgraded AI analysis engine with comprehensive intelligence and expert-level insights (July 10, 2025)
✓ Enhanced DFM analysis to provide detailed field analysis, business context, and structural insights (July 10, 2025)
✓ Implemented advanced response formatting with confidence levels and implementation guidance (July 10, 2025)
✓ Added intelligent error handling and fallback support for legacy analysis formats (July 10, 2025)
✓ Redesigned AI Assistant interface with simple, clean ChatGPT-style layout per user request (July 11, 2025)
✓ Simplified visual design removing complex gradients and animations for better usability (July 11, 2025)
✓ Implemented minimal chat interface with clean message bubbles and simple avatars (July 11, 2025)
✓ Named AI assistant "Codex" with magical branding and subtle design enhancements (July 11, 2025)
✓ Added gradient headers, colored message bubbles, and enhanced visual appeal while maintaining simplicity (July 11, 2025)
✓ Implemented personalized branding with "Codex - Your Magical AI Assistant" identity (July 11, 2025)
✓ Changed AI assistant name from "Codex" to "Alex" per user request (July 11, 2025)
✓ Created comprehensive MFact Form Builder system with advanced drag-and-drop construction zone (July 11, 2025)
✓ Implemented MFact Properties Panel with tabbed interface for component configuration (July 11, 2025)
✓ Built complete MFact models system supporting 25+ component types (TEXT, GRIDLKP, SELECT, etc.) (July 11, 2025)
✓ Integrated MFact Builder into main application with dropdown menu and route navigation (July 11, 2025)
✓ Added enhanced component palette with categorized sections and MFact program templates (July 11, 2025)
✓ Created three-panel layout: Form Settings, Construction Zone, and Properties Panel (July 11, 2025)
✓ Simplified and cleaned MFact Builder interface design removing cluttered elements and tabs (July 14, 2025)
✓ Removed statistics cards from dashboard for cleaner admin interface (July 14, 2025)
✓ Fixed authentication system by removing email verification requirement per user request (July 24, 2025)
✓ Eliminated 401 authentication errors and "Please verify your email" login blocks (July 24, 2025)
✓ Streamlined registration process to auto-verify all user accounts for immediate access (July 24, 2025)
✓ Enhanced navigation with user profile dropdown menu including profile access and logout functionality (July 24, 2025)
✓ Cleaned Analytics page by removing unnecessary stat cards that displayed empty data (July 24, 2025)
✓ Fixed root route redirect issue - unauthenticated users now go to SignIn instead of SignUp (July 24, 2025)
✓ Resolved authentication flow confusion by correcting routing logic in App.tsx (July 24, 2025)
✓ Successfully converted form builder toolbar buttons into clean dropdown menu interface (July 24, 2025)
✓ Consolidated Guide, Import, Export, External Components, Clear, and Save into Actions dropdown (July 24, 2025)
✓ Implemented functional Quick Start Guide dialog with step-by-step instructions for users (July 24, 2025)
✓ Created comprehensive FAQ documentation with user and technical guides for project support (July 24, 2025)