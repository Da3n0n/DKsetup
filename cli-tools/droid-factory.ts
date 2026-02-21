import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const DroidFactoryInstaller: Installer = {
    name: 'Droid Factory CLI',
    description: 'Command line interface for Droid Factory',
    check: async () => {
        try {
            execSync('droid-factory --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('Droid Factory CLI')}...`));

        try {
            console.log(chalk.gray('> npm install -g droid-factory-cli'));
            execSync('npm install -g droid-factory-cli', { stdio: 'inherit' });
            console.log(chalk.green('✔ Droid Factory CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Droid Factory CLI.'));
        }
    }
};
