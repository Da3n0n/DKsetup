"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DroidFactoryInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.DroidFactoryInstaller = {
    name: 'Droid Factory CLI',
    description: 'Command line interface for Droid Factory',
    check: async () => {
        try {
            (0, child_process_1.execSync)('droid-factory --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('Droid Factory CLI')}...`));
        try {
            console.log(chalk_1.default.gray('> npm install -g droid-factory-cli'));
            (0, child_process_1.execSync)('npm install -g droid-factory-cli', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ Droid Factory CLI installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install Droid Factory CLI.'));
        }
    }
};
