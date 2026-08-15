@echo off
TITLE KalaKriti Arts Studio - Windows One-Click Installer
COLOR 1F

:: Ensure Target Directory Exists
if not exist "C:\Mangesh\Jules\GayatriPortal" (
    mkdir "C:\Mangesh\Jules\GayatriPortal"
)

echo [=======================================================================] > "C:\Mangesh\Jules\GayatriPortal\install.log"
echo [   KALAKRITI ARTS STUDIO - AUTOMATED ONE-CLICK INSTALLATION LOG        ] >> "C:\Mangesh\Jules\GayatriPortal\install.log"
echo [=======================================================================] >> "C:\Mangesh\Jules\GayatriPortal\install.log"
echo Date: %date% Time: %time% >> "C:\Mangesh\Jules\GayatriPortal\install.log"
echo Base Directory: C:\Mangesh\Jules\GayatriPortal >> "C:\Mangesh\Jules\GayatriPortal\install.log"
echo. >> "C:\Mangesh\Jules\GayatriPortal\install.log"

echo =======================================================================
echo          KALAKRITI ARTS STUDIO - AUTOMATED 1-CLICK INSTALLER
echo =======================================================================
echo.
echo Target Base Path: C:\Mangesh\Jules\GayatriPortal
echo.

echo [1/4] Checking System Prerequisites (Node.js ^& NPM)...
echo [%date% %time%] [INFO] Checking system prerequisites... >> "C:\Mangesh\Jules\GayatriPortal\install.log"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Node.js not found on this system.
    echo Automatically downloading ^& installing Node.js v20 LTS from official nodejs.org...
    echo [%date% %time%] [INFO] Node.js missing. Triggering PowerShell auto-installer script... >> "C:\Mangesh\Jules\GayatriPortal\install.log"

    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\install-prerequisites.ps1"

    :: Refresh Environment Path for current cmd session
    set "PATH=%SystemRoot%\system32;%SystemRoot%;%SystemRoot%\System32\Wbem;%PROGRAMFILES%\nodejs\;%APPDATA%\npm;%PATH%"
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    COLOR 4F
    echo.
    echo [ERROR] Automated Node.js installation failed or path refresh pending.
    echo [%date% %time%] [ERROR] Node.js installation failed. >> "C:\Mangesh\Jules\GayatriPortal\error.log"
    echo [%date% %time%] [ERROR] Node.js installation failed. >> "C:\Mangesh\Jules\GayatriPortal\install.log"
    echo Please install Node.js manually from https://nodejs.org and rerun setup.bat
    pause
    exit /b 1
)

echo [%date% %time%] [INFO] Node.js detected: >> "C:\Mangesh\Jules\GayatriPortal\install.log"
node -v >> "C:\Mangesh\Jules\GayatriPortal\install.log"
echo Node.js version:
node -v
echo.

echo [2/4] Installing NPM Dependencies...
echo [%date% %time%] [INFO] Installing NPM dependencies... >> "C:\Mangesh\Jules\GayatriPortal\install.log"
call npm install >> "C:\Mangesh\Jules\GayatriPortal\install.log" 2>> "C:\Mangesh\Jules\GayatriPortal\error.log"
if %errorlevel% neq 0 (
    COLOR 4F
    echo [ERROR] Dependency installation failed! Check C:\Mangesh\Jules\GayatriPortal\error.log for details.
    echo [%date% %time%] [ERROR] NPM install failed. >> "C:\Mangesh\Jules\GayatriPortal\error.log"
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/4] Initializing Database ^& Loading Seed Artworks...
echo [%date% %time%] [INFO] Running Database Setup Wizard... >> "C:\Mangesh\Jules\GayatriPortal\install.log"
call npm run setup
if %errorlevel% neq 0 (
    COLOR 4F
    echo [ERROR] Database setup script failed! Check C:\Mangesh\Jules\GayatriPortal\error.log for details.
    echo [%date% %time%] [ERROR] Setup script failed. >> "C:\Mangesh\Jules\GayatriPortal\error.log"
    pause
    exit /b 1
)

COLOR 2F
echo [%date% %time%] [SUCCESS] Installation completed successfully! >> "C:\Mangesh\Jules\GayatriPortal\install.log"
echo.
echo =======================================================================
echo          SUCCESS! KALAKRITI ARTS STUDIO INSTALLED SUCCESSFULLY!
echo =======================================================================
echo.
echo All files ^& logs saved under:
echo   * C:\Mangesh\Jules\GayatriPortal\store.db
echo   * C:\Mangesh\Jules\GayatriPortal\install.log
echo   * C:\Mangesh\Jules\GayatriPortal\error.log
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
