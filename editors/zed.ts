import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const ZedInstaller: Installer = {
    name: 'Zed',
    description: 'High-performance multiplayer code editor',
    check: async () => {
        const platform = os.platform();
        if (platform === 'win32') return true; // Not supported on Windows, skip silently
        try {
            execSync('zed --version', { stdio: 'ignore' });
            return true;
        } catch {}
        if (platform === 'darwin') {
            try { execSync('test -d /Applications/Zed.app', { stdio: 'ignore' }); return true; } catch {}
        }
        return false;
    },
    install: async () => {
        const platform = os.platform();

        if (platform === 'win32') {
            console.log(chalk.yellow('⚠ Zed is not yet available on Windows. Check https://zed.dev for updates.'));
            return;
        }

        console.log(chalk.cyan(`Installing ${chalk.bold('Zed')}...`));

        try {
            if (platform === 'darwin') {
                console.log(chalk.gray('> brew install --cask zed'));
                execSync('brew install --cask zed', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                console.log(chalk.gray('> curl -f https://zed.dev/install.sh | sh'));
                execSync('curl -f https://zed.dev/install.sh | sh', { stdio: 'inherit', shell: '/bin/bash' });
            }
            console.log(chalk.green('✔ Zed installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Zed.'));
        }
    }
};
