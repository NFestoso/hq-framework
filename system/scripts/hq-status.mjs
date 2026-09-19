#!/usr/bin/env node
// HQ status for /hq-help, /daily, /sync-hq, /weekly-review.
// Usage: node hq-status.mjs [--text] [--cwd=/path]
import { homedir } from "node:os";
import { statSync } from "node:fs";
import {
  HQ_ROOT, loadState, repoRoot, isInside, linkedVenture, unsyncedCount, localDate,
  frontmatter, listDirs, listFilesRecursive, basename, join, existsSync, readFileSync,
} from "./hq-lib.mjs";

const args = process.argv.slice(2);
const cwd = args.find((a) => a.startsWith("--cwd="))?.slice(6) || process.cwd();
const state = loadState();
const today = localDate();

// Where am I?
let location = "other", repo = null;
if (isInside(cwd, HQ_ROOT)) location = "hq";
else {
  const root = repoRoot(cwd);
  if (root) {
    const entry = state.repos[root];
    const venture = linkedVenture(root) || entry?.venture || null;
    location = venture ? "linked-repo" : "unlinked-repo";
    repo = {
      name: basename(root), path: root, venture,
      last_synced_commit: entry?.commit || null, last_synced_at: entry?.synced_at || null,
      unsynced_commits: venture ? unsyncedCount(root, entry) : null,
    };
  }
}

// Daily log phases for today
const dailyPath = join(HQ_ROOT, "journal", "daily", `${today}.md`);
const dailyText = existsSync(dailyPath) ? readFileSync(dailyPath, "utf8") : "";
const phases = ["Log", "Premortem", "Midday", "Postmortem"].filter((p) => new RegExp(`^## ${p}`, "mi").test(dailyText));

// Weekly review recency
const weeklies = listFilesRecursive(join(HQ_ROOT, "journal", "weekly"), ".md").map((f) => basename(f)).sort();
const lastWeekly = weeklies.at(-1) || null;
let daysSinceWeekly = null;
if (lastWeekly) {
  const { mtimeMs } = statSync(join(HQ_ROOT, "journal", "weekly", lastWeekly));
  daysSinceWeekly = Math.floor((Date.now() - mtimeMs) / 86400000);
}

// Unsynced registered repos
const unsynced = Object.entries(state.repos)
  .map(([path, e]) => ({ name: e.name || basename(path), path, venture: e.venture, commits: existsSync(path) ? unsyncedCount(path, e) : null }))
  .filter((r) => r.commits && r.commits > 0);

// Onboarding: identity/goals still empty?
const hasContent = (f) => {
  try { return readFileSync(join(HQ_ROOT, "context", f), "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("<!--")).length >= 3; }
  catch { return false; }
};
const onboardingNeeded = !hasContent("identity.md") || !hasContent("goals.md");

// Installed skills and agents (HQ project + user level)
const skillRoots = [join(HQ_ROOT, ".claude", "skills"), join(homedir(), ".claude", "skills")];
const skills = {};
for (const r of skillRoots) for (const d of listDirs(r)) {
  const fm = frontmatter(join(r, d, "SKILL.md"));
  if (fm?.name && !skills[fm.name]) skills[fm.name] = { description: fm.description, user_invoked_only: fm.userOnly, hq_only: r.startsWith(HQ_ROOT) && !existsSync(join(homedir(), ".claude", "skills", d)) };
}
const agentRoots = [join(HQ_ROOT, ".claude", "agents"), join(homedir(), ".claude", "agents")];
const agents = {};
for (const r of agentRoots) for (const f of listFilesRecursive(r, ".md")) {
  const fm = frontmatter(f);
  if (fm?.name && !agents[fm.name]) agents[fm.name] = fm.description;
}

const status = {
  hq_root: HQ_ROOT, today, location, repo,
  onboarding_needed: onboardingNeeded,
  daily: { log: existsSync(dailyPath) ? dailyPath : null, phases_logged: phases },
  weekly: { last: lastWeekly, days_since: daysSinceWeekly, due: daysSinceWeekly === null || daysSinceWeekly >= 7 },
  unsynced_repos: unsynced,
  skills, agents,
};

if (!args.includes("--text")) {
  console.log(JSON.stringify(status, null, 2));
} else {
  const L = [];
  L.push(`HQ: ${HQ_ROOT} | today ${today} | location: ${location}`);
  if (repo) L.push(`Repo: ${repo.name} | venture: ${repo.venture || "not linked"} | last sync: ${repo.last_synced_at || "never"} | unsynced commits: ${repo.unsynced_commits ?? "n/a"}`);
  L.push(`Onboarding needed: ${onboardingNeeded ? "yes" : "no"}`);
  L.push(`Daily log today: ${phases.length ? phases.join(", ") : "none"}`);
  L.push(`Weekly review: last ${lastWeekly || "never"}${daysSinceWeekly !== null ? ` (${daysSinceWeekly}d ago)` : ""} | due: ${status.weekly.due ? "yes" : "no"}`);
  L.push(`Unsynced repos: ${unsynced.length ? unsynced.map((r) => `${r.name} (${r.commits})`).join(", ") : "none"}`);
  L.push(`Skills: ${Object.entries(skills).map(([n, s]) => `/${n}${s.hq_only ? " [HQ only]" : ""}`).join(", ") || "none found"}`);
  L.push(`Agents: ${Object.keys(agents).join(", ") || "none found"}`);
  console.log(L.join("\n"));
}
