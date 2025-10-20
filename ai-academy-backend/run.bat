@echo off
echo ================================
echo AI Academy Backend Server
echo ================================
echo.

echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

echo Starting Django development server...
python manage.py runserver
