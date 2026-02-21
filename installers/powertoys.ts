import { Installer } from './installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const PowerToysInstaller: Installer = {
    name: 'PowerToys',
    description: 'Microsoft PowerToys utility set',
    check: async () => {
        const platform = os.platform();
        if (platform !== 'win32') return true; // Pretend installed/not applicable on non-Windows

        try {
            // Check if PowerToys is installed using winget
            execSync('winget list -e --id Microsoft.PowerToys', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        if (platform !== 'win32') {
            console.log(chalk.yellow('⚠ PowerToys is only available on Windows. Skipping.'));
            return;
        }

        console.log(chalk.cyan(`Installing ${chalk.bold('PowerToys')}...`));

        try {
            console.log(chalk.gray('> winget install Microsoft.PowerToys --source winget'));
            execSync('winget install Microsoft.PowerToys --source winget', { stdio: 'inherit' });
            console.log(chalk.green('✔ PowerToys installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install PowerToys.'));
        }
    }
};
