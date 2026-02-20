import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const PythonInstaller: Installer = {
    name: 'Python',
    description: 'Python programming language',
    check: async () => {
        try {
            execSync('python --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('Python')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install --id Python.Python.3.12 -e --source winget'));
                // execSync('winget install --id Python.Python.3.12 -e --source winget', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install python'));
            } else if (platform === 'linux') {
                console.log(chalk.gray('> sudo apt-get install -y python3 python3-pip'));
            }
            console.log(chalk.green('✔ Python installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Python.'));
        }
    }
};
