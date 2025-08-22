# Contributing to FormBuilder Pro

Thank you for your interest in contributing to FormBuilder Pro! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x
- .NET 8.0 SDK
- Python 3.11+
- PostgreSQL database

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/formbuilder-pro.git`
3. Install dependencies: `npm install`
4. Create `.env` file in backend/ with required environment variables
5. Start development server: `npm run dev`

## 📋 Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow conventional commits:
- `feat: add new form component`
- `fix: resolve authentication issue`
- `docs: update installation guide`
- `refactor: optimize database queries`

## 🏗️ Project Structure

```
FormBuilder Pro/
├── backend/          # Node.js + Express backend
│   ├── server/       # API routes and server logic
│   ├── shared/       # Shared schemas and types
│   └── config/       # Configuration files
├── frontend/         # Frontend applications
│   ├── react/        # React application
│   └── blazor/       # .NET Blazor Server
└── ia/              # AI assistant
    ├── streamlit/    # Streamlit interface
    └── models/       # MFact business models
```

## 🔧 Development Guidelines

### Backend (Node.js + Express)
- Use TypeScript for all backend code
- Follow Drizzle ORM patterns for database interactions
- Implement proper error handling and validation
- Add JSDoc comments for complex functions

### Frontend (React)
- Use functional components with hooks
- Follow shadcn/ui component patterns
- Implement proper TypeScript types
- Use TanStack Query for API calls

### Frontend (Blazor)
- Follow .NET coding conventions
- Use MudBlazor components
- Implement proper error boundaries
- Add XML documentation comments

### AI Assistant (Python)
- Follow PEP 8 style guidelines
- Use type hints
- Add docstrings for functions
- Implement proper error handling

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run check
```

### Frontend Tests
```bash
npm run build
```

### Blazor Tests
```bash
cd frontend/blazor
dotnet test
```

## 📝 Code Quality

### Linting and Formatting
- Backend: ESLint + Prettier
- Frontend: ESLint + Prettier
- Blazor: .NET analyzers
- Python: Black + Flake8

### Pre-commit Hooks
Install pre-commit hooks to ensure code quality:
```bash
npm run prepare
```

## 🐛 Bug Reports

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node.js version, etc.)
- Screenshots if applicable

## 💡 Feature Requests

For feature requests, please provide:
- Clear description of the feature
- Use cases and benefits
- Proposed implementation approach
- Any relevant mockups or examples

## 📖 Documentation

- Update README.md for major changes
- Add JSDoc/XML comments for new functions
- Update API documentation for new endpoints
- Include examples for new features

## 🔒 Security

If you discover a security vulnerability, please email security@formbuilder-pro.com instead of opening a public issue.

## 📄 License

By contributing to FormBuilder Pro, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

Please be respectful and professional in all interactions. We want to maintain a welcoming environment for all contributors.

## 💬 Questions?

Feel free to open a discussion or issue if you have questions about contributing to the project.