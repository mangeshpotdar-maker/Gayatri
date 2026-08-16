# PowerShell Prerequisites Auto-Installer for KalaKriti Arts Studio / GayatriPortal
$ErrorActionPreference = "Stop"

$LogDir = "C:\Mangesh\Jules\GayatriPortal"
if (-not (Test-Path -Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

$InstallLog = Join-Path -Path $LogDir -ChildPath "install.log"
$ErrorLog = Join-Path -Path $LogDir -ChildPath "error.log"

function Write-InstallLog($message, $isError = $false) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] [PREREQ] $message"
    Add-Content -Path $InstallLog -Value $line
    if ($isError) {
        Add-Content -Path $ErrorLog -Value $line
    }
    Write-Host "[VERBOSE] $message" -ForegroundColor Cyan
}

Write-InstallLog "Checking system prerequisites for KalaKriti Arts Studio..."

# Check Node.js
$nodeInstalled = $false
try {
    $nodeVer = & node -v 2>$null
    if ($nodeVer) {
        $nodeInstalled = $true
        Write-InstallLog "Node.js detected: $nodeVer"
    }
} catch {
    $nodeInstalled = $false
}

if (-not $nodeInstalled) {
    Write-InstallLog "Node.js not detected. Downloading official Node.js v20 LTS from nodejs.org..."

    $nodeMsiUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
    $tempMsiPath = Join-Path -Path $env:TEMP -ChildPath "node-v20.18.0-x64.msi"

    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Write-InstallLog "Downloading installer from $nodeMsiUrl..."
        Invoke-WebRequest -Uri $nodeMsiUrl -OutFile $tempMsiPath -UseBasicParsing
        Write-InstallLog "Downloaded Node.js MSI installer to $tempMsiPath"

        Write-InstallLog "Executing silent MSI installer (msiexec)... Please wait..."
        $installProcess = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$tempMsiPath`" /qn /norestart" -Wait -PassThru

        if ($installProcess.ExitCode -eq 0 -or $installProcess.ExitCode -eq 3010) {
            Write-InstallLog "Node.js successfully installed!"
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
        } else {
            Write-InstallLog "Node.js installation exited with code $($installProcess.ExitCode)" $true
        }
    } catch {
        Write-InstallLog "Failed to download or install Node.js automatically: $_" $true
    }
}

# Final Check
try {
    $finalNode = & node -v
    $finalNpm = & npm -v
    Write-InstallLog "Prerequisite verification successful! Node: $finalNode | NPM: $finalNpm"
    exit 0
} catch {
    Write-InstallLog "Prerequisites verification failed. Please restart command prompt or install Node.js manually." $true
    exit 1
}
