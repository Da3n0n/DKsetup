import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';
import { detectLinuxPkgManager } from '../installers/linux-pkg.js';

export const NodeInstaller: Installer = {
    name: 'Node.js',
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    check: async () => {
        try {
            execSync('node --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('Node.js')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install OpenJS.NodeJS'));
                execSync('winget install OpenJS.NodeJS', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install node'));
                execSync('brew install node', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                const pkg = detectLinuxPkgManager();
                if (pkg === 'apt') {
                    console.log(chalk.gray('> curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs'));
                    execSync('curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs', { stdio: 'inherit', shell: '/bin/bash' });
                } else if (pkg === 'dnf') {
                    console.log(chalk.gray('> sudo dnf install -y nodejs npm'));
                    execSync('sudo dnf install -y nodejs npm', { stdio: 'inherit' });
                } else if (pkg === 'pacman') {
                    console.log(chalk.gray('> sudo pacman -S --noconfirm nodejs npm'));
                    execSync('sudo pacman -S --noconfirm nodejs npm', { stdio: 'inherit' });
                } else {
                    console.log(chalk.yellow('⚠ Unsupported package manager. Please install Node.js manually: https://nodejs.org'));
                    return;
                }
            }
            console.log(chalk.green('✔ Node.js installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Node.js.'));
        }
    }
};
