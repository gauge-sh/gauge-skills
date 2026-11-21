# Gauge skills

Installable skills for optimizing how AI discovers, describes, selects, and uses your product.

| Skill | Purpose | Connection |
| --- | --- | --- |
| [Gauge Agents](gauge-agents/SKILL.md) | Set up what to measure from your own context, evaluate coding-agent experience and preference, then test improvements. | Gauge CLI or Gauge MCP |
| [Gauge Chat](gauge-chat/SKILL.md) | Measure AI answers and competitors, research opportunities, and improve brand visibility. | Gauge MCP or Gauge CLI |

## Install from this checkout

From the repository root:

```sh
npx skills add . --skill gauge-agents --skill gauge-chat
```

Select either skill individually by passing only its name. Add `-g` for installation across projects, or `-a codex` / `-a claude-code` to target an agent.

The skills describe connection setup; installation does not install the Gauge CLI or authorize the MCP connection.

## Install from GitHub

```sh
npx skills add gauge-sh/gauge-skills --skill gauge-agents --skill gauge-chat
```

Each skill can also be installed independently by passing only its name.

## Example requests

- “Set up Gauge for our SDK and figure out what's worth measuring.”
- “Set up Gauge PR checks for this repo.”
- “Test whether a coding agent can use our SDK to complete its first integration.”
- “Run an evaluation to find where coding agents struggle with our onboarding.”
- “Measure whether our updated docs improve agent success.”
- “Use Gauge Agents to compare which email tools agents select and why.”
- “Use Gauge Chat to explain why our competitors appear in answers where we don't.”
- “Use Gauge Chat to draft an update to the page most likely to improve our AI visibility.”

## Gauge Agents input setup

[`gauge.json`](gauge.json) declares two committed Skill inputs, `gauge-agents`
and `gauge-chat`. Each selects its own directory and root `SKILL.md` at the
candidate commit. No build or artifact-upload workflow is required.

The config records the Gauge organization (`gauge`) as `orgId`, set with
`gauge orgs use gauge --project`.

Pull request checks discover cases under `gauge-evals/pr/`, which is currently
empty, so no sessions run on pull requests. The earlier setup suite was removed;
see [EVALS.md](EVALS.md). The cases in `gauge-evals/discoverability/` and
`gauge-cases/` are manual-only; select them explicitly with `--files` when
running a pilot.

In that organization's **Settings → GitHub**, ensure the existing **Gauge
Agents** installation includes `gauge-sh/gauge-skills` and enable checks for
the intended target branches. Repository access and check settings are managed
outside this config; merging it does not grant App access. The App needs
Contents read and Checks/Pull requests write.

Future cases should select one input, such as `config.inputs: [gauge-agents]`,
to test one Skill at a time; omitting the selection attaches all of them. Skill inputs do not install the CLI or authorize the MCP connection.
`checks.paths` watches both Skill directories; Gauge always watches `gauge.json`
and case paths too. The cases supply the evals that consume the selected Skill input.
