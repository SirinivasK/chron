---
name: chron
description: Use Chron to log every AI conversation with precise timestamps to a local SQLite database. Invoke at session start and on every exchange.
---

# Chron — AI Audit Log Skill

Chron records messages submitted through its configured logging paths with local timestamps and timezone offsets. A connected client or loaded skill alone does not establish complete capture.

## Storage, privacy, and evidence

Chron stores the content submitted to its configured database. Messages can contain
sensitive values; treat that database, backups, and exports as sensitive records.
Configuration determines storage paths and any enabled forwarding or exports.
Local storage alone does not establish confidentiality or zero data egress.

Do not suppress relevant privacy or security warnings. Logging authorization does
not grant permission to change configuration or send data to a new destination.

When logging is authorized, preserve the exact submitted content. Do not silently
redact, mask, omit, or paraphrase content and present it as an exact record. If
recording cannot be completed as requested, report that limitation. This skill
neither performs redaction nor establishes redaction provenance.

For text storage, Chron replaces NUL and invalid Unicode surrogate characters with
the replacement character (U+FFFD). Account for this existing normalization when
comparing content; do not claim byte-for-byte original data for those inputs.
This policy does not change that storage behavior.

Upgrading the package does not replace independently copied skill files or custom
hooks. Review the package README's “Upgrading existing skills and hooks” guidance.

## Prerequisites

Chron requires the MCP server to be running. If not yet configured:

```bash
# Claude Code
claude mcp add chron -- npx -y chron-mcp@0.1.68
```

For other tools, add to your MCP config:
```json
{
  "mcpServers": {
    "chron": {
      "command": "npx",
      "args": ["-y", "chron-mcp@0.1.68"]
    }
  }
}
```

## Session Start

Call `start_session` with a descriptive title (e.g. "Contract review — 2026-05-08") and set `ai_tool` to your tool name (e.g. "claude", "cursor", "windsurf").

Call `get_session_history` for the returned `session_id`. If prior messages exist, display:
> "Resuming session: [N messages] since [first_message_date]"

## Every Exchange

The rule is simple: **any time you output text and wait for input, log it.** This includes mid-task check-ins, not just clean user→assistant→user flows.

1. Call `log_message(session_id, role="user", content=<exact user message>)` → returns T1
2. Compose your response body (plain text only — no timestamp header). **Do NOT output any text yet.**
3. Call `log_message(session_id, role="assistant", content=<response body>)` → returns T2
   - `content` must be the **exact text you are about to output** — the literal response body, word for word. Not a summary, not a paraphrase, not a description of what you said. The actual text. If you summarize, the DB becomes a paraphrase archive, not an audit trail.
4. Output header + body:

```
[user: YYYY-MM-DD HH:MM:SS ±HH:MM | assistant: YYYY-MM-DD HH:MM:SS ±HH:MM]

<response body>
```

T1 and T2 are real server timestamps — T2 − T1 is the actual generation time. The DB stores clean body content without the header.

**Mid-task check-ins follow the same rule.** If you pause mid-task and ask the user something ("I've done the analysis, what's next?" / "Which approach do you prefer?"), that pause is an exchange — log the assistant message before outputting it, log the user's reply when it arrives. Every turn that crosses the user boundary gets timestamped, regardless of whether the task is "complete."

**Permission grants** — if Claude pauses for a permission prompt and the user allows/denies, log a user message on resume: `"[permission: <tool> <action> — allowed/denied]"`. This is the only visible record of the interaction since permission clicks are not typed messages.

**Do not use `log_exchange` for live conversations** — it captures both timestamps at the same instant and cannot show a real gap. Use it only for batch imports of historical messages.

## If Chron MCP is unavailable

State once: "Chron is not connected — this conversation will not be logged."
Continue normally. Do not retry repeatedly.
