import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const KimiCliInstaller: Installer = {
    name: 'Kimi CLI',
    description: 'Command line interface for Moonshot Kimi',
    check: async () => {
        try {
            execSync('kimi --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('Kimi CLI')}...`));

        try {
            console.log(chalk.gray('> npm install -g moonshot-kimi-cli'));
            execSync('npm install -g moonshot-kimi-cli', { stdio: 'inherit' });
            console.log(chalk.green('✔ Kimi CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Kimi CLI.'));
        }
    }
};
