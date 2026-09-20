@echo off
chcp 65001 >nul 2>nul
title Starting...

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"
set "FRONTEND=%ROOT%\tft-assistant"
set "BACKEND=%FRONTEND%\server"

echo ========================================
echo   Zhangshangjinchanchan - One-Click Start
echo ========================================
echo.

REM Step 1
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 goto :no_node
node --version
echo   Node.js OK
echo.

REM Step 2
echo [2/4] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>nul | find /I "mongod.exe" >nul
if not errorlevel 1 goto :mongo_running

set "MONGOD="
for /f "delims=" %%a in ('dir /b /s "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" 2^>nul') do set "MONGOD=%%a"
if defined MONGOD (
    echo   Starting MongoDB...
    if not exist "%ROOT%\mongo_data" mkdir "%ROOT%\mongo_data"
    start "" /MIN "%MONGOD%" --dbpath "%ROOT%\mongo_data"
    echo   MongoDB started
) else (
    echo   [WARN] MongoDB not found, backend won't connect to database
)
goto :install

:mongo_running
echo   MongoDB already running
goto :install

:install
echo.
echo [3/4] Installing dependencies...

if not exist "%FRONTEND%\node_modules" (
    echo   Installing frontend deps...
    cd /d "%FRONTEND%"
    call npm install
) else (
    echo   Frontend deps already installed
)

if not exist "%BACKEND%\node_modules" (
    echo   Installing backend deps...
    cd /d "%BACKEND%"
    call npm install
) else (
    echo   Backend deps already installed
)

echo.
echo [4/4] Starting services...

echo   Starting backend (port 3000)...
start "Backend" cmd /k "cd /d "%BACKEND%" && node server.js"

timeout /t 3 /nobreak >nul

netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo   Backend OK
) else (
    echo   [WARN] Backend may have failed, check MongoDB
)

echo   Starting frontend (port 5174)...
start "Frontend" cmd /k "cd /d "%FRONTEND%" && npm run dev -- --port 5174 --strictPort"

timeout /t 4 /nobreak >nul

echo.
echo ========================================
echo   Services started!
echo   Frontend: http://localhost:5174
echo   Backend:  http://localhost:3000
echo ========================================
echo.
echo   Opening browser...
start http://localhost:5174

echo.
echo   Press any key to close this window.
echo   (Close Backend/Frontend windows separately to stop)
pause >nul
exit /b 0

:no_node
echo   [ERROR] Node.js not installed.
echo   Download: https://nodejs.org/
pause
exit /b 1
