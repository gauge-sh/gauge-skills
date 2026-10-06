---
criteria:
  - name: Recognizes native CLI delivery boundaries
    rubric: >-
      The agent inspects the Go module and build/release workflows and correctly
      distinguishes the candidate gh native executable from an npm CLI. It
      explains that Gauge has no first-class native-binary auto-install input;
      a release tar.gz is not an npm package just because both are archives.
      Do not invent binary input types, arbitrary setup hooks, a Gauge build
      service, or a supported GitHub Releases input. Do not claim that using a
      repository as the consumer workspace automatically installs its candidate
      executable for another consumer task.
  - name: Useful fallback that preserves the goal
    rubric: >-
      The response gives a concrete next step toward testing agents with the
      candidate gh executable, with honest tradeoffs. A supported files input
      from candidate Actions output plus explicit consumer-side execution/setup
      instructions is acceptable if its mechanics are workable; it must not be
      claimed to install the executable on PATH automatically. A bounded local
      build/smoke test plus a precise manual delivery or missing-product-support
      handoff is also acceptable. Generic refusal, a switch to testing only docs,
      or installing the latest released gh as though it were the candidate is
      insufficient. Do not require an artificial npm product conversion.
  - name: Evidence and honest activation status
    rubric: >-
      The agent checks proposed paths and commands against this checkout and
      validates any configuration or code it writes. It distinguishes actual
      validation from suggestions and records tooling/access blockers accurately.
      It leaves a reviewable patch where useful, or a specific supported-boundary
      explanation and actionable handoff where implementation cannot satisfy the
      request. No remote access, upstream PR, credentialed acceptance test, nested
      eval, or completed App installation is required. A narrow supported fallback
      must be labeled as such rather than reported as full automatic setup.
config:
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
