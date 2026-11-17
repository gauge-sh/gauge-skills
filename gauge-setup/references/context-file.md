# GAUGE.md template

Write this at the repository root so teammates and future agent sessions start
from the same facts, and so a refresh can compare new evidence with old. Add one
line to `AGENTS.md` or `CLAUDE.md`:
`Gauge setup, what we measure and why: see GAUGE.md.`

Never include secrets, API keys, raw customer material, customer or prospect
names, or personal data. Describe evidence by source type and count, never by
quote. Use Gauge ids, not copied results. If the repository is public, leave
out the org slug and anything the team would not publish. Update it at the end
of each session that changes the setup.

```markdown
# Gauge

Last updated: <date> by <person or "agent session">. Gauge org: <slug>.

## What we measure and why
- Product: <one sentence>. Category, in a developer's words: <phrase>.
- Surfaces agents touch: <package names, CLI, API, MCP server, docs site, skill>.
- Sources read at setup: <e.g. "MCP analytics (30 days), docs analytics (30 days), 25 recent calls, GitHub issues">. Raw material stays in those systems.

## Themes
| Theme | Kind | Evidence (source type, count) | Measured by |
| --- | --- | --- | --- |
| <e.g. webhook signature verification> | experience | <docs analytics: top agent page; 6 GitHub issues> | <eval id> |
| <e.g. self-hosting requirement> | preference | <9 of 25 calls> | <prompt id> |

## Agent Experience evals (run when their surfaces change)
| Id | Task (short) | Covers | How it runs |
| --- | --- | --- | --- |
| <id> | <task> | <paths or surfaces> | <PR checks in <repo> / rerun after shipping> |

## Agent Preference prompts (tracked)
Schedule: <weekly on Monday / daily>, agents: <list>, sessions per prompt per cycle: <n>.
Credits per month: <estimate>. Can show: <e.g. "a flip within a month">.
| Id | Kind | Prompt (short) | Competitors | Role |
| --- | --- | --- | --- | --- |
| <id> | head-to-head | <prompt> | <name> | <trend / guard> |

## Competitors
| Name | Why it is on the list (source type, not names) |
| --- | --- |

## Latest findings (<date>)
- Friction: <finding, n of m sessions, surface to change>
- Objection: <finding, n of m sessions, claim or page to change>
- Retired or rewritten at setup: <one line each, with the reason>

## Next steps
1. <owner>: <action> by <date>
2. Refresh around <date>: re-read the sources above and compare with the themes table.
```
