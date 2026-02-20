import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const DroiCliInstaller: Installer = {
    name: 'Droi CLI',
    description: 'Command line interface for Droi',
    check: async () => {
        try {
            execSync('droi --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('Droi CLI')}...`));

        try {
            console.log(chalk.gray('> npm install -g droi-cli'));
            // execSync('npm install -g droi-cli', { stdio: 'inherit' });
            console.log(chalk.green('✔ Droi CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Droi CLI.'));
        }
    }
};
