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
      } else if (message.type === 'print') {
        // Create a temporary HTML file for printing
        const tempDir = path.join(__dirname, '..', 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const tempFileName = `print_${Date.now()}.html`;
        const tempFilePath = path.join(tempDir, tempFileName);
        
        let htmlContent;
        
        if (message.isHtml) {
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Print - ${path.basename(resource.fsPath)}</title>
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                  line-height: 1.6; 
                  margin: 40px; 
                  color: #333;
                  background: white;
                }
                img { max-width: 100%; height: auto; }
                @media print { body { margin: 20px; } }
              </style>
            </head>
            <body>
              <div style="text-align: right; margin-bottom: 20px; font-size: 12px; color: #666;">
                Use Ctrl+P (Cmd+P on Mac) to print or save as PDF
              </div>
              ${message.content}
            </body>
            </html>
          `;
        } else {
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Print - ${path.basename(resource.fsPath)}</title>
              <style>
                body { 
                  font-family: 'Courier New', monospace; 
                  line-height: 1.4; 
                  margin: 40px; 
                  color: #333;
                }
                pre { white-space: pre-wrap; }
                @media print { body { margin: 20px; } }
              </style>
            </head>
            <body>
              <div style="text-align: right; margin-bottom: 20px; font-size: 12px; color: #666;">
                Use Ctrl+P (Cmd+P on Mac) to print or save as PDF
              </div>
              <pre>${message.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </body>
            </html>
          `;
        }
        
        fs.writeFileSync(tempFilePath, htmlContent, 'utf8');
        vscode.env.openExternal(vscode.Uri.file(tempFilePath));
        
        setTimeout(() => {
          try {
            fs.unlinkSync(tempFilePath);
          } catch (e) {
            // Ignore cleanup errors
          }
        }, 30000);
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
        
        /* Keep print button visible in preview modes */
        .editor-toolbar .fa-print {
          display: inline-block !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
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
              },
              {
                  name: "print",
                  action: function customPrint(editor) {
                    console.log('Print button clicked - preview mode active:', !!document.querySelector('.editor-preview-active, .editor-preview-side'));
                    
                    // Function to capture content from preview
                    function capturePreviewContent() {
                      // Try to find the active preview element
                      let previewElement = document.querySelector('.editor-preview-active');
                      if (!previewElement) {
                        previewElement = document.querySelector('.editor-preview-side');
                      }
                      
                      if (previewElement && previewElement.innerHTML.trim().length > 0) {
                        console.log('Found preview content, capturing HTML...');
                        
                        // Clone the preview content to avoid modifying the original
                        const clonedContent = previewElement.cloneNode(true);
                        
                        // Convert any Mermaid SVGs to embedded images
                        const mermaidSvgs = clonedContent.querySelectorAll('.mermaid svg');
                        console.log('Found ' + mermaidSvgs.length + ' SVG diagrams to convert');
                        
                        mermaidSvgs.forEach((svg, idx) => {
                          try {
                            // Convert SVG to data URL
                            const svgData = new XMLSerializer().serializeToString(svg);
                            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                            const svgUrl = URL.createObjectURL(svgBlob);
                            
                            // Create img element to replace the SVG
                            const img = document.createElement('img');
                            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                            img.alt = 'Mermaid Diagram ' + (idx + 1);
                            
                            // Replace SVG with IMG
                            svg.parentNode.replaceChild(img, svg);
                            console.log('Converted SVG ' + (idx + 1) + ' to embedded image');
                          } catch (e) {
                            console.error('Failed to convert SVG ' + (idx + 1) + ':', e);
                          }
                        });
                        
                        // Send the HTML content
                        vscode.postMessage({
                          type: 'print',
                          content: clonedContent.innerHTML,
                          isHtml: true
                        });
                      } else {
                        console.log('No preview content found, using raw markdown');
                        // Fallback to raw markdown
                        vscode.postMessage({
                          type: 'print',
                          content: editor.value(),
                          isHtml: false
                        });
                      }
                    }
                    
                    // If we're in preview mode, make sure diagrams are rendered first
                    const hasPreview = document.querySelector('.editor-preview-active, .editor-preview-side');
                    if (hasPreview) {
                      console.log('Preview mode detected, ensuring Mermaid diagrams are rendered...');
                      // Trigger mermaid rendering and wait a bit
                      renderMermaidDiagrams();
                      setTimeout(capturePreviewContent, 2000); // Wait 2 seconds for rendering
                    } else {
                      console.log('No preview mode, capturing immediately...');
                      capturePreviewContent();
                    }
                  },
                  className: "fa fa-print",
                  title: "Print",
              }
          ]
        });

        // Hook into preview rendering to render Mermaid diagrams
        function renderMermaidDiagrams() {
          if (!window.mermaid) return;
          // Find all mermaid code blocks in preview
          const previews = document.querySelectorAll('.editor-preview, .editor-preview-side');
          if (previews.length === 0) return;
          
          previews.forEach(preview => {
            // Collect all diagrams that need rendering
            const diagramsToRender = [];
            
            // Look for unprocessed code blocks
            const codeBlocks = preview.querySelectorAll('pre > code.language-mermaid');
            codeBlocks.forEach((codeBlock, idx) => {
              const parent = codeBlock.parentElement;
              if (!parent) return;
              
              const diagramId = 'mermaid-diagram-' + Date.now() + '-' + idx;
              const container = document.createElement('div');
              container.className = 'mermaid';
              container.id = diagramId;
              
              parent.replaceWith(container);
              diagramsToRender.push({ container, code: codeBlock.textContent, id: diagramId });
            });
            
            // Look for existing mermaid containers that need re-rendering
            const mermaidContainers = preview.querySelectorAll('div.mermaid');
            mermaidContainers.forEach((container, idx) => {
              if (container.querySelector('svg')) return; // Skip if already has SVG
              
              const diagramCode = container.textContent;
              if (diagramCode && diagramCode.trim()) {
                const diagramId = 'mermaid-rerender-' + Date.now() + '-' + idx;
                diagramsToRender.push({ container, code: diagramCode, id: diagramId });
              }
            });
            
            // Render diagrams sequentially to avoid conflicts
            let renderIndex = 0;
            function renderNext() {
              if (renderIndex >= diagramsToRender.length) return;
              
              const { container, code, id } = diagramsToRender[renderIndex];
              renderIndex++;
              
              try {
                window.mermaid.render(id + '-svg', code).then(({svg}) => {
                  container.innerHTML = svg;
                  // Render next diagram after a small delay
                  setTimeout(renderNext, 50);
                }).catch(e => {
                  container.innerHTML = '<pre style="color:red">Mermaid render error: ' + e + '</pre>';
                  setTimeout(renderNext, 50);
                });
              } catch (e) {
                container.innerHTML = '<pre style="color:red">Mermaid render error: ' + e + '</pre>';
                setTimeout(renderNext, 50);
              }
            }
            
            // Start sequential rendering
            renderNext();
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