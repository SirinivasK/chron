import * as schema from './schema';
export declare function initDb(dbPath?: string): Promise<import("drizzle-orm/libsql").LibSQLDatabase<typeof schema> & {
    $client: import("@libsql/client").Client;
}>;
export type Db = Awaited<ReturnType<typeof initDb>>;
