import * as vscode from 'vscode';

export class PropertiesProvider {
    private static getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('golangCrudGenerator');
    }

    static getDatabaseConfig(): { host: string, port: string, dbName: string, user: string, password: string } {
        const config = PropertiesProvider.getConfig();
        return {
            host: config.get<string>('host', 'localhost'),
            port: config.get<string>('port', '5432'),
            dbName: config.get<string>('dbName', 'postgres'),
            user: config.get<string>('user', 'root'),
            password: config.get<string>('password', 'root')
        };
    }
    

    static async setDatabaseConfig(host: string, port: string, dbName: string, user: string, password: string): Promise<void> {
        const config = PropertiesProvider.getConfig();
        await config.update('host', host, vscode.ConfigurationTarget.Global);
        await config.update('port', port, vscode.ConfigurationTarget.Global);
        await config.update('dbName', dbName, vscode.ConfigurationTarget.Global);
        await config.update('user', user, vscode.ConfigurationTarget.Global);
        await config.update('password', password, vscode.ConfigurationTarget.Global);
    }
}
