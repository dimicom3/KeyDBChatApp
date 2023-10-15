import {RedisClientType, createClient}  from "redis"

export class KeyDB {
    
    client: RedisClientType;

    constructor(private readonly url: string) 
    {
        this.client = createClient({
            url: this.url,
            legacyMode: false
        })
        this.testConnection();
    } 
    async testConnection()
    {
        try {
            await this.client.connect();
            console.log('\x1b[32m%s\x1b[0m',`KeyDB connected...`);
        } catch (error) {
            console.log('\x1b[31m%s\x1b[0m', "KeyDB is not connected...");
            console.log('\x1b[31m%s\x1b[0m', "ERROR:", (error as Error).message);
            await this.client.disconnect();
        }
    }
}