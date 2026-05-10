export declare const sessions: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
    name: "sessions";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "id";
            tableName: "sessions";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        title: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "title";
            tableName: "sessions";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        ai_tool: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "ai_tool";
            tableName: "sessions";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        created_at: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "created_at";
            tableName: "sessions";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        updated_at: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "updated_at";
            tableName: "sessions";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
    };
    dialect: "sqlite";
}>;
export declare const messages: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
    name: "messages";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "id";
            tableName: "messages";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        session_id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "session_id";
            tableName: "messages";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        role: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "role";
            tableName: "messages";
            dataType: "string";
            columnType: "SQLiteText";
            data: "user" | "assistant";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["user", "assistant"];
            baseColumn: never;
        }, object>;
        content: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "content";
            tableName: "messages";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        created_at: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "created_at";
            tableName: "messages";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        prev_hash: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "prev_hash";
            tableName: "messages";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        content_hash: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "content_hash";
            tableName: "messages";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
    };
    dialect: "sqlite";
}>;
