# FormBuilder Pro - Quick Start Guide

Get FormBuilder Pro running on your machine in under 10 minutes.

## Prerequisites

- Node.js 18+ or .NET 8.0 SDK
- PostgreSQL 14+
- Git

## Quick Setup

### 1. Clone & Install

```bash
git clone https://github.com/imen-nasrii/formbuilder-pro.git
cd formbuilder-pro
npm install  # For React version
# OR
dotnet restore  # For Blazor version
```

### 2. Database Setup

```bash
# Create PostgreSQL database
sudo -u postgres createdb formbuilder_pro
sudo -u postgres createuser -P formbuilder_user
```

### 3. Environment Configuration

Create `.env` file:
```env
DATABASE_URL=postgresql://formbuilder_user:password@localhost:5432/formbuilder_pro
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### 4. Run Application

Choose your preferred technology stack:

#### React/Express.js
```bash
npm run dev
```
Open: http://localhost:5000

#### .NET Blazor
```bash
dotnet watch run
```
Open: https://localhost:7000

## Next Steps

1. **Create your first form**: Navigate to Forms → New Form
2. **Add components**: Drag and drop from the component palette
3. **Configure properties**: Double-click components to edit advanced properties
4. **Test AI assistant**: Click AI Assistant and describe your form
5. **Export your form**: Use Actions menu to export as JSON

## Need Help?

- 📖 [Complete Setup Guide](./COMPREHENSIVE_SETUP_GUIDE.md)
- 🔧 [API Documentation](./API_DOCUMENTATION.md)
- 🐛 [Troubleshooting](./TROUBLESHOOTING.md)

Happy form building! 🚀