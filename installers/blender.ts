import { Installer } from './installer.js';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as os from 'os';

export const BlenderInstaller: Installer = {
    name: 'Blender',
    description: 'Free and open source 3D creation suite',
    check: async () => {
        const platform = os.platform();
        try {
            if (platform === 'win32') {
                // Checking via winget or checking Program Files
                execSync('winget list -e --id BlenderFoundation.Blender', { stdio: 'ignore' });
                return true;
            } else if (platform === 'darwin') {
                execSync('ls /Applications/Blender.app', { stdio: 'ignore' });
                return true;
            } else {
                execSync('blender --version', { stdio: 'ignore' });
                return true;
            }
        } catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk.cyan(`Installing or Updating ${chalk.bold('Blender')}...`));

        try {
            if (platform === 'win32') {
                console.log(chalk.gray('> winget install --id BlenderFoundation.Blender -e --source winget --accept-package-agreements --accept-source-agreements'));
                // Remove the comment below to actually run the command
                execSync('winget install --id BlenderFoundation.Blender -e --source winget --accept-package-agreements --accept-source-agreements', { stdio: 'inherit' });
            } else if (platform === 'darwin') {
                console.log(chalk.gray('> brew install --cask blender'));
                execSync('brew install --cask blender', { stdio: 'inherit' });
            } else if (platform === 'linux') {
                console.log(chalk.gray('> sudo snap install blender --classic'));
                execSync('sudo snap install blender --classic', { stdio: 'inherit' });
            }
            console.log(chalk.green('✔ Blender installed/updated successfully!'));
        } catch (error) {
            console.log(chalk.red('✖ Failed to install or update Blender. It might already be running or require admin privileges.'));
        }
    }
};
