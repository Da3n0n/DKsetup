"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DroiCliInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.DroiCliInstaller = {
    name: 'Droi CLI',
    description: 'Command line interface for Droi',
    check: async () => {
        try {
            (0, child_process_1.execSync)('droi --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('Droi CLI')}...`));
        try {
            console.log(chalk_1.default.gray('> npm install -g droi-cli'));
            (0, child_process_1.execSync)('npm install -g droi-cli', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ Droi CLI installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install Droi CLI.'));
        }
    }
};
