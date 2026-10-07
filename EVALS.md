# PR setup evals

The learning goal is to find where the candidate `gauge-agents` Skill fails to
help an agent set up a realistic repository, recognize a support boundary, or
offer a useful alternative. The setup reference and the GitHub CLI/Astro criteria
now target the capabilities merged in
[alg PR #1595](https://github.com/gauge-sh/alg/pull/1595). A passing example is not
evidence of a pass-rate improvement.

## Coverage

| Case | Starting repository | What it tests |
| --- | --- | --- |
| [Existing CLI](gauge-evals/pr-setup-cli.md) | `gauge-sh/alg`, before Gauge setup | Existing supported npm CLI regression; one Codex/GPT-6.1 Sol sample. |
| [Vite](gauge-evals/pr-setup-vite.md) | `vitejs/vite` | Supported pnpm monorepo; select the consumer package, build it, and make a candidate tarball available to another app. Avoid mistaking pkg-pr-new publication for an Actions artifact. |
| [GitHub CLI](gauge-evals/pr-setup-github-cli.md) | `cli/cli` | Build and deliver the candidate Linux x86-64 executable through a supported input, with matching artifact paths and a usable command. |
| [FastAPI](gauge-evals/pr-setup-fastapi.md) | `fastapi/fastapi` | Python wheel/sdist consumer delivery; distinguish file transport from automatic Python installation. |
| [Astro docs](gauge-evals/pr-setup-astro-docs.md) | `withastro/docs` | Reuse the existing Cloudflare preview comment to discover the ready candidate and route the canonical docs origin to it. |

The four public-repository cases each run **one sample on two OpenCode targets**:
`accounts/fireworks/models/deepseek-v4p1-flash` and `z-ai/glm-5.3`.
This is eight exploratory sessions plus the existing Codex regression: **nine
sessions per eligible PR update or explicit rerun**. Each case has three
criteria. No custom turn, time, or dollar limit is claimed: committed case
configuration does not expose those controls, so platform limits apply.
Check the committed CLI plan before changing the roster or sample count.

All cases select only the candidate `gauge-agents` input. `gauge-chat` is not
attached. Public repositories are pinned by full SHA in each case; their contents
are consumer fixtures, not repositories where this test should push a PR. No
write credentials or nested eval launches are part of the tasks.

## Fixture evidence

These upstream files were inspected before authoring the criteria:

- Vite at `fea5b21dd9524ed7308632407b996f1fe5942c9c`:
  [root manifest](https://github.com/vitejs/vite/blob/fea5b21dd9524ed7308632407b996f1fe5942c9c/package.json),
  [consumer manifest](https://github.com/vitejs/vite/blob/fea5b21dd9524ed7308632407b996f1fe5942c9c/packages/vite/package.json),
  [CI](https://github.com/vitejs/vite/blob/fea5b21dd9524ed7308632407b996f1fe5942c9c/.github/workflows/ci.yml),
  [preview publication](https://github.com/vitejs/vite/blob/fea5b21dd9524ed7308632407b996f1fe5942c9c/.github/workflows/preview-release.yml).
- GitHub CLI at `17142e08db2e300b37e6da1ddcfb651eb6d9c587`:
  [Go module](https://github.com/cli/cli/blob/17142e08db2e300b37e6da1ddcfb651eb6d9c587/go.mod),
  [release archive definitions](https://github.com/cli/cli/blob/17142e08db2e300b37e6da1ddcfb651eb6d9c587/.goreleaser.yml),
  [deployment workflow](https://github.com/cli/cli/blob/17142e08db2e300b37e6da1ddcfb651eb6d9c587/.github/workflows/deployment.yml),
  [contribution boundaries](https://github.com/cli/cli/blob/17142e08db2e300b37e6da1ddcfb651eb6d9c587/AGENTS.md).
- FastAPI at `6e659e84de09ee06e0499141f7f4951f478ddbac`:
  [package metadata](https://github.com/fastapi/fastapi/blob/6e659e84de09ee06e0499141f7f4951f478ddbac/pyproject.toml),
  [redistribution tests](https://github.com/fastapi/fastapi/blob/6e659e84de09ee06e0499141f7f4951f478ddbac/.github/workflows/test-redistribute.yml),
  [PyPI publication](https://github.com/fastapi/fastapi/blob/6e659e84de09ee06e0499141f7f4951f478ddbac/.github/workflows/publish.yml).
- Astro docs at `4abc350573df78da1c85c06138f645831caa3984`:
  [preview workflow](https://github.com/withastro/docs/blob/4abc350573df78da1c85c06138f645831caa3984/.github/workflows/deploy-preview.yml),
  [Wrangler configuration](https://github.com/withastro/docs/blob/4abc350573df78da1c85c06138f645831caa3984/wrangler.jsonc).

## Interpreting results

GitHub CLI and Astro now require supported setup patches for the requested
executable and rendered preview. Their previous boundary-only criteria are
obsolete. FastAPI remains a boundary case: selected files can carry a candidate
wheel or sdist, but automatic Python installation is still unavailable. It accepts
explicit consumer-side steps or an actionable handoff for missing support. None
of the cases accepts invented Gauge fields, silent substitution of a release,
or calling a docs-source test equivalent to testing the requested product surface.

`gauge evals verify` provides offline working-tree evidence, not proof of actual
CI output, live delivery, sandbox execution, or account activation. Judge the
agent's feasible validation and accurate handoff; unavailable external access is
not itself a setup failure. Preserve the distinction between a local setup patch
and end-to-end execution with that patch.

The shared public-fixture persona supplies only the workspace (`gauge-x6af`),
local-experiment authorization, and scope/access facts. It does not supply a
support verdict or solution. The prompts identify the desired product surface
without revealing the expected implementation or limitation. The existing
alg-specific persona and regression remain unchanged.

Read the transcript and any linked-worktree patch before attributing a failure
to the Skill. Separate unsupported-product behavior, misleading instructions,
agent errors, invented persona constraints, unavailable tools/network, and
fixture/preparation failures. Record model, sample count, criterion evidence,
and session link. One sample per target is exploratory; confirm consequential
findings with repeated samples or a frontier model before generalizing.

## Next measurement

Before pushing an eligible update or explicitly rerunning this suite, confirm the
rollout is ready: the CLI customers install exposes `gauge evals verify`, the
published v2.4.0 schemas are available, and the control plane and execution path
support binary inputs and public previews. The candidate Skill must remain
selected when the CLI installs. Separately confirm the native-question answer
fix is deployed; two prior sessions stopped on invalid persona answers.

The last pre-#1595 suite at `96832b7` reported
[6/9 sessions passing](https://github.com/gauge-sh/gauge-skills/pull/2#issuecomment-6005590376).
The GitHub CLI/DeepSeek run switched to docs instead of the executable. GitHub
CLI/GLM and Vite/GLM terminated on invalid persona answers. The earlier
[original-versus-candidate comparison](https://agents.withgauge.com/gauge-x6af/agent-experience/cmuvwfiv0000101jetez6yqnq/optimizations/cmuvwfoen000001jaqkcptga1)
was confounded by an invented user restriction; no winner was adopted.

The first post-rollout nine-session run is a new regression measurement. Because
the product and two rubrics changed, its pooled score is not a before/after Skill
lift. For a clean comparison, freeze these revised prompts, criteria, fixture
SHAs, personas, CLI/product version, and target roster; vary only the original
versus candidate Skill bundle. Report per-case results and sample counts, and
repeat consequential differences before claiming improvement. Keep the existing
nine-session regression roster separate from any additionally authorized
comparison or confirmation runs.

Case notes live here rather than under `gauge-evals/`: the default discovery glob
would otherwise interpret a README there as an eval case. The cases' criteria
and these notes are not staged into the consumer fixture as Skill instructions.
