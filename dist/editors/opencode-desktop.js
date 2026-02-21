"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpencodeDesktopInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
exports.OpencodeDesktopInstaller = {
    name: 'OpenCode Desktop',
    description: 'Open source AI-native code editor',
    check: async () => {
        const platform = os.platform();
        try {
            if (platform === 'darwin') {
                (0, child_process_1.execSync)('test -d /Applications/OpenCode.app', { stdio: 'ignore' });
                return true;
            }
            (0, child_process_1.execSync)('opencode --version', { stdio: 'ignore' });
            return true;
        }
        catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk_1.default.cyan(`Installing ${chalk_1.default.bold('OpenCode Desktop')}...`));
        try {
            if (platform === 'win32') {
                console.log(chalk_1.default.gray('> winget install OpenCode.OpenCode'));
                (0, child_process_1.execSync)('winget install OpenCode.OpenCode', { stdio: 'inherit' });
            }
            else if (platform === 'darwin') {
                console.log(chalk_1.default.gray('> brew install --cask opencode'));
                (0, child_process_1.execSync)('brew install --cask opencode', { stdio: 'inherit' });
            }
            else if (platform === 'linux') {
                console.log(chalk_1.default.gray('> curl -fsSL https://opencode.ai/install.sh | sh'));
                (0, child_process_1.execSync)('curl -fsSL https://opencode.ai/install.sh | sh', { stdio: 'inherit', shell: '/bin/bash' });
            }
            console.log(chalk_1.default.green('✔ OpenCode Desktop installed successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.yellow('⚠ Automatic install failed. Visit https://opencode.ai to download manually.'));
        }
    }
};
