// Shared helpers for HQ scripts. Local only: git + filesystem, no network.
import { existsSync, readFileSync, writeFileSync, renameSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname, basename, relative, isAbsolute } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const HQ_ROOT = resolve(
  process.env.HQ_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..", "..")
);
export const STATE_PATH = join(HQ_ROOT, "system", "sync-state.json");

export function git(dir, args) {
  try {
    return execFileSync("git", ["-C", dir, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 3000,
    }).trim();
  } catch {
    return null;
  }
}

export function isInside(child, parent) {
  const rel = relative(resolve(parent), resolve(child));
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

export function repoRoot(dir) {
  return git(dir, ["rev-parse", "--show-toplevel"]);
}

export function loadState() {
  try {
    const s = JSON.parse(readFileSync(STATE_PATH, "utf8"));
    return s && typeof s.repos === "object" ? s : { repos: {} };
  } catch {
    return { repos: {} };
  }
}

export function saveState(state) {
  const tmp = `${STATE_PATH}.tmp`;
  writeFileSync(tmp, JSON.stringify(state, null, 2) + "\n");
  renameSync(tmp, STATE_PATH);
}

// Venture slug from the repo's CLAUDE.md pointer line, if present.
export function linkedVenture(root) {
  for (const f of ["CLAUDE.md", ".claude/CLAUDE.md"]) {
    const p = join(root, f);
    if (!existsSync(p)) continue;
    const m = readFileSync(p, "utf8").match(/Business context:.*ventures[\\/]([A-Za-z0-9_-]+)/);
    if (m) return m[1];
  }
  return null;
}

// Commits since last sync. Registered repos use the recorded commit; linked-but-never-synced
// repos count commits from the last 12 hours. Returns null when unknown.
export function unsyncedCount(root, entry) {
  if (entry?.commit) {
    const n = git(root, ["rev-list", "--count", `${entry.commit}..HEAD`]);
    if (n !== null) return Number(n);
    if (entry.synced_at) {
      const m = git(root, ["rev-list", "--count", `--since=${entry.synced_at}`, "HEAD"]);
      if (m !== null) return Number(m);
    }
    return null;
  }
  const r = git(root, ["rev-list", "--count", "--since=12 hours ago", "HEAD"]);
  return r === null ? null : Number(r);
}

// Loads KEY=value lines from .env at the HQ root into process.env, for keys not already set —
// a shell-exported var always wins. Lets /onboard save things like GEMINI_API_KEY locally
// (gitignored) without needing a new terminal. Missing file is not an error.
export function loadEnvFile(path = join(HQ_ROOT, ".env")) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawVal.replace(/^(['"])(.*)\1$/, "$2");
  }
}

export function localDate(d = new Date()) {
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
}

export function frontmatter(file) {
  try {
    const m = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/);
    if (!m) return null;
    const get = (k) => (m[1].match(new RegExp(`^${k}:\\s*(.+)$`, "m")) || [])[1]?.trim().replace(/^["']|["']$/g, "");
    return { name: get("name"), description: get("description"), userOnly: get("disable-model-invocation") === "true" };
  } catch {
    return null;
  }
}

export function listDirs(dir) {
  try {
    return readdirSync(dir).filter((d) => !d.startsWith(".") && statSync(join(dir, d)).isDirectory());
  } catch {
    return [];
  }
}

export function listFilesRecursive(dir, ext) {
  const out = [];
  const walk = (d) => {
    let entries = [];
    try { entries = readdirSync(d); } catch { return; }
    for (const e of entries) {
      const p = join(d, e);
      let st; try { st = statSync(p); } catch { continue; }
      if (st.isDirectory()) walk(p);
      else if (p.endsWith(ext)) out.push(p);
    }
  };
  walk(dir);
  return out;
}

export { basename, join, existsSync, readFileSync };
