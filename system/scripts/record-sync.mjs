#!/usr/bin/env node
// Marks a repo as synced at its current HEAD. Usage: node record-sync.mjs <repo-root> <venture-slug>
import { resolve, basename } from "node:path";
import { loadState, saveState, git } from "./hq-lib.mjs";

const [repoArg, venture] = process.argv.slice(2);
if (!repoArg || !venture) {
  console.error("usage: record-sync.mjs <repo-root> <venture-slug>");
  process.exit(1);
}
const root = git(resolve(repoArg), ["rev-parse", "--show-toplevel"]);
if (!root) { console.error(`not a git repo: ${repoArg}`); process.exit(1); }
const commit = git(root, ["rev-parse", "HEAD"]);
if (!commit) { console.error("repo has no commits yet; commit first, then sync"); process.exit(1); }

const state = loadState();
const previous = state.repos[root]?.commit || null;
state.repos[root] = {
  name: basename(root),
  venture,
  commit,
  branch: git(root, ["rev-parse", "--abbrev-ref", "HEAD"]),
  synced_at: new Date().toISOString(),
};
saveState(state);
console.log(JSON.stringify({ ok: true, repo: root, venture, previous_commit: previous, commit }));
