import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const DroidAgentInstaller: Installer = {
    name: 'Droid Agent CLI',
    description: 'Command line interface for Droid Agent',
    check: async () => {
        try {
            execSync('droid-agent --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('Droid Agent CLI')}...`));

        try {
            console.log(chalk.gray('> npm install -g droid-agent-cli'));
            execSync('npm install -g droid-agent-cli', { stdio: 'inherit' });
            console.log(chalk.green('✔ Droid Agent CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Droid Agent CLI.'));
        }
    }
};
