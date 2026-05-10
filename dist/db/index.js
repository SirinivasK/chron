"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = initDb;
const client_1 = require("@libsql/client");
const libsql_1 = require("drizzle-orm/libsql");
const os_1 = require("os");
const fs_1 = require("fs");
const path_1 = require("path");
const schema = __importStar(require("./schema"));
function getDbPath() {
    const envPath = process.env.CHRON_DB_PATH;
    if (envPath)
        return envPath;
    return (0, path_1.join)((0, os_1.homedir)(), '.chron', 'chron.db');
}
const CREATE_SQL = [
    `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    ai_tool TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
    `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    prev_hash TEXT,
    content_hash TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_title ON sessions(title)`,
    `CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id)`,
];
async function initDb(dbPath) {
    const path = dbPath ?? getDbPath();
    if (!path.startsWith(':')) {
        (0, fs_1.mkdirSync)((0, path_1.dirname)(path), { recursive: true });
    }
    const client = (0, client_1.createClient)({ url: path.startsWith(':') ? path : `file:${path}` });
    await client.execute('PRAGMA journal_mode = WAL');
    await client.execute('PRAGMA foreign_keys = ON');
    for (const sql of CREATE_SQL) {
        await client.execute(sql);
    }
    // Migrate existing messages tables that predate hash chaining columns
    const tableInfo = await client.execute('PRAGMA table_info(messages)');
    const columns = tableInfo.rows.map((r) => r[1]);
    if (!columns.includes('prev_hash')) {
        await client.execute('ALTER TABLE messages ADD COLUMN prev_hash TEXT');
    }
    if (!columns.includes('content_hash')) {
        await client.execute('ALTER TABLE messages ADD COLUMN content_hash TEXT');
    }
    return (0, libsql_1.drizzle)(client, { schema });
}
