---
criteria:
  - name: Recognizes Python package delivery boundaries
    rubric: >-
      The agent inspects pyproject.toml and the distribution workflows and
      recognizes that the requested surface is the candidate FastAPI Python
      library installed in a separate consumer application. Gauge's npm-package
      input does not install wheels or Python sdists. Do not invent pip-package,
      python-package, arbitrary install-command, or preparation-recipe fields.
      A files input can deliver selected bytes but does not automatically pip
      install them. The existing PyPI release workflow and a registry install
      do not establish candidate PR package delivery.
  - name: Practical candidate-preserving fallback
    rubric: >-
      The agent gives a concrete feasible fallback or a precise handoff for the
      missing installation support. A supported files input carrying a wheel or
      sdist built from the exact PR revision, with explicit consumer-side pip
      installation instructions, is acceptable if its limitations are clear.
      Existing redistribution CI can inform the build without requiring a PyPI
      release. Accept equivalent workable approaches; do not require a dummy
      npm wrapper. A plain refusal, switching silently to docs-only evals, or
      substituting the public latest FastAPI package is insufficient.
  - name: Verification and scoped handoff
    rubric: >-
      The agent validates configuration and paths it writes and grounds proposed
      build/install steps in this repository. It separates checks actually run
      from a future consumer verification procedure, reports environment blockers
      honestly, and explains remaining App/CI access steps. No published package,
      nested eval case, paid run, or remote write is required. Explain what a
      reduced-scope setup measures and what is still manual; do not claim that
      copying Python source or choosing a consumer repo alone proves installation
      of the PR's distribution in a separate application.
config:
  checks:
    paths: ["gauge-agents/**"]
  agents:
    - agent: OPENCODE
      models:
        - accounts/fireworks/models/deepseek-v4p1-flash
        - z-ai/glm-5.3
  sampleCount: 1
  repoUrl: https://github.com/fastapi/fastapi
  repoRef: 6e659e84de09ee06e0499141f7f4951f478ddbac
  profileId: cmuwuy89g00gd01js0w4qe8ch
  inputs:
    - gauge-agents
---

Set up Gauge PR checks for FastAPI so we can test agents building an application
with the PR's version of the Python library. This is a local experiment, not an
upstream contribution; leave a reviewable setup change and any remaining
activation steps.
