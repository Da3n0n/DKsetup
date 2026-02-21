import { Installer } from './installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';
import { detectLinuxPkgManager } from './linux-pkg.js';

export const GitInstaller: Installer = {
    name: 'Git',
    description: 'Distributed version control system',
    check: async () => {
        try {
            execSync('git --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('Git')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install --id Git.Git -e --source winget'));
                execSync('winget install --id Git.Git -e --source winget', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install git'));
                execSync('brew install git', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                const pkg = detectLinuxPkgManager();
                if (pkg === 'apt') {
                    console.log(chalk.gray('> sudo apt-get install -y git'));
                    execSync('sudo apt-get install -y git', { stdio: 'inherit' });
                } else if (pkg === 'dnf') {
                    console.log(chalk.gray('> sudo dnf install -y git'));
                    execSync('sudo dnf install -y git', { stdio: 'inherit' });
                } else if (pkg === 'pacman') {
                    console.log(chalk.gray('> sudo pacman -S --noconfirm git'));
                    execSync('sudo pacman -S --noconfirm git', { stdio: 'inherit' });
                } else {
                    console.log(chalk.yellow('⚠ Unsupported package manager. Please install Git manually: https://git-scm.com'));
                    return;
                }
            }
            console.log(chalk.green('✔ Git installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Git.'));
        }
    }
};
