import * as vscode from 'vscode';
import { DatabaseConnectionHandler } from './DatabaseConnectionHandler';
import { CrudGenerator } from './CrudGenerator';

let selectedSchema: string | null = null;
let selectedTable: string | null = null;

export function activate(context: vscode.ExtensionContext) {
    console.log('Ваше расширение "golang-crud-generator" активировано!');

    const connectToDatabaseCommand = vscode.commands.registerCommand('golang-crud-generator.connectToDatabase', () => {
        DatabaseConnectionHandler.showDatabaseConnectionForm();
    });

    const selectSchemaAndTableCommand = vscode.commands.registerCommand('golang-crud-generator.selectSchemaAndTable', async () => {
        const result = await DatabaseConnectionHandler.selectSchemaAndTable();
        if (result) {
            selectedSchema = result.schema;
            selectedTable = result.table;
            vscode.window.showInformationMessage(`Выбрана схема ${selectedSchema} и таблица ${selectedTable}.`);
        }
    });

    const generateCrudCommand = vscode.commands.registerCommand('golang-crud-generator.generateCrud', async () => {
        if (!selectedSchema || !selectedTable) {
            vscode.window.showWarningMessage('Сначала выберите схему и таблицу для генерации CRUD.');
            return;
        }
        await CrudGenerator.generateCrud(selectedSchema, selectedTable);
    });

    context.subscriptions.push(connectToDatabaseCommand, selectSchemaAndTableCommand, generateCrudCommand);
}

export function deactivate() {}