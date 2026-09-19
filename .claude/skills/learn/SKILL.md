---
name: learn
description: Builds a validated specialist from external sources (YouTube, podcasts, articles). Brief → source vetting → Gemini extraction → synthesis → packaging → blind eval.
disable-model-invocation: true
argument-hint: "<domain> <task the specialist must perform>"
---
# Learn pipeline
Work in knowledge/<domain>/. Stop at each [APPROVAL] and wait.

## 1. Brief [APPROVAL]
Write brief.md: concrete tasks the specialist must perform, what great output looks like,
the venture it serves, and 3 test tasks each with a real input.
No brief, no sources. Content gathered without a target task produces generic playbooks.

## 2. Sources [APPROVAL]
Delegate to researcher: 10–20 candidates. Rank: practitioner with verifiable results >
documented case studies > frameworks > opinion. Record in _sources.md
(url, author, why credible, length, conflicts of interest, status: PENDING).
Reject engagement bait, course funnels, unverifiable income claims. Public videos only.

## 3. Extraction
Delegate to distiller in batches of ≤5. Output lands in _raw/. Do not read _raw/ in the main session.

## 4. Synthesis
Delegate to a general-purpose subagent with model opus. Write
.claude/skills/<domain>-playbook/SKILL.md (≤400 lines):
- Principles ≥2 independent sources agree on, with source refs
- Step-by-step procedure for each brief task
- Quality checklist
- Templates in original wording (no copied text)
- Disputed points: both sides + which fits the user's context
- Confidence per section
Frontmatter description: "Reference playbook for <domain>. Preloaded by <agent>."
Then send the playbook to critic. Apply or reject each critique with a reason.

## 5. Package [APPROVAL]
Create .claude/agents/specialists/<domain>-<role>.md from system/templates/specialist.md.
Show the user both files.

## 6. Eval [APPROVAL]
For each test task: run the specialist AND a general-purpose agent with no playbook.
Save outputs to eval/ labeled A/B in shuffled order; keep the key in eval/key.md.
The user scores blind. Keep the specialist only if it wins ≥2 of 3. Otherwise revise step 4 or delete.

## 7. Feedback loop
Real outcomes (reply rates, conversions, the user's edits) → results.md.
/weekly-review proposes playbook changes from them.
Add the new specialist to USAGE.md's agents table via a proposal.
