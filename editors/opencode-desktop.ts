import { Installer } from '../installers/installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const OpencodeDesktopInstaller: Installer = {
    name: 'OpenCode Desktop',
    description: 'Open source AI-native code editor',
    check: async () => {
        const platform = os.platform();
        try {
            if (platform === 'darwin') {
                execSync('test -d /Applications/OpenCode.app', { stdio: 'ignore' });
                return true;
            }
            execSync('opencode --version', { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing ${chalk.bold('OpenCode Desktop')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install OpenCode.OpenCode'));
                execSync('winget install OpenCode.OpenCode', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install --cask opencode'));
                execSync('brew install --cask opencode', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                console.log(chalk.gray('> curl -fsSL https://opencode.ai/install.sh | sh'));
                execSync('curl -fsSL https://opencode.ai/install.sh | sh', { stdio: 'inherit', shell: '/bin/bash' });
            }
            console.log(chalk.green('✔ OpenCode Desktop installed successfully!'));
        } catch (error) {
            console.log(chalk.yellow('⚠ Automatic install failed. Visit https://opencode.ai to download manually.'));
        }
    }
};
