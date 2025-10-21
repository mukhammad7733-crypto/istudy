#!/bin/bash

# iStudy Deployment Helper Script

echo "=================================="
echo "   iStudy Deployment Helper"
echo "=================================="
echo ""

# Function to display menu
show_menu() {
    echo "Select deployment option:"
    echo ""
    echo "FRONTEND:"
    echo "1) Deploy to Vercel"
    echo "2) Deploy to Netlify"
    echo "3) Build for production"
    echo ""
    echo "BACKEND:"
    echo "4) Deploy to Railway"
    echo "5) Deploy to Heroku"
    echo "6) Deploy to Render"
    echo ""
    echo "DOCKER:"
    echo "7) Build Docker images"
    echo "8) Run with Docker Compose"
    echo ""
    echo "OTHER:"
    echo "9) Run tests"
    echo "10) Exit"
    echo ""
}

# Frontend - Vercel
deploy_vercel() {
    echo "Deploying to Vercel..."
    cd ai-academy-react

    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi

    vercel --prod
    cd ..
}

# Frontend - Netlify
deploy_netlify() {
    echo "Deploying to Netlify..."
    cd ai-academy-react

    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi

    netlify deploy --prod
    cd ..
}

# Frontend - Build
build_frontend() {
    echo "Building frontend for production..."
    cd ai-academy-react
    npm install
    npm run build
    echo "Build complete! Files in ./dist"
    cd ..
}

# Backend - Railway
deploy_railway() {
    echo "Deploying to Railway..."
    cd ai-academy-backend

    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi

    railway up
    cd ..
}

# Backend - Heroku
deploy_heroku() {
    echo "Deploying to Heroku..."
    cd ai-academy-backend

    if ! command -v heroku &> /dev/null; then
        echo "Please install Heroku CLI first:"
        echo "https://devcenter.heroku.com/articles/heroku-cli"
        return
    fi

    heroku login
    heroku create
    heroku addons:create heroku-postgresql:hobby-dev
    git push heroku main
    heroku run python manage.py migrate
    cd ..
}

# Backend - Render
deploy_render() {
    echo "To deploy to Render:"
    echo "1. Go to https://render.com"
    echo "2. Create new Web Service"
    echo "3. Connect GitHub repository"
    echo "4. Select 'ai-academy-backend' directory"
    echo "5. Add PostgreSQL database"
    echo "6. Set environment variables"
    echo ""
    echo "See DEPLOYMENT.md for details"
}

# Docker - Build
build_docker() {
    echo "Building Docker images..."

    echo "Building backend..."
    docker build -t istudy-backend:latest ./ai-academy-backend

    echo "Building frontend..."
    docker build -t istudy-frontend:latest ./ai-academy-react

    echo "Docker images built successfully!"
    docker images | grep istudy
}

# Docker - Compose
run_docker_compose() {
    echo "Starting services with Docker Compose..."
    docker-compose up --build -d

    echo ""
    echo "Services started!"
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:8000"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

# Run tests
run_tests() {
    echo "Running tests..."

    echo "Frontend tests..."
    cd ai-academy-react
    npm install
    npm run build
    cd ..

    echo "Backend tests..."
    cd ai-academy-backend
    python manage.py check
    cd ..

    echo "Tests complete!"
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-10]: " choice

    case $choice in
        1) deploy_vercel ;;
        2) deploy_netlify ;;
        3) build_frontend ;;
        4) deploy_railway ;;
        5) deploy_heroku ;;
        6) deploy_render ;;
        7) build_docker ;;
        8) run_docker_compose ;;
        9) run_tests ;;
        10)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac

    echo ""
    read -p "Press Enter to continue..."
    clear
done
