# FormBuilder Pro - Architecture Guide

Complete technical architecture documentation for developers and system administrators.

## System Architecture Overview

FormBuilder Pro implements a dual-architecture approach supporting both modern web technologies and enterprise .NET solutions.

```
┌─────────────────────────────────────────────────────────────┐
│                    FormBuilder Pro                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend Layer                                             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   React 18      │  │  .NET Blazor    │                  │
│  │   + TypeScript  │  │  Server 8.0     │                  │
│  │   + Vite.js     │  │  + MudBlazor    │                  │
│  │   + shadcn/ui   │  │  + SignalR      │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  Backend Layer                                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Express.js    │  │  ASP.NET Core   │                  │
│  │   + Node.js     │  │  + C# 12        │                  │
│  │   + REST API    │  │  + Web API      │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Drizzle ORM   │  │ Entity Framework│                  │
│  │   + PostgreSQL  │  │ Core + PostgreSQL│                 │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Claude AI API  │  │   Email Service │                  │
│  │  (Anthropic)    │  │   (SMTP/Gmail)  │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Comparison

| Component | React/Express.js | .NET Blazor |
|-----------|------------------|-------------|
| **Frontend Framework** | React 18 | Blazor Server 8.0 |
| **Language** | TypeScript/JavaScript | C# 12 |
| **Build System** | Vite.js | MSBuild |
| **UI Components** | shadcn/ui + Radix UI | MudBlazor |
| **State Management** | React Query + Context | Blazor State + Services |
| **Backend Framework** | Express.js | ASP.NET Core |
| **API Style** | REST API | Web API + SignalR |
| **ORM** | Drizzle | Entity Framework Core |
| **Real-time Updates** | WebSocket | SignalR |
| **Authentication** | Session-based | ASP.NET Core Identity |

## Detailed Architecture Components

### Frontend Architecture

#### React/Express.js Frontend
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── form-builder/   # Form builder specific components
│   └── enterprise/     # Enterprise form components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes
```

Key Libraries:
- **React Query**: Server state management
- **Wouter**: Lightweight routing
- **@dnd-kit**: Drag and drop functionality
- **React Hook Form**: Form validation
- **Zod**: Schema validation

#### .NET Blazor Frontend
```
/
├── Components/         # Blazor components
│   ├── Layout/        # Layout components
│   ├── Forms/         # Form-related components
│   └── Shared/        # Shared components
├── Pages/             # Blazor pages
├── Models/            # Data models
├── Services/          # Application services
└── wwwroot/           # Static files
```

Key Libraries:
- **MudBlazor**: Component library
- **SignalR**: Real-time communication
- **AutoMapper**: Object mapping
- **FluentValidation**: Validation

### Backend Architecture

#### Express.js Backend
```
server/
├── routes/            # API route handlers
├── middleware/        # Express middleware
├── models/            # Database models
├── services/          # Business logic services
├── utils/             # Utility functions
└── config/            # Configuration files
```

Key Features:
- RESTful API endpoints
- JWT/Session authentication
- Request validation
- Error handling middleware
- Rate limiting

#### ASP.NET Core Backend
```
/
├── Controllers/       # API controllers
├── Services/          # Business logic services
├── Models/            # Data models
├── Data/              # Entity Framework context
├── Hubs/              # SignalR hubs
└── Extensions/        # Service extensions
```

Key Features:
- Web API controllers
- Dependency injection
- ASP.NET Core Identity
- SignalR hubs
- Background services

### Database Architecture

#### Schema Design
```sql
-- Core Tables
Users
├── Id (UUID)
├── Email (varchar)
├── PasswordHash (varchar)
├── Role (varchar)
└── CreatedAt (timestamp)

Forms
├── Id (int)
├── MenuId (varchar)
├── Label (varchar)
├── Description (text)
├── FormConfig (jsonb)
├── UserId (UUID)
├── CreatedAt (timestamp)
└── UpdatedAt (timestamp)

ExternalComponents
├── Id (int)
├── Name (varchar)
├── Type (varchar)
├── Properties (jsonb)
├── CreatedBy (UUID)
└── CreatedAt (timestamp)

Notifications
├── Id (int)
├── UserId (UUID)
├── Title (varchar)
├── Message (text)
├── IsRead (boolean)
└── CreatedAt (timestamp)
```

#### Data Relationships
- Users (1) → Forms (N)
- Users (1) → ExternalComponents (N)
- Users (1) → Notifications (N)
- Forms support JSONB for flexible component storage

### Security Architecture

#### Authentication Flow
```
1. User Login Request
   ↓
2. Credential Validation
   ↓
3. Session/JWT Creation
   ↓
4. Protected Resource Access
   ↓
5. Token/Session Validation
```

#### Security Measures
- **Password Hashing**: bcrypt with salt
- **Session Security**: Secure cookies with HttpOnly
- **CSRF Protection**: Built-in middleware
- **Input Validation**: Zod schemas (React) / Data Annotations (.NET)
- **SQL Injection Prevention**: ORM parameterized queries
- **XSS Prevention**: Output encoding
- **Rate Limiting**: Request throttling

### AI Integration Architecture

#### Claude AI Integration
```
User Request
    ↓
Form Description
    ↓
AI Processing Service
    ↓
Claude API Call
    ↓
Response Processing
    ↓
Form Component Generation
    ↓
Client Response
```

#### AI Service Features
- Natural language form generation
- Component suggestion
- Validation rule creation
- Error message generation
- Form optimization recommendations

### Real-time Architecture

#### React/Express.js Real-time
```javascript
// WebSocket connection
const ws = new WebSocket('/ws');

// Form collaboration
ws.on('component-updated', (data) => {
    updateComponent(data.componentId, data.properties);
});

// User presence
ws.on('user-joined', (user) => {
    showUserPresence(user);
});
```

#### Blazor SignalR Real-time
```csharp
// SignalR Hub
public class FormHub : Hub
{
    public async Task JoinForm(string formId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, formId);
    }

    public async Task UpdateComponent(string formId, object component)
    {
        await Clients.Group(formId).SendAsync("ComponentUpdated", component);
    }
}
```

### Performance Architecture

#### Caching Strategy
- **Browser Cache**: Static assets (CSS, JS, images)
- **Memory Cache**: Frequently accessed data
- **Database Cache**: Query result caching
- **CDN**: Global content delivery

#### Optimization Techniques
- **Code Splitting**: Lazy-loaded components
- **Tree Shaking**: Unused code elimination
- **Bundle Optimization**: Webpack/Vite optimization
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Database connection management

### Deployment Architecture

#### Development Environment
```
Local Machine
├── Node.js/npm (React version)
├── .NET SDK (Blazor version)
├── PostgreSQL
├── Git
└── VS Code/Visual Studio
```

#### Production Environment Options

##### Docker Deployment
```dockerfile
# Multi-stage build
FROM node:18-alpine AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
COPY --from=build /app/dist ./dist
CMD ["npm", "start"]
```

##### Cloud Deployment
- **Replit**: Integrated deployment platform
- **Heroku**: Container-based deployment
- **DigitalOcean**: App Platform deployment
- **Azure**: App Service + SQL Database
- **AWS**: EC2 + RDS deployment

### Monitoring & Logging

#### Application Monitoring
- **Health Checks**: Endpoint monitoring
- **Performance Metrics**: Response time tracking
- **Error Tracking**: Exception logging
- **User Analytics**: Usage statistics

#### Logging Strategy
```javascript
// Structured logging
logger.info('Form created', {
    formId: form.id,
    userId: user.id,
    timestamp: new Date().toISOString()
});
```

### Scalability Considerations

#### Horizontal Scaling
- **Load Balancing**: Multiple application instances
- **Database Replication**: Read replicas
- **Session Storage**: Redis/external session store
- **File Storage**: S3/blob storage

#### Vertical Scaling
- **Resource Optimization**: CPU/Memory tuning
- **Database Optimization**: Query optimization
- **Caching Enhancement**: Advanced caching strategies

### Development Workflow

#### Code Organization
```
├── .github/workflows/    # CI/CD pipelines
├── docs/                # Documentation
├── tests/               # Test suites
├── scripts/             # Build/deployment scripts
└── environments/        # Environment configurations
```

#### Quality Assurance
- **Unit Testing**: Component/service testing
- **Integration Testing**: API endpoint testing
- **E2E Testing**: User flow testing
- **Code Quality**: ESLint, Prettier, SonarQube
- **Security Scanning**: Dependency vulnerability checks

### Migration Strategies

#### Database Migrations
```bash
# Express.js with Drizzle
npm run db:generate
npm run db:migrate

# .NET with Entity Framework
dotnet ef migrations add MigrationName
dotnet ef database update
```

#### Version Compatibility
- **API Versioning**: Semantic versioning
- **Database Schema**: Backward compatibility
- **Client Updates**: Progressive enhancement

---

**Architecture Version**: 2.0.0  
**Last Updated**: August 2025  
**Maintainers**: FormBuilder Pro Architecture Team