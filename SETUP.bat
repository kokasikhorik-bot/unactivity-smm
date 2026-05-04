@echo off
echo ========================================
echo Unactivity SMM - Установка
echo ========================================
echo.
echo Установка зависимостей для веб-сервера...
call npm install
echo.
echo ========================================
echo.
echo Установка зависимостей для GUI приложения...
cd gui-app
call npm install
cd ..
echo.
echo ========================================
echo.
echo Установка завершена!
echo.
echo Для запуска веб-сервера: START_SERVER.bat
echo Для запуска GUI приложения: START_GUI.bat
echo.
pause
