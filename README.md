# MarkDown View

`markdown-view` is a VS Code extension designed to provide an intuitive Markdown editing experience. It features a custom sidebar for navigating `.md` files and a modern Markdown editor powered by EasyMDE (built on CodeMirror). The extension supports live preview, formatting, and Mermaid diagrams, making it easy to edit and visualize Markdown content directly in VS Code.

## Features

- 📁 Sidebar view listing all Markdown files in your workspace.
- ✍️ Rich text editing and preview using EasyMDE (CodeMirror) with formatting toolbar (headings, bold, italics, lists, etc.).
- 💾 Save button to write edits directly to the selected file.
- 🖼️ Live preview with support for Mermaid diagrams (flowcharts, sequence diagrams, etc.).
- 🎨 Automatic dark/light theme matching VS Code's color theme.
- ✅ Built using VS Code Webview API, TypeScript, and EasyMDE/CodeMirror.


![MarkDown View Demo](https://github.com/joelrodriguezguzman/markdown/blob/main/images/markdown.gif?raw=true)

> 🎥 This GIF shows the MarkDown View extension in action — editing, previewing, and rendering Mermaid diagrams with EasyMDE.

## Requirements

- Internet connection to load EasyMDE, CodeMirror, and Mermaid via CDN.
- Workspace must contain at least one `.md` file.
- VS Code version `^1.75.0` or higher for full compatibility with Webview features.


## Extension Settings

*Currently, the extension does not expose user settings. All toolbar options and view modes are set by default for a streamlined experience.*

## Known Issues

- Mermaid diagrams require valid syntax; errors in diagrams will be shown in the preview.
- Some advanced Markdown features (footnotes, task lists) may not render identically to GitHub.
- Source/preview split view is not yet implemented (roadmapped for a future release).
- Save notification might not trigger if file is locked by another process.

## Release Notes

### 1.0.0
- Initial release with sidebar file explorer and EasyMDE integration.
- Added Mermaid diagram support in preview.
- Improved theming and toolbar UX.

## Following Extension Guidelines

We follow VS Code's official extension development guidelines to ensure compatibility and performance.

* [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with MarkDown View

You can author your README using Visual Studio Code. Useful shortcuts:

* Split editor: `Cmd+\` (macOS), `Ctrl+\` (Windows/Linux)
* Toggle preview: `Shift+Cmd+V` (macOS), `Shift+Ctrl+V` (Windows/Linux)
* Auto-complete Markdown snippets: `Ctrl+Space`

📘 Usage
To edit a Markdown file using MarkDown View:

Follow the MarkDown View GIF usage example for a visual walkthrough.

Open any .md file listed by the extension.

Use the EasyMDE toolbar to format and customize your text.

Click the 💾 Save icon to persist your changes.

Click the 👁️ Eye icon to preview the rendered Markdown.

🗂️ Managing Which Markdown Files Are Shown
By default, the extension lists all .md files located in the root directory of your project.

If you want MarkDown View to include Markdown files from additional folders:

Create a file named md_paths (without any file extension) inside your project's .vscode folder.

Inside md_paths, list the relative paths of any folders you want the extension to scan for .md files.

Enter one folder path per line. For example:

```bash
docs
content/blog
notes/personal
```

This allows you to customize which directories are included in the Markdown file list, making it easier to manage larger or more structured projects.

## More Info

* [VS Code Markdown Support](https://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Happy Markdown editing!**

## License

This project is licensed under the GNU Affero General Public License v3.0. See the LICENSE file for details.
