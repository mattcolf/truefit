import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// contents of the .env file are expected to conform to this interface
export interface EnvironmentVariables {
    PORT: string;

    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_DATABASE: string;
}

export class Config {
    private values: EnvironmentVariables;

    public constructor(values: EnvironmentVariables = process.env as any) {
        this.values = values;
    }

    public getPort(): Number {
        return this.values.PORT
            ? Number(this.values.PORT)
            : 8080;
    }

    public getDatabaseHost(): string {
        return this.values.DATABASE_HOST || "localhost";
    }

    public getDatabaseUsername(): string {
        return this.values.DATABASE_USERNAME || "";
    }

    public getDatabasePassword(): string {
        return this.values.DATABASE_PASSWORD || "";
    }

    public getDatabaseDatabase(): string {
        return this.values.DATABASE_DATABASE || "truefit";
    }
}