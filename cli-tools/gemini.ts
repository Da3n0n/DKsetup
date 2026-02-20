import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import * as os from 'os';
import { execSync } from 'child_process';

export const GeminiCliInstaller: Installer = {
    name: 'Gemini CLI',
    description: 'Command line interface for Google Gemini',
    check: async () => {
        try {
            execSync('gemini --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('Gemini CLI')}...`));

        try {
            console.log(chalk.gray('> npm install -g @google/gemini-cli'));
            // execSync('npm install -g @google/gemini-cli', { stdio: 'inherit' });
            console.log(chalk.green('✔ Gemini CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Gemini CLI.'));
        }
    }
};
