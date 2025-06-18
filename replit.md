# FormBuilder Pro - Enterprise Form Designer

## Overview

FormBuilder Pro is a comprehensive enterprise form building application that provides a visual drag-and-drop interface for creating dynamic forms. Built with modern web technologies, it offers both user and administrative interfaces with role-based access control, authentication, and form management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Build Tool**: Vite for development and production builds
- **Drag & Drop**: @dnd-kit/core for form builder interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with dual database support (PostgreSQL primary, MySQL local)
- **Authentication**: Express sessions with bcrypt password hashing
- **Email Service**: Nodemailer with SendGrid integration
- **2FA Support**: Speakeasy for TOTP authentication
- **Session Storage**: PostgreSQL-based session store

## Key Components

### Authentication System
- **Session-based authentication** with secure cookie management
- **Role-based access control** (admin/user roles)
- **Email verification** workflow with token-based verification
- **Password reset** functionality with secure token expiration
- **Two-factor authentication** with QR code generation
- **Account management** features including profile updates

### Form Builder Engine
- **Visual drag-and-drop interface** for form creation
- **Component palette** with input controls, layout components, and lookup fields
- **Universal configurator** for component properties
- **Real-time JSON preview** of form structure
- **Form validation** and export capabilities
- **Template system** for reusable form configurations

### Data Management
- **Dynamic form storage** with JSON field definitions
- **API integration** support for external data sources
- **Multi-framework export** (React, Vue, Blazor)
- **Form versioning** and template management
- **Import/export** functionality for form definitions

## Data Flow

1. **User Authentication**: Login → Session creation → Role-based route access
2. **Form Creation**: Component selection → Drag to canvas → Configure properties → Save form
3. **Form Management**: Dashboard listing → Edit/delete operations → Template creation
4. **API Integration**: External API configuration → Data mapping → Dynamic field population
5. **Export Process**: Form selection → Framework choice → Code generation → Download

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **@radix-ui/***: Comprehensive UI component library
- **@tanstack/react-query**: Server state management
- **@dnd-kit/***: Drag and drop functionality
- **bcryptjs**: Password hashing
- **express**: Web framework
- **drizzle-orm**: Database ORM
- **nodemailer**: Email services
- **speakeasy**: 2FA implementation
- **qrcode**: QR code generation

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tailwindcss**: CSS framework
- **@types/***: TypeScript definitions

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with XAMPP/MySQL support
- **Production**: Neon PostgreSQL with auto-scaling deployment
- **Session Management**: PostgreSQL-backed session storage
- **Static Assets**: Vite-built assets served from dist/public

### Build Process
1. **Client Build**: Vite compiles React/TypeScript to static assets
2. **Server Build**: ESBuild bundles Node.js server with external dependencies
3. **Database Migration**: Drizzle Kit handles schema migrations
4. **Deployment**: Auto-scaling deployment target with health checks

### Infrastructure Requirements
- **Database**: PostgreSQL 16+ with connection pooling
- **Node.js**: Version 20+ runtime environment
- **SSL**: HTTPS required for secure authentication
- **Email**: SMTP service for verification and notifications

## Changelog
- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.