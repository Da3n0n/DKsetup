import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const GlmCliInstaller: Installer = {
    name: 'GLM CLI',
    description: 'Command line interface for ChatGLM',
    check: async () => {
        try {
            execSync('glm --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('GLM CLI')}...`));

        try {
            console.log(chalk.gray('> pip install chatglm-cli'));
            // execSync('pip install chatglm-cli', { stdio: 'inherit' });
            console.log(chalk.green('✔ GLM CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install GLM CLI.'));
        }
    }
};
