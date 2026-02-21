import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const TypeScriptInstaller: Installer = {
    name: 'TypeScript',
    description: 'TypeScript language (global install)',
    check: async () => {
        try {
            execSync('tsc --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('TypeScript')}...`));

        try {
            console.log(chalk.gray('> npm install -g typescript ts-node'));
            execSync('npm install -g typescript ts-node', { stdio: 'inherit' });
            console.log(chalk.green('✔ TypeScript installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install TypeScript. Ensure Node.js and npm are installed.'));
        }
    }
};
