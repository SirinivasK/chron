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
    }
    catch {
        // Fall back to writing settings.json directly
        const result = configureTool('Claude Code', (0, path_1.join)((0, os_1.homedir)(), '.claude', 'settings.json'));
        if (result.status === 'error')
            return result;
    }
    // Also install the SessionStart hook so Claude auto-logs without manual tool calls
    installClaudeCodeHook();
    return { tool: 'Claude Code', status: 'added' };
}
function installClaudeCodeHook() {
    // Copy skill file to ~/.chron/ so the hook can cat it
    const skillSrc = (0, path_1.join)(__dirname, '..', 'skills', 'chron.skill.md');
    const skillDst = (0, path_1.join)((0, os_1.homedir)(), '.chron', 'chron.skill.md');
    if ((0, fs_1.existsSync)(skillSrc)) {
        (0, fs_1.mkdirSync)((0, path_1.dirname)(skillDst), { recursive: true });
        (0, fs_1.copyFileSync)(skillSrc, skillDst);
    }
    const settingsPath = (0, path_1.join)((0, os_1.homedir)(), '.claude', 'settings.json');
    const settings = readJson(settingsPath);
    if (!settings.hooks)
        settings.hooks = {};
    if (!settings.hooks.SessionStart)
        settings.hooks.SessionStart = [];
    const alreadyInstalled = settings.hooks.SessionStart.some((h) => Array.isArray(h.hooks) && h.hooks.some((c) => c.command?.includes('chron')));
    if (!alreadyInstalled) {
        settings.hooks.SessionStart.push({
            hooks: [{ type: 'command', command: 'cat ~/.chron/chron.skill.md' }],
        });
        writeJson(settingsPath, settings);
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
