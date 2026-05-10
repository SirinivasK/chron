"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMessage = logMessage;
exports.logExchange = logExchange;
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const schema_1 = require("../db/schema");
const time_1 = require("../utils/time");
const hash_1 = require("../utils/hash");
function logMessage(db) {
    return async (args) => {
        const existing = await db.select({ id: schema_1.sessions.id }).from(schema_1.sessions).where((0, drizzle_orm_1.eq)(schema_1.sessions.id, args.session_id)).limit(1);
        if (existing.length === 0) {
            return { content: [{ type: 'text', text: `Session not found: ${args.session_id}` }], isError: true };
        }
        const last = await db.select({ content_hash: schema_1.messages.content_hash })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.session_id, args.session_id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.created_at), (0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `rowid`))
            .limit(1);
        const now = (0, time_1.localISOString)();
        const id = (0, uuid_1.v4)();
        const prevHash = last[0]?.content_hash ?? null;
        const contentHash = (0, hash_1.computeContentHash)(args.session_id, args.role, args.content, now, prevHash);
        await db.insert(schema_1.messages).values({
            id,
            session_id: args.session_id,
            role: args.role,
            content: args.content,
            created_at: now,
            prev_hash: prevHash,
            content_hash: contentHash,
        });
        await db.update(schema_1.sessions)
            .set({ updated_at: now })
            .where((0, drizzle_orm_1.eq)(schema_1.sessions.id, args.session_id));
        return {
            content: [{ type: 'text', text: JSON.stringify({ message_id: id, created_at: now, content_hash: contentHash }) }],
        };
    };
}
function logExchange(db) {
    return async (args) => {
        const existing = await db.select({ id: schema_1.sessions.id }).from(schema_1.sessions).where((0, drizzle_orm_1.eq)(schema_1.sessions.id, args.session_id)).limit(1);
        if (existing.length === 0) {
            return { content: [{ type: 'text', text: `Session not found: ${args.session_id}` }], isError: true };
        }
        const last = await db.select({ content_hash: schema_1.messages.content_hash })
            .from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.session_id, args.session_id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.messages.created_at), (0, drizzle_orm_1.desc)((0, drizzle_orm_1.sql) `rowid`))
            .limit(1);
        const userNow = (0, time_1.localISOString)();
        const userId = (0, uuid_1.v4)();
        const assistantNow = (0, time_1.localISOString)();
        const assistantId = (0, uuid_1.v4)();
        const prevHash = last[0]?.content_hash ?? null;
        const userHash = (0, hash_1.computeContentHash)(args.session_id, 'user', args.user_content, userNow, prevHash);
        const assistantHash = (0, hash_1.computeContentHash)(args.session_id, 'assistant', args.assistant_content, assistantNow, userHash);
        await db.insert(schema_1.messages).values({
            id: userId,
            session_id: args.session_id,
            role: 'user',
            content: args.user_content,
            created_at: userNow,
            prev_hash: prevHash,
            content_hash: userHash,
        });
        await db.insert(schema_1.messages).values({
            id: assistantId,
            session_id: args.session_id,
            role: 'assistant',
            content: args.assistant_content,
            created_at: assistantNow,
            prev_hash: userHash,
            content_hash: assistantHash,
        });
        await db.update(schema_1.sessions)
            .set({ updated_at: assistantNow })
            .where((0, drizzle_orm_1.eq)(schema_1.sessions.id, args.session_id));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        user_message_id: userId,
                        user_created_at: userNow,
                        user_content_hash: userHash,
                        assistant_message_id: assistantId,
                        assistant_created_at: assistantNow,
                        assistant_content_hash: assistantHash,
                    }),
                }],
        };
    };
}
