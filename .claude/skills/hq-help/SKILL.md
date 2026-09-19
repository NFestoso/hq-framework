---
name: hq-help
description: Tells the user how to use their HQ system and which commands, skills, or agents to run right now. Use when they ask how to use this, what to run, what commands/skills/agents exist, or what they might be forgetting.
disable-model-invocation: true
---
# HQ help

1. Run: `node "$HQ_ROOT/system/scripts/hq-status.mjs" --text`
   If HQ_ROOT is empty or the script is missing, say setup isn't complete and tell the user to run
   `node <hq-folder>/setup/install.mjs`, then stop.
2. Read `$HQ_ROOT/USAGE.md`.
3. Answer in this order, ≤12 lines unless asked for everything:
   - **Right now:** the 1–3 commands that apply, based on the status output:
     - Onboarding needed → `/onboard` (in HQ)
     - Daily check-ins enabled and nothing logged today → `/daily` (in HQ)
     - Current repo is linked and has unsynced commits → `/sync-hq`
     - Current repo is unlinked → `/sync-hq` once to link it (only if it's one of the user's projects)
     - Other repos listed as unsynced → name them; `/sync-hq` must be run inside each
     - Weekly review enabled and due → `/weekly-review` (in HQ)
     - Nothing pending → say so in one line
   - **Useful here:** 1–2 plain-English asks for agents that fit the current context (e.g. in a code
     repo: "have the critic review this architecture").
   - **Full guide:** `$HQ_ROOT/USAGE.md`
4. If asked what exists: list skills and agents exactly as the status output shows them, with the
   descriptions from USAGE.md. Mark HQ-only skills. Never invent commands.
