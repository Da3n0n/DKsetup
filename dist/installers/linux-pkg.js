"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLinuxPkgManager = detectLinuxPkgManager;
const child_process_1 = require("child_process");
function detectLinuxPkgManager() {
    try {
        (0, child_process_1.execSync)('apt-get --version', { stdio: 'ignore' });
        return 'apt';
    }
    catch { }
    try {
        (0, child_process_1.execSync)('dnf --version', { stdio: 'ignore' });
        return 'dnf';
    }
    catch { }
    try {
        (0, child_process_1.execSync)('pacman --version', { stdio: 'ignore' });
        return 'pacman';
    }
    catch { }
    return 'unknown';
}
