@echo off
echo ========================================
echo Сборка .exe файла
echo ========================================
echo.
echo Это займет несколько минут...
echo.

cd gui-app

if not exist "node_modules" (
    echo Установка зависимостей...
    call npm install
    echo.
)

echo Сборка приложения...
call npm run build-win

echo.
echo ========================================
echo.
if exist "dist\Unactivity SMM Manager 1.0.0.exe" (
    echo ✅ УСПЕХ! .exe файл создан!
    echo.
    echo Расположение: gui-app\dist\Unactivity SMM Manager 1.0.0.exe
    echo.
    echo Вы можете скопировать этот файл куда угодно и запускать.
) else (
    echo ❌ Ошибка при сборке
)
echo.
echo ========================================
pause
