import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { MARKDOWN_EDITOR_STYLE } from './style';
import { getMarkdownEditorVars } from './theme';

export function activate(context: vscode.ExtensionContext) {
  const treeProvider = new MarkdownTreeProvider();
  vscode.window.registerTreeDataProvider('markdown-view', treeProvider);

  vscode.commands.registerCommand('markdownView.openMarkdownFile', (resource: vscode.Uri) => {
    const data = fs.readFileSync(resource.fsPath, 'utf-8');
    const panel = vscode.window.createWebviewPanel(
      'markdown-view',
      `MarkDown View: ${path.basename(resource.fsPath)}`,
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );

    // Detect current theme
    const getTheme = () => vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light';
    let currentTheme = getTheme();
    // Get the URI for app.css in the webview
    const cssPath = vscode.Uri.file(path.join(__dirname, 'app.css'));
    const cssUri = panel.webview.asWebviewUri(cssPath);
    // Render HTML with the correct CSS URI
    panel.webview.html = getMarkdownEditorHtml(data, currentTheme, cssUri.toString());

    // Listen for theme changes
    const themeListener = vscode.window.onDidChangeActiveColorTheme(theme => {
      currentTheme = theme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light';
      panel.webview.html = getMarkdownEditorHtml(data, currentTheme, cssUri.toString());
    });
    context.subscriptions.push(themeListener);

    panel.webview.onDidReceiveMessage((message) => {
      if (message.type === 'save') {
        fs.writeFileSync(resource.fsPath, message.text, 'utf8');
        vscode.window.showInformationMessage('Markdown file saved.');
      }
    });
  });
}

function getMarkdownEditorHtml(data: string, theme: string, cssUri: string): string {
  const vars = getMarkdownEditorVars(theme === 'dark' ? 'dark' : 'light');
  let themedStyle = MARKDOWN_EDITOR_STYLE;
  for (const [key, value] of Object.entries(vars)) {
    themedStyle = themedStyle.replaceAll(`{{${key}}}`, value);
  }
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>MarkDown View</title>
      <link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <style>
        ${themedStyle}
      </style>
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js"></script>
    </head>
    <body data-theme="${theme}">
      <textarea id="editor">${data}</textarea>
      <script src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
      <script>
        const vscode = acquireVsCodeApi();
        // Initialize Mermaid
        if (window.mermaid) {
          window.mermaid.initialize({ startOnLoad: false });
        }
        const easyMDE = new EasyMDE({
          element: document.getElementById("editor"),
          theme: "dracula",
          renderingConfig: {
              codeSyntaxHighlighting: true
          },
          toolbar: [
              "bold", "italic", "heading", "|",
              "quote", "unordered-list", "ordered-list", "|",
              "link", "image", "table", "code", "|",
              "preview", "side-by-side", "fullscreen", "|",
              {
                  name: "save",
                  action: function customSave(editor) {
                    const content = editor.value();
                    vscode.postMessage({
                        type: 'save',
                        text: content
                    });
                  },
                  className: "fa fa-save",
                  title: "Save",
              }
          ]
        });

        // Hook into preview rendering to render Mermaid diagrams
        function renderMermaidDiagrams() {
          if (!window.mermaid) return;
          // Find all mermaid code blocks in preview
          const previews = document.querySelectorAll('.editor-preview, .editor-preview-side');
          previews.forEach(preview => {
            const codeBlocks = preview.querySelectorAll('pre > code.language-mermaid');
            codeBlocks.forEach((codeBlock, idx) => {
              const parent = codeBlock.parentElement;
              if (!parent) return;
              // Create a container for the diagram
              const container = document.createElement('div');
              container.className = 'mermaid';
              container.innerHTML = codeBlock.textContent;
              parent.replaceWith(container);
              // Render the diagram
              try {
                window.mermaid.init(undefined, container);
              } catch (e) {
                container.innerHTML = '<pre style="color:red">Mermaid render error: ' + e + '</pre>';
              }
            });
          });
        }

        // EasyMDE preview hooks
        easyMDE.codemirror.on('update', function() {
          // If preview is active, render Mermaid
          if (document.querySelector('.editor-preview-active, .editor-preview-side')) {
            setTimeout(renderMermaidDiagrams, 0);
          }
        });
        // Also run after toggling preview
        document.addEventListener('click', function(e) {
          if (e.target && (e.target.classList.contains('fa-eye') || e.target.classList.contains('fa-columns'))) {
            setTimeout(renderMermaidDiagrams, 100);
          }
        });
      </script>
    </body>
    </html>
  `;
}

class MarkdownTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  private getSearchFolders(rootFolder: string): string[] {
    let searchFolders = [rootFolder];
    const mdPathsFile = path.join(rootFolder, '.vscode', 'md_paths');
    if (fs.existsSync(mdPathsFile)) {
      try {
        // Each line is a relative or absolute path
        const extraFolders = fs.readFileSync(mdPathsFile, 'utf-8')
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0 && line !== rootFolder);
        // Convert relative paths to absolute
        for (const folder of extraFolders) {
          const absPath = path.isAbsolute(folder) ? folder : path.join(rootFolder, folder);
          if (!searchFolders.includes(absPath)) {
            searchFolders.push(absPath);
          }
        }
      } catch (e) {
        const errMsg = (e instanceof Error) ? e.message : String(e);
        vscode.window.showWarningMessage('Could not read .vscode/md_paths: ' + errMsg);
      }
    }
    return searchFolders;
  }

  getChildren(): Thenable<vscode.TreeItem[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return Promise.resolve([]);

    const rootFolder = workspaceFolders[0].uri.fsPath;
    const searchFolders = this.getSearchFolders(rootFolder);

    let files: vscode.TreeItem[] = [];
    for (const folder of searchFolders) {
      if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
        const mdFiles = fs.readdirSync(folder)
          .filter(file => file.endsWith('.md'))
          .map(file => {
            const fullPath = path.join(folder, file);
            const item = new vscode.TreeItem(path.relative(rootFolder, fullPath), vscode.TreeItemCollapsibleState.None);
            item.command = {
              command: 'markdownView.openMarkdownFile',
              title: 'Open MarkDown View',
              arguments: [vscode.Uri.file(fullPath)]
            };
            item.iconPath = new vscode.ThemeIcon('book');
            return item;
          });
        files = files.concat(mdFiles);
      }
    }
    return Promise.resolve(files);
  }
}