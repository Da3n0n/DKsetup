"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeCodeInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.ClaudeCodeInstaller = {
    name: 'Claude Code CLI',
    description: 'Command line interface for Claude',
    check: async () => {
        try {
            (0, child_process_1.execSync)('claude --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('Claude Code CLI')}...`));
        try {
            console.log(chalk_1.default.gray('> npm install -g @anthropic-ai/claude-code'));
            (0, child_process_1.execSync)('npm install -g @anthropic-ai/claude-code', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ Claude Code CLI installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install Claude Code CLI.'));
        }
    }
};
