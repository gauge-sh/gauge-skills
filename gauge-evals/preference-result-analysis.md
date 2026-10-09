---
criteria:
  - name: Results come from the workspace
    rubric: >-
      Using the Gauge CLI against the workspace, the agent finds the named
      preference prompt and reads its run history with per-run verdicts. It
      reports how many completed runs chose Gauge versus Braintrust and breaks
      that down by agent/model. When this case was written the prompt had nine
      completed runs: Gauge won seven, and both Braintrust wins came from Claude
      Code, while Codex chose Gauge in all three of its runs. If the workspace
      has more runs now, judge against the data the CLI returns, not these
      numbers. Counts, models, and winners must match CLI output rather than
      guesses from names, timing, or the prompt text.
  - name: Losses explained from evidence
    rubric: >-
      The agent explains why agents chose Braintrust using the run-level
      verdict reasoning or session evidence for those specific runs, not
      generic speculation about the two products. The losing runs described
      Gauge as account- or sales-gated for a research-only task and as less
      rigorous or methodologically unclear than Braintrust's versioned
      before/after comparisons, including reading it as a marketing-style
      visibility score. An answer that names these reasons, or other reasons
      actually present in the returned evidence, satisfies this; reasons
      absent from the evidence do not.
  - name: Calibrated, actionable, read-only
    rubric: >-
      Recommendations follow from the evidenced loss reasons (for example a
      visible self-serve path, a documented before/after methodology, and a
      clear distinction between agent evaluation and AI-visibility scoring)
      rather than generic marketing advice. The agent states that the sample
      is small and that the head-to-head prompt names Gauge, so it measures
      choice after exposure rather than organic discovery, and does not claim a
      model difference is established. It may propose a follow-up measurement
      but launches nothing: no runs, synthesis, or edits to prompts, evals,
      personas, or settings. A command that fails is reported with its output.
config:
  checks:
    paths:
      - gauge-agents/SKILL.md
  agents:
    - agent: OPENCODE
      models:
        - accounts/fireworks/models/deepseek-v4p1-flash
        - z-ai/glm-5.3
  sampleCount: 1
  profileId: cmv0i6t87000401joltvpomu2
  connectionIds:
    - 187ab0c5-ee14-42ef-8b5e-a1a0ccb20b59
  inputs:
    - gauge-agents
---

Our Agent Preference prompt "ALG web study 2026-09-27: comparison" compares us
with Braintrust. Using Gauge, find out how often agents chose Braintrust over us,
why they did, and what we should change in our docs or site in response. This is
read-only: don't launch runs or change anything in the workspace.
