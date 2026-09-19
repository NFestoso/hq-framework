# HQ

@context/identity.md
@context/goals.md

## Working with me
- Direct and concise. Disclose limitations, dependencies, costs, and failure modes in the same message as any proposal.
- On factual pushback: hold position if right, show evidence.
- Convert vague goals into metric + date. Challenge weak reasoning.
- If I ask how to use this system or what to run: use the hq-help skill (full guide: USAGE.md).

## Map (read on demand, never by default)
| Need                       | Location                                  |
|----------------------------|-------------------------------------------|
| How to use HQ              | USAGE.md                                  |
| Venture context            | ventures/<slug>/README.md                 |
| Code project progress      | ventures/<slug>/status.md                 |
| Past decisions             | ventures/<slug>/decisions.md              |
| Domain know-how            | .claude/skills/<domain>-playbook/         |
| Rhythm, prefs, stack       | context/                                  |
| Writing style/voice        | context/voice.md (optional)               |
| Open tasks                 | tasks.md                                  |
| Parked ideas               | ventures/parked-ideas.md                  |
| Today / this week          | journal/                                  |
| Pending system changes     | system/proposals.md                       |
| Status (sync, daily, etc.) | `node system/scripts/hq-status.mjs --text` |

## Delegation
- Needs current web facts → researcher
- Video, podcast, or document too long to read → distiller
- Any plan, strategy, or major recommendation → critic BEFORE presenting
- Domain execution → .claude/agents/specialists/

## Rules
- tasks.md is the source of truth for tasks; context/goals.md for goals. journal/ is a log, not a
  task list.
- Do not read knowledge/*/_raw/ unless the task requires it.
- Do not edit CLAUDE.md, context/, USAGE.md, or .claude/ directly. Write a numbered proposal to
  system/proposals.md. Exceptions: /onboard, and proposals the user approved.
- Log decisions in the relevant decisions.md.
- Subagents return ≤25 lines + file paths. Detail lives in files.
- Label anything not verified this session as UNVERIFIED.
- Approval required before: sending, publishing, spending, deleting.
