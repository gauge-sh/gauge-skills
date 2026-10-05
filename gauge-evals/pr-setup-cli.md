---
criteria:
- name: Supported repository setup
  rubric: The final patch provides a supported Gauge Agents PR-check setup for the relevant
    customer-facing surface of this repository, using the repository facts and any user clarification.
    Configuration must be coherent with current supported Gauge interfaces and actual paths.
    If the workspace slug cannot be discovered from available configuration or the user, an
    explicitly identified prerequisite is acceptable; inventing an org or claiming unconfigured
    checks work is not. Advice alone without a reviewable patch is insufficient. Assess the
    actual config and CI wiring in the resulting branch or linked worktree, using tool-write/read
    and validation evidence when necessary. An empty exported main-checkout diff alone is not
    a failure when repository instructions require work in a linked worktree; the trace must
    still show a concrete, supported setup patch.
- name: Consumable candidate artifact
  rubric: 'For an npm CLI input, the patch connects PR-time CI output to the configured Gauge
    input: a build and packed npm tarball from the candidate revision, uploaded by a supported
    artifact mechanism with matching workflow/artifact/path selection and usable declared binaries.
    Reuse an appropriate existing CI workflow or add a focused one when needed; either is acceptable.
    For surfaces not requiring a build, use their supported input instead. Judge actual configuration
    and execution evidence; an unexecuted proposed command alone is insufficient.'
- name: Verification and accurate handoff
  rubric: The agent performs feasible local validation of its patch and clearly distinguishes
    what it verified from GitHub/App/CI steps that require unavailable access. Preserve existing
    release behavior and avoid exposing secrets. Report specific actionable remaining prerequisites
    rather than pretending checks or remote installation succeeded. Live GitHub writes and paid
    nested evals are not required. Do not penalize missing outside access as a code failure.
config:
  agents:
  - agent: CODEX_CLI
    models:
    - gpt-6.1-sol
  sampleCount: 1
  repoUrl: https://github.com/gauge-sh/alg
  repoRef: f14a08ff6072f96bc8f0d692303ac5d2474c7e8c
  profileId: cmuvuvxs5000801i9z1mhjmdr
  inputs:
  - gauge-agents
---

Set up Gauge PR checks for this repo
