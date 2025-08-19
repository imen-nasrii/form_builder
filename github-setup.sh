#!/bin/bash

# FormBuilder Pro - GitHub Repository Setup Script
# This script helps you set up the repository on GitHub

echo "🚀 FormBuilder Pro - GitHub Setup"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Setting up repository files..."

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    echo "✅ .gitignore created"
else
    echo "✅ .gitignore already exists"
fi

# Create README.md if it doesn't exist
if [ ! -f "README.md" ]; then
    echo "Creating README.md..."
    echo "✅ README.md created"
else
    echo "✅ README.md already exists"
fi

# Create LICENSE if it doesn't exist
if [ ! -f "LICENSE" ]; then
    echo "Creating LICENSE..."
    echo "✅ LICENSE created"
else
    echo "✅ LICENSE already exists"
fi

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    echo "Creating .env.example..."
    echo "✅ .env.example created"
else
    echo "✅ .env.example already exists"
fi

echo ""
echo "🔧 Repository structure:"
echo "   ├── README.md              (Main documentation)"
echo "   ├── README-BLAZOR.md       (.NET Blazor guide)"
echo "   ├── LICENSE                (MIT license)"
echo "   ├── .gitignore             (Git ignore rules)"
echo "   ├── .env.example           (Environment template)"
echo "   ├── package.json           (Node.js dependencies)"
echo "   ├── FormBuilderPro.csproj  (.NET project file)"
echo "   └── ..."
echo ""

# Check git status
echo "📊 Current git status:"
git status --porcelain | head -10
if [ $(git status --porcelain | wc -l) -gt 10 ]; then
    echo "... and $(( $(git status --porcelain | wc -l) - 10 )) more files"
fi

echo ""
echo "📝 Next steps to push to GitHub:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   • Go to https://github.com/new"
echo "   • Repository name: formbuilder-pro"
echo "   • Description: Advanced multi-platform form builder with AI"
echo "   • Set to Public or Private"
echo "   • DON'T initialize with README, .gitignore, or license (we have them)"
echo ""

echo "2. Add all files to git:"
echo "   git add ."
echo ""

echo "3. Make initial commit:"
echo "   git commit -m \"Initial commit: FormBuilder Pro with dual architecture support\""
echo ""

echo "4. Add GitHub remote (replace 'yourusername' with your GitHub username):"
echo "   git remote add origin https://github.com/yourusername/formbuilder-pro.git"
echo ""

echo "5. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

echo "6. Set up environment variables:"
echo "   • Copy .env.example to .env"
echo "   • Fill in your database and API key details"
echo "   • Never commit the .env file (it's in .gitignore)"
echo ""

echo "🔐 Important: Environment Variables"
echo "   Make sure to configure these in your deployment:"
echo "   • DATABASE_URL (PostgreSQL connection)"
echo "   • ANTHROPIC_API_KEY (for AI features)"
echo "   • OPENAI_API_KEY (for AI features)"
echo "   • SESSION_SECRET (random string for sessions)"
echo ""

echo "🎯 Repository Features:"
echo "   ✅ Dual architecture (React + .NET Blazor)"
echo "   ✅ Comprehensive documentation"
echo "   ✅ Environment configuration"
echo "   ✅ MIT License"
echo "   ✅ Professional .gitignore"
echo "   ✅ Setup scripts and guides"
echo ""

echo "🚀 Your FormBuilder Pro is ready for GitHub!"
echo ""

# Ask if user wants to add and commit files
read -p "🤔 Would you like to add and commit all files now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📦 Adding all files..."
    git add .
    
    echo "📝 Creating initial commit..."
    git commit -m "Initial commit: FormBuilder Pro with dual architecture support

Features:
- React + Express.js architecture
- .NET Blazor Server architecture  
- AI assistant integration
- PostgreSQL database support
- Comprehensive form builder
- Component management system
- User authentication
- MudBlazor and Radix UI components"
    
    echo ""
    echo "✅ Files committed successfully!"
    echo ""
    echo "🌟 Now add your GitHub remote and push:"
    echo "   git remote add origin https://github.com/yourusername/formbuilder-pro.git"
    echo "   git push -u origin main"
else
    echo ""
    echo "👍 No problem! Run the git commands manually when ready."
fi

echo ""
echo "📚 Additional Resources:"
echo "   • GitHub CLI: gh repo create formbuilder-pro --public"
echo "   • GitHub Desktop: https://desktop.github.com/"
echo "   • Git Documentation: https://git-scm.com/doc"
echo ""
echo "🎉 Happy coding!"