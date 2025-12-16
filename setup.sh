#!/bin/bash

# Demo Frontend Setup Script
# This script helps set up the demo project for testing the Jenkins pipeline

echo "🚀 Setting up Demo Frontend Application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Run linting
echo "🔍 Running linting check..."
npm run lint

# Run tests
echo ""
echo "🧪 Running tests..."
npm test

# Run build
echo ""
echo "🔨 Running build..."
npm run build

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Next Steps:"
echo "1. Create a Git repository:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit: Demo frontend app'"
echo ""
echo "2. Push to GitHub and create a PR"
echo "3. The Jenkins pipeline will automatically trigger!"
echo ""
echo "🧪 To test locally:"
echo "   npm run lint      - Check code quality"
echo "   npm test          - Run tests"
echo "   npm run build     - Build the app"
echo "   npm start         - Start dev server"
echo ""

