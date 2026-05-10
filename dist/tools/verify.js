"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = verifySession;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../db/schema");
const hash_1 = require("../utils/hash");
function verifySession(db) {
    return async (args) => {
        const rows = await db.select().from(schema_1.messages)
            .where((0, drizzle_orm_1.eq)(schema_1.messages.session_id, args.session_id))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.messages.created_at), (0, drizzle_orm_1.asc)((0, drizzle_orm_1.sql) `rowid`));
        const chained = rows.filter(r => r.content_hash !== null);
        if (chained.length === 0) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ valid: true, messages: rows.length, chained: 0, note: 'No chained messages — pre-dates hash chaining' }),
                    }],
            };
        }
        for (let i = 0; i < chained.length; i++) {
            const row = chained[i];
            const expectedPrev = i === 0 ? null : chained[i - 1].content_hash;
            if (row.prev_hash !== expectedPrev) {
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify({ valid: false, first_break: row.id, reason: 'prev_hash mismatch' }),
                        }],
                };
            }
            const expected = (0, hash_1.computeContentHash)(row.session_id, row.role, row.content, row.created_at, row.prev_hash);
            if (row.content_hash !== expected) {
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify({ valid: false, first_break: row.id, reason: 'content_hash mismatch — row was tampered' }),
                        }],
                };
            }
        }
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({ valid: true, messages: rows.length, chained: chained.length }),
                }],
        };
    };
}
