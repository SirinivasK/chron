"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSession = startSession;
exports.listSessions = listSessions;
exports.getSessionHistory = getSessionHistory;
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const schema_1 = require("../db/schema");
const time_1 = require("../utils/time");
function startSession(db) {
    return async (args) => {
        const id = (0, uuid_1.v4)();
        const now = (0, time_1.localISOString)();
        try {
            await db.insert(schema_1.sessions).values({
                id,
                title: args.title,
                ai_tool: args.ai_tool ?? null,
                created_at: now,
                updated_at: now,
            });
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ session_id: id, created: true, message_count: 0, ai_tool: args.ai_tool ?? null }),
                    }],
            };
        }
        catch (e) {
            const isUnique = e?.message?.includes('UNIQUE constraint failed') ||
                e?.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
                e?.cause?.message?.includes('UNIQUE constraint failed') ||
                e?.cause?.extendedCode === 'SQLITE_CONSTRAINT_UNIQUE';
            if (!isUnique)
                throw e;
            const existing = await db.select().from(schema_1.sessions).where((0, drizzle_orm_1.eq)(schema_1.sessions.title, args.title)).limit(1);
            const session = existing[0];
            const [countRow] = await db.select({ count: (0, drizzle_orm_1.sql) `count(*)` }).from(schema_1.messages).where((0, drizzle_orm_1.eq)(schema_1.messages.session_id, session.id));
            await db.update(schema_1.sessions).set({ updated_at: now }).where((0, drizzle_orm_1.eq)(schema_1.sessions.id, session.id));
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ session_id: session.id, created: false, message_count: countRow?.count ?? 0, ai_tool: session.ai_tool }),
                    }],
            };
        }
    };
}
function listSessions(db) {
    return async (args) => {
        const rows = await db.select({
            id: schema_1.sessions.id,
            title: schema_1.sessions.title,
            ai_tool: schema_1.sessions.ai_tool,
            created_at: schema_1.sessions.created_at,
            updated_at: schema_1.sessions.updated_at,
            message_count: (0, drizzle_orm_1.sql) `count(${schema_1.messages.id})`,
        })
            .from(schema_1.sessions)
            .leftJoin(schema_1.messages, (0, drizzle_orm_1.eq)(schema_1.messages.session_id, schema_1.sessions.id))
            .groupBy(schema_1.sessions.id)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.sessions.updated_at));
        const limited = args.limit != null ? rows.slice(0, args.limit) : rows;
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({ sessions: limited, total: rows.length }),
                }],
        };
    };
}
function getSessionHistory(db) {
    return async (args) => {
        const [countRow] = await db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.session_id, args.session_id));
        const total = countRow?.count ?? 0;
        const baseQuery = db.select().from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.session_id, args.session_id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.created_at), (0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `rowid`));
        const rows = await (args.limit != null ? baseQuery.limit(args.limit) : baseQuery);
        const limited = rows.reverse();
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        messages: limited.map(m => ({ role: m.role, content: m.content, created_at: m.created_at })),
                        total,
                    }),
                }],
        };
    };
}
