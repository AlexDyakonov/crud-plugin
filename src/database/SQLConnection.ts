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
    static async getSchemas(): Promise<string[]> {
        const client = await SQLConnection.getConnection();
        try {
            const res = await client.query(`
                SELECT schema_name 
                FROM information_schema.schemata 
                WHERE schema_name NOT IN ('pg_catalog', 'information_schema');
            `);
            return res.rows.map(row => row.schema_name);
        } finally {
            await client.end();
        }
    }

    static async getTables(schema: string): Promise<string[]> {
        const client = await SQLConnection.getConnection();
        try {
            const res = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = $1 AND table_type = 'BASE TABLE';
            `, [schema]);
            return res.rows.map(row => row.table_name);
        } finally {
            await client.end();
        }
    }
}
