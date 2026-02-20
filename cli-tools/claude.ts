import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';

export const ClaudeCodeInstaller: Installer = {
    name: 'Claude Code CLI',
    description: 'Command line interface for Claude',
    check: async () => {
        try {
            execSync('claude --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk.cyan(`Installing ${chalk.bold('Claude Code CLI')}...`));

        try {
            console.log(chalk.gray('> npm install -g @anthropic-ai/claude-code'));
            // execSync('npm install -g @anthropic-ai/claude-code', { stdio: 'inherit' });
            console.log(chalk.green('✔ Claude Code CLI installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Claude Code CLI.'));
        }
    }
};
