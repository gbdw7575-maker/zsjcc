@echo off
chcp 65001 >nul 2>nul
title TFT Assistant Launcher

set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"
set "FRONTEND=%ROOT%\tft-assistant"
set "BACKEND=%FRONTEND%\server"
set "AS_NODE=0"
set "NODE_EXE="

echo ========================================
echo   Zhangshangjinchanchan - One-Click Start
echo ========================================
echo.

REM ===== [1/4] Discover Node runtime =====
echo [1/4] Checking Node.js runtime...

where node >nul 2>&1
if not errorlevel 1 (
    set "NODE_EXE=node"
    goto runtime_ok
)

REM Registry Node.js InstallPath
set "INSTP="
for /f "tokens=2,*" %%a in ('reg query "HKLM\SOFTWARE\Node.js" /v InstallPath 2^>nul') do set "INSTP=%%b"
if defined INSTP if exist "%INSTP%node.exe" (
    set "NODE_EXE=%INSTP%node.exe"
    goto runtime_ok
)

REM Trae Electron candidates (ELECTRON_RUN_AS_NODE=1)
if exist "D:\Trae CN\Trae CN.exe" (
    set "NODE_EXE=D:\Trae CN\Trae CN.exe"
    set "AS_NODE=1"
    goto runtime_ok
)
if exist "D:\Trae\Trae.exe" (
    set "NODE_EXE=D:\Trae\Trae.exe"
    set "AS_NODE=1"
    goto runtime_ok
)
if exist "%LOCALAPPDATA%\Programs\Trae CN\Trae CN.exe" (
    set "NODE_EXE=%LOCALAPPDATA%\Programs\Trae CN\Trae CN.exe"
    set "AS_NODE=1"
    goto runtime_ok
)

echo   [ERROR] Node.js not found. Install it from https://nodejs.org/
pause
exit /b 1

:runtime_ok
if "%AS_NODE%"=="1" (
    echo   Using Trae Electron bundled Node: %NODE_EXE%
) else (
    echo   Node: %NODE_EXE%
)
echo.

REM ===== [2/4] MongoDB =====
echo [2/4] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>nul | find /I "mongod.exe" >nul
if not errorlevel 1 (
    echo   MongoDB already running
    goto deps
)

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

:deps
echo.
echo [3/4] Checking dependencies...
if exist "%FRONTEND%\node_modules" (
    echo   Frontend deps OK
) else (
    echo   [WARN] Frontend deps missing, run npm install in %FRONTEND%
)
if exist "%BACKEND%\node_modules" (
    echo   Backend deps OK
) else (
    echo   [WARN] Backend deps missing, run npm install in %BACKEND%
)

echo.
echo [4/4] Starting services...

REM --- Backend on port 3000 ---
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo   Port 3000 in use, backend skipped
    goto start_frontend
)
echo   Starting backend (port 3000)...
if "%AS_NODE%"=="1" (
    start "Backend" cmd /k "cd /d "%BACKEND%" && set ELECTRON_RUN_AS_NODE=1 && "%NODE_EXE%" server.js"
) else (
    start "Backend" cmd /k "cd /d "%BACKEND%" && "%NODE_EXE%" server.js"
)
timeout /t 5 /nobreak >nul
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul
if not errorlevel 1 (echo   Backend OK) else echo   [WARN] Backend not listening, check Backend window

:start_frontend
REM --- Frontend on port 5174 ---
netstat -ano | findstr ":5174 " | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo   Port 5174 in use, frontend skipped
    goto done
)
echo   Starting frontend (port 5174)...
if "%AS_NODE%"=="1" (
    start "Frontend" cmd /k "cd /d "%FRONTEND%" && set ELECTRON_RUN_AS_NODE=1 && "%NODE_EXE%" node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5174 --strictPort"
) else (
    start "Frontend" cmd /k "cd /d "%FRONTEND%" && "%NODE_EXE%" node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5174 --strictPort"
)
timeout /t 6 /nobreak >nul
netstat -ano | findstr ":5174 " | findstr "LISTENING" >nul
if not errorlevel 1 (echo   Frontend OK) else echo   [WARN] Frontend not listening, check Frontend window

:done
echo.
echo ========================================
echo   Services started!
echo   Frontend: http://localhost:5174
echo   Backend:  http://localhost:3000
echo ========================================
echo   Close Backend/Frontend windows to stop.
start http://localhost:5174
echo.
echo Press any key to close this launcher.
pause >nul
exit /b 0
