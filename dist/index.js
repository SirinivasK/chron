#!/usr/bin/env node
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
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const os_1 = require("os");
const path_1 = require("path");
const index_1 = require("./db/index");
const server_1 = require("./server");
const VERSION = '0.1.9';
// --version: quick install check, safe to run anywhere
if (process.argv[2] === '--version' || process.argv[2] === '-v') {
    process.stdout.write(`chron-mcp ${VERSION}\n`);
    process.exit(0);
}
async function main() {
    const dbPath = process.env.CHRON_DB_PATH ?? (0, path_1.join)((0, os_1.homedir)(), '.chron', 'chron.db');
    process.stderr.write(`chron-mcp ${VERSION} starting\n`);
    process.stderr.write(`database: ${dbPath}\n`);
    const db = await (0, index_1.initDb)();
    const server = (0, server_1.createServer)(db);
    if (process.env.CHRON_TRANSPORT === 'http') {
        const { startHttpServer } = await Promise.resolve().then(() => __importStar(require('./http/server')));
        await startHttpServer(server, db);
    }
    else {
        const transport = new stdio_js_1.StdioServerTransport();
        await server.connect(transport);
        process.stderr.write('ready\n');
    }
}
main().catch((err) => {
    process.stderr.write(`Failed to start chron: ${err}\n`);
    process.exit(1);
});
