"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const sessions_1 = require("./tools/sessions");
const messages_1 = require("./tools/messages");
const verify_1 = require("./tools/verify");
const roleEnum = zod_1.z.enum(['user', 'assistant']);
function createServer(db) {
    const server = new mcp_js_1.McpServer({
        name: 'chron',
        version: '0.1.7',
    });
    // @ts-expect-error — MCP SDK deep generic type instantiation limit hit; runtime types are correct
    server.tool('start_session', 'Create a new audit session or resume an existing one by title. Call this at the start of every conversation.', {
        title: zod_1.z.string().describe('Descriptive session title, e.g. "Contract review — 2026-05-08"'),
        ai_tool: zod_1.z.string().optional().describe('AI tool name: "claude", "cursor", "windsurf", etc.'),
    }, (0, sessions_1.startSession)(db));
    server.tool('log_message', 'Record a single message (user or assistant) with the current local datetime and timezone offset. Call before responding for user messages, and before sending for assistant messages.', {
        session_id: zod_1.z.string().describe('Session ID returned by start_session'),
        role: roleEnum,
        content: zod_1.z.string().describe('Full message text'),
    }, (0, messages_1.logMessage)(db));
    server.tool('log_exchange', 'Record a user+assistant exchange from historical or batch imports only. Do NOT use for live conversations — both timestamps are captured at the same instant with no real gap. For live sessions always call log_message twice: once for the user message, once for the assistant response.', {
        session_id: zod_1.z.string().describe('Session ID returned by start_session'),
        user_content: zod_1.z.string().describe('The exact user message'),
        assistant_content: zod_1.z.string().describe('The exact assistant response'),
    }, (0, messages_1.logExchange)(db));
    // @ts-expect-error — MCP SDK deep generic type instantiation limit hit; runtime types are correct
    server.tool('list_sessions', 'List all audit sessions ordered by most recently active. Returns id, title, ai_tool, message_count, created_at, updated_at.', {
        limit: zod_1.z.number().int().positive().optional().describe('Return only the most recent N sessions'),
    }, (0, sessions_1.listSessions)(db));
    server.tool('get_session_history', 'Retrieve the full timestamped audit log for a session, oldest first.', {
        session_id: zod_1.z.string(),
        limit: zod_1.z.number().int().positive().optional().describe('Return only the most recent N messages'),
    }, (0, sessions_1.getSessionHistory)(db));
    server.tool('verify_session', 'Verify the tamper-evident hash chain for a session. Returns valid=true if no rows were edited after logging, or the first broken link if tampering is detected.', {
        session_id: zod_1.z.string().describe('Session ID to verify'),
    }, (0, verify_1.verifySession)(db));
    return server;
}
