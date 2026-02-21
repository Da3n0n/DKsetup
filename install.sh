#!/bin/bash
# DKsetup Bootstrap Installer for Linux/macOS
# Run: curl -fsSL https://raw.githubusercontent.com/Da3n0n/DKsetup/main/install.sh | sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

step() {
    echo -e "\n${CYAN}==> $1${NC}"
}

success() {
    echo -e "    ${GREEN}OK: $1${NC}"
}

error() {
    echo -e "    ${RED}ERROR: $1${NC}"
}

warn() {
    echo -e "    ${YELLOW}$1${NC}"
}

echo -e "${MAGENTA}

  ██████╗ ██╗  ██╗    ██████╗██╗     ██╗
  ██╔══██╗██║ ██╔╝   ██╔════╝██║     ██║
  ██║  ██║█████╔╝    ██║     ██║     ██║
  ██║  ██║██╔═██╗    ██║     ██║     ██║
  ██████╔╝██║  ██╗██╗╚██████╗███████╗██║
  ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝╚═╝

  Bootstrap Installer for ${CYAN}$(uname -s)${NC}

${NC}"

detect_os() {
    case "$(uname -s)" in
        Darwin*)    echo "macos" ;;
        Linux*)     echo "linux" ;;
        *)          echo "unknown" ;;
    esac
}

OS=$(detect_os)

step "Checking for Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    success "Node.js $NODE_VERSION is installed"
else
    warn "Node.js not found. Installing..."
    
    if [ "$OS" = "macos" ]; then
        if command -v brew &> /dev/null; then
            step "Installing Node.js via Homebrew..."
            brew install node
            success "Node.js installed via Homebrew"
        else
            step "Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            brew install node
            success "Node.js installed"
        fi
    elif [ "$OS" = "linux" ]; then
        if command -v apt-get &> /dev/null; then
            step "Installing Node.js via apt..."
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
            success "Node.js installed via apt"
        elif command -v dnf &> /dev/null; then
            step "Installing Node.js via dnf..."
            sudo dnf install -y nodejs
            success "Node.js installed via dnf"
        elif command -v pacman &> /dev/null; then
            step "Installing Node.js via pacman..."
            sudo pacman -S --noconfirm nodejs npm
            success "Node.js installed via pacman"
        else
            error "Unsupported package manager. Please install Node.js manually."
            echo "    Visit: https://nodejs.org"
            exit 1
        fi
    fi
fi

step "Checking for npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    success "npm $NPM_VERSION is installed"
else
    error "npm not found"
    exit 1
fi

step "Installing dksetup globally..."
npm install -g dksetup
success "dksetup installed!"

echo -e "${GREEN}

  ================================================
   DKsetup is ready!
   
   Run 'dksetup' to start the setup dashboard.
  ================================================

${NC}"
