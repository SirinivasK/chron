"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.sessions = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.sessions = (0, sqlite_core_1.sqliteTable)('sessions', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    title: (0, sqlite_core_1.text)('title').notNull().unique(),
    ai_tool: (0, sqlite_core_1.text)('ai_tool'),
    created_at: (0, sqlite_core_1.text)('created_at').notNull(),
    updated_at: (0, sqlite_core_1.text)('updated_at').notNull(),
});
exports.messages = (0, sqlite_core_1.sqliteTable)('messages', {
    id: (0, sqlite_core_1.text)('id').primaryKey(),
    session_id: (0, sqlite_core_1.text)('session_id').notNull().references(() => exports.sessions.id),
    role: (0, sqlite_core_1.text)('role', { enum: ['user', 'assistant'] }).notNull(),
    content: (0, sqlite_core_1.text)('content').notNull(),
    created_at: (0, sqlite_core_1.text)('created_at').notNull(),
    prev_hash: (0, sqlite_core_1.text)('prev_hash'),
    content_hash: (0, sqlite_core_1.text)('content_hash'),
});
