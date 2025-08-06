# [1.0.1] - 2025-08-03

### Changed
- Extension name, sidebar, and view IDs updated to `markdown-view` and "MarkDown View" for marketplace uniqueness and clarity.
- All branding, documentation, and UI text updated to match new name.

### Fixed
- Command registration and context menu integration for `Open Markdown File` now fully compatible with VS Code's requirements.
- Added missing `commands` and `menus` contributions in `package.json` for proper command visibility and activation.
# Change Log

All notable changes to the "markdown-view" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0] - 2025-08-03

### Added
- Sidebar view listing all Markdown files in the workspace
- Rich Markdown editing and preview using EasyMDE (CodeMirror)
- Formatting toolbar (headings, bold, italics, lists, etc.)
- Save button to write edits directly to the selected file
- Live preview with support for Mermaid diagrams (flowcharts, sequence diagrams, etc.)
- Automatic dark/light theme matching VS Code's color theme
- Built using VS Code Webview API, TypeScript, and EasyMDE/CodeMirror