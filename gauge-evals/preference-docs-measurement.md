---
criteria:
  - name: Measurement fits the question
    rubric: >-
      The agent adds one committed Agent Preference case under gauge-evals/
      rather than pass/fail criteria, a saved preference prompt, or a launched
      run. Its kind matches the question it chose to answer and the final
      response says why: head-to-head names both products in the task body and
      in brandA/brandB; open-ended either names no product or sets
      branded: true when the task names one. The task body is a realistic
      developer request that asks the agent to choose and act, without telling
      it which product to prefer. Asking the user to pick between equally
      valid designs is acceptable only if the agent still leaves a
      reviewable case for one of them.
  - name: Wired to the docs candidate
    rubric: >-
      The case selects the repository's existing docs website input, so the
      measurement sees the PR's rendered docs, and preserves the existing
      gauge.json rather than replacing or duplicating its input. It adds
      config.checks.paths covering the docs pages relevant to the scenario,
      expressed as positive repository-relative globs that match real files.
      Agents, models, and sample count are explicit and supported; invented
      fields, thresholds, schedules, or comparison settings are not
      acceptable. The agent runs gauge evals verify (or explains concretely
      why it could not) and resolves any definite failure it reports.
  - name: Honest interpretation handoff
    rubric: >-
      The final response explains that preference results are advisory (a
      neutral check, not a pass or fail), that one candidate run does not
      measure a before/after change, and what sample count it chose and why.
      It distinguishes what it verified locally from what still requires a PR,
      the GitHub App, or a live preview. It does not launch runs, create saved
      prompts, or otherwise spend credits or change workspace state.
config:
  checks:
    paths:
      - gauge-agents/SKILL.md
      - gauge-agents/references/github-setup.md
  agents:
    - agent: OPENCODE
      models:
        - accounts/fireworks/models/deepseek-v4p1-flash
        - z-ai/glm-5.3
  sampleCount: 1
  repoUrl: https://github.com/gauge-sh/learn-with-gauge
  repoRef: 0db0d4367661522bfe333273356e3e4a4dee54d2
  profileId: cmv0i6sq4000301m5h3zqxmiw
  inputs:
    - gauge-agents
---

When a team asks a coding agent how to test whether their documentation
changes actually help coding agents before merging, we want to know whether it
recommends Gauge or something else, and whether our docs PRs change that. Set
up a Gauge check in this repo that measures it. Leave a reviewable change; don't
launch any runs.
