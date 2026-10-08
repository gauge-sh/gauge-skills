---
criteria:
  - name: Correct consumer package and setup
    rubric: >-
      The agent inspects this Vite checkout and leaves a reviewable Gauge PR-check
      setup for the candidate vite package consumed as a dependency of another
      application. It selects packages/vite rather than packing the private
      monorepo root or substituting the published registry version. The config
      uses supported interfaces and coherent repository paths; workspace npm
      installation is appropriate for the requested consumer-app use. Do not
      treat a complex pnpm monorepo as inherently unsupported. Equivalent working
      approaches are acceptable. Assess patches in linked worktrees as well as
      the main checkout.
  - name: Candidate artifact from practical CI
    rubric: >-
      The patch connects a build and packed candidate npm package to a matching
      Gauge Actions input. It respects the repository's pnpm toolchain and
      package build requirements, selects an unambiguous artifact and tarball,
      and arranges to build the PR head rather than silently using a synthetic
      merge or released version. Existing pkg-pr-new preview publication alone
      is not an uploaded Actions artifact. Reusing suitable CI or adding a
      focused packaging job are both acceptable; the path must work for relevant
      same-repository PR updates without depending on an unexplained preview
      label. Preserve existing release behavior.
  - name: Verification and accurate handoff
    rubric: >-
      The agent performs feasible validation of its patch and checks whether the
      candidate package can be consumed outside the monorepo. A successful clean
      install and import or small consumer build is strong evidence. If tooling,
      network, or time blocks this, the agent identifies the actual failed step
      and provides a concrete verification handoff without claiming success.
      Distinguish local evidence from unverified CI and App activation; explain
      required repository access and PR target-branch settings. No remote writes,
      nested eval cases, or paid launches are required. Source inspection alone
      must not be described as a completed package smoke test.
config:
  checks:
    paths: ["gauge-agents/**"]
  agents:
    - agent: OPENCODE
      models:
        - accounts/fireworks/models/deepseek-v4p1-flash
        - z-ai/glm-5.3
  sampleCount: 1
  repoUrl: https://github.com/vitejs/vite
  repoRef: fea5b21dd9524ed7308632407b996f1fe5942c9c
  profileId: cmuwuy89g00gd01js0w4qe8ch
  inputs:
    - gauge-agents
---

Set up Gauge PR checks for Vite so we can test agents using the PR's version of
Vite in another application. This is a local experiment, not an upstream
contribution; leave a reviewable setup change and any remaining activation steps.
