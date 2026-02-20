import chalk from 'chalk';
import { execSync } from 'child_process';

const EXTENSIONS = [
    'esbenp.prettier-vscode',
    'dbaeumer.vscode-eslint',
    'eamodio.gitlens',
    'pkief.material-icon-theme'
];

export async function installVsCodeExtensions() {
    console.log(chalk.cyan(`Installing ${chalk.bold('VS Code Extensions')}...`));

    for (const ext of EXTENSIONS) {
        try {
            console.log(chalk.gray(`> code --install-extension ${ext} --force`));
            // execSync(`code --install-extension ${ext} --force`, { stdio: 'inherit' });
            console.log(chalk.green(`✔ ${ext} installed.`));
        } catch (error) {
            console.log(chalk.red(`✖ Failed to install extension: ${ext}`));
        }
    }
}
