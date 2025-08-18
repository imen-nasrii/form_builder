# FormBuilder Pro - Replit Configuration

## Overview
FormBuilder Pro is a visual form builder application enabling users to create, customize, and manage forms via a drag-and-drop interface. It offers enterprise-grade features including user management, role-based access control, API integrations, and multi-framework export capabilities. The project's business vision is to provide a comprehensive solution for rapid form development, addressing market needs for intuitive and powerful form creation tools.

## User Preferences
Preferred communication style: Simple, everyday language (English interface, French communication).
System Requirements: Admin users cannot access Construction Zone (read-only mode), users have full form building access.
Interface Language: Complete English translation implemented for all PropertyManager and VisualComponentCreator components.

## System Architecture

### Frontend
- **Framework**: .NET 8.0 Blazor Server
- **UI Components**: MudBlazor component library
- **Styling**: MudBlazor theming with custom CSS
- **Rendering**: Server-side rendering with SignalR

### Backend
- **Runtime**: ASP.NET Core 8.0
- **Language**: C# with .NET 8
- **Database ORM**: Entity Framework Core
- **Authentication**: ASP.NET Core Identity with bcrypt
- **File Structure**: Clean architecture with Models, Services, Data layers

### Database Design
- **Primary Database**: PostgreSQL with Entity Framework Core
- **Schema Management**: EF Core Migrations
- **Key Tables**: `AspNetUsers`, `Forms`, `Notifications`
- **Connection**: Environment-based configuration with DATABASE_URL support

### Key Components
- **Form Builder Engine**: Drag & Drop interface (@dnd-kit), Universal Configurator, Component Palette, JSON Schema Validation, Multi-Framework Export (React, Vue, Blazor).
- **User Management System**: Role-Based Access (Admin/User), Enhanced Authentication (email verification, password reset, 2FA), Admin Panel, Secure Session Management.
- **Data Integration**: API Service for external data, Data Source Manager, Authentication Support (Bearer, API Key, Basic Auth), Response Mapping.
- **AI Assistant "Alex"**: ChatGPT-style interface for DFM file processing, Delphi component mapping to JSON, OpenAI API integration for interactive discussions, AI system prompt specializing in financial program JSON generation (ACCADJ, BUYTYP, PRIMNT, SRCMNT). It processes complex DFM files and integrates real production templates.
- **MFact Form Builder**: Advanced drag-and-drop construction zone, MFact Properties Panel with tabbed interface, MFact models system supporting 25+ component types, integrated MFact model selector with authentic data types and real model structures (e.g., ACCADJ, BUYTYP, PRIMNT, SRCMNT, BUYLONG, and 100+ C# models like AATRR, AE, CODES, CURNCY, USERS, ACTDATA, ACTYPE, ADJUST, TRX, SECRTY, FNDMAS, GL, TAXLOT, OPNPOS, INCOME, NAVHST, AUTTRX, EXCHNG, DIVTYP, ASOFUNSETL, SHRMAS, TRXTYP, TRXCUR, UNSETL, GLCAT, MKTVAL, SECCAT, SECGRP).
- **Import/Export System**: Support for multiple formats, External Component Library with JSON validation and step-by-step form import.
- **JSON Validator**: Intelligent validation with auto-correction and quality scoring.
- **UI/UX**: Clean white/light design, simplified interfaces, removal of unnecessary elements for cleaner navigation, personalized user dashboards. Component properties now display exact Excel specifications with proper French descriptions and localized data types.

## External Dependencies
- **React Ecosystem**: React 18, React Hook Form, React Query
- **UI Components**: Radix UI primitives
- **Drag & Drop**: @dnd-kit
- **Database**: Drizzle ORM, @neondatabase/serverless, mysql2
- **Authentication**: bcryptjs, express-session, connect-pg-simple
- **Email**: Nodemailer
- **Two-Factor Auth**: Speakeasy
- **AI**: OpenAI API, Streamlit (for Python AI chatbot)
- **Build Tools**: Vite, esbuild, TypeScript
- **Code Quality**: ESLint

## Recent Updates
✓ Created comprehensive PropertyManager component with CRUD functionality for External Components (August 1, 2025)
✓ Implemented dynamic property management with Add/Edit/Delete operations, type validation, and categorization (August 1, 2025)
✓ Enhanced External Components system with visual property editor supporting all data types and validation rules (August 1, 2025)
✓ Built Visual Component Creator with 4-step wizard interface matching user requirements (August 1, 2025)
✓ Completed full English translation of PropertyManager and VisualComponentCreator interfaces (August 4, 2025)
✓ Fixed React.Fragment error by replacing with div element using CSS 'contents' class (August 4, 2025)
✓ Resolved property name validation issues and accessibility warnings with DialogDescription (August 4, 2025)
✓ **MAJOR ARCHITECTURAL MIGRATION**: Complete migration from React + Vite.js + Express.js to .NET 8.0 Blazor Server architecture (August 18, 2025)
✓ Implemented full .NET Blazor Server application with MudBlazor UI components and ASP.NET Core backend (August 18, 2025)
✓ Created Entity Framework Core data models for Forms, Users, and Notifications with PostgreSQL support (August 18, 2025)
✓ Built comprehensive service layer with FormService, ComponentService, and NotificationService (August 18, 2025)
✓ Developed Blazor pages for Form Builder, Forms Management, and Home with drag-and-drop functionality (August 18, 2025)
✓ Configured ASP.NET Core Identity authentication and PostgreSQL database integration (August 18, 2025)
✓ Application ready to run with "dotnet run" command in proper .NET 8 environment (August 18, 2025)