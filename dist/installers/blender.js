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
exports.BlenderInstaller = void 0;
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const os = __importStar(require("os"));
exports.BlenderInstaller = {
    name: 'Blender',
    description: 'Free and open source 3D creation suite',
    check: async () => {
        const platform = os.platform();
        try {
            if (platform === 'win32') {
                // Checking via winget or checking Program Files
                (0, child_process_1.execSync)('winget list -e --id BlenderFoundation.Blender', { stdio: 'ignore' });
                return true;
            }
            else if (platform === 'darwin') {
                (0, child_process_1.execSync)('ls /Applications/Blender.app', { stdio: 'ignore' });
                return true;
            }
            else {
                (0, child_process_1.execSync)('blender --version', { stdio: 'ignore' });
                return true;
            }
        }
        catch {
            return false;
        }
    },
    install: async () => {
        const platform = os.platform();
        console.log(chalk_1.default.cyan(`Installing or Updating ${chalk_1.default.bold('Blender')}...`));
        try {
            if (platform === 'win32') {
                console.log(chalk_1.default.gray('> winget install --id BlenderFoundation.Blender -e --source winget --accept-package-agreements --accept-source-agreements'));
                // Remove the comment below to actually run the command
                (0, child_process_1.execSync)('winget install --id BlenderFoundation.Blender -e --source winget --accept-package-agreements --accept-source-agreements', { stdio: 'inherit' });
            }
            else if (platform === 'darwin') {
                console.log(chalk_1.default.gray('> brew install --cask blender'));
                (0, child_process_1.execSync)('brew install --cask blender', { stdio: 'inherit' });
            }
            else if (platform === 'linux') {
                console.log(chalk_1.default.gray('> sudo snap install blender --classic'));
                (0, child_process_1.execSync)('sudo snap install blender --classic', { stdio: 'inherit' });
            }
            console.log(chalk_1.default.green('✔ Blender installed/updated successfully!'));
        }
        catch (error) {
            console.log(chalk_1.default.red('✖ Failed to install or update Blender. It might already be running or require admin privileges.'));
        }
    }
};
