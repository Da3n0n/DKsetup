import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';
import { detectLinuxPkgManager } from '../installers/linux-pkg.js';

export const CppInstaller: Installer = {
    name: 'C/C++ Compiler',
    description: 'C/C++ development tools',
    check: async () => {
        const platform = os.platform();
        try {
            if (platform === 'win32') {
                try { execSync('gcc --version', { stdio: 'ignore' }); return true; } catch {}
                try { execSync('clang --version', { stdio: 'ignore' }); return true; } catch {}
                try { execSync('cl', { stdio: 'ignore' }); return true; } catch {}
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
                execSync('winget install LLVM.LLVM', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> xcode-select --install'));
                execSync('xcode-select --install', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                const pkg = detectLinuxPkgManager();
                if (pkg === 'apt') {
                    console.log(chalk.gray('> sudo apt-get install -y build-essential'));
                    execSync('sudo apt-get install -y build-essential', { stdio: 'inherit' });
                } else if (pkg === 'dnf') {
                    console.log(chalk.gray('> sudo dnf groupinstall -y "Development Tools"'));
                    execSync('sudo dnf groupinstall -y "Development Tools"', { stdio: 'inherit' });
                } else if (pkg === 'pacman') {
                    console.log(chalk.gray('> sudo pacman -S --noconfirm base-devel'));
                    execSync('sudo pacman -S --noconfirm base-devel', { stdio: 'inherit' });
                } else {
                    console.log(chalk.yellow('⚠ Unsupported package manager. Please install GCC manually.'));
                    return;
                }
            }
            console.log(chalk.green('✔ C/C++ Compiler installed successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install C/C++ Compiler.'));
        }
    }
};
