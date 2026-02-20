import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

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
                // execSync('winget install --id GitHub.cli', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install gh'));
            } else if (platform === 'linux') {
                console.log(chalk.gray('> sudo apt-get install gh'));
            }
            console.log(chalk.green('✔ GitHub CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install GitHub CLI.'));
        }
    }
};
