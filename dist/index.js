#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const enquirer_1 = require("enquirer");
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("commander");
const os = __importStar(require("os"));
// Core Installers
const git_js_1 = require("./installers/git.js");
const nodejs_js_1 = require("./languages/nodejs.js"); // Note it was moved
const npm_js_1 = require("./installers/npm.js");
const blender_js_1 = require("./installers/blender.js");
const powertoys_js_1 = require("./installers/powertoys.js");
// Languages
const python_js_1 = require("./languages/python.js");
const typescript_js_1 = require("./languages/typescript.js");
const cpp_js_1 = require("./languages/cpp.js");
// Editors
const installer_js_1 = require("./editors/vscode/installer.js");
const extensions_js_1 = require("./editors/vscode/extensions.js");
const zed_extensions_js_1 = require("./editors/zed-extensions.js");
const zed_js_1 = require("./editors/zed.js");
const antigravity_js_1 = require("./editors/antigravity.js");
const opencode_desktop_js_1 = require("./editors/opencode-desktop.js");
// CLI Tools
const gh_js_1 = require("./cli-tools/gh.js");
const gemini_js_1 = require("./cli-tools/gemini.js");
const kimi_js_1 = require("./cli-tools/kimi.js");
const glm_js_1 = require("./cli-tools/glm.js");
const opencode_js_1 = require("./cli-tools/opencode.js");
const droi_js_1 = require("./cli-tools/droi.js");
const droid_factory_js_1 = require("./cli-tools/droid-factory.js");
const droid_agent_js_1 = require("./cli-tools/droid-agent.js");
const claude_js_1 = require("./cli-tools/claude.js");
const program = new commander_1.Command();
program
    .name('dk-cli')
    .description('Full Environment Setup (Cross-Platform CLI Dashboard)')
    .version('1.0.0');
// Grouping and Configuration
const categories = {
    'Core Tools': [git_js_1.GitInstaller, nodejs_js_1.NodeInstaller, npm_js_1.NpmInstaller, blender_js_1.BlenderInstaller, powertoys_js_1.PowerToysInstaller],
    'Languages': [python_js_1.PythonInstaller, typescript_js_1.TypeScriptInstaller, cpp_js_1.CppInstaller],
    'Editors': [installer_js_1.VsCodeInstaller, zed_js_1.ZedInstaller, antigravity_js_1.AntigravityInstaller, opencode_desktop_js_1.OpencodeDesktopInstaller],
    'CLI AI Agents & Tools': [
        gh_js_1.GitHubCliInstaller, gemini_js_1.GeminiCliInstaller, kimi_js_1.KimiCliInstaller, glm_js_1.GlmCliInstaller,
        opencode_js_1.OpencodeCliInstaller, droi_js_1.DroiCliInstaller, droid_factory_js_1.DroidFactoryInstaller,
        droid_agent_js_1.DroidAgentInstaller, claude_js_1.ClaudeCodeInstaller
    ]
};
async function runDashboard() {
    const bannerText = [
        "██████╗ ██╗  ██╗    ██████╗██╗     ██╗",
        "██╔══██╗██║ ██╔╝   ██╔════╝██║     ██║",
        "██║  ██║█████╔╝    ██║     ██║     ██║",
        "██║  ██║██╔═██╗    ██║     ██║     ██║",
        "██████╔╝██║  ██╗██╗╚██████╗███████╗██║",
        "╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝╚═╝"
    ];
    const { getAnimationFrames } = await import('./installers/animator.js');
    const introFrames = getAnimationFrames('ASCII Animations/ring aniamtion.html');
    const gradient = (await import('gradient-string')).default;
    if (introFrames.length > 0) {
        console.clear();
        for (let i = 0; i < 40; i++) {
            const frameIdx = i % introFrames.length;
            const frameLines = introFrames[frameIdx].split('\n');
            const height = Math.max(bannerText.length, frameLines.length);
            const combinedLines = [];
            for (let line = 0; line < height; line++) {
                const bLine = bannerText[line] || '';
                const fLine = frameLines[line] || '';
                combinedLines.push(bLine.padEnd(42, ' ') + fLine);
            }
            process.stdout.write('\x1b[0;0H');
            console.log(gradient.rainbow(combinedLines.join('\n')));
            await new Promise(r => setTimeout(r, 60));
        }
    }
    else {
        const chalkAnimation = (await import('chalk-animation')).default;
        console.clear();
        const banner = chalkAnimation.rainbow(bannerText.join('\n'));
        await new Promise(r => setTimeout(r, 2000));
        banner.stop();
    }
    console.log(chalk_1.default.gray('The ultimate cross-platform dev environment bootstrap.\n'));
    // OS Overview
    const osType = os.platform();
    const osRelease = os.release();
    let osName = 'Unknown';
    if (osType === 'win32')
        osName = 'Windows';
    else if (osType === 'darwin')
        osName = 'macOS';
    else if (osType === 'linux')
        osName = 'Linux';
    console.log(`${chalk_1.default.bold('System:')} ${chalk_1.default.green(osName)} ${chalk_1.default.gray(`(${osRelease})`)}\n`);
    try {
        // Step 1: Category Selection
        const { selectedCategories } = await (0, enquirer_1.prompt)({
            type: 'multiselect',
            name: 'selectedCategories',
            message: 'Which categories do you want to configure? (Space to toggle, Enter to confirm)',
            choices: Object.keys(categories),
            indicator(state, choice) {
                return choice.enabled ? chalk_1.default.cyan('●') : chalk_1.default.gray('○');
            }
        });
        if (!selectedCategories || selectedCategories.length === 0) {
            console.log(chalk_1.default.yellow('\nNo categories selected. Exiting...'));
            process.exit(0);
        }
        // Step 2: Tool Selection per Category
        const finalInstallers = [];
        let installVsCodeExts = false;
        let installZedExts = false;
        for (const cat of selectedCategories) {
            console.log(); // Spacing
            const tools = categories[cat];
            const { selectedTools } = await (0, enquirer_1.prompt)({
                type: 'multiselect',
                name: 'selectedTools',
                message: `Select tools from ${chalk_1.default.bold.cyan(cat)}:`,
                choices: tools.map(t => ({ name: t.name, value: t.name })),
                indicator(state, choice) {
                    return choice.enabled ? chalk_1.default.cyan('●') : chalk_1.default.gray('○');
                }
            });
            // Special case for VS Code extensions
            if (selectedTools.includes(installer_js_1.VsCodeInstaller.name)) {
                const { exts } = await (0, enquirer_1.prompt)({
                    type: 'confirm',
                    name: 'exts',
                    message: `Would you like to install the curated ${chalk_1.default.bold('VS Code Extensions')} as well?`,
                    initial: true
                });
                installVsCodeExts = exts;
            }
            // Special case for Zed extensions & settings
            if (selectedTools.includes(zed_js_1.ZedInstaller.name)) {
                const { zedExts } = await (0, enquirer_1.prompt)({
                    type: 'confirm',
                    name: 'zedExts',
                    message: `Would you like to configure ${chalk_1.default.bold('Zed Extensions & Settings')} as well?`,
                    initial: true
                });
                installZedExts = zedExts;
            }
            const matchedInstallers = tools.filter(t => selectedTools.includes(t.name));
            finalInstallers.push(...matchedInstallers);
        }
        if (finalInstallers.length === 0) {
            console.log(chalk_1.default.yellow('\nNo tools selected. Exiting...'));
            process.exit(0);
        }
        // Step 3: Execution Engine
        const chalkAnimation = (await import('chalk-animation')).default;
        const transition = chalkAnimation.glitch('\n[ PREPARING SELECTED MODULES ]\n');
        await new Promise(r => setTimeout(r, 1500));
        transition.stop();
        console.log(chalk_1.default.bold.blue('🚀 Commencing Setup...\n'));
        const { getAnimationFrames } = await import('./installers/animator.js');
        const frames = getAnimationFrames('ASCII Animations/ring aniamtion.html');
        // Fallback to standard line spinner if frames fail to load
        const fallbackSpinner = ['-', '\\', '|', '/'];
        const spinnerFrames = frames.length > 0 ? frames : fallbackSpinner;
        const ora = (await import('ora')).default;
        for (const installer of finalInstallers) {
            console.log(chalk_1.default.bold(`➜ ${installer.name}`) + chalk_1.default.gray(` - ${installer.description}`));
            const isInstalled = await installer.check();
            if (isInstalled) {
                console.log(chalk_1.default.yellow(`  ℹ Already installed or present. Skipping.\n`));
                continue;
            }
            const spinner = ora({
                text: `Installing ${installer.name}...`,
                spinner: {
                    interval: frames.length > 0 ? 30 : 80,
                    frames: spinnerFrames
                }
            }).start();
            try {
                await installer.install();
                spinner.succeed(chalk_1.default.green(`Installed ${installer.name} successfully!`));
            }
            catch (error) {
                spinner.fail(chalk_1.default.red(`Failed to install ${installer.name}.`));
            }
            console.log(); // Spacing
        }
        if (installVsCodeExts) {
            console.log(chalk_1.default.bold(`➜ VS Code Extensions`));
            await (0, extensions_js_1.installVsCodeExtensions)();
            console.log();
        }
        if (installZedExts) {
            console.log(chalk_1.default.bold(`➜ Zed Extensions & Settings`));
            await (0, zed_extensions_js_1.installZedExtensions)();
            console.log();
        }
        console.log(chalk_1.default.bold.green('🎉 Setup Complete! Enjoy your new environment.'));
    }
    catch (err) {
        if (err.message === '') {
            // User pressed Ctrl+C
            console.log(chalk_1.default.gray('\nDashboard exited safely.'));
        }
        else {
            console.error(chalk_1.default.red('An error occurred during setup:'), err);
        }
    }
}
program.action(runDashboard);
program.parse(process.argv);
