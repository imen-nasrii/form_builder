# FormBuilder Pro - .NET Blazor Architecture

## 🎉 Migration Complete

The FormBuilder Pro application has been **successfully migrated** from React + Vite.js + Express.js to a complete **.NET 8.0 Blazor Server** architecture!

## 🚀 Running the Application

### Prerequisites
- .NET 8.0 SDK
- PostgreSQL database
- Visual Studio 2022 or VS Code with C# extension

### Quick Start
```bash
# 1. Restore dependencies
dotnet restore

# 2. Set up database connection (update appsettings.json or set environment variable)
export DATABASE_URL="Host=localhost;Database=formbuilder_pro;Username=postgres;Password=yourpassword"

# 3. Run the application with hot reload (recommended for development)
dotnet watch run

# Alternative: Run without hot reload
dotnet run

# 4. Open browser to
https://localhost:5001
```

### 🔥 Development with Hot Reload
For the best development experience, use `dotnet watch run`:

```bash
# Start with hot reload and custom URLs
dotnet watch run --urls="https://localhost:5001;http://localhost:5000"

# Or use the provided development script
./dotnet-watch-workflow.sh
```

**Hot Reload Features:**
- **Automatic restart** on C# code changes
- **Live reload** of Razor pages and components
- **CSS hot reload** without page refresh
- **Real-time updates** as you edit files
- **Faster development cycle** with instant feedback

## 📁 Project Structure

```
FormBuilderPro/
├── FormBuilderPro.csproj          # Project configuration
├── Program.cs                     # Application entry point
├── appsettings.json              # Configuration
├── _Imports.razor                # Global imports
├── App.razor                     # Main app component
├── Data/
│   └── ApplicationDbContext.cs   # Entity Framework context
├── Models/
│   ├── ApplicationUser.cs        # User model with Identity
│   ├── Form.cs                   # Form and field models
│   └── Notification.cs           # Notification model
├── Services/
│   ├── IFormService.cs           # Form service interface
│   ├── FormService.cs            # Form business logic
│   ├── IComponentService.cs      # Component service interface
│   ├── ComponentService.cs       # Component management
│   ├── INotificationService.cs   # Notification service interface
│   └── NotificationService.cs    # Notification management
├── Pages/
│   ├── Index.razor               # Home page
│   ├── FormBuilder.razor         # Main form builder with drag-and-drop
│   ├── Forms.razor               # Form management
│   └── Shared/
│       ├── _Host.cshtml          # Host page
│       ├── _Layout.cshtml        # HTML layout
│       ├── MainLayout.razor      # Blazor main layout
│       └── NavMenu.razor         # Navigation menu
├── Components/
│   ├── FormFieldRenderer.razor  # Field rendering component
│   └── FieldPropertiesEditor.razor # Properties editor
└── wwwroot/
    └── css/
        └── site.css              # Custom styles
```

## 🔧 Technology Stack

### Frontend
- **.NET 8.0 Blazor Server** - Server-side rendering with real-time updates
- **MudBlazor** - Modern Blazor UI component library
- **SignalR** - Real-time communication (built into Blazor Server)

### Backend
- **ASP.NET Core 8.0** - High-performance web framework
- **Entity Framework Core** - Object-relational mapping
- **ASP.NET Core Identity** - Authentication and authorization

### Database
- **PostgreSQL** - Primary database with full EF Core support
- **Entity Framework Migrations** - Schema management

## ✨ Key Features Implemented

### 🎯 Form Builder
- **Drag-and-drop interface** using MudBlazor components
- **Component palette** with categorized form elements
- **Real-time property editing** with live preview
- **Custom component creation** and management
- **Form validation** and field configuration

### 🔐 Authentication
- **ASP.NET Core Identity** integration
- **User management** with roles and permissions
- **Secure password handling** with bcrypt

### 💾 Data Management
- **Complete CRUD operations** for forms and components
- **JSON serialization** for complex field structures
- **PostgreSQL integration** with connection string support
- **Migration support** for database schema updates

### 🎨 User Interface
- **MudBlazor components** for consistent, modern UI
- **Responsive design** that works on all devices
- **Dark/light theme support** 
- **Accessibility features** built into MudBlazor

## 🔄 Migration Summary

| Aspect | React + Vite | .NET Blazor |
|--------|-------------|-------------|
| Frontend Framework | React 18 | Blazor Server |
| Backend | Express.js | ASP.NET Core |
| Database ORM | Drizzle | Entity Framework Core |
| UI Components | Radix UI | MudBlazor |
| Authentication | Custom sessions | ASP.NET Core Identity |
| Styling | Tailwind CSS | MudBlazor + Custom CSS |
| Real-time | WebSockets | SignalR (built-in) |

## 🛠 Development Commands

```bash
# Build the project
dotnet build

# Run in development mode with hot reload (recommended)
dotnet watch run

# Run with custom URLs and hot reload
dotnet watch run --urls="https://localhost:5001;http://localhost:5000"

# Run without hot reload
dotnet run

# Run with specific environment
ASPNETCORE_ENVIRONMENT=Development dotnet watch run

# Create database migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update

# Clean and rebuild
dotnet clean && dotnet build

# Run the development workflow script
./dotnet-watch-workflow.sh
```

### 🔧 .NET Watch Features

`dotnet watch` provides automatic recompilation and restart when files change:

- **C# Code Changes**: Automatic restart of the application
- **Razor Pages (.razor)**: Live reload without losing state
- **CSS Files**: Hot reload without page refresh
- **Static Files**: Immediate refresh
- **Configuration Changes**: Application restart

**Example workflow:**
1. Start: `dotnet watch run`
2. Edit a Razor component
3. Save the file
4. Browser automatically updates
5. Continue developing with instant feedback

## 🌐 Environment Variables

```bash
# Database connection
DATABASE_URL="Host=localhost;Database=formbuilder_pro;Username=postgres;Password=yourpassword"

# AI Integration (optional)
ANTHROPIC_API_KEY="your-anthropic-key"
OPENAI_API_KEY="your-openai-key"

# Environment
ASPNETCORE_ENVIRONMENT="Development"
ASPNETCORE_URLS="https://localhost:5001;http://localhost:5000"
```

## 📝 API Endpoints

The Blazor Server architecture uses server-side rendering with minimal API endpoints. Most interactions are handled through Blazor components and services.

Key service methods:
- `IFormService.GetUserFormsAsync()` - Get user's forms
- `IFormService.CreateFormAsync()` - Create new form
- `IFormService.UpdateFormAsync()` - Update existing form
- `IComponentService.GetUserComponentsAsync()` - Get custom components

## 🎯 Next Steps

1. **Deploy to production** with proper database and SSL configuration
2. **Add AI assistant integration** using the configured API keys
3. **Implement advanced form validation** rules
4. **Add export functionality** for multiple frameworks
5. **Enhance component library** with more field types

## 🆘 Troubleshooting

### Common Issues

1. **"dotnet command not found"**
   - Install .NET 8.0 SDK from https://dotnet.microsoft.com/download

2. **Database connection errors**
   - Verify PostgreSQL is running
   - Check connection string in appsettings.json
   - Run `dotnet ef database update`

3. **MudBlazor components not rendering**
   - Ensure MudBlazor services are registered in Program.cs
   - Check _Imports.razor for MudBlazor using statements

### Performance Tips

- Use `@rendermode="ServerPrerendered"` for faster initial loads
- Implement lazy loading for large component lists
- Use `StateHasChanged()` judiciously to control re-renders

## 📄 License

This project maintains the same license as the original FormBuilder Pro application.

---

**Congratulations!** 🎉 Your FormBuilder Pro application is now running on modern .NET Blazor technology with all the original functionality preserved and enhanced!