@echo off
TITLE KalaKriti Arts Studio - Windows Installer
COLOR 1F

echo [=======================================================================] > install.log
echo [   KALAKRITI ARTS STUDIO - WINDOWS ONE-CLICK INSTALLATION LOG         ] >> install.log
echo [=======================================================================] >> install.log
echo Date: %date% Time: %time% >> install.log
echo Base Directory: %CD% >> install.log
echo. >> install.log

echo =======================================================================
echo          KALAKRITI ARTS STUDIO - WINDOWS ONE-CLICK INSTALLER
echo =======================================================================
echo.

:: Check for Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    COLOR 4F
    echo [%date% %time%] [ERROR] Node.js is not installed or not found in system PATH. >> error.log
    echo [%date% %time%] [ERROR] Node.js is not installed or not found in system PATH. >> install.log
    echo [ERROR] Node.js is not installed or not found in system PATH.
    echo Please download and install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [%date% %time%] [INFO] Node.js detected successfully. >> install.log
echo [1/3] Node.js detected successfully!
node --version
echo.

echo [%date% %time%] [INFO] Installing NPM dependencies... >> install.log
echo [2/3] Installing NPM dependencies...
call npm install >> install.log 2>> error.log
if %errorlevel% neq 0 (
    COLOR 4F
    echo [%date% %time%] [ERROR] NPM dependency installation failed. >> error.log
    echo [ERROR] Dependency installation failed! Check error.log for details.
    pause
    exit /b 1
)
echo.

echo [%date% %time%] [INFO] Launching Database Setup Wizard... >> install.log
echo [3/3] Launching Database Setup Wizard & Loading Seed Artworks...
call npm run setup
if %errorlevel% neq 0 (
    COLOR 4F
    echo [%date% %time%] [ERROR] Setup script failed. >> error.log
    echo [ERROR] Setup script failed! Check error.log for details.
    pause
    exit /b 1
)

COLOR 2F
echo [%date% %time%] [SUCCESS] Kalakriti Arts Studio installation completed successfully. >> install.log
echo.
echo =======================================================================
echo          SUCCESS! KALAKRITI ARTS STUDIO INSTALLED SUCCESSFULLY!
echo =======================================================================
echo.
echo Logs created:
echo   * install.log - Complete installation transcript
echo   * error.log   - Runtime and setup error log
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
