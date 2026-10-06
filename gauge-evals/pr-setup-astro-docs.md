---
criteria:
  - name: Recognizes the actual preview provider
    rubric: >-
      The agent inspects this Astro docs repository's build and deployment
      configuration and identifies its Cloudflare preview delivery. Gauge's
      current website input adapter accepts public Mintlify previews, not an
      arbitrary preview URL or provider. Do not infer compatibility merely from
      having a public URL, GitHub Actions artifact, PR comment, or deployment
      record; do not invent a Cloudflare adapter or an environment to make the
      example configuration look complete. Do not claim canonical-origin
      preview routing is supported for this repository as it stands.
  - name: Useful fallback with explicit loss of coverage
    rubric: >-
      The agent provides a concrete next step without requiring an unsolicited
      docs-provider migration. Supported committed files or build-output inputs
      are acceptable reduced-scope alternatives if it states that raw MDX or
      static files do not reproduce the rendered preview at the canonical docs
      origin. Direct preview browsing may be proposed as a manual alternative
      only with its URL, version-selection and routing limitations explained.
      Identify the provider-support work or operational prerequisite needed for
      the requested rendered-site evaluation. A bare unsupported verdict or
      silently changing the task to source-file evaluation is insufficient.
  - name: Grounded validation and activation handoff
    rubric: >-
      Any setup patch uses actual paths and supported config fields and is
      validated as far as access permits. The response distinguishes evidence
      from future steps, preserves existing deployment behavior, and explains
      what remains before checks can run. Do not claim a local config enables
      upstream App access, that fork PRs automatically run Gauge checks, or that
      a production-docs fetch verifies a PR preview. A concrete fallback plan is
      acceptable without a misleading website input; no remote deployment,
      nested eval, or paid run is required.
config:
  agents:
    - agent: OPENCODE
      models:
        - accounts/fireworks/models/deepseek-v4p1-flash
        - z-ai/glm-5.3
  sampleCount: 1
  repoUrl: https://github.com/withastro/docs
  repoRef: 4abc350573df78da1c85c06138f645831caa3984
  profileId: cmuwuy89g00gd01js0w4qe8ch
  inputs:
    - gauge-agents
---

Set up Gauge PR checks for this Astro docs site so we can see whether agents
succeed using the PR's rendered docs before we publish them. This is a local
experiment, not an upstream contribution; leave a reviewable setup change and
any remaining activation steps.
