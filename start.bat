@echo off
:: Ensure working directory is set to script folder even if "Run as Administrator" defaults to C:\Windows\System32
cd /d "%~dp0"

TITLE KalaKriti Arts Studio - Server Launcher
COLOR 0A

echo =======================================================================
echo              KALAKRITI ARTS STUDIO - SERVER LAUNCHER
echo =======================================================================
echo.
echo Starting local web server at http://localhost:3000...
echo Studio Admin URL: http://localhost:3000/admin
echo.

:: Open browser after 3 seconds in background
start "" timeout /t 3 /nobreak >nul & start http://localhost:3000

:: Run development server
call npm run dev
