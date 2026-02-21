"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installZedExtensions = installZedExtensions;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const ZED_EXTENSIONS = [
    'html',
    'css',
    'json',
    'python',
    'rust',
    'toml',
    'dockerfile',
    'catppuccin',
];
const ZED_SETTINGS = {
    theme: 'One Dark',
    tab_size: 4,
    hard_tabs: false,
    format_on_save: 'on',
    buffer_font_size: 14,
    ui_font_size: 14,
    vim_mode: false,
    wrap_guides: [80, 120],
    show_whitespace: 'selection',
    inlay_hints: { enabled: true },
    assistant: { enabled: true, version: '2' }
};
async function installZedExtensions() {
    console.log(chalk_1.default.cyan(`Configuring ${chalk_1.default.bold('Zed')} extensions & settings...`));
    // Try CLI extension installs
    let cliAvailable = false;
    try {
        (0, child_process_1.execSync)('zed --version', { stdio: 'ignore' });
        cliAvailable = true;
    }
    catch { }
    if (cliAvailable) {
        for (const ext of ZED_EXTENSIONS) {
            try {
                console.log(chalk_1.default.gray(`> zed extension install ${ext}`));
                (0, child_process_1.execSync)(`zed extension install ${ext}`, { stdio: 'inherit' });
                console.log(chalk_1.default.green(`✔ ${ext} installed.`));
            }
            catch {
                console.log(chalk_1.default.yellow(`  ⚠ Could not install ${ext} via CLI — install it in Zed's extension panel.`));
            }
        }
    }
    else {
        console.log(chalk_1.default.yellow('  ⚠ Zed CLI not in PATH. Install these extensions from Zed > Extensions:'));
        for (const ext of ZED_EXTENSIONS) {
            console.log(chalk_1.default.gray(`     · ${ext}`));
        }
    }
    // Write settings.json
    const settingsDir = (0, path_1.join)((0, os_1.homedir)(), '.config', 'zed');
    const settingsPath = (0, path_1.join)(settingsDir, 'settings.json');
    try {
        if (!(0, fs_1.existsSync)(settingsDir))
            (0, fs_1.mkdirSync)(settingsDir, { recursive: true });
        let existing = {};
        if ((0, fs_1.existsSync)(settingsPath)) {
            try {
                existing = JSON.parse((0, fs_1.readFileSync)(settingsPath, 'utf8'));
            }
            catch { }
        }
        const merged = { ...ZED_SETTINGS, ...existing };
        (0, fs_1.writeFileSync)(settingsPath, JSON.stringify(merged, null, 2));
        console.log(chalk_1.default.green(`✔ Zed settings written to ${settingsPath}`));
    }
    catch (err) {
        console.log(chalk_1.default.yellow(`  ⚠ Could not write Zed settings: ${err.message}`));
    }
}
