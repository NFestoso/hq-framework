# How to use HQ

Not sure what to do? Ask Claude **"what should I run?"** (or type `/hq-help`) from any folder.
It checks where you are and what's pending, then tells you the 1–3 commands that apply.

## Every day

| When | Where | Command |
|---|---|---|
| Coding | `cd ~/code/<project> && claude` | work normally |
| Finished a coding session | inside that project | `/sync-hq` |
| Any time (if daily check-ins enabled) | HQ | `/daily` |
| Sunday (if weekly review enabled) | HQ | `/weekly-review` |
| Switching to an unrelated task | anywhere | `/clear` |

`/daily` and `/weekly-review` are both opt-in — turn them on with `/onboard rhythm`. Neither is
an accountability tool: no streaks, no completion tracking, easy to turn off again.
`/daily` manages today's tasks in one simple pass by default, any time of day. `/onboard rhythm`
can turn on a more structured premortem/midday/postmortem version instead, which picks a phase
by time of day — force one with `/daily midday`.

## Agents: just ask in plain English (any folder)

| Say something like | Agent |
|---|---|
| "Research X" / "What's the current state of Y?" | researcher (web search, cited) |
| "Poke holes in this plan" / "Should I do Z?" | critic |
| "Digest this video / podcast / long doc" | distiller (Gemini) |

Specialists you've built with `/learn` appear here automatically once they exist.

## Occasionally (HQ)

| Command | When |
|---|---|
| `/learn <domain> <task>` | You've done the same task manually 3+ times and want a specialist |
| `/onboard <section>` | Goals, ventures, rhythm, voice, or preferences changed |
| `/hq-help` | Lost, or want the list of what's installed |

## Code projects

- **First time in a repo:** run `/sync-hq` once. It links the repo to a venture in HQ.
- **After that:** run `/sync-hq` when you wrap up. It logs what changed, decisions, blockers, and next step to `ventures/<slug>/status.md`.
- **Reminders:** if a linked repo has commits since your last sync, Claude asks once per session whether you want to run `/sync-hq`. `/daily` also lists every unsynced repo (if daily check-ins are enabled).
- **What counts as unsynced:** commits only. Uncommitted edits don't trigger reminders.

## Plugging a venture into daily/weekly (optional)

If you want `/daily` or `/weekly-review` to cover something specific to one of your ventures —
a digest to review each morning, a log to append to each evening, numbers to pull into the
weekly write-up — add an optional `## Daily check-in` and/or `## Weekly review inputs` heading
to that venture's `ventures/<slug>/README.md` with plain-English instructions. Neither skill
assumes any venture has one; most won't.

## Rules of thumb

- Claude got the same thing wrong twice → approve a CLAUDE.md proposal.
- Same prompt typed 3 times → new skill.
- New specialist only after it beats plain Claude in `/learn`'s blind test.
- Commit HQ at the end of the day: `git add -A && git commit -m "log"`.

## If something seems broken

| Symptom | Check |
|---|---|
| `/hq-help` or `/sync-hq` missing in a code repo | Restart the session. Then `ls ~/.claude/skills` should show both. |
| Agents missing | `ls ~/.claude/agents/hq-core` should list three files. Restart session. |
| No sync reminders | Run `/hooks` and confirm a Stop hook mentions `sync-reminder.mjs`. Then run the hook test in README.md. |
| Anything else | Re-run `node ~/hq/setup/install.mjs` (safe to repeat). |
