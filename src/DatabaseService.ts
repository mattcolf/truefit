import { Client, QueryConfig, QueryResult } from "pg";

// a simple wrapper for the database connection
export class DatabaseService {
    private client: Client;
    private connected: boolean;

    public constructor(host: string, username: string, password: string, database: string) {
        this.client = new Client({
            host: host,
            user: username,
            password: password,
            database: database,
        });

        this.connected = false;
    }

    public async query(query: QueryConfig): Promise<QueryResult> {
        // there's likely a better way to do this...
        if (!this.connected) {
            await this.connect();
            this.connected = true;
        }

        return this.client.query(query);
    }

    private async connect(): Promise<void> {
        return this.client.connect();
    }
}
