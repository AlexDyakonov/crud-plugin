import { Client } from 'pg';
import { PropertiesProvider } from './PropertiesProvider';

export class SQLConnection {
    static async testConnection(): Promise<void> {
        const { host, port, dbName, user, password } = PropertiesProvider.getDatabaseConfig();
        const client = new Client({
            host,
            port: parseInt(port, 10),
            database: dbName,
            user,
            password,
        });

        try {
            await client.connect();
            await client.query('SELECT 1');
        } finally {
            await client.end();
        }
    }

    static async getConnection(): Promise<Client> {
        const { host, port, dbName, user, password } = PropertiesProvider.getDatabaseConfig();
        const client = new Client({
            host,
            port: parseInt(port, 10),
            database: dbName,
            user,
            password,
        });

        await client.connect();
        return client;
    }
}
