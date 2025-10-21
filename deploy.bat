@echo off
REM iStudy Deployment Helper Script for Windows

:menu
cls
echo ==================================
echo    iStudy Deployment Helper
echo ==================================
echo.
echo Select deployment option:
echo.
echo FRONTEND:
echo 1) Deploy to Vercel
echo 2) Deploy to Netlify
echo 3) Build for production
echo.
echo BACKEND:
echo 4) Deploy to Railway
echo 5) Deploy to Heroku
echo 6) Deploy to Render
echo.
echo DOCKER:
echo 7) Build Docker images
echo 8) Run with Docker Compose
echo.
echo OTHER:
echo 9) Run tests
echo 10) Exit
echo.

set /p choice="Enter your choice [1-10]: "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto build_frontend
if "%choice%"=="4" goto railway
if "%choice%"=="5" goto heroku
if "%choice%"=="6" goto render
if "%choice%"=="7" goto build_docker
if "%choice%"=="8" goto docker_compose
if "%choice%"=="9" goto tests
if "%choice%"=="10" goto exit

echo Invalid option. Please try again.
pause
goto menu

:vercel
echo Deploying to Vercel...
cd ai-academy-react
call vercel --prod
cd ..
pause
goto menu

:netlify
echo Deploying to Netlify...
cd ai-academy-react
call netlify deploy --prod
cd ..
pause
goto menu

:build_frontend
echo Building frontend for production...
cd ai-academy-react
call npm install
call npm run build
echo Build complete! Files in .\dist
cd ..
pause
goto menu

:railway
echo Deploying to Railway...
cd ai-academy-backend
call railway up
cd ..
pause
goto menu

:heroku
echo Deploying to Heroku...
cd ai-academy-backend
call heroku login
call heroku create
call heroku addons:create heroku-postgresql:hobby-dev
call git push heroku main
call heroku run python manage.py migrate
cd ..
pause
goto menu

:render
echo.
echo To deploy to Render:
echo 1. Go to https://render.com
echo 2. Create new Web Service
echo 3. Connect GitHub repository
echo 4. Select 'ai-academy-backend' directory
echo 5. Add PostgreSQL database
echo 6. Set environment variables
echo.
echo See DEPLOYMENT.md for details
pause
goto menu

:build_docker
echo Building Docker images...
echo.
echo Building backend...
docker build -t istudy-backend:latest ./ai-academy-backend
echo.
echo Building frontend...
docker build -t istudy-frontend:latest ./ai-academy-react
echo.
echo Docker images built successfully!
docker images | findstr istudy
pause
goto menu

:docker_compose
echo Starting services with Docker Compose...
docker-compose up --build -d
echo.
echo Services started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
pause
goto menu

:tests
echo Running tests...
echo.
echo Frontend tests...
cd ai-academy-react
call npm install
call npm run build
cd ..
echo.
echo Backend tests...
cd ai-academy-backend
call python manage.py check
cd ..
echo.
echo Tests complete!
pause
goto menu

:exit
echo Goodbye!
exit
