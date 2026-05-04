@echo off
echo ========================================
echo Unactivity SMM Manager - GUI
echo ========================================
echo.

if exist "gui-app\dist\Unactivity SMM Manager 1.0.0.exe" (
    echo Запуск .exe файла...
    start "" "gui-app\dist\Unactivity SMM Manager 1.0.0.exe"
) else (
    echo .exe файл не найден. Запуск через npm...
    echo.
    cd gui-app
    
    if not exist "node_modules" (
        echo Установка зависимостей...
        call npm install
        echo.
    )
    
    echo Запуск приложения...
    call npm start
)
