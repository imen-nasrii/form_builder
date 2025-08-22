# FormBuilder Pro

## Overview

FormBuilder Pro is a comprehensive form creation and management platform that specializes in converting legacy form definitions (DFM files) into modern JSON-based form structures. The application supports MFact business models and provides intelligent form generation using AI assistance. It features a React frontend with TypeScript, Express.js backend, and PostgreSQL database with Drizzle ORM.

The platform serves financial and enterprise applications, providing specialized components like Grid Lookups, List Lookups, and various data entry controls designed for business processes. It includes user management, role-based access control, real-time notifications, and an AI-powered assistant for form generation and validation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- React 18 with TypeScript for type safety and component-based UI
- Shadcn/UI components with Tailwind CSS for consistent design system
- Tanstack React Query for server state management and caching
- Drag-and-drop form building using @dnd-kit libraries
- Wouter for lightweight client-side routing
- Vite for fast development and optimized builds

**Backend Architecture**
- Express.js server with TypeScript
- Modular route organization with authentication middleware
- Session-based authentication with PostgreSQL session storage
- Role-based access control (admin/user roles)
- RESTful API design with consistent error handling
- Real-time notification system
- AI integration using Anthropic's Claude API

**Data Storage Solutions**
- PostgreSQL as primary database via Neon serverless platform
- Drizzle ORM for type-safe database operations and schema management
- Database connection pooling for performance optimization
- Separate schemas for users, forms, templates, notifications, and sessions

**Authentication and Authorization**
- Session-based authentication with secure cookie handling
- Password hashing using bcrypt
- Two-factor authentication support with TOTP tokens
- Email verification system for user registration
- Password reset functionality with secure tokens
- Role-based route protection (admin/user permissions)

**Form Building System**
- JSON-based form definitions with validation rules
- Support for MFact business models and component types
- Drag-and-drop form construction with visual properties panel
- Real-time form preview and validation
- Template system for reusable form structures
- Advanced grid layout support with cell merging and spanning

**AI Integration**
- Claude AI assistant for form generation and validation
- Intelligent field suggestions based on business context
- DFM to JSON conversion capabilities
- Natural language form creation guidance
- JSON structure validation and optimization

## External Dependencies

**Database Services**
- Neon PostgreSQL for serverless database hosting
- Drizzle Kit for database migrations and schema management

**AI Services**
- Anthropic Claude API for form generation and assistance
- Custom AI helpers for JSON validation and suggestions

**Authentication Services**
- Express-session for session management
- Connect-pg-simple for PostgreSQL session storage
- Speakeasy for two-factor authentication TOTP generation

**Email Services**
- Nodemailer for email delivery
- SendGrid integration support for transactional emails
- Custom email templates for verification and notifications

**UI/UX Libraries**
- Radix UI components for accessible, unstyled primitives
- Lucide React for consistent iconography
- Tailwind CSS for utility-first styling
- React Hook Form with Zod validation

**Development Tools**
- Vite for build tooling and hot module replacement
- ESBuild for server-side bundling
- PostCSS with Autoprefixer for CSS processing
- TypeScript compiler for type checking

**Real-time Features**
- WebSocket support preparation for real-time form collaboration
- Polling-based notification updates with configurable intervals
- Live form validation and error reporting