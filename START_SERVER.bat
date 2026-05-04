@echo off
echo ========================================
echo Unactivity SMM - Web Server
echo ========================================
echo.
echo Запуск веб-сервера...
echo.

if not exist "node_modules" (
    echo Установка зависимостей...
    call npm install
    echo.
)

echo Сервер запускается на http://localhost:3000
echo.
echo Нажмите Ctrl+C для остановки сервера
echo.

call npm start

pause
