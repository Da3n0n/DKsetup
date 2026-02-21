import { execSync } from 'child_process';

export type LinuxPkgManager = 'apt' | 'dnf' | 'pacman' | 'unknown';

export function detectLinuxPkgManager(): LinuxPkgManager {
    try { execSync('apt-get --version', { stdio: 'ignore' }); return 'apt'; } catch {}
    try { execSync('dnf --version', { stdio: 'ignore' }); return 'dnf'; } catch {}
    try { execSync('pacman --version', { stdio: 'ignore' }); return 'pacman'; } catch {}
    return 'unknown';
}
