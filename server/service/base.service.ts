import { RedisClientType } from "redis";
import { keyDB } from "../db";

export class BaseService {
    keyDB: RedisClientType;

    constructor()
    {
        this.keyDB = keyDB.client;
    }

    // getRecordDataFromNeo(data: QueryResult)
    // {
    //     if(!data.records.length) return [];

    //     return data.records.map(record => record["_fields"][0].properties)
    // }
}