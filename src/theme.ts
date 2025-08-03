// theme.ts
// Exports a function to get theme variables for the markdown editor webview.

export function getMarkdownEditorVars(theme: 'dark' | 'light') {
  const isDark = theme === 'dark';
  return {
    'background': isDark ? '#000' : '#fff',
    'color': isDark ? '#fff' : '#111',
    'toolbarBg': isDark ? '#111' : '#eee',
    'toolbarBorder': isDark ? '#333' : '#ccc',
    'toolbarIcon': isDark ? '#ccc' : '#333',
    'toolbarIconHover': isDark ? '#fff' : '#111',
    'previewBg': isDark ? '#0d1117' : '#fff',
    'previewColor': isDark ? '#c9d1d9' : '#222',
    'headingBorder': isDark ? '#30363d' : '#ccc',
    'headingColor': isDark ? '#c9d1d9' : '#222',
    'inlineCodeBg': isDark ? '#161b22' : '#f6f8fa',
    'inlineCodeColor': isDark ? '#d2a8ff' : '#6e5494',
    'preBg': isDark ? '#161b22' : '#f6f8fa',
    'preColor': isDark ? '#c9d1d9' : '#222',
    'cmBg': isDark ? '#0d1117' : '#fff',
    'cmColor': isDark ? '#c9d1d9' : '#222',
    'cmGutterBorder': isDark ? '#30363d' : '#ccc',
    'cmCursor': isDark ? '#c9d1d9' : '#222',
    'cmHeader': isDark ? '#58a6ff' : '#005cc5',
    'cmStrong': isDark ? '#f0f6fc' : '#222',
    'cmEm': isDark ? '#c9d1d9' : '#222',
    'cmLink': isDark ? '#79c0ff' : '#0366d6',
    'cmComment': isDark ? '#8b949e' : '#6a737d',
  };
}
