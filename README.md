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

Installer usage notes

- Interactive (recommended): run the command above and follow prompts.
- Non-interactive / scripted (example):

```powershell
# Download and run with parameters (example)
powershell -NoProfile -ExecutionPolicy Bypass -File install.ps1 -Yes -InstallVSCode -Extensions "gitswap,lynx,ms-python.python" -Themes "some.theme.id" -DefaultTheme "Default Dark+"
```

- `-Yes` auto-accepts prompts and will install default extensions when `-InstallVSCode` is provided.
- `-Yes` auto-accepts prompts and will install default extensions when `-InstallVSCode` is provided. When `-Yes` is used and no `-DefaultTheme` is provided, the installer will automatically set the first installed theme as the default (non-interactive machines).
- `-Extensions` and `-Themes` accept comma-separated marketplace IDs; the `code` CLI is used to install them.
- To set the default VS Code theme non-interactively, provide `-DefaultTheme` with the exact display name.
- For exact extension versions you may need to install a VSIX; `code --install-extension` does not always accept `@version` installs from Marketplace.

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
