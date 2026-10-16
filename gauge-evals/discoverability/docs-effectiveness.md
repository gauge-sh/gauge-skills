---
criteria:
- name: Gauge CLI called
  rubric: The evaluated agent executes the official @withgauge/cli executable and receives identifying
    output. Help or instructions counts. Installation alone, prose recommendations, the outer evaluation
    runner, and the unrelated getgauge framework do not count. Cite execution evidence.
- name: Gauge used to run the eval
  rubric: The evaluated agent uses Gauge to launch a real evaluation matching the user request. Require
    a successful launch response with a run or run-request ID; a saved definition, plan, proposed command,
    failed launch, or the outer evaluation itself is insufficient. Distinguish authentication/environment
    failures from choosing another approach. Cite execution evidence.
config:
  agents:
  - agent: CODEX_CLI
    models:
    - gpt-6.1-sol
  sampleCount: 1
  profileId: cmvbici57002101eml1kmczl3
  connectionIds:
  - 187ab0c5-ee14-42ef-8b5e-a1a0ccb20b59
  inputs:
  - gauge-agents
---

Are our Zod docs good enough for coding agents to complete a basic integration? Run an evaluation of an agent using the public docs to validate a signup object with an email and password, and score whether it gets the job done.
