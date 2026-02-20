import { prompt } from 'enquirer';
import chalk from 'chalk';
import { Command } from 'commander';
import * as os from 'os';

// Import Interfaces
import { Installer } from './installers/installer.js';

// Core Installers
import { GitInstaller } from './installers/git.js';
import { NodeInstaller } from './languages/nodejs.js'; // Note it was moved
import { NpmInstaller } from './installers/npm.js';
import { BlenderInstaller } from './installers/blender.js';
import { PowerToysInstaller } from './installers/powertoys.js';

// Languages
import { PythonInstaller } from './languages/python.js';
import { TypeScriptInstaller } from './languages/typescript.js';
import { CppInstaller } from './languages/cpp.js';

// Editors
import { VsCodeInstaller } from './editors/vscode/installer.js';
import { installVsCodeExtensions } from './editors/vscode/extensions.js';
import { ZedInstaller } from './editors/zed.js';
import { AntigravityInstaller } from './editors/antigravity.js';
import { OpencodeDesktopInstaller } from './editors/opencode-desktop.js';

// CLI Tools
import { GitHubCliInstaller } from './cli-tools/gh.js';
import { GeminiCliInstaller } from './cli-tools/gemini.js';
import { KimiCliInstaller } from './cli-tools/kimi.js';
import { GlmCliInstaller } from './cli-tools/glm.js';
import { OpencodeCliInstaller } from './cli-tools/opencode.js';
import { DroiCliInstaller } from './cli-tools/droi.js';
import { DroidFactoryInstaller } from './cli-tools/droid-factory.js';
import { DroidAgentInstaller } from './cli-tools/droid-agent.js';
import { ClaudeCodeInstaller } from './cli-tools/claude.js';

const program = new Command();

program
    .name('dk-cli')
    .description('Full Environment Setup (Cross-Platform CLI Dashboard)')
    .version('1.0.0');

// Grouping and Configuration
const categories = {
    'Core Tools': [GitInstaller, NodeInstaller, NpmInstaller, BlenderInstaller, PowerToysInstaller],
    'Languages': [PythonInstaller, TypeScriptInstaller, CppInstaller],
    'Editors': [VsCodeInstaller, ZedInstaller, AntigravityInstaller, OpencodeDesktopInstaller],
    'CLI AI Agents & Tools': [
        GitHubCliInstaller, GeminiCliInstaller, KimiCliInstaller, GlmCliInstaller,
        OpencodeCliInstaller, DroiCliInstaller, DroidFactoryInstaller,
        DroidAgentInstaller, ClaudeCodeInstaller
    ]
};

async function runDashboard() {
    console.clear();
    console.log(chalk.bold.hex('#00e5ff')(`
██████╗ ██╗  ██╗    ██████╗██╗     ██╗
██╔══██╗██║ ██╔╝   ██╔════╝██║     ██║
██║  ██║█████╔╝    ██║     ██║     ██║
██║  ██║██╔═██╗    ██║     ██║     ██║
██████╔╝██║  ██╗██╗╚██████╗███████╗██║
╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝╚═╝
    `));
    console.log(chalk.gray('The ultimate cross-platform dev environment bootstrap.\n'));

    // OS Overview
    const osType = os.platform();
    const osRelease = os.release();
    let osName = 'Unknown';
    if (osType === 'win32') osName = 'Windows';
    else if (osType === 'darwin') osName = 'macOS';
    else if (osType === 'linux') osName = 'Linux';
    console.log(`${chalk.bold('System:')} ${chalk.green(osName)} ${chalk.gray(`(${osRelease})`)}\n`);

    try {
        // Step 1: Category Selection
        const { selectedCategories } = await prompt<{ selectedCategories: string[] }>({
            type: 'multiselect',
            name: 'selectedCategories',
            message: 'Which categories do you want to configure? (Space to toggle, Enter to confirm)',
            choices: Object.keys(categories),
            indicator(state: any, choice: any) {
                return choice.enabled ? chalk.cyan('●') : chalk.gray('○');
            }
        } as any);

        if (!selectedCategories || selectedCategories.length === 0) {
            console.log(chalk.yellow('\nNo categories selected. Exiting...'));
            process.exit(0);
        }

        // Step 2: Tool Selection per Category
        const finalInstallers: Installer[] = [];
        let installVsCodeExts = false;

        for (const cat of selectedCategories) {
            console.log(); // Spacing
            const tools = categories[cat as keyof typeof categories];

            const { selectedTools } = await prompt<{ selectedTools: string[] }>({
                type: 'multiselect',
                name: 'selectedTools',
                message: `Select tools from ${chalk.bold.cyan(cat)}:`,
                choices: tools.map(t => ({ name: t.name, value: t.name })),
                indicator(state: any, choice: any) {
                    return choice.enabled ? chalk.cyan('●') : chalk.gray('○');
                }
            } as any);

            // Special case for VS Code extensions
            if (selectedTools.includes(VsCodeInstaller.name)) {
                const { exts } = await prompt<{ exts: boolean }>({
                    type: 'confirm',
                    name: 'exts',
                    message: `Would you like to install the curated ${chalk.bold('VS Code Extensions')} as well?`,
                    initial: true
                } as any);
                installVsCodeExts = exts;
            }

            const matchedInstallers = tools.filter(t => selectedTools.includes(t.name));
            finalInstallers.push(...matchedInstallers);
        }

        if (finalInstallers.length === 0) {
            console.log(chalk.yellow('\nNo tools selected. Exiting...'));
            process.exit(0);
        }

        // Step 3: Execution Engine
        console.log(chalk.bold.blue('\n🚀 Commencing Setup...\n'));
        for (const installer of finalInstallers) {
            console.log(chalk.bold(`➜ ${installer.name}`) + chalk.gray(` - ${installer.description}`));

            const isInstalled = await installer.check();
            if (isInstalled) {
                console.log(chalk.yellow(`  ℹ Already installed or present. Skipping.\n`));
                continue;
            }

            await installer.install();
            console.log(); // Spacing
        }

        if (installVsCodeExts) {
            console.log(chalk.bold(`➜ VS Code Extensions`));
            await installVsCodeExtensions();
            console.log();
        }

        console.log(chalk.bold.green('🎉 Setup Complete! Enjoy your new environment.'));

    } catch (err) {
        if ((err as Error).message === '') {
            // User pressed Ctrl+C
            console.log(chalk.gray('\nDashboard exited safely.'));
        } else {
            console.error(chalk.red('An error occurred during setup:'), err);
        }
    }
}

program.action(runDashboard);
program.parse(process.argv);
