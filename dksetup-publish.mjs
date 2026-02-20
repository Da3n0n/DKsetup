#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

const dryRun = process.argv.includes('--dry-run');
const resumeOnly = process.argv.includes('--resume');

const packageConfigs = [
  {
    name: 'dksetup',
    path: 'package.json',
    publishDir: '.'
  }
];

function bumpPatch(version) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid semver version: ${version}`);
  }
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

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
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', rejectPromise);
    child.on('close', (code) => {
      resolvePromise({ stdout: stdout.trim(), stderr: stderr.trim(), code });
    });
  });
}

async function loadPackageJson(path) {
  const raw = await readFile(path, 'utf8');
  const json = JSON.parse(raw);
  return json;
}

async function savePackageJson(path, json) {
  const normalized = `${JSON.stringify(json, null, 2)}\n`;
  await writeFile(path, normalized, 'utf8');
}

async function isPublished(packageName, version, cwd) {
  const lookup = `${packageName}@${version}`;
  const result = await runCommandCapture('npm', ['view', lookup, 'version'], cwd);
  return result.code === 0 && result.stdout === version;
}

async function assertNpmAuth(cwd) {
  const result = await runCommandCapture('npm', ['whoami'], cwd);
  if (result.code !== 0 || !result.stdout) {
    throw new Error('npm authentication failed (token expired/revoked). Run "npm login" and retry publish.');
  }
  return result.stdout;
}

async function main() {
  const repoRoot = process.cwd();
  const packageStates = [];
  for (const config of packageConfigs) {
    const fullPath = resolve(repoRoot, config.path);
    const pkgJson = await loadPackageJson(fullPath);
    if (pkgJson.name !== config.name) {
      throw new Error(`Package mismatch at ${config.path}. Expected ${config.name}, found ${pkgJson.name}`);
    }
    packageStates.push({
      ...config,
      fullPath,
      pkgJson,s
      oldVersion: pkgJson.version,
      newVersion: bumpPatch(pkgJson.version)
    });
  }
  let publishedCount = 0;
  for (const pkg of packageStates) {
    pkg.currentPublished = await isPublished(pkg.name, pkg.oldVersion, repoRoot);
    if (pkg.currentPublished) {
      publishedCount += 1;
    }
  }
  if (resumeOnly && publishedCount > 0 && publishedCount < packageStates.length) {
    if (!dryRun) {
      const npmUser = await assertNpmAuth(repoRoot);
      console.log(`\nAuthenticated as npm user: ${npmUser}`);
    }
    const missing = packageStates.filter((pkg) => !pkg.currentPublished);
    console.log('\nPartial release detected.');
    console.log('Already published at current local versions:');
    for (const pkg of packageStates.filter((item) => item.currentPublished)) {
      console.log(`- ${pkg.name}@${pkg.oldVersion}`);
    }
    console.log('\nPending publish (no version bump):');
    for (const pkg of missing) {
      console.log(`- ${pkg.name}@${pkg.oldVersion}`);
    }
    if (dryRun) {
      console.log('\nDry run complete. No files were changed and no packages were published.');
      return;
    }
    console.log('\nResuming publish for missing packages...');
    for (const pkg of missing) {
      const publishCwd = resolve(repoRoot, pkg.publishDir);
      console.log(`\nPublishing ${pkg.name}@${pkg.oldVersion} from ${pkg.publishDir}`);
      await runCommand('npm', ['publish', '--access', 'public'], publishCwd);
    }
    console.log('\nPublish resume completed successfully.');
    return;
  }
  if (resumeOnly && publishedCount === 0) {
    if (dryRun) {
      console.log('\nResume mode: no packages published yet at current local versions.');
      console.log('Pending publish (no version bump):');
      for (const pkg of packageStates) {
        console.log(`- ${pkg.name}@${pkg.oldVersion}`);
      }
      console.log('\nDry run complete. No files were changed and no packages were published.');
      return;
    }
    const npmUser = await assertNpmAuth(repoRoot);
    console.log(`\nAuthenticated as npm user: ${npmUser}`);
    console.log('\nResume mode: publishing current local versions without bump...');
    for (const pkg of packageStates) {
      const publishCwd = resolve(repoRoot, pkg.publishDir);
      console.log(`\nPublishing ${pkg.name}@${pkg.oldVersion} from ${pkg.publishDir}`);
      await runCommand('npm', ['publish', '--access', 'public'], publishCwd);
    }
    console.log('\nPublish resume completed successfully.');
    return;
  }
  if (resumeOnly && publishedCount === packageStates.length) {
    console.log('\nNo partial release detected. All current local versions are already published.');
    if (dryRun) {
      console.log('\nDry run complete. No files were changed and no packages were published.');
      return;
    }
    console.log('\nResume mode did not publish anything.');
    return;
  }
  if (dryRun) {
    console.log('\nPlanned version updates:');
    for (const pkg of packageStates) {
      console.log(`- ${pkg.name}: ${pkg.oldVersion} -> ${pkg.newVersion}`);
    }
    console.log('\nDry run complete. No files were changed and no packages were published.');
    return;
  }
  const npmUser = await assertNpmAuth(repoRoot);
  console.log(`\nAuthenticated as npm user: ${npmUser}`);
  for (const pkg of packageStates) {
    pkg.pkgJson.version = pkg.newVersion;
    await savePackageJson(pkg.fullPath, pkg.pkgJson);
  }
  console.log('\nVersion updates:');
  for (const pkg of packageStates) {
    console.log(`- ${pkg.name}: ${pkg.oldVersion} -> ${pkg.newVersion}`);
  }
  console.log('\nPublishing packages to npm...');
  for (const pkg of packageStates) {
    const publishCwd = resolve(repoRoot, pkg.publishDir);
    console.log(`\nPublishing ${pkg.name}@${pkg.newVersion} from ${pkg.publishDir}`);
    await runCommand('npm', ['publish', '--access', 'public'], publishCwd);
  }
  console.log('\nAll packages published successfully.');
}

main().catch((error) => {
  console.error(`\nPublish pipeline failed: ${error.message}`);
  process.exit(1);
});
