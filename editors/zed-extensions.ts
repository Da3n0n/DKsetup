import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const ZED_EXTENSIONS = [
    'html',
    'css',
    'json',
    'python',
    'rust',
    'toml',
    'dockerfile',
    'catppuccin',
];

const ZED_SETTINGS = {
    theme: 'One Dark',
    tab_size: 4,
    hard_tabs: false,
    format_on_save: 'on',
    buffer_font_size: 14,
    ui_font_size: 14,
    vim_mode: false,
    wrap_guides: [80, 120],
    show_whitespace: 'selection',
    inlay_hints: { enabled: true },
    assistant: { enabled: true, version: '2' }
};

export async function installZedExtensions() {
    console.log(chalk.cyan(`Configuring ${chalk.bold('Zed')} extensions & settings...`));

    // Try CLI extension installs
    let cliAvailable = false;
    try {
        execSync('zed --version', { stdio: 'ignore' });
        cliAvailable = true;
    } catch {}

    if (cliAvailable) {
        for (const ext of ZED_EXTENSIONS) {
            try {
                console.log(chalk.gray(`> zed extension install ${ext}`));
                execSync(`zed extension install ${ext}`, { stdio: 'inherit' });
                console.log(chalk.green(`✔ ${ext} installed.`));
            } catch {
                console.log(chalk.yellow(`  ⚠ Could not install ${ext} via CLI — install it in Zed's extension panel.`));
            }
        }
    } else {
        console.log(chalk.yellow('  ⚠ Zed CLI not in PATH. Install these extensions from Zed > Extensions:'));
        for (const ext of ZED_EXTENSIONS) {
            console.log(chalk.gray(`     · ${ext}`));
        }
    }

    // Write settings.json
    const settingsDir = join(homedir(), '.config', 'zed');
    const settingsPath = join(settingsDir, 'settings.json');

    try {
        if (!existsSync(settingsDir)) mkdirSync(settingsDir, { recursive: true });

        let existing: Record<string, unknown> = {};
        if (existsSync(settingsPath)) {
            try { existing = JSON.parse(readFileSync(settingsPath, 'utf8')); } catch {}
        }

        const merged = { ...ZED_SETTINGS, ...existing };
        writeFileSync(settingsPath, JSON.stringify(merged, null, 2));
        console.log(chalk.green(`✔ Zed settings written to ${settingsPath}`));
    } catch (err) {
        console.log(chalk.yellow(`  ⚠ Could not write Zed settings: ${(err as Error).message}`));
    }
}
