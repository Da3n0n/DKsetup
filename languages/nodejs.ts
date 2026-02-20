import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const NodeInstaller: Installer = {
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    check: async () => {
        try {
            execSync('node --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('Node.js')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install OpenJS.NodeJS'));
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install node'));
            } else if (platform === 'linux') {
                console.log(chalk.gray('> curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs'));
            }
            console.log(chalk.green('✔ Node.js installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Node.js.'));
        }
    }
};
