#!/bin/bash

echo "🚀 Chess AI Clone - Render Deployment Helper"
echo "=============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if all required files exist
echo "📋 Checking required files..."

required_files=(
    "render.yaml"
    "backend/package.json"
    "package.json"
    "next.config.mjs"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - Missing!"
        exit 1
    fi
done

echo ""
echo "✅ All required files found!"
echo ""
echo "📝 Next steps for Render deployment:"
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add Render deployment config'"
echo "   git push"
echo ""
echo "2. Go to https://render.com and sign up/login"
echo ""
echo "3. Click 'New +' and select 'Blueprint'"
echo ""
echo "4. Connect your GitHub repository"
echo ""
echo "5. Render will automatically detect render.yaml and create both services"
echo ""
echo "6. Configure environment variables in Render dashboard:"
echo "   - MONGODB_URI: Your MongoDB connection string"
echo "   - JWT_SECRET: Generate a secure random string"
echo ""
echo "7. Wait for deployment to complete (usually 5-10 minutes)"
echo ""
echo "🎉 Your app will be available at:"
echo "   Frontend: https://chess-frontend.onrender.com"
echo "   Backend: https://chess-backend.onrender.com"
echo ""
echo "📚 For detailed instructions, see README.md" 