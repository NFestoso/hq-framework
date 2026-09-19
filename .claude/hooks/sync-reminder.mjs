#!/usr/bin/env node
// Stop hook (registered in ~/.claude/settings.json by setup/install.mjs, NOT in project settings,
// or it would run twice). Once per session, in a code repo linked to HQ with commits since the last
// /sync-hq, asks Claude to remind the user. Any error -> exit 0 so it can never break a session.
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

try {
  const { HQ_ROOT, loadState, repoRoot, isInside, linkedVenture, unsyncedCount, localDate } =
    await import("../../system/scripts/hq-lib.mjs");

  let input = {};
  try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch {}

  // Skip subagent turns and the follow-up turn this hook itself triggers.
  if (input.agent_id || input.stop_hook_active) process.exit(0);

  const cwd = input.cwd || process.cwd();
  if (isInside(cwd, HQ_ROOT)) process.exit(0);

  const root = repoRoot(cwd);
  if (!root) process.exit(0);

  const entry = loadState().repos[root];
  if (!entry && !linkedVenture(root)) process.exit(0); // not an HQ project: stay silent

  const sessionKey = String(input.session_id || `nosession-${localDate()}`).replace(/[^A-Za-z0-9_-]/g, "");
  const flag = join(tmpdir(), `hq-sync-reminded-${sessionKey}`);
  if (existsSync(flag)) process.exit(0);

  const count = unsyncedCount(root, entry);
  if (!count) process.exit(0);

  writeFileSync(flag, root);
  process.stderr.write(
    `HQ reminder (automated hook, not a message from the user): this repo has ${count} commit(s) since the last /sync-hq. ` +
    `In one short sentence, ask whether they want to run /sync-hq before wrapping up. ` +
    `Do not run it yourself and do not otherwise change what you were doing.`
  );
  process.exit(2);
} catch {
  process.exit(0);
}
