@echo off
echo ================================
echo AI Academy Backend Setup
echo ================================
echo.

echo Checking Python installation...
python --version
if errorlevel 1 (
    echo Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo.

echo Creating virtual environment...
python -m venv venv
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Installing dependencies...
pip install -r requirements.txt
echo.

echo Running migrations...
python manage.py makemigrations
python manage.py migrate
echo.

echo.
echo ================================
echo Setup completed successfully!
echo ================================
echo.
echo Next steps:
echo 1. Create superuser: python manage.py createsuperuser
echo 2. Run server: python manage.py runserver
echo.
echo Don't forget to activate virtual environment first:
echo venv\Scripts\activate
echo.
pause
