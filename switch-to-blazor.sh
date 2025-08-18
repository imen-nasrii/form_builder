#!/bin/bash

# FormBuilder Pro - Switch to .NET Blazor Architecture
# This script helps transition from npm/React to dotnet/Blazor

echo "🔄 FormBuilder Pro - Architecture Switch"
echo "========================================"
echo ""
echo "Current architecture: React + Express.js (npm run dev)"
echo "Target architecture:  .NET Blazor Server (dotnet watch run)"
echo ""

# Check current running processes
if pgrep -f "npm run dev" > /dev/null; then
    echo "📋 Currently running: npm run dev (React + Express)"
    echo "   Process ID: $(pgrep -f 'npm run dev')"
    echo ""
    echo "⚠️  To switch to .NET Blazor:"
    echo "   1. Stop the current npm process (Ctrl+C in console)"
    echo "   2. Install .NET 8 SDK if not available"
    echo "   3. Run: dotnet watch run"
    echo ""
else
    echo "📋 No npm process detected"
fi

# Check if .NET is available
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    echo "✅ .NET Runtime detected: v$DOTNET_VERSION"
    echo ""
    echo "🚀 Ready to switch! Run these commands:"
    echo "   # Stop npm (if running)"
    echo "   pkill -f 'npm run dev'"
    echo ""
    echo "   # Start .NET Blazor with hot reload"
    echo "   dotnet watch run"
    echo ""
    echo "   # Or use the development script"
    echo "   ./dotnet-watch-workflow.sh"
    echo ""
else
    echo "⚠️  .NET Runtime not found"
    echo ""
    echo "📥 To install .NET 8:"
    echo "   # On Ubuntu/Debian"
    echo "   wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb"
    echo "   sudo dpkg -i packages-microsoft-prod.deb"
    echo "   sudo apt-get update"
    echo "   sudo apt-get install -y dotnet-sdk-8.0"
    echo ""
    echo "   # Or download from: https://dotnet.microsoft.com/download"
    echo ""
fi

echo "📊 Architecture Comparison:"
echo "┌──────────────────┬──────────────────┬────────────────────┐"
echo "│ Aspect           │ Current (React)  │ Target (Blazor)    │"
echo "├──────────────────┼──────────────────┼────────────────────┤"
echo "│ Command          │ npm run dev      │ dotnet watch run   │"
echo "│ Frontend         │ React 18         │ Blazor Server      │"
echo "│ Backend          │ Express.js       │ ASP.NET Core       │"
echo "│ Hot Reload       │ Vite HMR         │ .NET Hot Reload    │"
echo "│ Port             │ :5000            │ :5001 (HTTPS)      │"
echo "│ Database         │ Drizzle ORM      │ Entity Framework   │"
echo "│ UI Components    │ Radix UI         │ MudBlazor          │"
echo "└──────────────────┴──────────────────┴────────────────────┘"
echo ""

# Show project files for both architectures
echo "📁 Project Files Available:"
echo ""
echo "React Architecture:"
echo "   ✅ package.json              (npm dependencies)"
echo "   ✅ server/index.ts           (Express server)"
echo "   ✅ client/src/App.tsx        (React components)"
echo "   ✅ vite.config.ts            (Vite configuration)"
echo ""
echo ".NET Blazor Architecture:"
echo "   ✅ FormBuilderPro.csproj     (.NET project file)"
echo "   ✅ Program.cs                (ASP.NET Core startup)"
echo "   ✅ Pages/FormBuilder.razor   (Blazor components)"
echo "   ✅ Models/Form.cs            (Entity Framework models)"
echo ""

echo "🎯 Both architectures are ready to use!"
echo "   Choose the one that fits your development workflow."