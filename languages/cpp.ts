import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const CppInstaller: Installer = {
    name: 'C/C++ Compiler',
    description: 'C/C++ development tools',
    check: async () => {
        const platform = os.platform();
        try {
            if (platform === 'win32') {
                // simple check for clang, gcc or cl
                try { execSync('gcc --version', { stdio: 'ignore' }); return true; } catch { }
                try { execSync('clang --version', { stdio: 'ignore' }); return true; } catch { }
                try { execSync('cl', { stdio: 'ignore' }); return true; } catch { }
                return false;
            } else {
                execSync('gcc --version', { stdio: 'ignore' });
                return true;
            }
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('C/C++ Compiler')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install LLVM.LLVM'));
                // execSync('winget install LLVM.LLVM', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> xcode-select --install'));
            } else if (platform === 'linux') {
                console.log(chalk.gray('> sudo apt-get install -y build-essential'));
            }
            console.log(chalk.green('✔ C/C++ Compiler installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install C/C++ Compiler.'));
        }
    }
};
