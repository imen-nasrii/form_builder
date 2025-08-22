# FormBuilder Pro

## Overview

FormBuilder Pro is a comprehensive full-stack application for creating and managing dynamic forms with AI assistance. It combines a React frontend with an Express/Node.js backend, featuring Drizzle ORM for database operations, real-time collaboration, and AI-powered form generation capabilities. The application specializes in financial form templates (ACCADJ, BUYTYP, PRIMNT, SRCMNT) with support for complex component types like Grid Lookups (GRIDLKP) and List Lookups (LSTLKP).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for development and production builds
- **UI Library**: Shadcn/ui components with Radix UI primitives and Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Drag & Drop**: @dnd-kit for sophisticated form builder drag-and-drop functionality
- **Routing**: Wouter for lightweight client-side routing
- **Form Management**: React Hook Form with Zod validation schemas

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js with session-based authentication
- **Database ORM**: Drizzle ORM with support for both PostgreSQL (primary) and MySQL (local development)
- **Real-time Features**: RESTful APIs with real-time polling for notifications and updates
- **AI Integration**: Anthropic Claude API for intelligent form generation and assistance
- **File Processing**: Support for DFM and Info file parsing for legacy system migration

### Data Storage Solutions
- **Primary Database**: PostgreSQL (Neon serverless) with connection pooling
- **Local Development**: MySQL support via XAMPP configuration
- **Session Storage**: Database-backed sessions using connect-pg-simple
- **Schema Management**: Drizzle migrations with push-based deployment

### Authentication and Authorization
- **Authentication**: Session-based auth with bcrypt password hashing
- **Role-based Access**: Admin and user roles with middleware protection
- **Security Features**: 2FA support, email verification, password reset workflows
- **Enhanced Security**: Rate limiting, input validation, and secure session configuration

### External Dependencies

#### Database Services
- **Neon PostgreSQL**: Primary production database with serverless architecture
- **@neondatabase/serverless**: Database driver with WebSocket support for serverless environments

#### AI Services
- **Anthropic Claude**: Primary AI assistant using claude-sonnet-4-20250514 model for form generation and validation
- **@anthropic-ai/sdk**: Official Anthropic SDK for AI interactions

#### Authentication & Security
- **bcryptjs**: Password hashing and verification
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store adapter
- **speakeasy & QRCode**: Two-factor authentication implementation

#### Email Services
- **nodemailer**: Email delivery service for verification and notifications
- **@sendgrid/mail**: SendGrid integration for production email delivery

#### Development & Build Tools
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend bundling for production deployment
- **TSX**: TypeScript execution for development
- **Drizzle Kit**: Database schema management and migrations

#### Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **@dnd-kit/***: Modern drag-and-drop toolkit for React
- **@hookform/resolvers**: Form validation resolvers for React Hook Form
- **Zod**: TypeScript-first schema validation library

#### Financial System Integration
- **MFact Models**: Comprehensive business models for financial programs
- **Component Registry**: Standardized form components (GRIDLKP, LSTLKP, DATEPICKER, etc.)
- **Legacy Support**: DFM and Info file parsing for system migration