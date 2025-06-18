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