---
name: daily
description: Optional daily check-in — manages today's tasks in one simple pass by default; /onboard can turn on a more structured premortem/midday/postmortem routine instead. Use when the user says run my daily check-in, morning check-in, midday check-in, end of day, or /daily.
argument-hint: "[premortem|midday|postmortem] (structured mode only)"
disable-model-invocation: true
---
# Daily check-in

This is opt-in. If `context/operating-rhythm.md` doesn't exist yet, or exists but its
"Daily check-ins" field is off, say in one line that daily check-ins aren't enabled and point
at `/onboard rhythm` to turn them on. Stop there — no partial run.

Read the "Daily check-in style" field in `context/operating-rhythm.md`. Default to **simple**
if the field is missing (covers rhythm files written before this option existed, and is the
right default for most people). Use **structured** only if the field explicitly says so.

Never compute or surface streaks, completion percentages, or "you did X yesterday but not
today" comparisons, in either mode. This is a planning aid the user chose to turn on, not an
accountability tool.

## Simple mode (default)

One pass, any time of day — this manages today's tasks, it isn't a scheduled ritual.

1. Run `node "$HQ_ROOT/system/scripts/hq-status.mjs" --text`.
2. Read `tasks.md`: all open items, plus Done items dated today.
3. Read `ventures/<slug>/README.md` only for a venture that has a task due or in play today.
4. For each `ventures/*/README.md` with a `## Daily check-in` section, follow its instructions
   as if they were part of this skill. Skip silently for ventures that don't declare one.
5. State directly, in order: open high-priority tasks, other open tasks by project, unsynced
   code repos (`repo: N commits, run /sync-hq there`, omit if none), and anything marked Done
   today. Then ask what to prioritize, or what to log as done.
6. Edit `tasks.md` in the same turn for anything completed or added. tasks.md is the source of
   truth for tasks, not chat history or journal/.
7. Append to `journal/daily/YYYY-MM-DD.md` (local date) under a `## Log` heading: ≤5 lines
   covering priorities chosen and what got done. Create the file if needed; if `/daily` runs
   more than once today, append another `## Log` entry rather than overwriting. This feeds
   /weekly-review. It is a log, not a task list.

## Structured mode (opt-in via `/onboard rhythm`)

A Premortem/Midday/Postmortem structure for people who want more scaffolding across the day.
Turn this on with `/onboard rhythm` (choose "structured" for the daily check-in style) — don't
switch modes on your own.

Phase: `$ARGUMENTS` if given. Otherwise by local time: before 11:00 premortem, 11:00–16:00
midday, after 16:00 postmortem. State the phase in the first line.

### Always, first
1. Run `node "$HQ_ROOT/system/scripts/hq-status.mjs" --text`.
2. Read `context/goals.md`.
3. Read `tasks.md`:
   - Premortem/Midday: all open items.
   - Postmortem: open items, plus Done items dated today.
4. Read `ventures/<slug>/README.md` only for a venture that has a task due or in play today.
5. For each `ventures/*/README.md` with a `## Daily check-in` section, follow its instructions
   for the matching phase. Skip silently for ventures that don't declare one.
6. If calendar or email connectors are configured for this setup, confirm they're available in
   this session; if either isn't, say so directly and try to fix it. If neither is configured,
   skip this step silently.

tasks.md is the source of truth for tasks, not chat history or journal/.
When a task is completed or added during the check-in, edit tasks.md in the same turn.

### Premortem (morning)
State directly, in order:
1. Any venture-declared Premortem sections (see step 5 above).
2. High priority tasks from tasks.md.
3. Other open tasks by project.
4. Time-sensitive calendar/email items, if connectors are configured.
5. Unsynced code repos from the status output, one line each: `repo: N commits, run /sync-hq there`. Omit if none.
6. One line: which of this quarter's top goals today's tasks move. If none do, say so.
Then ask what to prioritize.

### Midday
Open tasks pull, plus any venture-declared Midday sections, then: quick pulse on progress vs.
this morning, what's still open by project, what needs adjusting.

### Postmortem (end of day)
What got done today (Done items dated today in tasks.md), plus any venture-declared Postmortem
sections. Remaining open tasks become tomorrow's plan. List unsynced repos again if any.

### Log
Append to `journal/daily/YYYY-MM-DD.md` (local date) under a heading `## Premortem`, `## Midday`,
or `## Postmortem`: ≤8 lines covering priorities chosen, done, carried over. Create the file if
needed. This feeds /weekly-review and /hq-help. It is a log, not a task list.

## Quote (optional, either mode)
If the user's preferences (context/preferences.md) ask for it, one short, correctly attributed
quote from a historical figure or entrepreneur, fit to the day's context. Never fabricate or
misattribute. If unsure of attribution, pick a different quote. Skip entirely otherwise.

## Voice
Direct answers only. State facts, no fluff, no padding, no apologizing, no re-explaining what's already been said.
