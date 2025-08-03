import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Markdown Extension Test Suite', () => {
  test('Extension should activate and register markdown.openFile command', async () => {
	const ext = vscode.extensions.getExtension('your-publisher.markdown');
	assert.ok(ext, 'Extension not found');
	await ext!.activate();
	const commands = await vscode.commands.getCommands(true);
	assert.ok(commands.includes('markdown.openFile'), 'Command markdown.openFile not registered');
  });
});
