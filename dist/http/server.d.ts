import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Db } from '../db/index';
export declare function startHttpServer(server: McpServer, db: Db): Promise<void>;
