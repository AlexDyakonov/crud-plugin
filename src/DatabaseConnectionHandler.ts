import * as vscode from 'vscode';
import { SQLConnection } from './database/SQLConnection';
import { PropertiesProvider } from './database/PropertiesProvider';
import { getConnectionFormContent } from './webview/connectionFormContent';

export class DatabaseConnectionHandler {
    static showDatabaseConnectionForm() {
        const panel = vscode.window.createWebviewPanel(
            'dbConnection',
            'Database Connection',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getConnectionFormContent();

        const dbConfig = PropertiesProvider.getDatabaseConfig();
        panel.webview.onDidReceiveMessage(
            async message => {
                const { host, port, dbName, user, password } = message.data;
                // console.log('Connecting with parameters:', { host, port, dbName, user, password });

                if (message.command === 'testConnection') {
                    PropertiesProvider.setDatabaseConfig(host, port, dbName, user, password);
                    try {
                        await SQLConnection.testConnection();
                        vscode.window.showInformationMessage('Test Connection Successful!');
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        vscode.window.showErrorMessage(`Test Connection Failed: ${errorMessage}`);
                    }
                } else if (message.command === 'connect') {
                    PropertiesProvider.setDatabaseConfig(host, port, dbName, user, password);
                    try {
                        const client = await SQLConnection.getConnection();
                        vscode.window.showInformationMessage('Connected successfully!');
                        panel.dispose();
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        vscode.window.showErrorMessage(`Connection Failed: ${errorMessage}`);
                    }
                }
            }
        );

        panel.webview.postMessage({ command: 'loadConfig', data: dbConfig });
    }
}
