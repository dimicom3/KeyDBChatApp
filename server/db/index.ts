import dotenv from "dotenv";
import { KeyDB } from "./keydb.db";


dotenv.config()

const keyDB = new KeyDB(process.env.KEYDB_URL!);

keyDB.client.ping()


export {
    keyDB
}