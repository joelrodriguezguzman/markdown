import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Markdown Editor Mermaid Sample Test', () => {
  test('Sample Markdown file with Mermaid diagrams can be opened', async () => {
    const samplePath = path.join(
      vscode.workspace.workspaceFolders?.[0].uri.fsPath || '',
      'samples',
      'HelloWorld.md'
    );
    const doc = await vscode.workspace.openTextDocument(samplePath);
    assert.ok(doc, 'Sample Markdown file could not be opened');
    assert.ok(doc.getText().includes('sequenceDiagram'), 'Sample does not contain a Mermaid diagram');
    // Optionally, you could trigger your extension's command here if you want to test the webview
  });
});
