---
name: weekly-review
description: Optional weekly progress review plus assistant self-maintenance proposals — a planning aid, not a tracker.
disable-model-invocation: true
---
# Weekly review

This is opt-in. If `context/operating-rhythm.md` doesn't exist yet, or exists but its
"Weekly review" field is off, say in one line that weekly review isn't enabled and point at
`/onboard rhythm` to turn it on. Stop there.

1. Run `node system/scripts/hq-status.mjs --text` (skip if it fails, e.g. in a cloud routine).
2. Read: `context/goals.md`, this week's `journal/daily/*`, `ventures/*/status.md`,
   `ventures/*/metrics.md`, `system/proposals.md`, `knowledge/*/results.md`. For each
   `ventures/*/README.md` with a `## Weekly review inputs` section, also read the files it names
   and fold the result into that venture's status line.
3. Write `journal/weekly/YYYY-Www.md` (≤40 lines): goal progress with numbers, wins, misses with
   root cause, per-venture status (flag repos unsynced for 7+ days), decisions due for revisit,
   next week's top priorities.
4. PROPOSE, don't apply. Append numbered items to `system/proposals.md`:
   - Stale, duplicated, or ignored lines in CLAUDE.md, USAGE.md, or context/ (show exact diff)
   - Corrections the user made twice this week → CLAUDE.md rule
   - Manual work repeated 3+ times → skill candidate
   - Agents/skills unused for 4 weeks → archive
   - Playbook updates backed by results.md
   - Size budget breaches (CLAUDE.md >200 lines; identity/goals >40 lines)
5. Interactive run: ask approve/reject per number, apply approved ones, log to `system/changelog.md`.
   Unattended run (routine): apply nothing. Commit proposals on a `claude/` branch and open a PR.

Never compute or surface streaks, completion percentages, or missed-week counts. This is a
planning aid the user chose to turn on, not an accountability tool.
