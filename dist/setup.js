"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSetup = runSetup;
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const child_process_1 = require("child_process");
const CHRON_ENTRY = {
    command: 'npx',
    args: ['-y', 'chron-mcp'],
};
function configPath(...parts) {
    return (0, path_1.join)((0, os_1.homedir)(), ...parts);
}
const TOOLS = [
    {
        name: 'Claude Desktop',
        path: process.platform === 'win32'
            ? (0, path_1.join)(process.env.APPDATA ?? '', 'Claude', 'claude_desktop_config.json')
            : configPath('Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
    },
    {
        name: 'Cursor',
        path: process.platform === 'win32'
            ? (0, path_1.join)(process.env.APPDATA ?? '', 'Cursor', 'User', 'globalStorage', 'cursor.mcp', 'mcp.json')
            : configPath('.cursor', 'mcp.json'),
    },
    {
        name: 'Windsurf',
        path: configPath('.codeium', 'windsurf', 'mcp_config.json'),
    },
    {
        name: 'Claude Code',
        path: configPath('.claude', 'settings.json'),
    },
];
function readJson(filePath) {
    if (!(0, fs_1.existsSync)(filePath))
        return {};
    try {
        return JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
    }
    catch {
        return {};
    }
}
function writeJson(filePath, data) {
    (0, fs_1.mkdirSync)((0, path_1.dirname)(filePath), { recursive: true });
    (0, fs_1.writeFileSync)(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
function configureTool(name, filePath) {
    // Skip if the app isn't installed (config dir doesn't exist and it's not Claude Code)
    const dir = (0, path_1.dirname)(filePath);
    if (!(0, fs_1.existsSync)(dir) && name !== 'Claude Code') {
        return { tool: name, status: 'skipped' };
    }
    try {
        const config = readJson(filePath);
        if (!config.mcpServers)
            config.mcpServers = {};
        if (config.mcpServers.chron) {
            return { tool: name, status: 'already', path: filePath };
        }
        config.mcpServers.chron = CHRON_ENTRY;
        writeJson(filePath, config);
        return { tool: name, status: 'added', path: filePath };
    }
    catch (err) {
        return { tool: name, status: 'error', error: err.message };
    }
}
function configureClaudeCode() {
    // Try `claude mcp add` first — it's the official way
    try {
        (0, child_process_1.execSync)('claude mcp add chron -- npx -y chron-mcp', { stdio: 'pipe' });
        return { tool: 'Claude Code', status: 'added' };
    }
    catch {
        // Fall back to writing settings.json directly
        return configureTool('Claude Code', (0, path_1.join)((0, os_1.homedir)(), '.claude', 'settings.json'));
    }
}
async function runSetup() {
    const results = [];
    for (const tool of TOOLS) {
        const result = tool.name === 'Claude Code'
            ? configureClaudeCode()
            : configureTool(tool.name, tool.path);
        results.push(result);
    }
    return results.filter(r => r.status !== 'skipped');
}
