"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHttpServer = startHttpServer;
const express_1 = __importDefault(require("express"));
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const middleware_1 = require("./middleware");
const server_1 = require("../server");
async function startHttpServer(server, db) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json({ limit: '1mb' }));
    const apiKey = process.env.CHRON_API_KEY;
    if (apiKey) {
        app.use((0, middleware_1.apiKeyMiddleware)(apiKey));
    }
    const transports = new Map();
    app.get('/sse', async (req, res) => {
        try {
            const instanceServer = (0, server_1.createServer)(db);
            const transport = new sse_js_1.SSEServerTransport('/messages', res);
            transports.set(transport.sessionId, { transport, server: instanceServer });
            transport.onclose = () => transports.delete(transport.sessionId);
            await instanceServer.connect(transport);
        }
        catch (err) {
            process.stderr.write(`SSE error: ${err}\n`);
            if (!res.headersSent)
                res.status(500).json({ error: 'Internal server error' });
        }
    });
    app.post('/messages', async (req, res) => {
        try {
            const sessionId = req.query.sessionId;
            const entry = transports.get(sessionId);
            if (!entry) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }
            await entry.transport.handlePostMessage(req, res);
        }
        catch (err) {
            process.stderr.write(`Messages error: ${err}\n`);
            if (!res.headersSent)
                res.status(500).json({ error: 'Internal server error' });
        }
    });
    const port = parseInt(process.env.PORT ?? '3001', 10);
    if (isNaN(port))
        throw new Error(`Invalid PORT value: ${process.env.PORT}`);
    await new Promise(resolve => app.listen(port, resolve));
    process.stderr.write(`Chron HTTP server listening on port ${port}\n`);
}
