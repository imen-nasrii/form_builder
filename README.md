# FormBuilder Pro

An advanced multi-platform enterprise AI form generation platform that leverages cutting-edge technologies for comprehensive data management and dynamic form creation.

## 🚀 Features

- **Dual Architecture Support**: Choose between React+Express or .NET Blazor Server
- **Visual Form Builder**: Drag-and-drop interface with live preview
- **AI Assistant "Alex"**: ChatGPT-style interface for form generation
- **Advanced Component Library**: 25+ component types with MFact models
- **User Management**: Role-based access control and authentication
- **Database Integration**: PostgreSQL with full CRUD operations
- **Export Capabilities**: Multi-framework export (React, Vue, Blazor)
- **Real-time Updates**: Live collaboration and instant feedback

## 🏗️ Architecture Options

### Option 1: React + Express.js (Current)
```bash
npm install
npm run dev
# Opens on http://localhost:5000
```

### Option 2: .NET Blazor Server
```bash
dotnet restore
dotnet watch run
# Opens on https://localhost:5001
```

## 🛠️ Technology Stack

### React Architecture
- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Radix UI components + Tailwind CSS
- **Auth**: Custom session management

### .NET Blazor Architecture  
- **Frontend**: Blazor Server, C#
- **Backend**: ASP.NET Core 8.0
- **Database**: PostgreSQL with Entity Framework Core
- **UI**: MudBlazor components
- **Auth**: ASP.NET Core Identity

## 📋 Prerequisites

### For React Version
- Node.js 18+ 
- npm or yarn
- PostgreSQL database

### For .NET Version
- .NET 8.0 SDK
- PostgreSQL database
- Visual Studio 2022 or VS Code

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/formbuilder-pro.git
cd formbuilder-pro
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure your variables
DATABASE_URL="postgresql://username:password@localhost:5432/formbuilder_pro"
ANTHROPIC_API_KEY="your-anthropic-key"
OPENAI_API_KEY="your-openai-key"
```

### 3. Choose Your Architecture

#### React + Express
```bash
npm install
npm run dev
```

#### .NET Blazor
```bash
dotnet restore
dotnet watch run
```

## 📁 Project Structure

```
formbuilder-pro/
├── 📂 React Architecture
│   ├── client/                 # React frontend
│   ├── server/                 # Express backend
│   ├── shared/                 # Shared types
│   ├── package.json
│   └── vite.config.ts
├── 📂 .NET Architecture  
│   ├── Pages/                  # Blazor pages
│   ├── Components/             # Blazor components
│   ├── Models/                 # Data models
│   ├── Services/               # Business logic
│   ├── Data/                   # Database context
│   └── FormBuilderPro.csproj
├── 📂 AI Integration
│   ├── ai_assistant.py         # Python AI assistant
│   └── training_examples.json  # AI training data
└── 📂 Documentation
    ├── README.md
    ├── README-BLAZOR.md
    └── Technical_Architecture_Guide.md
```

## 🔧 Development

### React Development
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Run production server
npm start
```

### .NET Development
```bash
# Run with hot reload
dotnet watch run

# Build project
dotnet build

# Run migrations
dotnet ef database update
```

### Database Setup
```bash
# Create database
createdb formbuilder_pro

# Run migrations (React)
npm run db:push

# Run migrations (.NET)
dotnet ef database update
```

## 🤖 AI Assistant Features

- **DFM File Processing**: Convert Delphi forms to JSON
- **Component Mapping**: Intelligent component type detection  
- **Form Generation**: AI-powered form creation
- **Model Integration**: Support for 100+ C# models
- **Interactive Chat**: ChatGPT-style conversation interface

## 🎨 UI Components

### React Components
- Drag-and-drop form builder
- Property editors with validation
- Component palette with categories
- External component management
- Visual component creator

### Blazor Components  
- MudBlazor form builder
- Server-side rendering
- Real-time updates via SignalR
- Integrated authentication
- Entity Framework integration

## 🔐 Authentication

### React Version
- Session-based authentication
- bcrypt password hashing
- Custom user management
- Role-based access control

### .NET Version
- ASP.NET Core Identity
- Entity Framework user store
- Built-in security features
- Integrated authorization

## 📊 Database Schema

### Core Tables
- **Users**: User accounts and profiles
- **Forms**: Form definitions and metadata
- **Components**: Custom component library  
- **Notifications**: System notifications
- **Templates**: Form templates and presets

## 🌐 API Endpoints

### React API
- `GET /api/forms` - List user forms
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `GET /api/components` - List components

### .NET API
- Built-in Blazor Server communication
- Real-time updates via SignalR
- Entity Framework integration
- Automatic API generation

## 📈 Performance

- **React**: Vite hot module replacement
- **Blazor**: Built-in hot reload
- **Database**: Optimized queries with indexes
- **Caching**: Intelligent data caching
- **CDN**: Static asset optimization

## 🧪 Testing

```bash
# React tests
npm test

# .NET tests  
dotnet test

# E2E tests
npm run test:e2e
```

## 📦 Deployment

### React Deployment
```bash
npm run build
npm start
```

### .NET Deployment
```bash
dotnet publish -c Release
dotnet run --environment Production
```

### Docker Support
```bash
# Build React image
docker build -t formbuilder-pro-react .

# Build .NET image  
docker build -f Dockerfile.blazor -t formbuilder-pro-blazor .
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@formbuilder-pro.com
- 📚 Documentation: [docs.formbuilder-pro.com](https://docs.formbuilder-pro.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/formbuilder-pro/issues)

## 🙏 Acknowledgments

- MudBlazor for excellent Blazor components
- Radix UI for accessible React primitives  
- Anthropic and OpenAI for AI capabilities
- PostgreSQL for robust data storage
- The open-source community

---

**FormBuilder Pro** - Build forms faster with AI-powered tools and modern technology stacks.