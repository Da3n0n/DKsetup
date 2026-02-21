"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.NpmInstaller = {
    name: 'npm',
    description: 'Node Package Manager',
    check: async () => {
        try {
            (0, child_process_1.execSync)('npm --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing or Updating ${chalk_1.default.bold('npm')}...`));
        try {
            console.log(chalk_1.default.gray('> npm install -g npm'));
            (0, child_process_1.execSync)('npm install -g npm', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ npm installed/updated successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install or update npm. Make sure Node.js is installed first.'));
        }
    }
};
