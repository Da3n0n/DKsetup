import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const OpencodeCliInstaller: Installer = {
    name: 'OpenCode CLI',
    description: 'Command line interface for OpenCode',
    check: async () => {
        try {
            execSync('opencode --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('OpenCode CLI')}...`));

        try {
            console.log(chalk.gray('> npm install -g opencode-cli'));
            execSync('npm install -g opencode-cli', { stdio: 'inherit' });
            console.log(chalk.green('✔ OpenCode CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install OpenCode CLI.'));
        }
    }
};
