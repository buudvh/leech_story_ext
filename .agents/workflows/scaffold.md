# Scaffolding a New Novel Extension Workflow

This workflow guides the developer through creating a new crawler extension for a website.

## Steps

1. **Research the Website**:
   - Inspect the detail page, TOC page, list pages, search results pages, and chapter text.
   - Look for pagination in search results, lists, TOC (for books > 1000 chapters), and chapter text.

2. **Create the Extension Folder**:
   - Initialize the `plugin.json` and a custom `icon.png`.
   - Setup `src/libs.js` and script mappings.

3. **Implement Scripts**:
   - Write `home.js`, `genre.js`, `gen.js`, `detail.js`, `toc.js`, `chap.js`, and `search.js`.

4. **Verify and Test**:
   - Test against target URLs using python/JS execution.

5. **Package**:
   - Zip the files into a `.zip` archive.
