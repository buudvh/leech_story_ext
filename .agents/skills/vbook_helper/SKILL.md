---
name: vbook_helper
description: Guidelines and helper instructions for building new Vbook novel crawlers
---

# Vbook Helper Skill

This skill provides step-by-step instructions on how to create, test, and package novel crawler extensions for the Vbook app.

## File Structure of an Extension
An extension should reside in its own folder and have:
- `plugin.json`: Metadata, script mappings, and configs.
- `icon.png`: A 144x144 png logo.
- `src/`: Containing JavaScript files (`home.js`, `detail.js`, `toc.js`, `chap.js`, etc.).

## Command for Packaging
Once files are created, compress them using:
```powershell
Compress-Archive -Path "plugin.json", "icon.png", "src" -DestinationPath "<ext_name>.zip" -Force
```
