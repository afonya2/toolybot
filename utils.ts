import { Database } from "sqlite3";
import Logger from "./logger";

const logger = new Logger("utils");

function queryDB(db: Database, query: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                logger.error("Database error:", err);
                reject(err);
            }
            resolve(rows);
        });
    })
}

export default {
    queryDB
}