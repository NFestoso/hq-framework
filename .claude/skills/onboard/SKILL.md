---
name: onboard
description: Structured interview that builds or updates the user's context files. Run at first setup, or with a section name to update one area.
disable-model-invocation: true
argument-hint: "[section]"
---
# Onboarding interview

Goal: compact, accurate context so every future session starts informed.
Accuracy over speed. This runs in the main session; subagents cannot ask questions.

## Rules
- If `$ARGUMENTS` names a section, run only that section and update in place.
- Read existing files first. Skip what's answered; confirm what looks stale.
- 3–5 questions per batch. Use AskUserQuestion for discrete options; plain text for open questions.
- Push back once on vague answers: turn "grow", "better", "soon" into a number or date.
  If the user doesn't know, write `UNKNOWN: revisit`. Never invent.
- Record only what the user said. No inferred personality traits. No flattering summaries.
- After each section: write the file, show a ≤10-line summary of what was saved, confirm before continuing.
- identity.md and goals.md must stay ≤40 lines (they load every session). Overflow → detail files.
- Do not store passwords, account numbers, government IDs, or health details. Exception: an API
  key the user opts to save for local tool use (see **stack** below) goes in `.env` at the HQ
  root (gitignored), never in a context/*.md file, and is never echoed back in a summary.

## Sections → files
1. **identity** → context/identity.md
   Role and background. Strengths. Self-reported blind spots. Values. What excellent work means. Non-negotiables.
2. **goals** → context/goals.md
   3-year vision (one paragraph). 12-month outcomes (≤5, measurable). This quarter's top priorities (metric + deadline).
   What the user is explicitly NOT doing this year.
3. **ventures** → ventures/<slug>/README.md (one per venture or major project)
   Problem. Customer. Offer. Stage. Business model. Current metrics. Top constraint. Next milestone + date.
   Key people. Decisions already locked. `repo:` path if there's code.
   Optional: a `## Daily check-in` and/or `## Weekly review inputs` heading — plain-English
   instructions for what `/daily`/`/weekly-review` should surface or log for this venture, if the
   user wants those skills to cover it. Neither heading is required; most ventures won't have one.
4. **rhythm** → context/operating-rhythm.md
   Weekly shape. Peak-energy hours. Fixed training and other recurring blocks. Planning horizon.
   Then ask two explicit yes/no questions, framed as optional planning aids, not trackers, no
   streaks, easy to turn off later by re-running `/onboard rhythm`:
   - "Daily check-ins" (on/off): a quick pass over today's tasks — what's open, what got done,
     log it. Not a tracker.
   - "Weekly review" (on/off): a Sunday-style progress read plus proposals for tightening up
     CLAUDE.md and skills.
   If "Daily check-ins" is on, ask one follow-up (default to simple unless they want more):
   - "Daily check-in style": **simple** (one pass, any time of day, manages today's tasks — most
     people want this) or **structured** (a premortem/midday/postmortem routine some people find
     useful for staying oriented across the day, picked automatically by time of day).
   Record as explicit values in the file — `Daily check-ins: on/off`, `Daily check-in style:
   simple/structured`, `Weekly review: on/off` — `/daily` and `/weekly-review` read them.
5. **voice** → context/voice.md
   Ask: (a) "Want writing checked against a checklist of AI-sounding tells (em dashes, staged
   contrasts, chatbot residue, hedging, and the like) so it reads more like you and less like a
   chatbot?" — explicitly optional, not a grading system. If no, don't create the file, and note
   in preferences.md that this check is off.
   If yes, write context/voice.md with these sections:
   - `## AI-tone tells to avoid (default checklist)`: em/en dashes; staged contrasts ("not just
     X, it's Y"); staged run-ups ("Simply put,", "Honestly,", "The truth is,"); raising an
     objection nobody asked then knocking it down; stacked qualifiers ("could potentially
     possibly"); vague association language ("associated with", "in connection with") standing in
     for the real relationship; borrowed authority with no named source ("studies show"); chatbot
     residue ("Great question!", "I hope this helps!"); knowledge-limit hedging ("while details
     are limited, it appears..."); curly quotes, decorative bold, emoji, or arrow bullets in
     plain-text writing; a generic unearned "wisdom" line not tied to a concrete fact; two
     consecutive sentences sharing an opening word or subject.
   - `## Words/phrases I don't use`: ask the user, record verbatim, empty list if none given.
   - `## How I want to sound`: open text — sentence length, contractions, formality, sign-off style.
   - `## Scope`: note this file is domain-independent — any skill or agent drafting user-facing
     writing can read and apply it by default. Domain-specific writing rules (e.g. a cover-letter
     word cap) belong in that domain's own playbook file, which may reference this one rather
     than duplicate it.
   - `## Credit`: "Checklist adapted from github.com/blader/humanizer's public AI-writing-tell taxonomy."
6. **working-style** → context/preferences.md
   Output format. When the user wants challenge vs. questions vs. frameworks. Decision style. How to deliver bad news. AI output pet peeves.
7. **stack** → context/stack.md
   Tools and accounts in use. Source of truth per data type (tasks, calendar, notes, CRM).
   Code repo locations. APIs available. Monthly ceiling for AI/API spend.
   Also ask: "Set up Gemini now for `/learn` (turns long videos/podcasts/articles into
   specialists)?" Optional and skippable — nothing else in HQ needs it, and it can be done later
   with `/onboard stack`. If yes: ask for the key, then write `GEMINI_API_KEY=<key>` to `.env`
   at the HQ root — create the file if it doesn't exist, keep any other lines already there,
   never overwrite a key that's already set. Confirm it was saved without repeating the key.
8. **boundaries** → context/constraints.md
   Actions that always need approval. Spend limits. Off-limits data or topics. Legal/compliance constraints.
9. **delegation** → system/proposals.md
   Recurring tasks the user would hand off. For each: frequency, time per occurrence, what good output looks like, a real example of great output.
   Do NOT create agents. Rank proposals by (time per occurrence × frequency).

## Finish
- Write system/onboarding-gaps.md with every UNKNOWN.
- Output: files written, top gaps, ranked delegation proposals. Stop.
