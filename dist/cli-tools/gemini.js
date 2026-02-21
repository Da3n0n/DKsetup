"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiCliInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.GeminiCliInstaller = {
    name: 'Gemini CLI',
    description: 'Command line interface for Google Gemini',
    check: async () => {
        try {
            (0, child_process_1.execSync)('gemini --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('Gemini CLI')}...`));
        try {
            console.log(chalk_1.default.gray('> npm install -g @google/gemini-cli'));
            (0, child_process_1.execSync)('npm install -g @google/gemini-cli', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ Gemini CLI installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install Gemini CLI.'));
        }
    }
};
