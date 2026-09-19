---
name: sync-hq
description: Records this code project's progress in HQ (status, decisions, next step) and marks the repo as synced.
disable-model-invocation: true
---
# Sync to HQ

1. Run `node "$HQ_ROOT/system/scripts/hq-status.mjs" --text`.
   If location is `hq` or `other`, say this must be run inside a code repo and stop.

2. **Link check.** If the status shows the venture as "not linked":
   - List folders in `$HQ_ROOT/ventures/`. Ask which venture this repo belongs to, or for a new slug.
   - New slug: create `$HQ_ROOT/ventures/<slug>/README.md` containing `repo: <repo-root>` and
     `TODO: fill with /onboard ventures`.
   - Ask before adding this line to the repo's CLAUDE.md (create the file if missing):
     `Business context: <HQ_ROOT>/ventures/<slug>/README.md (read only when needed)`

3. **Gather.**
   - Commits: `git log --oneline <last_synced_commit>..HEAD`, or `git log --oneline -20` if never synced.
   - Uncommitted: `git status --short`.
   - This session: what was worked on and decided.

4. **Write** `$HQ_ROOT/ventures/<slug>/status.md`, newest entry at the top:
   ```
   ## YYYY-MM-DD: <repo>@<short-sha>
   Changed: ≤5 plain-language bullets (outcomes, not file lists)
   Decisions: or "none"
   Blockers: or "none"
   Next step: one line
   Uncommitted: yes/no + one line
   ```
   Keep the file ≤80 lines: collapse entries older than the latest 5 into one-line bullets under `## History`.

5. Product or architecture decisions → also append to `$HQ_ROOT/ventures/<slug>/decisions.md`
   as `date | decision | why | revisit-by`.

6. If the repo has no commits yet, tell the user to commit first and stop here. Otherwise run:
   `node "$HQ_ROOT/system/scripts/record-sync.mjs" "<repo-root>" "<slug>"`

7. Reply in ≤5 lines: what was logged, next step, and whether uncommitted work exists
   (it isn't covered by the sync marker).
