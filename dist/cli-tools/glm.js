"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlmCliInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.GlmCliInstaller = {
    name: 'GLM CLI',
    description: 'Command line interface for ChatGLM',
    check: async () => {
        try {
            (0, child_process_1.execSync)('glm --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('GLM CLI')}...`));
        try {
            console.log(chalk_1.default.gray('> pip install chatglm-cli'));
            (0, child_process_1.execSync)('pip install chatglm-cli', { stdio: 'inherit' });
            console.log(chalk_1.default.green('✔ GLM CLI installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install GLM CLI.'));
        }
    }
};
