# FormBuilder Pro - Complete Setup & Configuration Guide

This comprehensive guide covers the complete setup, configuration, and usage of FormBuilder Pro, a dual-architecture form builder application supporting both React/Express.js and .NET Blazor Server technologies.

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Requirements](#system-requirements)
3. [Environment Setup](#environment-setup)
4. [Database Configuration](#database-configuration)
5. [React/Express.js Setup](#reactexpressjs-setup)
6. [.NET Blazor Setup](#net-blazor-setup)
7. [Environment Variables](#environment-variables)
8. [Running the Application](#running-the-application)
9. [Features & Usage](#features--usage)
10. [API Integration](#api-integration)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## Project Overview

FormBuilder Pro is an advanced form builder application with dual architecture support:

- **Frontend**: React 18 with TypeScript, Vite.js build system
- **Backend**: Express.js with Node.js OR .NET 8.0 Blazor Server
- **Database**: PostgreSQL with Entity Framework Core
- **AI Integration**: Claude API for intelligent form generation
- **UI**: Modern components with MudBlazor and shadcn/ui

### Key Features
- Visual drag-and-drop form builder
- Advanced component property editor
- AI assistant "Alex" for form generation
- Multi-framework export (React, Vue, Blazor)
- User management with role-based access
- Real-time form validation
- Database integration

## System Requirements

### For React/Express.js Development
- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **PostgreSQL**: 14.x or higher
- **Git**: Latest version

### For .NET Blazor Development
- **.NET SDK**: 8.0 or higher
- **PostgreSQL**: 14.x or higher
- **Visual Studio 2022** or **VS Code** with C# extension
- **Git**: Latest version

### Recommended System Specs
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Ubuntu 20.04+

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/imen-nasrii/formbuilder-pro.git
cd formbuilder-pro
```

### 2. Install Dependencies

#### For React/Express.js
```bash
# Install Node.js dependencies
npm install

# Verify installation
npm run dev --version
```

#### For .NET Blazor
```bash
# Install .NET dependencies
dotnet restore

# Verify installation
dotnet --version
```

## Database Configuration

### 1. Install PostgreSQL

#### Windows
1. Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
2. Run installer and follow setup wizard
3. Remember your superuser password

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE formbuilder_pro;
CREATE USER formbuilder_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE formbuilder_pro TO formbuilder_user;
\q
```

### 3. Database Connection String

Your PostgreSQL connection string should look like:
```
postgresql://formbuilder_user:your_secure_password@localhost:5432/formbuilder_pro
```

## React/Express.js Setup

### 1. Environment Configuration

Create `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://formbuilder_user:your_secure_password@localhost:5432/formbuilder_pro

# API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=FormBuilder Pro <your_email@gmail.com>

# Application Settings
NODE_ENV=development
PORT=5000
```

### 2. Database Migration

```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
```

### 3. Start Development Server

```bash
# Start the application
npm run dev
```

The application will be available at: `http://localhost:5000`

## .NET Blazor Setup

### 1. Environment Configuration

Create `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=formbuilder_pro;Username=formbuilder_user;Password=your_secure_password"
  },
  "ApiKeys": {
    "AnthropicApiKey": "your_anthropic_api_key",
    "OpenAiApiKey": "your_openai_api_key"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SenderEmail": "your_email@gmail.com",
    "SenderPassword": "your_app_password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### 2. Database Migration

```bash
# Install Entity Framework tools
dotnet tool install --global dotnet-ef

# Create and apply migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 3. Start Development Server

```bash
# Start with hot reload
dotnet watch run

# Or standard run
dotnet run
```

The application will be available at: `https://localhost:7000` or `http://localhost:5000`

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `ANTHROPIC_API_KEY` | Claude API key for AI features | `sk-ant-api03-...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key | Not required |
| `EMAIL_SERVICE` | Email service provider | `gmail` |
| `EMAIL_USER` | Email username | None |
| `EMAIL_PASS` | Email password/app password | None |
| `PORT` | Application port | `5000` |

### Getting API Keys

#### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key starting with `sk-ant-`

#### OpenAI API Key (Optional)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key starting with `sk-`

## Running the Application

### Choose Your Architecture

#### Option 1: React/Express.js
```bash
npm run dev
```
- Best for: Frontend-heavy development, modern web technologies
- Features: Hot reload, Vite build system, React ecosystem

#### Option 2: .NET Blazor Server
```bash
dotnet watch run
```
- Best for: Enterprise applications, C# development, server-side rendering
- Features: SignalR real-time updates, MudBlazor components, .NET ecosystem

### Switching Between Architectures

The project supports both architectures simultaneously:

1. **For React development**: Use `npm run dev`
2. **For Blazor development**: Use `dotnet watch run`
3. **For dual development**: Run both commands in separate terminals

## Features & Usage

### 1. Form Builder Interface

#### Creating a New Form
1. Navigate to Forms page
2. Click "Create New Form"
3. Enter form details (name, description)
4. Use drag-and-drop to add components

#### Component Types Available
- **Text Input**: Single-line text fields
- **Textarea**: Multi-line text areas
- **Select Dropdown**: Single/multiple selection
- **Radio Groups**: Single selection from options
- **Checkboxes**: Multiple selection options
- **Date Picker**: Date/time selection
- **File Upload**: File attachment
- **Grid Lookup**: Advanced data grids

#### Advanced Component Editor
1. Double-click any component to edit
2. Modify properties in the Advanced Properties panel:
   - Basic Properties: ID, Label, Placeholder, Default Value
   - Appearance: Color, Width, Size, State (Required/Disabled/ReadOnly)
   - Validation: Min/Max Length, Regex Pattern, Error Messages
   - Styling: CSS Classes, Custom CSS, Data Attributes
   - Options: For select/radio/checkbox components

### 2. AI Assistant "Alex"

#### Using the AI Assistant
1. Click the AI Assistant button in the form builder
2. Describe your form requirements in natural language
3. Alex will generate appropriate form components
4. Review and customize the generated form

#### Example Prompts
- "Create a user registration form with email validation"
- "Build a financial transaction form with currency fields"
- "Generate a survey form with rating scales"

### 3. User Management

#### User Roles
- **Admin**: Full access, read-only Construction Zone
- **User**: Full form building access
- **Viewer**: Read-only access to forms

#### Authentication Features
- Email/password authentication
- Password reset functionality
- Two-factor authentication (2FA)
- Session management

### 4. Data Integration

#### External Data Sources
1. Configure API endpoints in Settings
2. Set authentication (Bearer token, API key, Basic auth)
3. Map response fields to form components
4. Test connection and data retrieval

#### Supported Authentication Types
- Bearer Token
- API Key
- Basic Authentication
- Custom headers

## API Integration

### REST API Endpoints

#### Forms Management
```
GET    /api/forms           - List all forms
POST   /api/forms           - Create new form
GET    /api/forms/:id       - Get specific form
PUT    /api/forms/:id       - Update form
DELETE /api/forms/:id       - Delete form
```

#### Components Management
```
GET    /api/components      - List available components
POST   /api/components      - Create custom component
PUT    /api/components/:id  - Update component
DELETE /api/components/:id  - Delete component
```

#### User Management
```
POST   /api/auth/login      - User login
POST   /api/auth/register   - User registration
POST   /api/auth/logout     - User logout
GET    /api/auth/user       - Get current user
```

### WebSocket Events (Blazor)

#### Real-time Updates
- Form collaboration
- Live form preview
- Component synchronization
- User presence indicators

## Deployment

### Production Environment Setup

#### 1. Environment Variables
```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
ANTHROPIC_API_KEY=your_production_key
```

#### 2. Build for Production

##### React/Express.js
```bash
npm run build
npm start
```

##### .NET Blazor
```bash
dotnet publish -c Release
dotnet run --configuration Release
```

### Docker Deployment

#### 1. Build Docker Image
```bash
# For React/Express.js
docker build -t formbuilder-pro-node .

# For .NET Blazor
docker build -t formbuilder-pro-dotnet -f Dockerfile.blazor .
```

#### 2. Run with Docker Compose
```yaml
version: '3.8'
services:
  app:
    image: formbuilder-pro-node
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/formbuilder
      - ANTHROPIC_API_KEY=your_key
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=formbuilder
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Cloud Deployment Options

#### Replit Deployment
1. Connect your GitHub repository
2. Configure environment variables
3. Use "Deploy" button in Replit interface

#### Heroku Deployment
```bash
heroku create formbuilder-pro
heroku addons:create heroku-postgresql
heroku config:set ANTHROPIC_API_KEY=your_key
git push heroku main
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure environment variables
3. Add PostgreSQL database addon
4. Deploy automatically

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -p 5432 -U formbuilder_user -d formbuilder_pro
```

#### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### .NET Issues
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore
```

### Performance Optimization

#### Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling
- Implement query optimization

#### Frontend Optimization
- Enable code splitting
- Implement lazy loading
- Use CDN for static assets

### Security Considerations

#### Environment Security
- Never commit `.env` files
- Use strong database passwords
- Implement rate limiting
- Enable HTTPS in production

#### API Security
- Validate all input data
- Implement proper authentication
- Use CORS properly
- Sanitize user inputs

## Support & Documentation

### Additional Resources
- [React Documentation](https://reactjs.org/docs)
- [.NET Blazor Documentation](https://docs.microsoft.com/en-us/aspnet/core/blazor)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Anthropic API Documentation](https://docs.anthropic.com/)

### Getting Help
1. Check this documentation first
2. Review the troubleshooting section
3. Check GitHub issues
4. Contact the development team

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

---

**Last Updated**: August 2025
**Version**: 2.0.0
**Authors**: FormBuilder Pro Development Team