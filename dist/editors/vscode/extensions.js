"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installVsCodeExtensions = installVsCodeExtensions;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const EXTENSIONS = [
    'esbenp.prettier-vscode',
    'dbaeumer.vscode-eslint',
    'eamodio.gitlens',
    'pkief.material-icon-theme'
];
async function installVsCodeExtensions() {
    console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('VS Code Extensions')}...`));
    for (const ext of EXTENSIONS) {
        try {
            console.log(chalk_1.default.gray(`> code --install-extension ${ext} --force`));
            (0, child_process_1.execSync)(`code --install-extension ${ext} --force`, { stdio: 'inherit' });
            console.log(chalk_1.default.green(`✔ ${ext} installed.`));
        }
        catch (error) {
            console.log(chalk_1.default.red(`✖ Failed to install extension: ${ext}`));
        }
    }
}
