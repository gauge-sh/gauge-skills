# Gauge skills

Installable skills for optimizing how AI discovers, describes, selects, and uses your product.

| Skill | Purpose | Connection |
| --- | --- | --- |
| [Gauge Agents](gauge-agents/SKILL.md) | Evaluate coding-agent experience and preference, then test improvements. | Gauge CLI |
| [Gauge Chat](gauge-chat/SKILL.md) | Measure AI answers and competitors, research opportunities, and improve brand visibility. | Gauge MCP |

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

- “Set up Gauge PR checks for this repo.”
- “Use Gauge Agents to find where coding agents struggle with our onboarding.”
- “Use Gauge Agents to compare which email tools agents select and why.”
- “Use Gauge Chat to explain why our competitors appear in answers where we don't.”
- “Use Gauge Chat to draft an update to the page most likely to improve our AI visibility.”

## Gauge Agents input setup

[`gauge.json`](gauge.json) declares two committed Skill inputs, `gauge-agents`
and `gauge-chat`. Each selects its own directory and root `SKILL.md` at the
candidate commit. No build or artifact-upload workflow is required.

The config sets `org` to the Gauge organization (`gauge-x6af`).
[`gauge-evals/pr-setup-cli.md`](gauge-evals/pr-setup-cli.md) tests the request
“Set up Gauge PR checks for this repo” against a pinned pre-setup CLI checkout.
It selects only the candidate `gauge-agents` Skill and runs one Codex/GPT-6.1 Sol
session per eligible PR update. Four additional public-repository cases cover
Vite, GitHub CLI, FastAPI, and Astro docs, with one sample each on DeepSeek V4.1
Flash and GLM 5.3 through OpenCode. The complete suite launches **nine sessions**
per eligible update. See [eval coverage and interpretation](EVALS.md).

The personas preserve setup-only scope and supply no remote write credentials,
so the inner tasks produce local setup changes or actionable fallback handoffs
without launching nested evals. In that organization's
**Settings → GitHub**, ensure the existing **Gauge Agents** installation includes
`gauge-sh/gauge-skills` and enable checks for the intended target branches.
Repository access and check settings are managed outside this config; merging
it does not grant App access. The App needs Contents read and Checks/Pull requests write.

Future cases should select `config.inputs: [gauge-agents]` or
`config.inputs: [gauge-chat]` to test one Skill at a time; omitting the selection
attaches both. Skill inputs do not install the CLI or authorize the MCP connection.
`checks.paths` watches both Skill directories; Gauge always watches `gauge.json`
and case paths too. The cases supply the evals that consume the selected Skill input.
