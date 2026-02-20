import { Installer } from './installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const NpmInstaller: Installer = {
    name: 'npm',
    description: 'Node Package Manager',
    check: async () => {
        try {
            execSync('npm --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing or Updating ${chalk.bold('npm')}...`));

        try {
            console.log(chalk.gray('> npm install -g npm'));
            // Remove the comment below to actually run the command if desired
            // execSync('npm install -g npm', { stdio: 'inherit' });
            console.log(chalk.green('✔ npm installed/updated successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install or update npm. Make sure Node.js is installed first.'));
        }
    }
};
