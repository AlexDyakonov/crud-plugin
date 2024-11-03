export function getConnectionFormContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Database Connection</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f3f3f3;
                    color: #000;
                }
                h2 {
                    text-align: center;
                }
                #connection-form {
                    display: flex;
                    flex-direction: column;
                    width: 300px;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                }
                label {
                    margin: 10px 0 5px;
                    font-weight: bold;
                }
                input[type="text"], input[type="password"] {
                    padding: 8px;
                    font-size: 14px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    outline: none;
                    box-sizing: border-box;
                }
                .button-group {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                }
                button {
                    flex: 1;
                    padding: 10px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #007acc;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    margin-right: 10px;
                }
                button:last-child {
                    margin-right: 0;
                }
                button:hover {
                    background-color: #005f9e;
                }
            </style>
        </head>
        <body>
            <div>
                <h2>Database Connection</h2>
                <form id="connection-form">
                    <label>Host: <input type="text" id="host" required /></label>
                    <label>Port: <input type="text" id="port" required /></label>
                    <label>Database Name: <input type="text" id="dbName" required /></label>
                    <label>User: <input type="text" id="user" required /></label>
                    <label>Password: <input type="password" id="password" /></label>
                    <div class="button-group">
                        <button type="button" onclick="testConnection()">Test Connection</button>
                        <button type="button" onclick="connect()">Connect</button>
                    </div>
                </form>
            </div>
            <script>
                const vscode = acquireVsCodeApi();

                window.addEventListener('message', event => {
                    const message = event.data;
                    if (message.command === 'loadConfig') {
                        const { host, port, dbName, user, password } = message.data;
                        document.getElementById('host').value = host || '';
                        document.getElementById('port').value = port || '';
                        document.getElementById('dbName').value = dbName || '';
                        document.getElementById('user').value = user || '';
                        document.getElementById('password').value = password || '';
                    }
                });

                function testConnection() {
                    const host = document.getElementById('host').value;
                    const port = document.getElementById('port').value;
                    const dbName = document.getElementById('dbName').value;
                    const user = document.getElementById('user').value;
                    const password = document.getElementById('password').value;

                    vscode.postMessage({
                        command: 'testConnection',
                        data: { host, port, dbName, user, password }
                    });
                }
                
                function connect() {
                    const host = document.getElementById('host').value;
                    const port = document.getElementById('port').value;
                    const dbName = document.getElementById('dbName').value;
                    const user = document.getElementById('user').value;
                    const password = document.getElementById('password').value;

                    vscode.postMessage({
                        command: 'connect',
                        data: { host, port, dbName, user, password }
                    });
                }
            </script>
        </body>
        </html>
    `;
}
