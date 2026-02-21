"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntigravityInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
exports.AntigravityInstaller = {
    name: 'Antigravity Workspace',
    description: 'Agentic IDE by DeepMind',
    check: async () => {
        try {
            (0, child_process_1.execSync)('antigravity --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('Antigravity')}...`));
        console.log(chalk_1.default.yellow('⚠ Antigravity does not have a public automated installer yet.'));
        console.log(chalk_1.default.gray('  Please visit https://antigravity.dev for installation instructions.'));
    }
};
