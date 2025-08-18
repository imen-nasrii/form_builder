#!/bin/bash

# FormBuilder Pro - .NET Watch Development Workflow
# This script configures and runs the Blazor application with hot reload

echo "🚀 FormBuilder Pro - .NET Watch Development Mode"
echo "================================================"
echo ""

# Set environment variables for development
export ASPNETCORE_ENVIRONMENT=Development
export ASPNETCORE_URLS="https://localhost:5001;http://localhost:5000"

# Check for required environment variables
echo "🔧 Checking environment configuration..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Using default PostgreSQL connection."
    export DATABASE_URL="Host=localhost;Database=formbuilder_pro;Username=postgres;Password=postgres"
fi

echo "✅ Environment configured:"
echo "   • ASPNETCORE_ENVIRONMENT: $ASPNETCORE_ENVIRONMENT"
echo "   • ASPNETCORE_URLS: $ASPNETCORE_URLS"
echo "   • DATABASE_URL: [configured]"
echo ""

# Restore packages if needed
echo "📦 Restoring .NET packages..."
if [ -f "FormBuilderPro.csproj" ]; then
    dotnet restore
    echo "✅ Packages restored successfully"
else
    echo "❌ FormBuilderPro.csproj not found!"
    exit 1
fi

echo ""
echo "🎯 Starting Blazor application with hot reload..."
echo "   • File changes will trigger automatic rebuilds"
echo "   • Browser will refresh automatically"
echo "   • CSS changes apply instantly"
echo "   • Razor page changes trigger re-compilation"
echo ""
echo "🌐 Application will be available at:"
echo "   • HTTPS: https://localhost:5001"
echo "   • HTTP:  http://localhost:5000"
echo ""
echo "⌨️  Press Ctrl+C to stop the application"
echo "================================================"
echo ""

# Start the application with hot reload
dotnet watch run --urls="$ASPNETCORE_URLS"