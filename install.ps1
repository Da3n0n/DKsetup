# DKsetup Bootstrap Installer for Windows
# Run this in PowerShell: iwr https://raw.githubusercontent.com/Da3n0n/DKsetup/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

function Write-Step($msg) {
    Write-Host "`n==> $msg" -ForegroundColor Cyan
}

function Write-Success($msg) {
    Write-Host "    OK: $msg" -ForegroundColor Green
}

function Write-Err($msg) {
    Write-Host "    ERROR: $msg" -ForegroundColor Red
}

Write-Host @"

  ██████╗ ██╗  ██╗    ██████╗██╗     ██╗
  ██╔══██╗██║ ██╔╝   ██╔════╝██║     ██║
  ██║  ██║█████╔╝    ██║     ██║     ██║
  ██║  ██║██╔═██╗    ██║     ██║     ██║
  ██████╔╝██║  ██╗██╗╚██████╗███████╗██║
  ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝╚═╝

  Bootstrap Installer for Windows

"@ -ForegroundColor Magenta

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# Check for Node.js
Write-Step "Checking for Node.js..."
$nodeInstalled = $false
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Success "Node.js $nodeVersion is installed"
        $nodeInstalled = $true
    }
} catch {}

if (-not $nodeInstalled) {
    Write-Host "    Node.js not found. Installing via winget..." -ForegroundColor Yellow
    
    # Try winget first
    $wingetAvailable = Get-Command winget -ErrorAction SilentlyContinue
    
    if ($wingetAvailable) {
        Write-Step "Installing Node.js via winget..."
        winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Node.js installed via winget"
        } else {
            Write-Err "winget install failed, trying alternative method..."
            $wingetAvailable = $false
        }
    }
    
    if (-not $wingetAvailable) {
        Write-Step "Downloading Node.js installer..."
        $nodeUrl = "https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi"
        $nodeMsi = "$env:TEMP\node-install.msi"
        
        try {
            Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeMsi -UseBasicParsing
            Write-Success "Downloaded Node.js installer"
            
            Write-Step "Running Node.js installer (this may prompt for admin)..."
            Start-Process msiexec.exe -ArgumentList "/i `"$nodeMsi`" /qn" -Wait -Verb RunAs
            Write-Success "Node.js installation completed"
            
            Remove-Item $nodeMsi -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Err "Failed to download/install Node.js: $_"
            Write-Host "    Please install Node.js manually from https://nodejs.org" -ForegroundColor Yellow
            exit 1
        }
    }
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    # Verify Node.js is now available
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Success "Node.js $nodeVersion is now available"
        } else {
            Write-Host "    Node.js installed but not in PATH. Please restart your terminal and run: npm install -g dksetup" -ForegroundColor Yellow
            exit 0
        }
    } catch {
        Write-Host "    Node.js installed but requires terminal restart. Please close this window, open a new terminal, and run: npm install -g dksetup" -ForegroundColor Yellow
        exit 0
    }
}

# Check for npm
Write-Step "Checking for npm..."
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Success "npm $npmVersion is installed"
    }
} catch {
    Write-Err "npm not found"
    exit 1
}

# Install dksetup globally
Write-Step "Installing dksetup globally..."
try {
    npm install -g dksetup
    Write-Success "dksetup installed successfully!"
} catch {
    Write-Err "Failed to install dksetup: $_"
    exit 1
}

Write-Host @"

  ================================================
   DKsetup is ready!
   
   Run 'dksetup' to start the setup dashboard.
  ================================================

"@ -ForegroundColor Green
