#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const dryRun = process.argv.includes('--dry-run');

function runCommand(command, args, cwd) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
      }
    });
  });
}

function runCommandCapture(command, args, cwd) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32'
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      resolvePromise({ stdout: stdout.trim(), stderr: stderr.trim(), code });
    });
  });
}

async function main() {
  const repoRoot = process.cwd();
  const pkgPath = resolve(repoRoot, 'package.json');
  const pkgJson = JSON.parse(await readFile(pkgPath, 'utf8'));
  const version = pkgJson.version;

  console.log(`\nPublishing dksetup@${version}...`);

  if (dryRun) {
    console.log('Dry run — no packages published.');
    return;
  }

  const auth = await runCommandCapture('npm', ['whoami'], repoRoot);
  if (auth.code !== 0 || !auth.stdout) {
    throw new Error('npm authentication failed. Run "npm login" and retry.');
  }
  console.log(`Authenticated as: ${auth.stdout}`);

  await runCommand('npm', ['publish', '--access', 'public'], repoRoot);
  console.log(`\nPublished dksetup@${version} successfully.`);
}

main().catch((error) => {
  console.error(`\nPublish failed: ${error.message}`);
  process.exit(1);
});
