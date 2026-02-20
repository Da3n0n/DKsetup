import { Installer } from '../../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const VsCodeInstaller: Installer = {
    name: 'Visual Studio Code',
    description: 'Code editor',
    check: async () => {
        try {
            execSync('code --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('VS Code')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install Microsoft.VisualStudioCode'));
                // execSync('winget install Microsoft.VisualStudioCode', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install --cask visual-studio-code'));
            } else if (platform === 'linux') {
                console.log(chalk.gray('> sudo snap install code --classic'));
            }
            console.log(chalk.green('✔ VS Code installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install VS Code.'));
        }
    }
};
