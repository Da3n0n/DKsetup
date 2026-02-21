import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';
import { detectLinuxPkgManager } from '../installers/linux-pkg.js';

export const PythonInstaller: Installer = {
    name: 'Python',
    description: 'Python programming language',
    check: async () => {
        try {
            execSync('python --version', { stdio: 'ignore' });
            return true;
        } catch {}
        try {
            execSync('python3 --version', { stdio: 'ignore' });
            return true;
        } catch {}
        return false;
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('Python')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install --id Python.Python.3.12 -e --source winget'));
                execSync('winget install --id Python.Python.3.12 -e --source winget', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install python'));
                execSync('brew install python', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                const pkg = detectLinuxPkgManager();
                if (pkg === 'apt') {
                    console.log(chalk.gray('> sudo apt-get install -y python3 python3-pip'));
                    execSync('sudo apt-get install -y python3 python3-pip', { stdio: 'inherit' });
                } else if (pkg === 'dnf') {
                    console.log(chalk.gray('> sudo dnf install -y python3 python3-pip'));
                    execSync('sudo dnf install -y python3 python3-pip', { stdio: 'inherit' });
                } else if (pkg === 'pacman') {
                    console.log(chalk.gray('> sudo pacman -S --noconfirm python python-pip'));
                    execSync('sudo pacman -S --noconfirm python python-pip', { stdio: 'inherit' });
                } else {
                    console.log(chalk.yellow('⚠ Unsupported package manager. Please install Python manually: https://python.org'));
                    return;
                }
            }
            console.log(chalk.green('✔ Python installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install Python.'));
        }
    }
};
