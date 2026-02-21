import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const AntigravityInstaller: Installer = {
    name: 'Antigravity Workspace',
    description: 'Agentic IDE by DeepMind',
    check: async () => {
        try {
            execSync('antigravity --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('Antigravity')}...`));
        console.log(chalk.yellow('⚠ Antigravity does not have a public automated installer yet.'));
        console.log(chalk.gray('  Please visit https://antigravity.dev for installation instructions.'));
    }
};
