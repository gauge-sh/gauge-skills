---
criteria:
  - name: Candidate native command setup
    rubric: >-
      The agent inspects the Go module and build/release workflows and correctly
      distinguishes the candidate gh native executable from an npm CLI. It leaves
      a reviewable supported configuration exposing that executable to agents.
      Gauge's binary input supports Linux x86-64 ELF files, selected paths, and
      explicit command mappings on PATH. The configured command must select the
      candidate executable, with any required companion files. Accept equivalent
      supported delivery that achieves this outcome; do not require an npm
      wrapper or accept a docs-only setup or a released gh as the candidate.
      Assess patches in linked worktrees as well as the main checkout.
  - name: Consumable candidate build artifact
    rubric: >-
      The patch connects PR-time CI to the configured input, building the exact
      candidate revision with this repository's toolchain for a compatible Linux
      x86-64 consumer. Artifact names and paths match the uploaded layout, and
      binary inputs receive unpacked executables rather than a nested release
      tarball. Reuse suitable CI or add a focused build/upload job; do not rely on
      release publication or assume Gauge performs the build or installs system
      libraries. Preserve existing release behavior. Configuration must establish
      a practical delivery path; an unimplemented suggestion is insufficient.
  - name: Evidence and honest activation status
    rubric: >-
      The agent checks proposed paths and commands against this checkout and
      validates any configuration or code it writes. It distinguishes actual
      validation from suggestions and records tooling/access blockers accurately.
      Local static verification and a feasible build/command smoke test are useful
      evidence, but static success alone does not prove CI delivery or runtime
      compatibility. If the environment blocks a build or invocation, identify
      the actual blocker and give a concrete verification handoff without claiming
      it passed. Explain remaining App/CI activation steps. No remote access,
      upstream PR, credentialed acceptance test, nested eval, or completed App
      installation is required.
config:
  checks:
    paths: ["gauge-agents/**"]
  agents:
    - agent: OPENCODE
      models:
        - accounts/fireworks/models/deepseek-v4p1-flash
        - z-ai/glm-5.3
  sampleCount: 1
  repoUrl: https://github.com/cli/cli
  repoRef: 17142e08db2e300b37e6da1ddcfb651eb6d9c587
  profileId: cmuwuy89g00gd01js0w4qe8ch
  inputs:
    - gauge-agents
---

Set up Gauge PR checks for GitHub CLI so agents can try the PR's version of gh
on realistic user tasks. This is a local experiment, not an upstream contribution;
leave a reviewable setup change and any remaining activation steps.
