#!/usr/bin/env node
"use strict";

// src/cli/hook.ts
var import_path6 = require("path");
var import_os = require("os");

// src/utils/config-path.ts
var import_path = require("path");
function guardedJournalPath(path) {
  return guardTestRoot("a capture journal", path, "CHRON_JOURNAL_PATH");
}
function guardTestRoot(what, path, envVar) {
  const root = process.env.CHRON_TEST_ROOT;
  if (!root) return path;
  if (isContainedBy((0, import_path.resolve)(path), (0, import_path.resolve)(root))) return path;
  throw new Error(
    `Refusing to use ${what} at ${(0, import_path.resolve)(path)} during a test run.
  Paths must stay inside ${root}. Set ${envVar} to a path within it
  before anything can read it \u2014 and set it before clearing other variables,
  because an unset ${envVar} falls back to the real home directory.
  If this is a shell script, check the variables are exported in the current
  shell: assignments inside $(...) apply only to the subshell.`
  );
}
function isContainedBy(candidate, root) {
  const rel = (0, import_path.relative)(root, candidate);
  if (rel === "") return true;
  if ((0, import_path.isAbsolute)(rel)) return false;
  return rel !== ".." && !rel.startsWith(`..${import_path.sep}`);
}

// src/native/launch-notices.ts
var import_fs = require("fs");
var import_path2 = require("path");
var import_crypto = require("crypto");
var LAUNCH_DIR = "CHRON_CODEX_LAUNCH_DIR";
var LAUNCH_TOKEN = "CHRON_CODEX_LAUNCH_TOKEN";
var NOTICE_SCHEMA = "chron.codex-launch-notice/v1";
function beginLaunchNotice(env = process.env) {
  const dir = env[LAUNCH_DIR], token = env[LAUNCH_TOKEN];
  if (!dir || !token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const id = (0, import_crypto.randomUUID)();
  const publish = (state) => {
    let tmp;
    try {
      guardTestRoot("a Codex launch notification", dir, LAUNCH_DIR);
      const stat = (0, import_fs.lstatSync)(dir);
      if (!stat.isDirectory() || stat.isSymbolicLink()) return;
      const manifest = JSON.parse((0, import_fs.readFileSync)((0, import_path2.join)(dir, "launch.json"), "utf8"));
      if (manifest.token !== token) return;
      tmp = (0, import_path2.join)(dir, `${id}.${(0, import_crypto.randomUUID)()}.tmp`);
      (0, import_fs.writeFileSync)(tmp, JSON.stringify({ schema: NOTICE_SCHEMA, token, id, state }), { flag: "wx", mode: 384 });
      (0, import_fs.renameSync)(tmp, (0, import_path2.join)(dir, `${id}.json`));
    } catch {
    } finally {
      if (tmp) try {
        (0, import_fs.unlinkSync)(tmp);
      } catch {
      }
    }
  };
  publish("started");
  return { finish: (state) => publish(state) };
}

// src/native/record.ts
var import_fs5 = require("fs");
var import_crypto3 = require("crypto");
var import_path5 = require("path");

// src/journal/writer.ts
var import_fs4 = require("fs");
var import_path4 = require("path");

// src/utils/time.ts
function localISOString() {
  const d = /* @__PURE__ */ new Date();
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const absMin = Math.abs(offsetMin);
  const hh = String(Math.floor(absMin / 60)).padStart(2, "0");
  const mm = String(absMin % 60).padStart(2, "0");
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}${sign}${hh}:${mm}`;
}

// src/journal/format.ts
var import_crypto2 = require("crypto");

// src/utils/content.ts
var UNREPRESENTABLE = /\u0000|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
function canonicalContent(content) {
  return content.replace(UNREPRESENTABLE, "\uFFFD");
}

// src/journal/format.ts
var JOURNAL_FORMAT_VERSION = 1;
var CONTINUATION_KIND = "journal.continued";
function canonicalJson(value) {
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(canonicalContent(value));
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`journal: non-finite number ${String(value)}`);
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    const parts = keys.filter((k) => value[k] !== void 0).map((k) => `${JSON.stringify(canonicalContent(k))}:${canonicalJson(value[k])}`);
    return `{${parts.join(",")}}`;
  }
  throw new Error(`journal: value of type ${typeof value} cannot be recorded`);
}
function journalRecordHash(r) {
  const input = [
    String(r.v),
    String(r.seq),
    canonicalContent(r.at),
    canonicalContent(r.kind),
    canonicalJson(r.data),
    r.prev ?? ""
  ].join("|");
  return (0, import_crypto2.createHash)("sha256").update(input, "utf8").digest("hex");
}
function serializeRecord(r) {
  return `{"v":${r.v},"seq":${r.seq},"at":${JSON.stringify(canonicalContent(r.at))},"kind":${JSON.stringify(canonicalContent(r.kind))},"data":${canonicalJson(r.data)},"prev":${r.prev === null ? "null" : JSON.stringify(r.prev)},"hash":${JSON.stringify(r.hash)}}
`;
}
function makeRecord(seq, at, kind, data, prev) {
  const base = { v: JOURNAL_FORMAT_VERSION, seq, at, kind, data, prev };
  return { ...base, hash: journalRecordHash(base) };
}
function isRecordShaped(x) {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const r = x;
  return typeof r.v === "number" && typeof r.seq === "number" && typeof r.at === "string" && typeof r.kind === "string" && typeof r.data === "object" && r.data !== null && !Array.isArray(r.data) && (r.prev === null || typeof r.prev === "string") && typeof r.hash === "string";
}

// src/journal/verify.ts
var import_fs2 = require("fs");
function verifyJournalBytes(bytes, expectedFirstPrev = null) {
  const text = bytes.toString("utf8");
  if (text.length === 0) {
    return {
      status: "empty",
      records: [],
      validPrefixBytes: 0,
      discardableBytes: 0,
      coverage: expectedFirstPrev === null ? "whole_chain" : "segment"
    };
  }
  const records = [];
  let validPrefixBytes = 0;
  let prev = expectedFirstPrev;
  let expectedSeq = null;
  let line = 0;
  let continuesFrom;
  const coverageSoFar = () => continuesFrom !== void 0 || expectedFirstPrev !== null ? "segment" : "whole_chain";
  let firstRecordPending = true;
  let cursor = 0;
  while (cursor < text.length) {
    const nl = text.indexOf("\n", cursor);
    if (nl === -1) break;
    line++;
    const raw = text.slice(cursor, nl);
    const lineBytes = Buffer.byteLength(text.slice(cursor, nl + 1), "utf8");
    const fail = (reason, seq) => ({
      status: "corrupt",
      continuesFrom,
      coverage: coverageSoFar(),
      records,
      validPrefixBytes,
      discardableBytes: bytes.length - validPrefixBytes,
      problem: { line, seq, reason }
    });
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return fail("line is terminated but not valid JSON");
    }
    if (!isRecordShaped(parsed)) return fail("line is JSON but not a journal record");
    const rec = parsed;
    if (journalRecordHash(rec) !== rec.hash) {
      return fail("record does not match its own hash", rec.seq);
    }
    if (rec.prev !== prev) {
      const opensAsContinuation = firstRecordPending && expectedFirstPrev === null && rec.kind === CONTINUATION_KIND && typeof rec.prev === "string";
      if (opensAsContinuation) {
        continuesFrom = rec.prev;
      } else {
        return fail(
          prev === null ? "first record should not link to a predecessor" : "prev_hash does not match the preceding record",
          rec.seq
        );
      }
    }
    if (expectedSeq !== null && rec.seq !== expectedSeq) {
      return fail(`sequence jumped from ${expectedSeq - 1} to ${rec.seq}`, rec.seq);
    }
    records.push(rec);
    firstRecordPending = false;
    validPrefixBytes += lineBytes;
    prev = rec.hash;
    expectedSeq = rec.seq + 1;
    cursor = nl + 1;
  }
  const tail = text.slice(cursor);
  if (tail.length === 0) {
    return {
      status: "ok",
      continuesFrom,
      coverage: coverageSoFar(),
      records,
      validPrefixBytes,
      discardableBytes: 0
    };
  }
  return {
    status: "unterminated_tail",
    continuesFrom,
    coverage: coverageSoFar(),
    records,
    validPrefixBytes,
    discardableBytes: bytes.length - validPrefixBytes,
    problem: {
      line: line + 1,
      reason: "final line is not newline-terminated: consistent with an interrupted write, and equally with deliberate truncation"
    }
  };
}
function verifyJournalFile(path, expectedFirstPrev = null) {
  if (!(0, import_fs2.existsSync)(path)) {
    return {
      status: "empty",
      records: [],
      validPrefixBytes: 0,
      discardableBytes: 0,
      coverage: expectedFirstPrev === null ? "whole_chain" : "segment"
    };
  }
  return verifyJournalBytes((0, import_fs2.readFileSync)(path), expectedFirstPrev);
}
function lastHashOf(verdict) {
  return verdict.records.length ? verdict.records[verdict.records.length - 1].hash : null;
}

// src/journal/runs.ts
var import_fs3 = require("fs");
var import_path3 = require("path");

// src/journal/scope.ts
var CAPTURE_SCOPE_VERSION = 3;
function captureScope(durability) {
  const durableNames = durability === "durable";
  return {
    scope_version: CAPTURE_SCOPE_VERSION,
    durability,
    covered: [
      "bytes written by the operator to this process stdin, recorded before being forwarded to the child",
      "bytes written by the child to stdout, recorded and made durable before being released to the terminal",
      "bytes written by the child to stderr, on the same terms as stdout, because stderr can carry interaction content",
      "the child command line, its exit status, and the time each of those was recorded"
    ],
    not_covered: [
      "files the child reads or writes",
      "subprocesses the child spawns, and anything those do",
      "network requests the child makes, including the model API call itself",
      "any terminal the child opens directly rather than through the inherited pipes",
      "side effects already committed before the wrapper observed the output describing them"
    ],
    establishes: [
      durableNames ? "no byte was released to the terminal before the journal write covering it was flushed and fsynced" : "no byte was released to the terminal before the journal write covering it was flushed and fsynced \u2014 but see durability below: the file holding those records does not have a durable name",
      "the order of releases within a single stream matches the order in which they were recorded",
      "a journal write failure stopped forwarding in both directions and terminated the child"
    ],
    does_not_establish: [
      "that the child performed no work that went unrecorded",
      "that a person read what was released",
      "that the interleaving of stdout and stderr matches what an unwrapped run would have produced",
      "that the wrapper was used at all for any other invocation \u2014 that needs a control outside Chron (enforced:policy)",
      ...durableNames ? [] : [
        "that a released record still exists after a system crash. Its contents were fsynced; its file name was not, because this platform cannot sync a directory entry and an operator accepted that trade-off. The record can survive without a name to reach it by.",
        "the durability guarantee a fully durable run makes. A run recorded under this capability must not be classified as `enforced:wrapper` on the same terms."
      ]
    ],
    // Version 2 of this list said there was no database projection and that no
    // session could be marked `enforced:wrapper`. Both were true when written
    // and both became false when v0.1.62 shipped projection and the
    // enforcement verifier — and this text is written into the journal as the
    // run's first record, so every wrapped run since has carried limitations
    // its own build had already lifted, contradicting what `chron verify`
    // reported for that same run.
    //
    // Records already written are left exactly as they are. A journal states
    // what was claimed when it was written, and editing that to be more
    // flattering would destroy the one property the journal exists for. The
    // version is bumped instead, so a reader can tell which vocabulary a
    // record carries, and version 2 stays readable.
    known_limitations: [
      "`chron run` attempts projection itself when the run completes, so a successful run normally appears in `chron history` and `chron verify <session-id>` without a further command. Before that attempt, and if it fails, the run exists in the journal alone \u2014 inspect it with `chron verify --journal`.",
      "projection is a separate step that can fail independently of capture, and a failure there changes nothing about what was captured. `chron project` is the retry: it replays the journal and is idempotent, so running it again after a failure or at any later time is safe.",
      "`enforced:wrapper` is reported for a projected run only when `chron verify <session-id>` has followed its binding to the journal records and compared them field by field. The claim is checked on read, never taken from the session row.",
      "nothing here establishes that the wrapper was used for any other invocation. Running the client directly bypasses it, and preventing that needs a control outside Chron (`enforced:policy`).",
      "one client shape is supported: a child that speaks through inherited stdio pipes."
    ]
  };
}
var CAPTURE_SCOPE = captureScope("durable");

// src/journal/runs.ts
function journalSegmentPaths(activePath, options = {}) {
  const dir = (0, import_path3.dirname)(activePath);
  const name = (0, import_path3.basename)(activePath);
  let entries;
  try {
    entries = (0, import_fs3.readdirSync)(dir);
  } catch (e) {
    if (options.strict) throw e;
    return [activePath];
  }
  const rotated = [];
  for (const e of entries) {
    if (!e.startsWith(`${name}.`)) continue;
    if (e.endsWith(".lock")) continue;
    if (e.slice(name.length + 1).startsWith("unterminated-")) continue;
    const m = /\.(\d+)$/.exec(e);
    if (!m) continue;
    rotated.push({ path: (0, import_path3.join)(dir, e), seq: Number(m[1]) });
  }
  rotated.sort((a, b) => a.seq - b.seq);
  return [...rotated.map((r) => r.path), activePath];
}

// src/journal/writer.ts
var DIRECTORY_SYNC_SUPPORTED = process.platform !== "win32";
var ACCEPT_UNSYNCED_DIRECTORIES_ENV = "CHRON_ACCEPT_UNSYNCED_DIRECTORIES";
var ROTATE_BYTES_ENV = "CHRON_JOURNAL_ROTATE_BYTES";
function configuredRotateBytes() {
  const raw = process.env[ROTATE_BYTES_ENV];
  if (raw === void 0) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}
function fsyncDirDefault(dir) {
  if (!DIRECTORY_SYNC_SUPPORTED) return false;
  const fd = (0, import_fs4.openSync)(dir, "r");
  try {
    (0, import_fs4.fsyncSync)(fd);
  } finally {
    (0, import_fs4.closeSync)(fd);
  }
  return true;
}
var defaultFsOps = {
  openSync: import_fs4.openSync,
  writeSync: (fd, data) => (0, import_fs4.writeSync)(fd, data),
  fsyncSync: import_fs4.fsyncSync,
  closeSync: import_fs4.closeSync,
  fsyncDirSync: fsyncDirDefault,
  renameSync: import_fs4.renameSync
};
function requireDirectorySyncCapability(opts) {
  if (DIRECTORY_SYNC_SUPPORTED) return;
  if (opts.acceptUnsyncedDirectories) return;
  if (process.env[ACCEPT_UNSYNCED_DIRECTORIES_ENV] === "1") return;
  throw new JournalBrokenError(
    `this platform (${process.platform}) cannot sync directory entries, so a file holding acknowledged records can lose its name in a crash. The durability guarantee is not available. Set ${ACCEPT_UNSYNCED_DIRECTORIES_ENV}=1 to proceed without it, knowingly.`
  );
}
function acquireJournalLock(lockPath, now) {
  const mine = JSON.stringify({ pid: process.pid, at: now() });
  const lock = {
    path: lockPath,
    release: () => {
      try {
        (0, import_fs4.unlinkSync)(lockPath);
      } catch {
      }
    }
  };
  try {
    (0, import_fs4.writeFileSync)(lockPath, mine, { flag: "wx" });
    return lock;
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
  }
  let holder = {};
  try {
    holder = JSON.parse((0, import_fs4.readFileSync)(lockPath, "utf8"));
  } catch {
    throw new JournalBrokenError(`journal lock ${lockPath} is unreadable; not stealing it`);
  }
  if (typeof holder.pid !== "number") {
    throw new JournalBrokenError(`journal lock ${lockPath} names no pid; not stealing it`);
  }
  if (holder.pid === process.pid) {
    throw new JournalBrokenError("journal is already open in this process");
  }
  try {
    process.kill(holder.pid, 0);
    throw new JournalBrokenError(`journal is locked by live process ${holder.pid}`);
  } catch (e) {
    if (e instanceof JournalBrokenError) throw e;
    if (e.code === "EPERM") {
      throw new JournalBrokenError(`journal is locked by process ${holder.pid}`);
    }
  }
  (0, import_fs4.unlinkSync)(lockPath);
  (0, import_fs4.writeFileSync)(lockPath, mine, { flag: "wx" });
  return lock;
}
var JournalBrokenError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "JournalBrokenError";
  }
};
var DEFAULT_FLUSH_BYTES = 64 * 1024;
var DEFAULT_ROTATE_BYTES = 32 * 1024 * 1024;
var DEFAULT_MIN_FREE_BYTES = 16 * 1024 * 1024;
function freeBytesFor(path) {
  const fs = require("fs");
  if (typeof fs.statfsSync !== "function") return null;
  try {
    const s = fs.statfsSync((0, import_path4.dirname)(path));
    return s.bsize * s.bavail;
  } catch {
    return null;
  }
}
var JournalWriter = class _JournalWriter {
  constructor(path, opts) {
    this.path = path;
    this.ops = { ...defaultFsOps, ...opts.fs };
    this.flushBytes = opts.flushBytes ?? DEFAULT_FLUSH_BYTES;
    if (opts.rotateBytesCeiling !== void 0 && (!Number.isSafeInteger(opts.rotateBytesCeiling) || opts.rotateBytesCeiling <= 0)) {
      throw new RangeError("journal rotation ceiling must be a positive safe integer");
    }
    this.rotateBytes = Math.min(
      opts.rotateBytes ?? configuredRotateBytes() ?? DEFAULT_ROTATE_BYTES,
      opts.rotateBytesCeiling ?? Infinity
    );
    this.minFreeBytes = opts.minFreeBytes ?? DEFAULT_MIN_FREE_BYTES;
    this.now = opts.now ?? localISOString;
    this.acceptUnsynced = opts.acceptUnsyncedDirectories === true || process.env[ACCEPT_UNSYNCED_DIRECTORIES_ENV] === "1";
    this.lockPath = `${path}.lock`;
  }
  fd = null;
  buffer = "";
  bufferedRecords = [];
  seq = 0;
  prev = null;
  bytesOnDisk = 0;
  broken = null;
  lockPath;
  lock = null;
  ops;
  flushBytes;
  rotateBytes;
  minFreeBytes;
  now;
  acceptUnsynced;
  /**
   * The durability this journal committed to on open. `null` until then, so the
   * open-time sync itself is not measured against a capability it is setting.
   */
  established = null;
  /**
   * Open a journal for appending.
   *
   * Refuses to open a file with interior corruption. A writer that appends past
   * a broken link would produce a journal whose valid suffix looks intact, which
   * is how a damaged record becomes invisible.
   *
   * A torn tail is also refused here rather than silently fixed, because
   * truncating is a decision that gets recorded. `recoverTornTail` does it.
   */
  static open(path, opts = {}, heldLock) {
    const w = new _JournalWriter(path, opts);
    (0, import_fs4.mkdirSync)((0, import_path4.dirname)(path), { recursive: true });
    requireDirectorySyncCapability(opts);
    if (heldLock) w.lock = heldLock;
    else w.acquireLock();
    try {
      const verdict = verifyJournalFile(path);
      if (verdict.status === "corrupt") {
        throw new JournalBrokenError(
          `journal has interior corruption at line ${verdict.problem?.line}: ${verdict.problem?.reason}`
        );
      }
      if (verdict.status === "unterminated_tail") {
        throw new JournalBrokenError(
          "journal ends with an unterminated record; recover it before appending"
        );
      }
      if (verdict.status === "empty" && journalSegmentPaths(path, { strict: true }).length > 1) {
        throw new JournalBrokenError(
          "journal active file is empty or absent beside rotated history; recover the interrupted rotation before appending"
        );
      }
      w.seq = verdict.records.length ? verdict.records[verdict.records.length - 1].seq + 1 : 0;
      w.prev = lastHashOf(verdict);
      w.bytesOnDisk = verdict.validPrefixBytes;
      w.fd = w.ops.openSync(path, "a");
      w.established = w.syncDirOrStop((0, import_path4.dirname)(path));
      opts.inspectVerifiedPrefix?.(verdict.records);
      return w;
    } catch (e) {
      if (w.fd !== null) {
        try {
          w.ops.closeSync(w.fd);
        } catch {
        }
        w.fd = null;
      }
      w.releaseLock();
      throw e;
    }
  }
  /**
   * Exclusive append (§5.2). Two writers appending to one journal interleave
   * partial lines, which looks exactly like corruption and is unrecoverable.
   */
  acquireLock() {
    this.lock = acquireJournalLock(this.lockPath, this.now);
  }
  releaseLock() {
    this.lock?.release();
    this.lock = null;
  }
  /**
   * Write every byte, or fail closed.
   *
   * `writeSync` may write fewer bytes than it was given, and the first version of
   * this code ignored the return value entirely: a 194-byte file was reported as
   * 209 durable bytes with `durableSeq` advanced and no error raised. The wrapper
   * would then have released output whose journal record was incomplete, which is
   * the one thing it exists not to do.
   *
   * A short write that makes progress is resumed. A write that makes none cannot
   * be retried into working, so it stops the writer rather than spinning.
   */
  writeAll(fd, data) {
    let offset = 0;
    while (offset < data.length) {
      const n = this.ops.writeSync(fd, data.subarray(offset));
      if (!Number.isInteger(n) || n <= 0) {
        throw new Error(
          `write made no progress after ${offset} of ${data.length} bytes (returned ${String(n)})`
        );
      }
      offset += n;
    }
  }
  /**
   * Move to the broken state and raise. The only way the writer stops.
   *
   * Rotation used to run outside this transition, so a rotation failure threw
   * without marking the writer broken and the next `appendDurable` succeeded —
   * appending after a missing continuation record, which is precisely the
   * fail-stop contract being violated. Reproduced: marker write returns 0, first
   * append throws, next append succeeds.
   */
  fail(what, e) {
    this.broken = new JournalBrokenError(
      `${what}; capture has stopped: ${e instanceof Error ? e.message : String(e)}`,
      e
    );
    throw this.broken;
  }
  /**
   * Sync a directory entry, or stop.
   *
   * Three outcomes, kept distinct because collapsing them is what caused the
   * bug. An error stops the writer. A `false` return means the operation does
   * not exist here, which stops the writer too *unless* an operator has accepted
   * that — because without it the durability guarantee is unavailable, and
   * continuing would release output under a guarantee that does not hold.
   *
   * The platform gate in `requireDirectorySyncCapability` is an early, clearer
   * refusal for the obvious case. This is the control: checking the platform and
   * not the returned value was a check that looked like it covered the claim
   * while the actual value could still say otherwise.
   */
  syncDirOrStop(dir) {
    let synced;
    try {
      synced = this.ops.fsyncDirSync(dir);
    } catch (e) {
      return this.fail(`journal directory sync failed for ${dir}`, e);
    }
    if (!synced) {
      if (this.established === true) {
        this.fail(
          `journal directory ${dir} could not be synced during rotation, and this journal opened with durable names. Capture has stopped rather than continue under a weaker guarantee than its own evidence claims`,
          new Error("a run that starts durable stays durable or stops")
        );
      }
      if (!this.acceptUnsynced) {
        this.fail(
          `journal directory ${dir} could not be synced on this platform, so a file holding acknowledged records can lose its name in a crash`,
          new Error(`set ${ACCEPT_UNSYNCED_DIRECTORIES_ENV}=1 to proceed without that guarantee`)
        );
      }
    }
    return synced;
  }
  assertUsable() {
    if (this.broken) throw this.broken;
    if (this.fd === null) throw new JournalBrokenError("journal is closed");
  }
  /**
   * Bytes for which fsync has returned in this process.
   *
   * This is the only durable position anyone has, and it is not recoverable by
   * reading the file. A reader sees terminated records, which proves the writer
   * emitted whole lines, not that the kernel acknowledged them — a complete record
   * can sit in the page cache, be visible to every reader, and be gone after a
   * power loss. So a release gate compares against this, held by the process that
   * did the writing, and never against a verdict's `validPrefixBytes`.
   */
  get durableBytes() {
    return this.bytesOnDisk;
  }
  /** Highest seq confirmed on disk, or null when nothing is. */
  get durableSeq() {
    return this.seq - this.bufferedRecords.length - 1 >= 0 ? this.seq - this.bufferedRecords.length - 1 : null;
  }
  /**
   * Whether this journal's file names are durable, as measured on open.
   *
   * Reported rather than inferred from the platform, because the observed result
   * is the fact. A caller releasing work under a durability guarantee has to be
   * able to state which guarantee it actually has — an operator accepting the
   * trade-off authorises it, and cannot make it true.
   */
  get namesDurable() {
    return this.established === true;
  }
  get activePath() {
    return this.path;
  }
  get formatVersion() {
    return JOURNAL_FORMAT_VERSION;
  }
  /**
   * Append a record. Buffered; durable only after a flush reports success.
   *
   * Returns the record so a caller can hold its seq and hash, but holding them
   * is not permission to act on them — `durableSeq` is.
   */
  append(kind, data) {
    this.assertUsable();
    const rec = makeRecord(this.seq, this.now(), kind, data, this.prev);
    this.buffer += serializeRecord(rec);
    this.bufferedRecords.push(rec);
    this.seq++;
    this.prev = rec.hash;
    if (Buffer.byteLength(this.buffer, "utf8") >= this.flushBytes) this.flush();
    return rec;
  }
  /** Append and make it durable before returning. The fail-closed path. */
  appendDurable(kind, data) {
    const rec = this.append(kind, data);
    this.flush();
    return rec;
  }
  /**
   * Write the buffer and fsync it.
   *
   * On failure the writer is marked broken and the error is thrown. The buffer is
   * kept rather than cleared, so nothing is reported as written that was not, and
   * a caller that catches this cannot carry on appending as though the gap were
   * not there.
   */
  flush() {
    this.assertUsable();
    if (this.buffer.length === 0) return;
    const pending = Buffer.byteLength(this.buffer, "utf8");
    const free = freeBytesFor(this.path);
    if (free !== null && free < this.minFreeBytes + pending) {
      this.broken = new JournalBrokenError(
        `refusing to append: ${free} bytes free, need ${this.minFreeBytes + pending}`
      );
      throw this.broken;
    }
    try {
      this.writeAll(this.fd, Buffer.from(this.buffer, "utf8"));
      this.ops.fsyncSync(this.fd);
    } catch (e) {
      this.fail("journal write failed", e);
    }
    this.bytesOnDisk += pending;
    this.buffer = "";
    this.bufferedRecords = [];
    if (this.bytesOnDisk >= this.rotateBytes) {
      try {
        this.rotate();
      } catch (e) {
        if (e instanceof JournalBrokenError && this.broken === e) throw e;
        this.fail("journal rotation failed", e);
      }
    }
  }
  /**
   * Move the active file aside and continue in a fresh one.
   *
   * The continuation's first record carries `prev` from the last record of the
   * rotated file, so the chain crosses the boundary. Without that, rotation is a
   * place where a chain can be restarted and nothing in either file says so.
   */
  rotate() {
    const stamp = this.now().replace(/[:.]/g, "-");
    const rotated = `${this.path}.${stamp}.${this.seq}`;
    this.ops.fsyncSync(this.fd);
    this.syncDirOrStop((0, import_path4.dirname)(this.path));
    this.ops.closeSync(this.fd);
    this.fd = null;
    this.ops.renameSync(this.path, rotated);
    this.fd = this.ops.openSync(this.path, "a");
    this.bytesOnDisk = 0;
    this.syncDirOrStop((0, import_path4.dirname)(this.path));
    const marker = makeRecord(this.seq, this.now(), CONTINUATION_KIND, { rotated_to: rotated }, this.prev);
    this.seq++;
    this.prev = marker.hash;
    const line = Buffer.from(serializeRecord(marker), "utf8");
    this.writeAll(this.fd, line);
    this.ops.fsyncSync(this.fd);
    this.syncDirOrStop((0, import_path4.dirname)(this.path));
    this.bytesOnDisk += line.length;
  }
  /**
   * Close the journal, releasing the lock unconditionally.
   *
   * A final flush can fail — that is the whole point of the broken state — and if
   * the failure escaped before the lock was released, a disk error would leave the
   * journal locked by a process that had exited. Capture would then refuse to
   * start until someone deleted a file by hand. So the flush error is recorded on
   * the writer and rethrown only after the lock is gone.
   */
  close() {
    let pendingError;
    if (this.fd !== null) {
      try {
        if (this.buffer.length > 0) this.flush();
      } catch (e) {
        pendingError = e;
      } finally {
        try {
          this.ops.fsyncSync(this.fd);
        } catch {
        }
        try {
          this.ops.closeSync(this.fd);
        } catch {
        }
        this.fd = null;
      }
    }
    this.releaseLock();
    if (pendingError !== void 0) throw pendingError;
  }
};

// src/native/events.ts
var NATIVE_SCOPE_VERSION = 1;
var NATIVE_CLIENT = "claude-code";
var CODEX_CLIENT = "codex";
var UserPromptSubmit = {
  client: NATIVE_CLIENT,
  event: "UserPromptSubmit",
  boundary: "model_request",
  content_field: "prompt",
  // None read. The payload documents `session_title` when set, which is
  // content rather than framing, and nothing else that changes what the prompt
  // means.
  metadata_fields: [],
  blocking_exit_code: 2,
  measured: {
    client_version: "2.1.311",
    invocation_mode: "claude -p",
    measured_at: "2026-11-16",
    content_precedes_hook: true,
    gate: "honoured",
    evidence: 'seven runs, onFailure "block" read back from the settings file: the client blocked the turn request on all four failure modes and on a documented denial, and a streaming POST /v1/messages carrying the prompt reached the observed endpoint 168 to 585 ms before the hook was invoked in every run'
  }
};
var MessageDisplay = {
  client: NATIVE_CLIENT,
  event: "MessageDisplay",
  boundary: "display",
  content_field: "delta",
  // `index` places the batch in the turn and `final` is the end-of-message
  // signal, which an empty last delta needs to be readable at all.
  metadata_fields: ["index", "final"],
  blocking_exit_code: null,
  measured: {
    client_version: "2.1.311",
    invocation_mode: "claude -p",
    measured_at: "2026-11-13",
    content_precedes_hook: false,
    gate: "fails_open",
    evidence: "seven runs: the batch was displayed on every failure mode, including one held for 9901 ms and then displayed when the hook timed out, so the hook is a chance to record before display and not a condition of it"
  }
};
var CLAUDE_CODE_EVENTS = Object.freeze({
  UserPromptSubmit,
  MessageDisplay
});
var CodexUserPromptSubmit = {
  client: CODEX_CLIENT,
  event: "UserPromptSubmit",
  boundary: "model_request",
  content_field: "prompt",
  // cwd, model and permission_mode were observed in the payload alongside the
  // prompt, but none of them changes what the prompt itself means, which is
  // the same position taken for Claude Code's own UserPromptSubmit.
  metadata_fields: [],
  blocking_exit_code: 2,
  measured: {
    client_version: "0.169.0-alpha.11.1",
    invocation_mode: "codex exec",
    measured_at: "2026-11-19",
    content_precedes_hook: false,
    gate: "inconsistent",
    evidence: "two seven-case sets: on a healthy run the exact prompt was recorded 160 ms before the request reached the fixture, so the hook ran first; an explicit exit-2 failure report stopped that request from reaching the fixture at all, but a bare exit 1 and an externally confirmed SIGKILL of the handler each let the exact prompt cross afterward, and two configured-timeout injections could not be attributed to timeout handling"
  }
};
var CodexStop = {
  client: CODEX_CLIENT,
  event: "Stop",
  boundary: "display",
  content_field: "last_assistant_message",
  // `stop_hook_active` tells a reader whether this invocation is itself a
  // continuation of an earlier Stop decision, which frames what the reply
  // means without being part of it.
  metadata_fields: ["stop_hook_active"],
  // Not 2: exit 2 at Stop asks the client to keep working and does not block
  // or retract anything that already crossed, so there is no blocking code to
  // offer here, the same position taken for MessageDisplay.
  blocking_exit_code: null,
  measured: {
    client_version: "0.169.0-alpha.11.1",
    invocation_mode: "codex exec",
    measured_at: "2026-11-19",
    content_precedes_hook: true,
    gate: "fails_open",
    evidence: "two seven-case sets, plain exec and JSON-mode controls alike: the exact final reply was recorded in Stop's payload only after the CLI had already emitted it, in every case including the repeated-failure continuation run that reached the fixture's request cap; exit 2 at Stop requests continuation and does not retract what was already emitted"
  }
};
var CODEX_EVENTS = Object.freeze({
  UserPromptSubmit: CodexUserPromptSubmit,
  Stop: CodexStop
});
var EVENTS_BY_CLIENT = Object.freeze({
  [NATIVE_CLIENT]: CLAUDE_CODE_EVENTS,
  [CODEX_CLIENT]: CODEX_EVENTS
});
function nativeEventSpec(event, client = NATIVE_CLIENT) {
  const known = EVENTS_BY_CLIENT[client]?.[event];
  if (known) return known;
  return {
    client,
    event,
    // Null, not `display`. The boundary of an unmeasured event is not known
    // either, and a default here would travel into every record as a fact.
    boundary: null,
    content_field: null,
    metadata_fields: [],
    blocking_exit_code: null,
    measured: null
  };
}

// src/native/scope.ts
function nativeCaptureScope(spec, durability) {
  const durableNames = durability === "durable";
  const m = spec.measured;
  const establishes = [
    durableNames ? "the event the client delivered to this handler was recorded and the journal write covering it was flushed and fsynced before the handler returned" : "the event the client delivered to this handler was recorded and the journal write covering it was flushed and fsynced before the handler returned, but see durability: the file holding that record does not have a durable name",
    // Qualified twice, because the unqualified sentence was false in two
    // directions. An edit is detectable and so is a deletion with records
    // after it, since the next record names a predecessor that is no longer
    // there. Removing the LAST record leaves a shorter chain that verifies
    // clean. And an edit whose following hashes are recomputed leaves a chain
    // that verifies clean too, because nothing in the file points forward and
    // the chain is anchored nowhere outside it. Both limits are stated below
    // rather than left to be discovered.
    "the record is linked into the journal hash chain, so an edit of it, or a deletion that leaves later records in place, is detectable by `chron verify --journal` unless the hashes following it were recomputed as well",
    "the time the record was created, which is taken before the write and is part of the hashed record"
  ];
  const doesNot = [
    "that the content this event carries was withheld until the record was durable. A hook is invoked by the client and cannot hold anything the client has already sent or shown",
    "that the client invoked this hook for every event of this kind. An invocation that did not happen leaves no record, and an absent record cannot establish uncaptured activity",
    "that the client used this hook at all for any other session or any other invocation",
    "anything about the client surfaces this event does not carry",
    /**
     * The tail. A journal is append-only and nothing in the file points
     * forward, so a trailing record can be removed and what is left verifies
     * as a whole chain. Detecting that needs the writing process\'s own
     * durable position, which no reader has, or a last-hash anchor kept
     * somewhere else.
     */
    "that the last records of this journal are still here. Removing a trailing record leaves a shorter chain that verifies clean, and detecting that needs the writing process's own durable position or an anchor kept outside the file",
    /**
     * The anchor, which is the same limit `chron run` states for its own
     * journal and for the same reason. The chain binds each record to the one
     * before it, so it catches an edit left on its own; it cannot catch an
     * edit by someone who can rewrite the file, because recomputing every hash
     * from the edited record forward produces a file that verifies clean with
     * its sequence numbers intact.
     */
    "that nobody edited these records. The chain is anchored nowhere outside the file, so a rewrite that recomputes the hashes after an edited record verifies clean. Detecting that needs an anchor kept somewhere this journal is not, which Chron does not keep for native events",
    "that the record carries the time it became durable. The post-fsync acknowledgement is a runtime value returned to the handler that wrote it, and it is not stored: the time in the record is the time the record was created, before the write"
  ];
  if (m === null) {
    doesNot.push(
      "anything about what this client does when the hook fails on this event, because this event has not been measured on a real client by this build"
    );
  } else {
    if (m.content_precedes_hook) {
      doesNot.push(
        `that the content had not already crossed its boundary before this hook was invoked. On ${m.client_version} in ${m.invocation_mode}, measured ${m.measured_at}, it had: ${m.evidence}`
      );
    }
    if (m.gate === "fails_open") {
      doesNot.push(
        `that a failure reported from this handler stops the action. This event fails open, measured on ${m.client_version} in ${m.invocation_mode} on ${m.measured_at}: ${m.evidence}`
      );
    }
    if (m.gate === "honoured") {
      doesNot.push(
        `that blocking the action protects the content. The block was measured honoured on ${m.client_version} in ${m.invocation_mode} on ${m.measured_at}, and it stops the request the hook gates, which is not the request that carried the content`
      );
    }
    if (m.gate === "inconsistent") {
      doesNot.push(
        `that a failure reported from this handler has one effect on the action. Measured on ${m.client_version} in ${m.invocation_mode} on ${m.measured_at}, it did not: ${m.evidence}. No capture-before-release guarantee is claimed across these failure modes`
      );
    }
  }
  if (!durableNames) {
    doesNot.push(
      "that a recorded event still exists after a system crash. Its contents were fsynced; its file name was not, because this platform cannot sync a directory entry and an operator accepted that trade-off"
    );
  }
  return {
    scope_version: NATIVE_SCOPE_VERSION,
    client: spec.client,
    event: spec.event,
    boundary: spec.boundary,
    durability,
    covered: [
      `the payload this client delivered for ${spec.event}, as the client sent it`,
      spec.content_field === null ? `no content field: this build has not established which field of ${spec.event} carries content, so the record holds the event and its identifiers only` : `the content in \`${spec.content_field}\`, recorded as bytes rather than as a rendering of them`,
      "the client identifiers the payload carried, and the time the record became durable"
    ],
    not_covered: [
      "anything the client does without invoking this hook, including every request it makes to the model",
      "the client content this event does not carry",
      "files the client reads or writes, and subprocesses it spawns",
      "whether the client proceeded, since the hook is not told and does not decide"
    ],
    establishes,
    does_not_establish: doesNot,
    measured: m,
    known_limitations: [
      "the journal is authoritative. `chron project` projects closed native messages into the database; projection does not establish that the conversation was completely captured",
      "a capture failure is reported on the handler's stderr and appended to a failure marker file beside the journal. `chron doctor` reports failed capture attempts when inspected; a client may hide hook stderr, and the opt-in Codex launcher only reports statuses observed during its own launch",
      "the failure marker is a plain append, not a chain. It carries no hashes, an earlier attempt that could not finish its line leaves that line unreadable, and the entry written after it says so rather than repairing it",
      "a mark is written under an exclusive lock on the file it goes into, and a writer that cannot take that lock marks its own file instead. So counting a recurring gap means reading every native-capture-failures file beside the journal, not only the one with the plain name",
      "each event is scoped to its recorded client, version and invocation mode; a measurement for one client or mode is not evidence about another"
    ]
  };
}

// src/native/record.ts
var NATIVE_EVENT_KIND = "native.event";
var NATIVE_SCOPE_KIND = "native.capture.scope";
var NATIVE_FAILURE_MARKER_NAME = "native-capture-failures.jsonl";
var NATIVE_ROTATE_BYTES_CEILING = 16 * 1024;
function fsyncDirDefault2(dir) {
  if (!DIRECTORY_SYNC_SUPPORTED) return false;
  const fd = (0, import_fs5.openSync)(dir, "r");
  try {
    (0, import_fs5.fsyncSync)(fd);
  } finally {
    (0, import_fs5.closeSync)(fd);
  }
  return true;
}
function messageOf(e) {
  const text = e instanceof Error ? e.message : String(e);
  return text.length > 300 ? `${text.slice(0, 300)}\u2026` : text;
}
function stringOrNull(x) {
  return typeof x === "string" ? x : null;
}
function clientIdsOf(payload) {
  return {
    session_id: stringOrNull(payload.session_id),
    prompt_id: stringOrNull(payload.prompt_id),
    message_id: stringOrNull(payload.message_id),
    turn_id: stringOrNull(payload.turn_id),
    event_id: stringOrNull(payload.event_id),
    transcript_path: stringOrNull(payload.transcript_path)
  };
}
function endsMidLine(path) {
  try {
    const size = (0, import_fs5.statSync)(path).size;
    if (size === 0) return false;
    const fd = (0, import_fs5.openSync)(path, "r");
    try {
      const last = Buffer.alloc(1);
      return (0, import_fs5.readSync)(fd, last, 0, 1, size - 1) === 1 && last[0] !== 10;
    } finally {
      (0, import_fs5.closeSync)(fd);
    }
  } catch {
    return false;
  }
}
function markerIdPart(invocationId) {
  const cleaned = invocationId.replace(/[^A-Za-z0-9_-]+/g, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
  return cleaned.length > 0 ? cleaned : (0, import_crypto3.randomUUID)();
}
function ownMarkerPath(sharedPath, invocationId) {
  const name = (0, import_path5.basename)(sharedPath);
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  return (0, import_path5.join)((0, import_path5.dirname)(sharedPath), `${stem}.${markerIdPart(invocationId)}${ext}`);
}
function tryMarkerLock(path, now) {
  try {
    return acquireJournalLock(`${path}.lock`, now);
  } catch {
    return null;
  }
}
function markFailure(sharedPath, entry, ops, opts) {
  const openIt = ops.openSync ?? import_fs5.openSync;
  const writeIt = ops.writeSync ?? ((fd, data) => (0, import_fs5.writeSync)(fd, data));
  const syncIt = ops.fsyncSync ?? import_fs5.fsyncSync;
  const closeIt = ops.closeSync ?? import_fs5.closeSync;
  const syncDir = ops.fsyncDirSync ?? fsyncDirDefault2;
  let lock = null;
  let path = sharedPath;
  try {
    (0, import_fs5.mkdirSync)((0, import_path5.dirname)(sharedPath), { recursive: true });
    for (const candidate of [
      sharedPath,
      ownMarkerPath(sharedPath, opts.invocationId),
      ownMarkerPath(sharedPath, (0, import_crypto3.randomUUID)())
    ]) {
      lock = tryMarkerLock(candidate, opts.now);
      if (lock !== null) {
        path = candidate;
        break;
      }
    }
    if (lock === null) return null;
    const midLine = endsMidLine(path);
    const line = Buffer.from(
      `${JSON.stringify(midLine ? { ...entry, after_partial_line: true } : entry)}
`,
      "utf8"
    );
    const fd = openIt(path, "a");
    try {
      const writeAll = (bytes) => {
        let written = 0;
        while (written < bytes.length) {
          const n = writeIt(fd, bytes.subarray(written));
          if (!(n > 0)) throw new Error(`marker write made no progress at byte ${written}`);
          written += n;
        }
      };
      if (midLine) writeAll(Buffer.from("\n", "utf8"));
      writeAll(line);
      syncIt(fd);
    } finally {
      closeIt(fd);
    }
    const nameDurable = syncDir((0, import_path5.dirname)(path));
    return { path, name_durable: nameDurable, shared: path === sharedPath };
  } catch {
    return null;
  } finally {
    lock?.release();
  }
}
function scopeAlreadyWritten(records, client, event, sessionId, scopeVersion, durability) {
  return records.some((r) => {
    if (r.kind !== NATIVE_SCOPE_KIND) return false;
    const d = r.data;
    const ids = d.client_ids ?? {};
    return d.client === client && d.event === event && d.scope_version === scopeVersion && d.durability === durability && (ids.session_id ?? null) === sessionId;
  });
}
function metadataOf(payload, fields) {
  const out = {};
  for (const field of fields) {
    const value = payload[field];
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      out[field] = value;
    }
  }
  return out;
}
function recordNativeEvent(input) {
  const now = input.now ?? localISOString;
  const client = input.client ?? NATIVE_CLIENT;
  const invocationId = input.invocationId ?? (0, import_crypto3.randomUUID)();
  const markerPath = input.failureMarkerPath ?? (0, import_path5.join)((0, import_path5.dirname)(input.journalPath), NATIVE_FAILURE_MARKER_NAME);
  const base = {
    recorded: false,
    event: null,
    boundary: null,
    invocation_id: invocationId,
    byte_count: null,
    scope_written: false,
    durable_seq: null,
    record_hash: null,
    recorded_at_ms: null,
    durability: null,
    failure: null,
    failure_marker: null,
    failure_marker_durability: null,
    journal_path: input.journalPath
  };
  if (typeof input.payload !== "object" || input.payload === null || Array.isArray(input.payload)) {
    return {
      ...base,
      failure: { stage: "payload", reason: "the hook payload was not a JSON object" }
    };
  }
  const payload = input.payload;
  const event = stringOrNull(payload.hook_event_name);
  if (event === null || event.length === 0) {
    return {
      ...base,
      failure: {
        stage: "payload",
        reason: "the hook payload carried no hook_event_name, and the claim a record makes is per event"
      }
    };
  }
  const spec = nativeEventSpec(event, client);
  const ids = clientIdsOf(payload);
  const scope_version = nativeCaptureScope(spec, "durable").scope_version;
  const markEntry = (stage, reason) => ({
    at: now(),
    client,
    client_version: input.clientVersion ?? null,
    event,
    invocation_id: invocationId,
    client_ids: ids,
    stage,
    reason,
    journal_path: input.journalPath,
    recorded: false
  });
  const contentField = spec.content_field;
  const rawContent = contentField === null ? null : payload[contentField];
  const content = contentField === null || rawContent === void 0 || rawContent === null ? null : String(rawContent);
  const bytes = content === null ? null : Buffer.from(content, "utf8");
  let lock = null;
  let writer = null;
  try {
    (0, import_fs5.mkdirSync)((0, import_path5.dirname)(input.journalPath), { recursive: true });
    lock = acquireJournalLock(`${input.journalPath}.lock`, now);
    let existing = [];
    writer = JournalWriter.open(input.journalPath, {
      // One event per invocation, and the next invocation is a different
      // process. Nothing is gained by holding bytes back for a group commit
      // that will never come, and a buffered record is a record a crash loses.
      flushBytes: 1,
      rotateBytesCeiling: NATIVE_ROTATE_BYTES_CEILING,
      inspectVerifiedPrefix: (records) => {
        existing = records;
      },
      ...input.minFreeBytes !== void 0 ? { minFreeBytes: input.minFreeBytes } : {},
      ...input.journalFs ? { fs: input.journalFs } : {},
      ...input.acceptUnsyncedDirectories !== void 0 ? { acceptUnsyncedDirectories: input.acceptUnsyncedDirectories } : {},
      now
    }, lock);
    lock = null;
    const durability = writer.namesDurable ? "durable" : "names_not_durable";
    const needsScope = !scopeAlreadyWritten(
      existing,
      client,
      event,
      ids.session_id,
      scope_version,
      durability
    );
    let scopeWritten = false;
    if (needsScope) {
      writer.appendDurable(NATIVE_SCOPE_KIND, {
        ...nativeCaptureScope(spec, durability),
        client_ids: ids,
        client_version: input.clientVersion ?? null
      });
      scopeWritten = true;
    }
    const record = writer.appendDurable(NATIVE_EVENT_KIND, {
      client,
      client_version: input.clientVersion ?? null,
      event,
      boundary: spec.boundary,
      scope_version,
      invocation_id: invocationId,
      client_ids: ids,
      cwd: stringOrNull(payload.cwd),
      // The capability THIS record was written under, so a reader does not
      // have to work out which scope record applies to it.
      durability,
      // Framing the content needs to be read with: the batch position and the
      // end-of-message signal, where the event documents them.
      event_metadata: metadataOf(payload, spec.metadata_fields),
      content_field: contentField,
      byte_count: bytes === null ? null : bytes.length,
      bytes_b64: bytes === null ? null : bytes.toString("base64"),
      ...contentField === null ? { content_absent_reason: "no_measured_content_field_for_this_event" } : {}
    });
    const recordedAtMs = Date.now();
    const durableSeq = writer.durableSeq;
    writer.close();
    writer = null;
    return {
      ...base,
      recorded: true,
      event,
      boundary: spec.boundary,
      byte_count: bytes === null ? null : bytes.length,
      scope_written: scopeWritten,
      durable_seq: durableSeq,
      record_hash: record.hash,
      recorded_at_ms: recordedAtMs,
      durability
    };
  } catch (e) {
    const stage = writer === null ? "open" : "append";
    const reason = messageOf(e);
    try {
      writer?.close();
    } catch {
    }
    lock?.release();
    const mark = markFailure(
      markerPath,
      markEntry(stage, reason),
      input.markerFs ?? {},
      { invocationId, now }
    );
    return {
      ...base,
      event,
      boundary: spec.boundary,
      failure: { stage, reason },
      failure_marker: mark === null ? null : mark.path,
      failure_marker_durability: mark === null ? null : mark.name_durable ? "durable" : "names_not_durable"
    };
  }
}

// src/cli/hook.ts
var HOOK_CAPTURE_FAILED_EXIT = 1;
function defaultJournalPath() {
  return guardedJournalPath(process.env.CHRON_JOURNAL_PATH ?? (0, import_path6.join)(process.env.CHRON_HOME ?? (0, import_path6.join)((0, import_os.homedir)(), ".chron"), "capture.jsonl"));
}
async function readAllStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}
function flagValue(args, name) {
  const prefix = `--${name}=`;
  const inline = args.find((a) => a.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] !== void 0 ? args[i + 1] : null;
}
function hookUsage() {
  return [
    "usage: chron-hook <claude-code|codex> [--journal <path>] [--client-version <v>]",
    "                             [--invocation-id <id>] [--on-capture-failure report|block]",
    "",
    "Reads one hook payload on stdin and records it in the capture journal.",
    "Equivalent compatibility command: chron hook <claude-code|codex> [the same options].",
    `Measured claude-code events: ${Object.keys(CLAUDE_CODE_EVENTS).join(", ")}.`,
    `Measured codex events: ${Object.keys(CODEX_EVENTS).join(", ")}.`,
    "Any other event is recorded with no ordering claim, because this build has not measured it.",
    "",
    "It records. It does not withhold: a hook is invoked by the client and cannot hold",
    "back content the client has already sent or shown. `block` is available where the",
    "vendor documents a blocking exit code; its effect is specific to the client and event.",
    "For Claude Code, the measured UserPromptSubmit gates a different request from the one that already carried the prompt.",
    "For Codex, the healthy UserPromptSubmit ran before the observed request; failure effects differed across failure modes.",
    "--on-capture-failure=block makes no unconditional capture-before-release guarantee for either client.",
    "",
    "Configure it as a command hook in the client's settings, for example:",
    '  "hooks": { "UserPromptSubmit": [ { "hooks": [',
    '    { "type": "command", "command": "chron-hook claude-code" } ] } ] }',
    "or, for Codex:",
    '  "hooks": { "UserPromptSubmit": [ { "hooks": [',
    '    { "type": "command", "command": "chron-hook codex" } ] } ] }',
    ""
  ].join("\n");
}
async function hookCommand(args, deps = {}) {
  const notice = args[0] === CODEX_CLIENT ? beginLaunchNotice() : null;
  try {
    const code = await executeHook(args, deps);
    notice?.finish(code === 0 ? "recorded" : "failed");
    return code;
  } catch (error) {
    notice?.finish("unknown");
    throw error;
  }
}
async function executeHook(args, deps) {
  const stdout = deps.stdout ?? ((s) => {
    process.stdout.write(s);
  });
  const stderr = deps.stderr ?? ((s) => {
    process.stderr.write(s);
  });
  const clientArg = args[0] ?? "";
  if (clientArg === "" || clientArg === "--help" || clientArg === "-h") {
    stdout(hookUsage());
    return clientArg === "" ? 64 : 0;
  }
  if (clientArg !== NATIVE_CLIENT && clientArg !== CODEX_CLIENT) {
    stderr(
      `chron hook: only ${NATIVE_CLIENT} or ${CODEX_CLIENT} is supported, not '${clientArg}'. A client this build has not measured would have its events recorded under claims taken from another client, which is the one thing a per-event table exists to prevent.
`
    );
    return HOOK_CAPTURE_FAILED_EXIT;
  }
  const client = clientArg;
  const modeRaw = flagValue(args, "on-capture-failure") ?? "report";
  if (modeRaw !== "report" && modeRaw !== "block") {
    stderr(
      `chron hook: --on-capture-failure must be 'report' or 'block', not '${modeRaw}'. Choosing one for you would decide how a client behaves on a failed capture.
`
    );
    return HOOK_CAPTURE_FAILED_EXIT;
  }
  const mode = modeRaw;
  let journalPath;
  try {
    const named = flagValue(args, "journal");
    journalPath = named === null ? defaultJournalPath() : guardedJournalPath(named);
  } catch (e) {
    stderr(`chron: capture failed \u2014 ${e.message}
`);
    return HOOK_CAPTURE_FAILED_EXIT;
  }
  const clientVersion = flagValue(args, "client-version");
  const invocationId = flagValue(args, "invocation-id");
  const raw = deps.payload ?? await (deps.readStdin ?? readAllStdin)();
  let payload;
  try {
    payload = JSON.parse(raw.length === 0 ? "null" : raw);
  } catch {
    stderr(
      `chron: capture failed \u2014 the hook payload could not be read as JSON (${Buffer.byteLength(raw, "utf8")} bytes received). Nothing was recorded for this event, and the payload is not repeated here.
`
    );
    return HOOK_CAPTURE_FAILED_EXIT;
  }
  const result = recordNativeEvent({
    journalPath,
    client,
    payload,
    ...invocationId ? { invocationId } : {},
    ...clientVersion ? { clientVersion } : {},
    ...deps.markerFs ? { markerFs: deps.markerFs } : {}
  });
  if (result.recorded) {
    return 0;
  }
  const spec = nativeEventSpec(result.event ?? "", client);
  const marker = result.failure_marker === null ? "the failure could not be marked beside the journal either, so this message is the only record of it" : result.failure_marker_durability === "durable" ? `marked in ${(0, import_path6.basename)(result.failure_marker)} beside the journal` : `marked in ${(0, import_path6.basename)(result.failure_marker)} beside the journal, but that file's own name is not durable on this filesystem: its bytes were fsynced and the directory entry naming them could not be, so a crash can leave the mark with no name to reach it by`;
  stderr(
    `chron: capture failed \u2014 could not confirm capture of ${result.event ?? "an unreadable event"} (${result.failure?.stage}: ${result.failure?.reason}). ${marker}.
`
  );
  if (mode === "report") return HOOK_CAPTURE_FAILED_EXIT;
  if (spec.blocking_exit_code === null) {
    stderr(
      `chron: ${spec.event} documents no blocking exit code, so the failure is reported and the action continues. Asking for a block where none exists would be a guarantee this cannot keep.
`
    );
    return HOOK_CAPTURE_FAILED_EXIT;
  }
  const m = spec.measured;
  const blockNote = m === null ? "This build has not measured what this client does when this handler exits with that code." : m.content_precedes_hook ? `It does not recover anything that already crossed: on ${m.client_version} in ${m.invocation_mode}, measured ${m.measured_at}, the content this event carries had already crossed its boundary before this handler was invoked.` : m.gate === "inconsistent" ? `Exiting with this code was measured stopping the request on ${m.client_version} in ${m.invocation_mode}, measured ${m.measured_at}; a different failure of this handler, such as a crash or a kill, was measured not stopping it. This does not establish that blocking stops the request on every way this handler can fail.` : `This exit code was measured stopping the request on ${m.client_version} in ${m.invocation_mode}, measured ${m.measured_at}.`;
  stderr(
    `chron: blocking the action, as --on-capture-failure=block asked. This stops the request this hook gates. ${blockNote}
`
  );
  return spec.blocking_exit_code;
}

// src/hook/index.ts
hookCommand(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}).catch(() => {
  process.stderr.write("chron-hook: capture failed before a result could be returned.\n");
  process.exitCode = HOOK_CAPTURE_FAILED_EXIT;
});
