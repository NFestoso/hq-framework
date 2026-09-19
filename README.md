# HQ

A personal operating system for Claude Code. Run the onboarding interview once, and every
session after that already knows your goals, your projects, and how you like to work.

## Why

- **Stop re-explaining yourself.** One onboarding interview builds your context once. Every
  new session starts already knowing your goals, your projects, and how you like to work,
  instead of you re-typing it every time.
- **Code and everything else, one picture.** `/sync-hq` pulls each coding project's status,
  decisions, and blockers back into one place, so you're not tracking work across a dozen repos
  in your head.
- **Nothing here nags you.** Daily check-ins and a weekly review are off by default. No streaks,
  no completion tracking. Turn them on if they help, ignore them if they don't.
- **Sounds like you, not a chatbot.** An optional writing-voice checklist catches AI-sounding
  tells (dashes, hedging, staged contrasts) so drafts read the way you actually write.
- **Build real specialists, not one-off prompts.** `/learn` turns videos, podcasts, and articles
  into a sub-agent, and validates it with a blind test against plain Claude before you trust it.
- **You own it.** Everything lives in plain markdown files in a repo you control. No proprietary
  database, fully inspectable, free to fork and change.

## What it is

An onboarding interview that builds your own context files, a stable place for
goals/ventures/decisions to live, and a couple of optional, non-accountability planning aids
(daily check-ins, a weekly review, a writing-voice checklist) you can turn on or ignore. Your
planning hub. Non-code projects live here; code projects stay in their own repos and report
back with `/sync-hq`.
Day-to-day usage: **USAGE.md**, or ask Claude "what should I run?"

## Requirements
- Claude Code (logged in), Node 18+, git

## Setup (2 minutes)

1. **Put this folder at `~/hq`** (any path works; examples assume `~/hq`).
   ```
   cd ~/hq && git init && git add -A && git commit -m "init"
   ```
2. **Run the installer** (safe to re-run; backs up `~/.claude/settings.json` first):
   ```
   node ~/hq/setup/install.mjs
   ```
   It installs npm packages, links the core agents plus `/sync-hq` and `/hq-help` into
   `~/.claude`, and adds `HQ_ROOT`, HQ folder access, and the sync reminder hook to your user
   settings. Fix anything listed under "Needs attention", a note that `GEMINI_API_KEY` isn't
   set yet is expected and fine; `/onboard` covers it if you want it.
3. **Onboard:** `cd ~/hq && claude`, then run `/onboard` (60-90 min; do one section at a time if
   you like). This builds your context files, decides whether daily check-ins, weekly review,
   and the writing-voice checklist are on or off, and optionally sets up Gemini for `/learn`.
4. **Link each code project:** open Claude Code inside the repo, confirm `/hq-help` and
   `/sync-hq` appear, then run `/sync-hq` once.

That's the whole setup. Everything below is optional.

## Optional / advanced

### Gemini key (only needed for `/learn`)
Nothing else in HQ needs it. `/onboard stack` will ask and, if you say yes, save it to `.env`
at the HQ root (gitignored, no terminal restart needed). To set it up yourself instead: get a
key at aistudio.google.com and either add `GEMINI_API_KEY=...` as a line in `~/hq/.env`, or
export it in your shell profile (`~/.zshrc`/`~/.bashrc`, new terminal required). Test it (from
`~/hq`, any short public YouTube video):
```
npx tsx .claude/skills/learn/scripts/gemini-extract.ts "<youtube-url>" research/_raw/test.md
```

### Full verify script
`cd ~/hq && claude`, then paste:
```
Verify my HQ setup. Report pass/fail for each, don't fix anything silently:
1. List the subagents you can see; researcher, critic, distiller should be there.
2. List skills; daily, onboard, learn, weekly-review, sync-hq, hq-help should be there.
3. Run: echo $HQ_ROOT && node "$HQ_ROOT/system/scripts/hq-status.mjs" --text
4. Have the researcher answer one current-events question with WebSearch, with sources.
5. If you've connected calendar/email tools, check they're available here (/daily uses them
   when present).
6. Use the claude-code-guide agent to check every frontmatter field in .claude/ and the
   hooks entry in ~/.claude/settings.json against current Claude Code docs. List conflicts.
```

### Test the reminder hook without Claude
Inside a linked repo with a commit since your last sync:
```
echo "{\"session_id\":\"test-$RANDOM\",\"cwd\":\"$PWD\"}" | node "$HQ_ROOT/.claude/hooks/sync-reminder.mjs"; echo "exit $?"
```
`exit 2` plus a reminder message = working. `exit 0` with no message = nothing to remind.
Inside Claude Code, `/hooks` should list the Stop hook.

### What's been tested (Linux, Node 22) and what hasn't
Tested:
- Installer: fresh install, re-run, merge into existing settings, conflicting links, invalid settings JSON.
- Reminder hook: 12 scenarios (non-repo, HQ folder, unlinked repo, linked-never-synced, repeat in same
  session, subagent turn, follow-up turn, bad input, just synced, commits after sync, subfolder, stale commit).
  Runs in ~35 ms.
- Status and record-sync scripts.
- Gemini script type-checks against @google/genai 2.21.0 and reports errors cleanly.

Not tested:
- Anything inside a live Claude Code session: whether it follows the symlinked agent/skill folders,
  how the Stop hook's reminder actually appears, whether `$HQ_ROOT` reaches skill commands.
- A live Gemini call (sandbox network blocked it). The default model ID may be outdated; set `GEMINI_MODEL`.
- macOS and Windows. On Windows, links are created as junctions and hooks may need PowerShell adjustments.
- Calendar and email connectors in Claude Code.
- The skills' prompt behavior. Expect to tune them after a week of use.

### Unattended runs (later, optional)
Cloud routines need this repo on GitHub, and they won't see your `~/.claude` setup or local code repos.
To run `/weekly-review` as a routine, schedule it with:
`/schedule every Sunday 6pm: run the weekly-review skill in unattended mode`.
WebSearch needs no extra credential; if a routine uses Gemini (`/learn`), add `GEMINI_API_KEY`
as an API credential and allow `generativelanguage.googleapis.com` in its environment.

## Uninstall
- Remove `~/.claude/agents/hq-core`, `~/.claude/skills/sync-hq`, `~/.claude/skills/hq-help`.
- In `~/.claude/settings.json`, remove `env.HQ_ROOT`, the HQ entry in `permissions.additionalDirectories`,
  and the Stop hook mentioning `sync-reminder.mjs`. Backups sit next to it as `settings.json.bak-*`.
