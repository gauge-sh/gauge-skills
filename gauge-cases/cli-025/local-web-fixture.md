---
criteria:
  - name: Canonical URL fixture
    rubric: Creates a supported local web-fixture input and a measurement that attaches it, replacing the exact requested HTTPS page with the supplied candidate content. Does not silently substitute a files input, a direct preview URL, or hosted website routing.
  - name: Honest local readiness
    rubric: Performs feasible CLI validation and explains the supported local launch path and actual prerequisites. Does not claim the fixture was delivered in a real agent session when none ran. Does not log in, switch to hosted execution, or launch sessions.
config:
  agents:
    - agent: OPENCODE
      models: [accounts/fireworks/models/deepseek-v4p1-flash]
  sampleCount: 1
  inputs: [gauge-agents, cli-release]
---

Prepare a local-only Gauge test of a proposed documentation page, in a new directory. During the eventual agent session, visiting https://example.com/hello should return this candidate text: "Hello CLI: install with npm install -g hello-cli, then run hello Ada. The output is Hello Ada." The task should ask an agent to use that page to explain installation and the greeting command. I need the canonical URL replaced during the test, not a file handed to the agent or a different URL. Use the installed Gauge CLI. Prepare and validate the configuration but don't run agent sessions yet, log in, or upload anything to hosted Gauge. Explain any remaining local prerequisites.
