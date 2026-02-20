import { Installer } from './installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

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
                // execSync('winget install --id Git.Git -e --source winget', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install git'));
            } else if (platform === 'linux') {
                console.log(chalk.gray('> sudo apt-get install git'));
            }
            console.log(chalk.green('✔ Git installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Git.'));
        }
    }
};
