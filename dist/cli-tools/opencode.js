"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpencodeCliInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.OpencodeCliInstaller = {
    name: 'OpenCode CLI',
    description: 'Command line interface for OpenCode',
    check: async () => {
        try {
            (0, child_process_1.execSync)('opencode --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('OpenCode CLI')}...`));
        try {
            console.log(chalk_1.default.gray('> npm install -g opencode-cli'));
            (0, child_process_1.execSync)('npm install -g opencode-cli', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ OpenCode CLI installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install OpenCode CLI.'));
        }
    }
};
