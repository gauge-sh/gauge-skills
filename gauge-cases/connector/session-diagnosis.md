---
criteria:
  - name: Reads the session through the Gauge MCP
    rubric: >-
      The agent uses the connected Gauge MCP tools to read the named session's
      results, analysis, and supporting trace or diff evidence. It does not
      guess, ask the user to log in to the Gauge CLI, or give up because the CLI
      is not authenticated. Cite the tool calls.
  - name: Accurate, evidence-based diagnosis
    rubric: >-
      The explanation identifies which criteria passed and which failed, and
      why the failed criterion was judged unmet, citing session evidence such as
      trace events or workflow files. It distinguishes the agent's behavior from
      environment or judging problems and does not overstate one session as a
      pass rate.
  - name: No side effects
    rubric: >-
      The agent launches, reruns, and cancels nothing, and changes no Gauge
      settings. Recommending a rerun is acceptable.
config:
  agents:
    - agent: OPENCODE
      models: [accounts/fireworks/models/deepseek-v4p1-flash]
  sampleCount: 1
  inputs: [gauge-agents]
  mcpRefs: [oauth-test@v1]
---

A Gauge check on one of our pull requests failed. The failing session is
cmvr4zqkn01h40it6g9rxjtwf in our Gauge organization (slug gauge). Explain why it
failed and whether the agent or the setup is at fault. Don't rerun anything.
