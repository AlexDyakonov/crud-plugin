import * as vscode from 'vscode';
import { DatabaseConnectionHandler } from './DatabaseConnectionHandler';

export function activate(context: vscode.ExtensionContext) {
    const connectToDatabaseCommand = vscode.commands.registerCommand('golang-crud-generator.connectToDatabase', () => {
        DatabaseConnectionHandler.showDatabaseConnectionForm();
    });

    context.subscriptions.push(connectToDatabaseCommand);
}

export function deactivate() {}