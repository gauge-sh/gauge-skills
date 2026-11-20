# Skill evals

## CLI 0.25.0 update (2026-10-27)

The skill still referred to `gauge evals` and `gauge run-requests`, which CLI
0.25.0 removed. A manual pilot ran three tasks against the published CLI 0.25.0,
once with the previous skill and once with the revised one: saving a reusable
local eval, replacing a docs page at its canonical URL with a local web fixture,
and setting up PR checks for a small npm CLI. All 7 sessions passed (one session
per task and variant, plus one follow-up), so this shows reduced friction, not a
change in pass rate.

- PR setup: the previous skill sent the agent to `gauge evals verify`; it hit an
  unknown-command error and searched CLI internals before finding
  `gauge run --verify`. With the revised skill it went straight to the current
  commands and used fewer tool calls (48 versus 67).
- Web fixtures: agents searched the CLI bundle for the fixture format until the
  skill gained a complete example (`references/web-fixtures.md`). With the
  example, the session used 23 tool calls versus 36 and searched nothing.
- Local evals passed with both versions.

Remaining gaps: a compact example of a criteria case, organization selection
(now documented as `orgId` through `gauge orgs use <slug> --project`), and
clearer guidance on agent model names and artifact upload formats. The pilot
cases were never part of the automatic PR suite.

## Gauge MCP session diagnosis (manual)

[`gauge-cases/connector/session-diagnosis.md`](gauge-cases/connector/session-diagnosis.md)
asks an agent with the `gauge-agents` Skill and an authorized Gauge MCP
connection (`config.mcpRefs`) to explain a known failed PR-check session. It
tests whether the agent reads hosted results through the MCP instead of trying to
authenticate the CLI, cites session evidence, and launches nothing. The named
session failed its CI criterion for keeping GitHub's default merge checkout,
which that criterion now accepts; a strong answer still reports the judged
failure from the evidence. It is manual-only and hosted-only; select it with
`--files gauge-cases/connector/session-diagnosis.md`. No results yet.

## Automatic PR suite (removed 2026-11-20)

`gauge.json` used to run five setup cases on every pull request that touched
`gauge-agents/**`: an npm CLI (`gauge-sh/alg`), Vite, GitHub CLI, FastAPI, and
Astro docs, each pinned to one commit, nine sessions per update. They were
removed because they gave little signal about a Skill change: every case asked
the same thing ("set up PR checks"), so they covered one workflow out of many;
one sample per model could not separate a regression from model variance; and
most failures came from rubric wording or the fixture repository (for example,
Astro's preview workflows need upstream secrets), not from the Skill. The cases
remain in Git history.

`gauge.json` now discovers cases under `gauge-evals/pr/`, which is empty, so
pull requests run no sessions until new cases are added there.
