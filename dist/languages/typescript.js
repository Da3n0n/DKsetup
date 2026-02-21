"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.TypeScriptInstaller = {
    name: 'TypeScript',
    description: 'TypeScript language (global install)',
    check: async () => {
        try {
            (0, child_process_1.execSync)('tsc --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('TypeScript')}...`));
        try {
            console.log(chalk_1.default.gray('> npm install -g typescript ts-node'));
            (0, child_process_1.execSync)('npm install -g typescript ts-node', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ TypeScript installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install TypeScript. Ensure Node.js and npm are installed.'));
        }
    }
};
