# GAUGE.md template

Write this at the repository root so teammates and future agent sessions start
from the same facts. Add one line to `AGENTS.md` or `CLAUDE.md`:
`Gauge setup, tracked measurements, and next steps: see GAUGE.md.`

Never include secrets, API keys, raw customer material, customer or prospect
names, or personal data. Use Gauge ids, not copied results. Update it at the end
of each session that changes the setup.

```markdown
# Gauge

Last updated: <date> by <person or "agent session">. Gauge org: <slug> (leave the slug out if this repository is public).

## What we measure and why
- Product: <one sentence>. Category, in a developer's words: <phrase>.
- Surfaces agents touch: <package names, CLI, API, MCP server, docs site, skill>.
- Decision this supports: <e.g. "docs rewrite before the v3 launch">.

## Competitors
| Name | Why it is on the list (source type, not names) |
| --- | --- |
| <Competitor> | <e.g. "named in pricing comparison page", "frequent in lost-deal notes"> |

## Tracked preference prompts (on the org schedule)
Schedule: <weekly on Monday / daily>, agents: <list>. Cost per cycle: <estimate>.
| Id | Kind | Prompt (short) |
| --- | --- | --- |

## Agent-experience evals
- Saved eval sets: <id: name, cadence>.
- Repo kit: `gauge-cases/` (smoke n, deep n, pending n). Runner: `node gauge-kit/gauge-kit.mjs`.
- Shared criteria: `gauge-kit/rubrics.md`.

## Personas
<id: name, one line on when to use it>

## Budget
<credits per month agreed, credits per session measured on <date>, schedule cap>

## Latest results (<date>)
- One thing: <the change with the most evidence>
- <finding, n of m sessions, owner surface>
- Open questions: <criteria under review, setup errors>

## Next steps
1. <owner>: <action> by <date>
2. Before the next docs or product change: `node gauge-kit/gauge-kit.mjs run --changed origin/main`
```
