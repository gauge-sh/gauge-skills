---
criteria:
  - name: Candidate preview discovery
    rubric: >-
      The agent inspects this Astro docs repository's build and deployment
      configuration and identifies its Cloudflare preview delivery and existing
      bot comment. It leaves a reviewable supported website input resolving a
      ready preview for the exact candidate revision. A github-pr-comment source
      must match the actual author and identifying marker, with readiness and
      named URL/SHA captures grounded in the comment template. An equivalent
      deployment source is acceptable only with repository evidence that it
      exists. Do not invent an environment, accept pending/stale previews, or
      treat a timestamp or branch alias as proof of the candidate commit.
  - name: Rendered docs at the canonical origin
    rubric: >-
      The setup routes the repository's canonical docs HTTPS origin to the
      candidate's public rendered preview using supported Gauge configuration.
      Preserve existing deployment behavior and reuse usable preview evidence
      without requiring a provider migration or redundant deployment workflow.
      Source MDX, static-file delivery, or a production-docs fetch alone does not
      satisfy the rendered-preview goal. Reject configurations requiring private,
      authenticated, or path-prefixed previews, and false claims that Gauge
      snapshots live preview pages. The handoff must disclose limitations that
      prevent the chosen setup from working. Omitting generic access or snapshot
      caveats from the final response is not by itself a failure when the setup
      is supported and material blockers are disclosed.
  - name: Grounded validation and activation handoff
    rubric: >-
      Any setup patch uses actual paths and supported config fields and is
      validated as far as access permits. The response distinguishes evidence
      from future steps, preserves existing deployment behavior, and explains
      what remains before checks can run. Do not claim a local config enables
      upstream App access, that fork PRs automatically run Gauge checks, or that
      a production-docs fetch verifies a PR preview. For comment discovery, check
      extraction against the repository's comment format, including readiness
      and candidate identity; a schema-valid regex alone does not prove it selects
      the right preview. Local static checks do not prove live discovery or
      routing. Assess linked-worktree patches too. No remote deployment, upstream
      write, nested eval, paid run, or live preview access is required; report any
      unavailable external verification as a remaining step.
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
