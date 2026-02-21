import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';
import { detectLinuxPkgManager } from '../installers/linux-pkg.js';

export const GitHubCliInstaller: Installer = {
    name: 'GitHub CLI (gh)',
    description: 'GitHub on the command line',
    check: async () => {
        try {
            execSync('gh --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('GitHub CLI')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install --id GitHub.cli'));
                execSync('winget install --id GitHub.cli', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install gh'));
                execSync('brew install gh', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                const pkg = detectLinuxPkgManager();
                if (pkg === 'apt') {
                    console.log(chalk.gray('> sudo apt-get install -y gh'));
                    execSync('sudo apt-get install -y gh', { stdio: 'inherit' });
                } else if (pkg === 'dnf') {
                    console.log(chalk.gray('> sudo dnf install -y gh'));
                    execSync('sudo dnf install -y gh', { stdio: 'inherit' });
                } else if (pkg === 'pacman') {
                    console.log(chalk.gray('> sudo pacman -S --noconfirm github-cli'));
                    execSync('sudo pacman -S --noconfirm github-cli', { stdio: 'inherit' });
                } else {
                    console.log(chalk.yellow('⚠ Unsupported package manager. Install gh manually: https://cli.github.com'));
                    return;
                }
            }
            console.log(chalk.green('✔ GitHub CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install GitHub CLI.'));
        }
    }
};
