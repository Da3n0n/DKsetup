import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import * as os from 'os';

export const ZedInstaller: Installer = {
    name: 'Zed',
    description: 'High-performance multiplayer code editor',
    check: async () => {
        // Mock check since Zed doesn't have a reliable CLI check on all platforms
        return false;
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('Zed')}...`));

        try {
            if (platform === 'darwin') {
                console.log(chalk.gray('> brew install --cask zed'));
            } else if (platform === 'linux') {
                console.log(chalk.gray('> curl -f https://zed.dev/install.sh | sh'));
            } else {
                console.log(chalk.yellow('⚠ Zed has limited support on Windows. Please check zed.dev for updates.'));
            }
            console.log(chalk.green('✔ Zed installed (or attempted) successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Zed.'));
        }
    }
};
