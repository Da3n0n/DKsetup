# DKsetup

A cross-platform CLI toolkit for setting up your entire development environment - no prerequisites required.

## What it does

DKsetup bootstraps your dev environment by installing:
- **Core Tools**: Git, Node.js, npm, Blender, PowerToys
- **Languages**: Python, TypeScript, C++
- **Editors**: VS Code, Zed, Antigravity, Opencode Desktop
- **CLI AI Agents & Tools**: GitHub CLI, Gemini CLI, Kimi CLI, GLM CLI, Opencode CLI, and more

## Installation

### Windows (PowerShell)

```powershell
iwr https://raw.githubusercontent.com/Da3n0n/DKsetup/main/install.ps1 | iex
```

### Linux / macOS

```bash
curl -fsSL https://raw.githubusercontent.com/Da3n0n/DKsetup/main/install.sh | sh
```

### With npm (if you already have it)

```bash
npm install -g dksetup
```

## Usage

Just run:

```bash
dksetup
```

You'll be presented with an interactive dashboard to select which tools and categories you want to install.

## Requirements

None! The bootstrap installer handles everything:
- If Node.js/npm isn't installed, it installs them for you
- Then it installs dksetup globally

## License

MIT
