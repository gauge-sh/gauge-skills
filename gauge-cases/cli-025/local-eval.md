---
criteria:
  - name: Reusable local measurement
    rubric: Creates a real local saved eval with a stable ID, a task and observable criteria matching the requested release-note behavior. The eval can be retrieved through the CLI. A proposal or loose prompt file alone is insufficient.
  - name: Inputs and rerun handoff
    rubric: Creates the requested small skill and declares a skill input. Provides supported commands to run the saved eval with that input and compare subsequent batches. Clearly distinguishes preparation from execution and does not launch sessions or request hosted login.
config:
  agents:
    - agent: OPENCODE
      models: [accounts/fireworks/models/deepseek-v4p1-flash]
  sampleCount: 1
  inputs: [gauge-agents, cli-release]
---

Set up a reusable local Gauge evaluation in a new directory for a small release-notes skill. Create the skill too: it should turn supplied changes into RELEASE-NOTES.md, grouped under Added and Fixed, with no invented changes. Use a task about version 1.2.0 adding dark mode and fixing a login crash. I want to save the evaluation now, then rerun it after editing the skill and compare results. Use the installed Gauge CLI. No Gauge account or hosted services, and don't launch agent sessions yet. Show what you saved and how I can run and compare it later.
