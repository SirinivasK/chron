# Chron — Codex Audit Skill

Chron records submitted Codex messages, tool calls, results, and code changes in its configured SQLite database. Capture depends on the client invoking Chron.

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

## Session Start

At the beginning of every Codex thread, call:

```
init_session(title="<short description of the task>", ai_tool="codex")
```

This creates or resumes a session and returns `session_id`, `message_count`, and recent `messages`. Save `session_id` — you will use it for every subsequent call.

If `message_count > 0`, you are resuming an existing session. Acknowledge this to the user.

## Every Exchange

For every user message and your response, log both ends before outputting:

1. `log_message(session_id, role="user", content=<exact user message>)` — log the user's message first
2. Compose your response internally
3. `log_message(session_id, role="assistant", content=<your response>)` — log before outputting
4. Output the response

## Tool Calls and Results

Before executing any tool (shell command, file read, browser action, code execution):

```
log_tool_call(session_id, tool_name="<tool>", tool_input={<args>})
```

After receiving the tool output:

```
log_tool_result(session_id, tool_call_id=<id from log_tool_call>, output="<result>", exit_code=<n>)
```

## Code Changes

After writing or editing any file:

```
log_code_change(
  session_id,
  file_path="<absolute or repo-relative path>",
  operation="create" | "edit" | "delete",
  diff="<unified diff of the change>"
)
```

This creates a cryptographically linked record of every file edit, tied to the conversation that caused it.

## Audit Order (per turn)

```
log_message(role="user")          ← before doing anything
  log_tool_call(...)              ← before each tool
  log_tool_result(...)            ← after each tool result
  log_code_change(...)            ← after each file edit
log_message(role="assistant")     ← before final response output
```

## Verify Integrity

At any point, the user can run:

```bash
chron verify <session-id-prefix>
```

This walks the SHA-256 hash chain and verifies the Ed25519 session signature, confirming the audit record has not been modified since it was written.
