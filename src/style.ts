// style.ts
// Export the markdown editor CSS as a template string for injection into the webview.

export const MARKDOWN_EDITOR_STYLE = `
  body {
      background-color: {{background}};
      color: {{color}};
      font-family: sans-serif;
      margin: 0;
      padding: 1rem;
  }
  .editor-toolbar {
      background-color: {{toolbarBg}} !important;
      border-bottom: 1px solid {{toolbarBorder}} !important;
  }
  .editor-toolbar button,
  .editor-toolbar i {
      color: {{toolbarIcon}} !important;
      opacity: 1 !important;
  }
  .editor-toolbar button:hover,
  .editor-toolbar i:hover {
      color: {{toolbarIconHover}} !important;
  }
  .editor-toolbar.disabled-for-preview button {
      opacity: 0.5 !important;
  }
  .editor-preview,
  .editor-preview-side {
      background-color: {{previewBg}} !important;
      color: {{previewColor}} !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      padding: 2rem;
      box-sizing: border-box;
  }
  .editor-preview h1,
  .editor-preview-side h1 {
      font-size: 2em;
      border-bottom: 1px solid {{headingBorder}};
      padding-bottom: 0.3em;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: {{headingColor}};
  }
  .editor-preview h2,
  .editor-preview-side h2 {
      font-size: 1.5em;
      border-bottom: 1px solid {{headingBorder}};
      padding-bottom: 0.3em;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: {{headingColor}};
  }
  .editor-preview code,
  .editor-preview-side code {
      background-color: {{inlineCodeBg}};
      padding: 2px 4px;
      border-radius: 4px;
      font-family: Consolas, "Courier New", monospace;
      font-size: 85%;
      color: {{inlineCodeColor}};
  }
  .editor-preview pre,
  .editor-preview-side pre {
      background-color: {{preBg}};
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 85%;
      color: {{preColor}};
  }
  .CodeMirror {
      background-color: {{cmBg}} !important;
      color: {{cmColor}} !important;
      font-family: Consolas, "Courier New", monospace;
      font-size: 16px;
      line-height: 1.6;
      padding: 1rem;
      border-radius: 6px;
  }
  .CodeMirror-gutters {
      background-color: {{cmBg}} !important;
      border-right: 1px solid {{cmGutterBorder}};
  }
  .CodeMirror-cursor {
      border-left: 1px solid {{cmCursor}} !important;
  }
  .cm-header {
      color: {{cmHeader}};
  }
  .cm-strong {
      color: {{cmStrong}};
      font-weight: bold;
  }
  .cm-em {
      color: {{cmEm}};
      font-style: italic;
  }
  .cm-link {
      color: {{cmLink}};
      text-decoration: underline;
  }
  .cm-comment {
      color: {{cmComment}};
  }
  .cm-code {
      background-color: {{inlineCodeBg}};
      color: {{inlineCodeColor}};
      padding: 2px 4px;
      border-radius: 4px;
  }
  .cm-string,
  .cm-inline-code,
  .cm-variable,
  .cm-def {
      color: {{inlineCodeColor}} !important;
      background-color: {{inlineCodeBg}} !important;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: Consolas, "Courier New", monospace;
      font-size: 85%;
  }
`;
