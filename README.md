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

- “Use Gauge Agents to find where coding agents struggle with our onboarding.”
- “Use Gauge Agents to compare which email tools agents select and why.”
- “Use Gauge Chat to explain why our competitors appear in answers where we don't.”
- “Use Gauge Chat to draft an update to the page most likely to improve our AI visibility.”
