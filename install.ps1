$param(
    [switch]$AllUsers,
    [switch]$Yes,
    [switch]$InstallVSCode,
    [string]$Extensions,
    [string]$Themes,
    [string]$DefaultTheme
)

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

try {
    $globalBin = npm bin -g 2>$null
} catch {
    $globalBin = $null
}

$exeName = "dksetup.cmd"
$exePath = $null
if ($globalBin) {
    $candidate = Join-Path $globalBin $exeName
    if (Test-Path $candidate) { $exePath = $candidate }
}

# Optional: offer to install Visual Studio Code and selected extensions
$installVSCode = Read-Host "Would you like to install Visual Studio Code now? (Y/N) [N]"
if ($installVSCode -match '^[Yy]') {
    $wingetAvailable = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetAvailable) {
        Write-Step "Installing Visual Studio Code via winget..."
        winget install --id Microsoft.VisualStudioCode -e --accept-source-agreements --accept-package-agreements
        if ($LASTEXITCODE -eq 0) { Write-Success "Visual Studio Code installed" } else { Write-Err "winget install failed" }
    } else {
        Write-Host "    winget not found. Please install VS Code manually from https://code.visualstudio.com/" -ForegroundColor Yellow
    }

    # Try to locate the `code` CLI
    $codeAvailable = $false
    try {
        $cv = code --version 2>$null
        if ($cv) { $codeAvailable = $true; Write-Success "Detected 'code' CLI" }
    } catch {}

    if (-not $codeAvailable) {
        # Try common location for code.exe
        $possible = @(
            "$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin\code.cmd",
            "$env:ProgramFiles\Microsoft VS Code\bin\code.cmd",
            "$env:ProgramFiles(x86)\Microsoft VS Code\bin\code.cmd"
        )
        foreach ($p in $possible) {
            if (Test-Path $p) {
                $env:Path += ";$(Split-Path $p)"
                try { code --version 2>$null; $codeAvailable = $true; Write-Success "Found 'code' at $p"; break } catch {}
            }
        }
    }

    if ($codeAvailable) {
        Write-Host "`nExtensions and themes: you may enter extension IDs (optionally with @version), comma-separated." -ForegroundColor Green
        Write-Host "Examples: ms-python.python, eamodio.gitlens, gitswap@1.2.3" -ForegroundColor Yellow
        $defaultExts = @("gitswap","lynx","ms-python.python","eamodio.gitlens")
        Write-Host "Default extensions if you press Enter: $($defaultExts -join ', ')" -ForegroundColor Yellow
        $extInput = Read-Host "Enter extension IDs (comma-separated) or press Enter to use defaults"
        if ([string]::IsNullOrWhiteSpace($extInput)) {
            $extensions = $defaultExts
        } else {
            $extensions = $extInput -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        }

        # Themes selection
        Write-Host "`nTheme extensions: you may include themes in the extensions list, or enter theme extension IDs separately." -ForegroundColor Green
        Write-Host "If you want to install themes only, enter their extension IDs now (comma-separated) or press Enter to skip." -ForegroundColor Yellow
        $themeInput = Read-Host "Enter theme extension IDs (comma-separated) or press Enter to skip"
        if (-not [string]::IsNullOrWhiteSpace($themeInput)) {
            $themeExts = $themeInput -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
            $extensions += $themeExts
        } else {
            $themeExts = @()
        }

        # Install each requested extension
        $installedThemes = @()
        foreach ($ext in $extensions) {
            Write-Step "Installing extension: $ext"
            try {
                # Try direct install; `code` may not accept @version for marketplace installs.
                & code --install-extension $ext --force 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Success "Installed $ext"
                } else {
                    Write-Err "'code' failed to install $ext (attempting without version)..."
                    # If ext contains @version, try without version
                    if ($ext -match "@") {
                        $base = $ext.Split('@')[0]
                        & code --install-extension $base --force 2>$null
                        if ($LASTEXITCODE -eq 0) { Write-Success "Installed $base (versioned install not supported, installed latest)" }
                        else { Write-Err "Failed to install $base as well" }
                    }
                }

                # Track themes (best-effort): if the extension id contains 'theme' or is in themeExts, record it
                if ($ext -match '(theme|Theme)' -or ($themeExts -contains $ext) -or ($ext -in $defaultExts -and $ext -match 'lynx|gitswap')) {
                    $installedThemes += $ext
                }
            } catch {
                Write-Err "Failed to install $ext: $_"
            }
        }

        # If themes were installed, offer to set default theme
        if ($installedThemes.Count -gt 0) {
            Write-Host "`nInstalled themes/extensions detected: $($installedThemes -join ', ')" -ForegroundColor Green

            if ($PSBoundParameters.ContainsKey('DefaultTheme') -and -not [string]::IsNullOrWhiteSpace($DefaultTheme)) {
                $chosenTheme = $DefaultTheme
                Write-Host "Setting default theme from CLI: $chosenTheme" -ForegroundColor Yellow
            } elseif ($Yes) {
                # Non-interactive auto-accept: pick the first installed theme as default
                $chosenTheme = $installedThemes[0]
                Write-Host "Auto-accept: setting the first installed theme as default: $chosenTheme" -ForegroundColor Yellow
            } else {
                if ($installedThemes.Count -eq 1) {
                    $setDefault = Read-Host "Set the installed theme as default? (Y/N) [Y]"
                    if ($setDefault -match '^[Nn]') { $chosenTheme = $null } else { $chosenTheme = Read-Host "Enter the exact theme name to set as default (example: 'Default Dark+')" }
                } else {
                    Write-Host "You installed multiple themes. Enter the exact theme name to set as default (or press Enter to skip)." -ForegroundColor Yellow
                    $chosenTheme = Read-Host "Theme name to set as default (exact)"
                    if ([string]::IsNullOrWhiteSpace($chosenTheme)) { $chosenTheme = $null }
                }
            }

            if ($chosenTheme) {
                $settingsDir = Join-Path $env:APPDATA 'Code\User'
                if (-not (Test-Path $settingsDir)) { New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null }
                $settingsPath = Join-Path $settingsDir 'settings.json'

                $settings = @{}
                if (Test-Path $settingsPath) {
                    try { $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json -ErrorAction Stop } catch { $settings = @{} }
                }

                $settings.'workbench.colorTheme' = $chosenTheme
                $settingsJson = $settings | ConvertTo-Json -Depth 5
                $settingsJson | Out-File -FilePath $settingsPath -Encoding UTF8
                Write-Success "Set default theme to '$chosenTheme' in $settingsPath"
            }
        }
    } else {
        Write-Host "    Could not find the 'code' CLI. Open VS Code, then install extensions from the Extensions view or run 'code --install-extension <id>' once 'code' is available." -ForegroundColor Yellow
    }
}

if ($exePath) {
    $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
    $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $combinedPath = "{0};{1}" -f $userPath, $machinePath
    $inPath = ($combinedPath -split ";" | ForEach-Object { $_.TrimEnd('\') }) -contains $globalBin.TrimEnd('\')

    Write-Host "`n  ================================================" -ForegroundColor Green
    Write-Host "   DKsetup is ready!" -ForegroundColor Green
    Write-Host "" -ForegroundColor Green
    if ($inPath) {
        Write-Host "   You can now run dksetup from this terminal:" -ForegroundColor Green
        Write-Host "     dksetup" -ForegroundColor Yellow
    } else {
        Write-Host "   To run immediately without restarting your terminal, execute:" -ForegroundColor Green
        Write-Host "     & '$exePath' run" -ForegroundColor Yellow
        Write-Host "" -ForegroundColor Green
        Write-Host "   Or open a new terminal (to refresh PATH), then run:" -ForegroundColor Green
        Write-Host "     dksetup" -ForegroundColor Yellow
        Write-Host "" -ForegroundColor Green
        Write-Host "   Or run without installing globally using npx:" -ForegroundColor Green
        Write-Host "     npx dksetup" -ForegroundColor Yellow
        Write-Host "" -ForegroundColor Green
        Write-Host "   Global npm binaries are located at: $globalBin" -ForegroundColor Green
        Write-Host "   To add that folder to your PATH permanently (optional), run:" -ForegroundColor Green
        Write-Host "     setx PATH \"$($userPath);$globalBin\"" -ForegroundColor Yellow
    }
    Write-Host "  ================================================`n" -ForegroundColor Green
} else {
    Write-Host "`n  ================================================" -ForegroundColor Green
    Write-Host "   DKsetup is ready!" -ForegroundColor Green
    Write-Host "" -ForegroundColor Green
    Write-Host "   Unable to detect global npm binaries. To run DKsetup now without restarting, run:" -ForegroundColor Green
    Write-Host "     npx dksetup" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor Green
    Write-Host "   Or close and re-open your terminal, then run:" -ForegroundColor Green
    Write-Host "     dksetup" -ForegroundColor Yellow
    Write-Host "  ================================================`n" -ForegroundColor Green
}
