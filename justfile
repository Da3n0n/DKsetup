# Use PowerShell for all recipes
set shell := ["powershell", "-c"]
# Justfile for DK-CLI

# Publish: bump patch version and publish to npm
publish:
    node dksetup-publish.mjs

# (Lockfile removed) — use `publish` which now safely checks registry before bumping/publishing

# Bump only
bump:
    npm version patch --no-git-tag-version

# Show current version
version:
    node -p "require('./package.json').version"

# Install dependencies
install:
    npm install

# Help
help:
    echo "Available commands: publish, publish-force, publish-unlock, version, install"

