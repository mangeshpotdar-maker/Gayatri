@echo off
TITLE KalaKriti Arts Studio - Windows Installer
COLOR 1F

echo =======================================================================
echo          KALAKRITI ARTS STUDIO - WINDOWS ONE-CLICK INSTALLER
echo =======================================================================
echo.

:: Check for Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    COLOR 4F
    echo [ERROR] Node.js is not installed or not found in system PATH.
    echo Please download and install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [1/3] Node.js detected successfully!
node --version
echo.

echo [2/3] Installing NPM dependencies...
call npm install
if %errorlevel% neq 0 (
    COLOR 4F
    echo [ERROR] Dependency installation failed!
    pause
    exit /b 1
)
echo.

echo [3/3] Launching Database Setup Wizard & Loading Seed Artworks...
call npm run setup
if %errorlevel% neq 0 (
    COLOR 4F
    echo [ERROR] Setup script failed!
    pause
    exit /b 1
)

COLOR 2F
echo.
echo =======================================================================
echo          SUCCESS! KALAKRITI ARTS STUDIO INSTALLED SUCCESSFULLY!
echo =======================================================================
echo.
echo You can now double-click "start.bat" anytime to run your website.
echo.
set /p START_NOW="Do you want to start the website server now? (Y/N): "
if /i "%START_NOW%"=="Y" (
    call start.bat
) else (
    echo.
    echo Press any key to exit installer.
    pause >nul
)
