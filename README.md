<div align="center">
  <img src="assets/chron-icon-png-transperent.png" alt="Chron" width="96" />
  <h1>Chron</h1>
  <p>Local-first, tamper-evident audit trails for AI conversations, tool calls, code changes, and secrets.</p>
</div>

AI tools show when you sent a message. Chron logs when the AI responded too — and keeps a permanent, queryable, tamper-evident record of the AI work happening across your tools.

Works with Claude Desktop, Claude Code, Cursor, Windsurf, and any MCP-compatible AI tool.

---

## Why

AI tools produce no audit trail by default. You cannot answer:
- What did the AI say, and when exactly?
- How long did the AI take to respond?
- What was the full conversation that produced this output?
- Which tool calls, command results, and code diffs happened during the session?
- Did a secret or credential get pasted into an AI prompt?
- Has this audit record been edited after the fact?
- What did I ask Claude last week about this codebase?

Chron fixes that. Every exchange is logged with a precise local datetime (including timezone offset) to a SQLite file you own. It can hash-chain every event, sign sessions with Ed25519, detect secrets/PII, produce SOC 2 evidence, and stream metadata-only events to your SIEM. No cloud, no vendor lock-in, no message content leaving your machine.

---

## What Chron captures

Chron stores a local audit trail of:

- User and assistant messages
- Tool calls and tool results
- Code changes with file path, operation, and unified diff
- Session start/resume metadata, including parent session and external refs
- Secret/PII detections with masked values
- Hash-chain integrity data
- Optional Ed25519 session signatures
- Optional NTP clock attestation metadata

Chron's SIEM integrations send only metadata: session starts, role-only message events, and masked secret detections. Message content and raw secret values stay local.

---

## Install

**MCP server** (for Claude Desktop, Claude Code, Cursor, Windsurf):

Add to your AI tool's MCP config:

```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp"]
    }
  }
}
```

**CLI** (for `chron history`, `chron connect`, `chron export`, etc.):

```bash
npm install -g chron-mcp
```

> `npx chron-mcp` starts the MCP server only — it does not put the `chron` CLI command in your PATH. You need a global install for the CLI.

First run creates `~/.chron/chron.db` automatically. No database setup, no env vars, no migrations.

Check your setup:

```bash
chron doctor
```

For CI or automation:

```bash
chron doctor --json
```

---

## CLI

After `npm install -g chron-mcp`, the `chron` command is available globally:

```
Usage: chron <command> [options]

Commands:
  history         List sessions or show full log for a session
  report          Aggregate audit stats across sessions
  export          Export a session as markdown
  secrets         List detected secrets across sessions
  settings        View current configuration
  connect         Connect to a SIEM integration (crowdstrike, sentinel, splunk)
  summary         Structured summary of a session (timeline, mutations, secrets)
  sign            Sign a session with its Ed25519 key — produces a .chron.sig file
  verify          Verify a session's hash chain and Ed25519 signature
  prune           Delete sessions older than a retention cutoff
  doctor          Check your Chron setup — Node version, DB, MCP configs, SIEM
  import          Import conversations from external AI tools into Chron

Options (history):
  --limit=<n>     Max sessions to show (default: 20)
  --ref=<value>   Filter by external_ref prefix (e.g. --ref=jira:ENG-123)
  <id-prefix>     Show full log for the session with this ID prefix

Options (report):
  --since=<range>   Filter by date: 7d, 30d, or YYYY-MM-DD (default: all time)
  --format=soc2     Generate SOC 2 HTML evidence package
  --output=<file>   Output file for --format=soc2

Options (export):
  <id-prefix>       Markdown export for a single session
  --signed          Tamper-evident bundle (JSONL + manifest + Ed25519 sig)
  --session=<id>    Filter bundle to a single session
  --since=<range>   Filter bundle by date: 7d, 30d, or YYYY-MM-DD
  --output=<file>   Output path (default: bundle.chron.tar.gz)

Options (verify):
  <id-prefix>       Verify a session's hash chain + Ed25519 signature
  --bundle=<file>   Verify a signed bundle offline (no DB needed)

Options (prune):
  --older-than=<n>d  Cutoff in days (falls back to retention_days in config)
  --dry-run          Show what would be deleted without deleting
  --confirm          Required flag to actually delete

Options (doctor):
  --json             Machine-readable JSON output

Options (import):
  chatgpt <file>     Import from ChatGPT export (.zip or conversations.json)
```

### `chron doctor`

`chron doctor` validates the pieces that make Chron useful in real life:

- Node.js version (v18+ required)
- Local Chron version vs npm latest
- `npx chron-mcp --version`
- DB directory and key directory write access
- Claude Desktop, Claude Code, Cursor, and Windsurf MCP config presence
- Whether Chron is configured in each MCP client
- Optional HTTP mode health check on `/health`
- Splunk, Sentinel, and LogScale configuration via env vars or `~/.chron/config.json`

Warnings for optional integrations do not fail the command. Real failures exit with code `1`.

---

## What it logs

Every exchange is recorded with precise local timestamps — user message when received, assistant response when sent:

```
[user: 2026-05-08 14:32:11 +02:00 | assistant: 2026-05-08 14:32:43 +02:00]

The main risks of deploying this contract are...
```

The gap between user and assistant timestamps is real generation time. Both are stored in your local SQLite DB with full timezone offset.

---

## Config by tool

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add chron -- npx -y chron-mcp
```

Then add the skill hook to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cat ~/.chron/chron.skill.md"
          }
        ]
      }
    ]
  }
}
```

### Cursor

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp"]
    }
  }
}
```

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp"]
    }
  }
}
```

---

## Companion skill file

Chron ships with `skills/chron.skill.md` — a plain-text instruction file that tells the AI how to use the MCP tools automatically. Load it into your AI tool once. After that, the AI:

1. Creates or resumes a named session at the start of every conversation
2. Logs your message before it starts responding (captures the real user timestamp)
3. Logs its response after composing it (captures the real assistant timestamp)
4. Shows `[user: YYYY-MM-DD HH:MM:SS ±HH:MM | assistant: YYYY-MM-DD HH:MM:SS ±HH:MM]` at the top of every response
5. Retrieves prior session history so context is never lost across conversations

---

## MCP Tools

| Tool | Description |
|---|---|
| `init_session` | Initialize or resume a session — returns session_id, message count, and recent messages in one call |
| `start_session` | Create a new named audit session (legacy — prefer `init_session`) |
| `log_message` | Record a single message with the current local datetime |
| `log_tool_call` | Record an AI tool invocation as an audit event |
| `log_tool_result` | Record tool output and link it to a tool call |
| `log_code_change` | Record a file edit with operation and unified diff |
| `log_exchange` | Log a user/assistant pair atomically (for batch imports) |
| `list_sessions` | List all sessions ordered by most recently active |
| `get_session_history` | Retrieve the full timestamped log for a session |
| `verify_session` | Verify the tamper-evident hash chain — detects any post-log edits |
| `scan_prompt` | Scan text for secrets (API keys, credentials) before logging — returns masked detections |
| `rehydrate_response` | Restore redacted placeholders in an assistant response back to their original values |
| `delete_session` | Delete a session and cascade its messages/secrets |
| `summarize_session` | Return a timeline summary with latency, mutations, secrets, and prod references |

---

## Integrity and signing

Every new audit event is linked to the previous one via a SHA-256 chain:

```
content_hash = SHA256(session_id | role | content | created_at | prev_hash | event_type)
```

`verify_session` walks the chain and returns:
- `valid: true` — no messages were modified after logging
- `valid: false, first_break: <id>` — exact row ID of the first tampered message

This turns your local log into a verifiable audit artifact. Any edit to a stored message — content, timestamp, or role — breaks the chain and is detected immediately.

Chron also generates an Ed25519 keypair per new session when possible. The private key stays under `~/.chron/keys`. Use:

```bash
chron sign <session-id-prefix>
chron verify <session-id-prefix>
```

For portable evidence:

```bash
chron export --signed --session=<session-id-prefix> --output=evidence.chron.tar.gz
chron verify --bundle=evidence.chron.tar.gz
```

`chron verify` also reports NTP clock attestation metadata for sessions created with clock-check support.

---

## Secrets and PII detection

Chron can detect and mask:

- API keys: OpenAI, Anthropic, AWS, Google, GitHub, Slack, Stripe, SendGrid, HuggingFace
- Private keys, JWTs, URL credentials, password assignments, env-style secrets
- Credit cards, IBANs, SSNs, DOBs, passports
- Email addresses, US/E.164 phone numbers, internal RFC-1918 IPs

Use:

```bash
chron secrets
chron secrets <session-id-prefix>
```

MCP tools can also call `scan_prompt` before sending content to an AI tool. Redaction uses `$CHRON_*` placeholders and `rehydrate_response` can restore values from the returned token map.

---

## Reports and evidence

```bash
chron history
chron summary <session-id-prefix>
chron report --since=30d
chron report --format=soc2 --output=soc2-report.html
chron export <session-id-prefix>
chron export --signed --since=30d --output=bundle.chron.tar.gz
chron prune --older-than=90d --dry-run
```

The SOC 2 report and signed bundles are designed for audit review, legal hold, and incident reconstruction without sending conversation content to Chron infrastructure.

---

## CrowdStrike LogScale integration

Stream AI session telemetry directly from developer machines into your CrowdStrike LogScale repository. No relay service — events go straight to your own LogScale instance.

**What gets sent:** session starts, message counts (role only), and masked credential detections. Message content never leaves the machine.

### Setup

**1. Create a LogScale repository and ingest token**

In Falcon console → **Log Management** → **Repositories** → **New repository** (name it `ChronAIEvents`).  
Then **Settings** → **API Tokens** → **Add token** → select **Ingest** permission → copy the token.

Your ingest URL follows this pattern:
```
https://<your-cluster>.humio.com/api/v1/ingest/humio-structured
```

**2. Install the CLI and run the onboarding wizard**

```bash
npm install -g chron-mcp
chron connect crowdstrike
# Paste your ingest URL and token when prompted
# The wizard sends a test event and confirms before saving
```

**3. Add env vars to your MCP client config**

The wizard prints the exact block to paste. For Claude Code, add to the `chron` entry in `~/.claude.json`:

```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp"],
      "env": {
        "CHRON_LOGSCALE_URL": "https://<your-cluster>.humio.com/api/v1/ingest/humio-structured",
        "CHRON_LOGSCALE_TOKEN": "<your-ingest-token>"
      }
    }
  }
}
```

Restart your AI tool to pick up the new env vars.

**4. Import the pre-built dashboard**

In Falcon → **Log Management** → **Dashboards** → **Import**:
```
node_modules/chron-mcp/dashboards/logscale/chron-ai-activity.yaml
```

Full guide with SOC alert setup: [dashboards/logscale/README.md](dashboards/logscale/README.md)

### Env vars

| Env var | Description |
|---|---|
| `CHRON_LOGSCALE_URL` | LogScale ingest endpoint |
| `CHRON_LOGSCALE_TOKEN` | LogScale ingest token |

Both must be set for events to flow. If unset, the integration is silently disabled.

---

## Splunk integration

Stream AI session telemetry into Splunk via HTTP Event Collector (HEC). Works with Splunk Enterprise, Splunk Cloud, and a local Docker instance.

**What gets sent:** session starts, message counts (role only), and masked credential detections. Message content never leaves the machine.

### Setup

**Option A — Local Docker (fastest, no account needed)**

```bash
# Start a local Splunk instance (Apple Silicon: --platform linux/amd64 is required)
docker run -d --name splunk-chron \
  --platform linux/amd64 \
  -p 8000:8000 -p 8088:8088 \
  -e SPLUNK_START_ARGS=--accept-license \
  -e SPLUNK_GENERAL_TERMS=--accept-sgt-current-at-splunk-com \
  -e SPLUNK_PASSWORD=Admin1234! \
  -e SPLUNK_HEC_TOKEN=chron-test-token \
  splunk/splunk:latest

# Wait ~2 minutes, then watch until ready:
docker logs -f splunk-chron 2>&1 | grep -i "Ansible playbook complete"
```

**Option B — Splunk Enterprise or Cloud**

Settings → **Data Inputs** → **HTTP Event Collector** → **New Token** → name it `chron-ingest` → source type `chron:event` → copy the token.

**2. Install the CLI and run the onboarding wizard**

```bash
npm install -g chron-mcp
chron connect splunk
# For local Docker: URL = https://localhost:8088, Token = chron-test-token
# TLS verification is skipped automatically for localhost (self-signed cert)
```

**3. Add env vars to your MCP client config**

The wizard prints the exact block to paste. For Claude Code, add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp"],
      "env": {
        "CHRON_SPLUNK_URL": "https://localhost:8088",
        "CHRON_SPLUNK_TOKEN": "chron-test-token",
        "CHRON_SPLUNK_INSECURE": "1"
      }
    }
  }
}
```

> Remove `CHRON_SPLUNK_INSECURE` for production Splunk instances with valid TLS certificates.

Restart your AI tool to pick up the new env vars.

**4. Search in Splunk**

Open [http://localhost:8000](http://localhost:8000) → **Search & Reporting** → run:
```
sourcetype="chron:event"
```

Events appear in real time as you have AI conversations.

Full guide with dashboard templates and alert setup: [dashboards/splunk/README.md](dashboards/splunk/README.md)

### Env vars

| Env var | Description |
|---|---|
| `CHRON_SPLUNK_URL` | Splunk HEC base URL, e.g. `https://localhost:8088` or `https://your-host:8088` |
| `CHRON_SPLUNK_TOKEN` | HEC ingest token |
| `CHRON_SPLUNK_INSECURE` | Set to `1` to skip TLS verification (local Docker with self-signed cert) |

`CHRON_SPLUNK_URL` and `CHRON_SPLUNK_TOKEN` must both be set for events to flow.

---

## Microsoft Sentinel integration

Stream AI session telemetry into your Microsoft Sentinel workspace via the Azure Monitor Logs Ingestion API. Events go directly from developer machines to your own Log Analytics workspace — no relay service.

**What gets sent:** session starts, message counts (role only), and masked credential detections. Message content never leaves the machine.

### Setup

**1. Register an Azure App**

Azure Portal → **Azure Active Directory** → **App registrations** → **New registration** → name it `chron-ingest`.  
Note the **Application (client) ID** and **Directory (tenant) ID**.  
Go to **Certificates & secrets** → **New client secret** → copy the value immediately.

**2. Create a custom table in Log Analytics**

Open your Log Analytics workspace → **Tables** → **Create** → **New custom log (DCR-based)** → name it `ChronEvents_CL`.

Add these columns (in addition to the auto-added `TimeGenerated`):

| Column | Type |
|---|---|
| `EventType` | string |
| `SessionIdPrefix` | string |
| `AiTool` | string |
| `OS` | string |
| `ChronVersion` | string |
| `Computer` | string |
| `Role` | string |
| `DetectionType` | string |
| `MaskedValue` | string |

The wizard creates a **Data Collection Endpoint (DCE)** and **Data Collection Rule (DCR)** — note both.

**3. Grant the App ingest permission**

Open the DCR → **Access control (IAM)** → **Add role assignment** → Role: **Monitoring Metrics Publisher** → Member: the `chron-ingest` app.

**4. Get the DCR Immutable ID**

Open the DCR → **Overview** → **JSON view** → copy the `immutableId` field (starts with `dcr-`).

**5. Install the CLI and run the onboarding wizard**

```bash
npm install -g chron-mcp
chron connect sentinel
# Enter tenant ID, client ID, client secret, DCE URL, DCR immutable ID, and stream name
# The wizard authenticates with Azure AD and sends a test event before saving
```

**6. Add env vars to your MCP client config**

The wizard prints the exact block to paste. For Claude Code, add to `~/.claude.json`:

```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp"],
      "env": {
        "CHRON_SENTINEL_TENANT_ID": "<your-tenant-id>",
        "CHRON_SENTINEL_CLIENT_ID": "<your-client-id>",
        "CHRON_SENTINEL_CLIENT_SECRET": "<your-client-secret>",
        "CHRON_SENTINEL_DCE": "https://<your-dce>.ingest.monitor.azure.com",
        "CHRON_SENTINEL_DCR_ID": "dcr-<your-immutable-id>",
        "CHRON_SENTINEL_STREAM": "Custom-ChronEvents_CL"
      }
    }
  }
}
```

Restart your AI tool to pick up the new env vars.

**7. Query in Sentinel**

Sentinel → **Logs** → paste any query from `dashboards/sentinel/`:
```kql
ChronEvents_CL
| where TimeGenerated > ago(24h)
| summarize count() by EventType, AiTool
```

Full guide with KQL queries and alert rule setup: [dashboards/sentinel/README.md](dashboards/sentinel/README.md)

### Env vars

| Env var | Description |
|---|---|
| `CHRON_SENTINEL_TENANT_ID` | Azure AD tenant ID |
| `CHRON_SENTINEL_CLIENT_ID` | App Registration client ID |
| `CHRON_SENTINEL_CLIENT_SECRET` | App Registration client secret |
| `CHRON_SENTINEL_DCE` | Data Collection Endpoint URL |
| `CHRON_SENTINEL_DCR_ID` | DCR Immutable ID (starts with `dcr-`) |
| `CHRON_SENTINEL_STREAM` | Stream name, e.g. `Custom-ChronEvents_CL` |

All six must be set for events to flow. Token refresh is automatic (1-hour Azure AD tokens, refreshed 60s before expiry).

---

## Configuration

| Env var | Default | Description |
|---|---|---|
| `CHRON_DB_PATH` | `~/.chron/chron.db` | Path to SQLite database file |
| `CHRON_TRANSPORT` | `stdio` | Set to `http` to enable HTTP+SSE mode |
| `CHRON_API_KEY` | _(none)_ | Bearer token for HTTP mode |
| `PORT` | `3001` | Port for HTTP mode |
| `CHRON_LOGSCALE_URL` | _(none)_ | LogScale ingest endpoint (enables CrowdStrike integration) |
| `CHRON_LOGSCALE_TOKEN` | _(none)_ | LogScale ingest token |
| `CHRON_SENTINEL_TENANT_ID` | _(none)_ | Azure AD tenant ID (enables Sentinel integration) |
| `CHRON_SENTINEL_CLIENT_ID` | _(none)_ | App Registration client ID |
| `CHRON_SENTINEL_CLIENT_SECRET` | _(none)_ | App Registration client secret |
| `CHRON_SENTINEL_DCE` | _(none)_ | Data Collection Endpoint URL |
| `CHRON_SENTINEL_DCR_ID` | _(none)_ | DCR Immutable ID |
| `CHRON_SENTINEL_STREAM` | _(none)_ | Stream name (e.g. `Custom-ChronEvents_CL`) |
| `CHRON_SPLUNK_URL` | _(none)_ | Splunk HEC base URL (enables Splunk integration) |
| `CHRON_SPLUNK_TOKEN` | _(none)_ | Splunk HEC ingest token |
| `CHRON_SPLUNK_INSECURE` | _(none)_ | Set to `1` to skip TLS verification for local Splunk/self-signed certs |
| `CHRON_RELAY_URL` | _(none)_ | Generic relay endpoint (any SIEM or webhook) |
| `CHRON_RELAY_TOKEN` | _(none)_ | Bearer token for generic relay |

---

## HTTP+SSE mode (team / self-hosted)

For teams or remote use, run Chron as an HTTP server:

```bash
CHRON_TRANSPORT=http CHRON_API_KEY=your-key PORT=3001 npx chron-mcp
```

Point your MCP config at the URL:

```json
{
  "mcpServers": {
    "chron": {
      "url": "https://your-server/sse",
      "headers": {
        "Authorization": "Bearer your-key"
      }
    }
  }
}
```

---

## ChatGPT import

Bring your existing ChatGPT history into Chron's tamper-evident audit trail.

```bash
# From a ChatGPT data export ZIP
chron import chatgpt ~/Downloads/chatgpt-export.zip

# Or from an extracted conversations.json
chron import chatgpt ~/Downloads/conversations.json
```

**How to get your ChatGPT export:**
ChatGPT → Settings → Data Controls → Export data → wait for email → download the ZIP.

**What gets imported:**
- One Chron session per conversation, with `ai_tool=chatgpt`
- Original message timestamps from the export
- `external_ref=chatgpt:<conversation_id>` on every session (visible in `chron history`)
- Full SHA-256 hash chain across all imported messages
- Secret detection runs on all user messages

**Re-running is safe** — already-imported conversations are skipped by `external_ref` match.

After import, sessions appear in `chron history` and `chron verify` works on them the same as any natively-logged session.

---

## Your data

Your audit log lives at `~/.chron/chron.db` — a single SQLite file on your machine. Query it directly with any SQLite tool:

```bash
sqlite3 ~/.chron/chron.db \
  "SELECT s.title, m.role, m.content, m.created_at
   FROM messages m JOIN sessions s ON s.id = m.session_id
   ORDER BY m.created_at"
```

No cloud, no telemetry, no data leaving your machine. Change the location with `CHRON_DB_PATH`.

---

## License

Copyright (c) 2026 Nivaya. All rights reserved.

Source code is public for transparency only. Cloning, forking, modification, and redistribution are not permitted without explicit written permission. See [LICENSE](LICENSE) for full terms.
