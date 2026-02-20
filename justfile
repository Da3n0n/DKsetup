# Use PowerShell for all recipes
set shell := ["powershell", "-c"]
# Justfile for DK-CLI

# Publish: bump patch version and publish to npm
publish:
    node dksetup-publish.mjs





