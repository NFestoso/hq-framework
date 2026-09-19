#!/usr/bin/env node
// One-time (and safe to re-run) global setup for HQ. macOS, Linux, Windows.
// Run from anywhere: node <hq>/setup/install.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, lstatSync, readlinkSync, symlinkSync, realpathSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const HQ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CLAUDE_DIR = join(homedir(), ".claude");
const log = (m) => console.log(m);
const warn = (m) => console.log(`WARN  ${m}`);
const problems = [];

const { loadEnvFile } = await import(join(HQ, "system", "scripts", "hq-lib.mjs"));
loadEnvFile();

const [major] = process.versions.node.split(".").map(Number);
if (major < 18) { console.error(`Node ${process.versions.node} is too old; need >=18.`); process.exit(1); }

// 0. Validate ~/.claude/settings.json before touching anything
const settingsPath = join(CLAUDE_DIR, "settings.json");
let settings = {};
if (existsSync(settingsPath)) {
  try { settings = JSON.parse(readFileSync(settingsPath, "utf8")); }
  catch { console.error(`${settingsPath} is not valid JSON; fix it and re-run. Nothing changed.`); process.exit(1); }
  copyFileSync(settingsPath, `${settingsPath}.bak-${Date.now()}`);
}
// 1. Dependencies for the Gemini script
if (!existsSync(join(HQ, "node_modules", "@google", "genai"))) {
  log("Installing npm dependencies...");
  try { execSync("npm install", { cwd: HQ, stdio: "inherit" }); }
  catch { problems.push("npm install failed; run it manually in the HQ folder."); }
}

// 2. Local state file
const statePath = join(HQ, "system", "sync-state.json");
if (!existsSync(statePath)) writeFileSync(statePath, JSON.stringify({ repos: {} }, null, 2) + "\n");

// 3. Share core agents + global skills with every project (symlinks; junctions on Windows)
const links = [
  [join(HQ, ".claude", "agents", "core"), join(CLAUDE_DIR, "agents", "hq-core")],
  [join(HQ, ".claude", "skills", "sync-hq"), join(CLAUDE_DIR, "skills", "sync-hq")],
  [join(HQ, ".claude", "skills", "hq-help"), join(CLAUDE_DIR, "skills", "hq-help")],
];
for (const [target, link] of links) {
  mkdirSync(dirname(link), { recursive: true });
  let st = null;
  try { st = lstatSync(link); } catch {}
  if (st) {
    let same = false;
    try { same = realpathSync(link) === realpathSync(target); } catch {}
    if (same) { log(`ok    ${link} (already linked)`); continue; }
    problems.push(`${link} already exists and points elsewhere; left untouched. Remove it and re-run.`);
    continue;
  }
  try {
    symlinkSync(target, link, platform() === "win32" ? "junction" : "dir");
    log(`link  ${link} -> ${target}`);
  } catch (e) {
    problems.push(`could not link ${link}: ${e.message}`);
  }
}

// 4. Merge ~/.claude/settings.json (parsed and backed up at start)
settings.env = { ...(settings.env || {}), HQ_ROOT: HQ };
settings.permissions = settings.permissions || {};
const dirs = new Set(settings.permissions.additionalDirectories || []);
dirs.add(HQ);
settings.permissions.additionalDirectories = [...dirs];

const hookCmd = `node "${join(HQ, ".claude", "hooks", "sync-reminder.mjs")}"`;
settings.hooks = settings.hooks || {};
settings.hooks.Stop = settings.hooks.Stop || [];
const already = JSON.stringify(settings.hooks.Stop).includes("sync-reminder.mjs");
if (!already) settings.hooks.Stop.push({ hooks: [{ type: "command", command: hookCmd, timeout: 10 }] });
writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
log(`ok    ${settingsPath} (HQ_ROOT, additionalDirectories, Stop hook${already ? " already present" : ""})`);

// 5. Keys (informational only — GEMINI_API_KEY is optional and only needed for /learn;
// `/onboard` can save it to .env, or export it yourself and re-run this script)
if (!process.env.GEMINI_API_KEY) log("note  GEMINI_API_KEY not set yet (optional, needed only for /learn — /onboard can set it up)");

log("");
if (problems.length) { log("Needs attention:"); problems.forEach((p) => warn(p)); }
else log("Setup complete.");
log("Restart any open Claude Code sessions so they pick up the new settings, agents, and skills.");
