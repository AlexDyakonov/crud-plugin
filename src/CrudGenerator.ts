import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class CrudGenerator {
    static async generateCrud(schema: string, table: string): Promise<void> {
        try {
            const crudCode = CrudGenerator.getCrudCode(schema, table);

            await vscode.env.clipboard.writeText(crudCode);
            vscode.window.showInformationMessage(`CRUD для ${schema}.${table} скопирован в буфер обмена.`);

            const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(path.join(vscode.workspace.rootPath || '', `${table}_crud.go`)),
                filters: { 'Go Files': ['go'] },
                saveLabel: 'Save CRUD File'
            });

            if (uri) {
                fs.writeFileSync(uri.fsPath, crudCode, 'utf8');
                vscode.window.showInformationMessage(`CRUD-код для ${schema}.${table} сохранен в файл ${uri.fsPath}.`);
            } else {
                vscode.window.showWarningMessage('Сохранение файла отменено.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`Не удалось сгенерировать CRUD: ${errorMessage}`);
        }
    }
// TODO: написать хороший CRUD генератор
    static getCrudCode(schema: string, table: string): string {
        return `// CRUD код для таблицы ${schema}.${table}

// Импорт пакетов
package ${table}

// Структура для ${table}
type ${table} struct {
    ID int \`json:"id"\`
    // Добавьте остальные поля таблицы
}

// GetAll: Получение всех записей из таблицы ${table}
func GetAll${table}() ([]${table}, error) {
    var items []${table}
    // Здесь должен быть код для подключения к базе данных и выполнения SQL-запроса SELECT
    query := "SELECT * FROM ${schema}.${table}"
    // Пример выполнения запроса
    rows, err := db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    for rows.Next() {
        var item ${table}
        // Здесь должно быть сканирование полей
        if err := rows.Scan(/* поля */); err != nil {
            return nil, err
        }
        items = append(items, item)
    }
    return items, nil
}

// Insert: Добавление новой записи в таблицу ${table}
func Insert${table}(item *${table}) error {
    // Здесь должен быть код для подключения к базе данных и выполнения SQL-запроса INSERT
    query := "INSERT INTO ${schema}.${table} (/* поля */) VALUES (/* значения */)"
    _, err := db.Exec(query, /* значения */)
    return err
}
`;
    }
}
