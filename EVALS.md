# PR setup evals

The learning goal is to find where the candidate `gauge-agents` Skill fails to
help an agent set up a realistic repository, recognize a support boundary, or
offer a useful alternative. The Skill is held fixed while this coverage is
added. A passing example is not evidence of a pass-rate improvement.

## Coverage

| Case | Starting repository | What it tests |
| --- | --- | --- |
| [Existing CLI](gauge-evals/pr-setup-cli.md) | `gauge-sh/alg`, before Gauge setup | Existing supported npm CLI regression; one Codex/GPT-6.1 Sol sample. |
| [Vite](gauge-evals/pr-setup-vite.md) | `vitejs/vite` | Supported pnpm monorepo; select the consumer package, build it, and make a candidate tarball available to another app. Avoid mistaking pkg-pr-new publication for an Actions artifact. |
| [GitHub CLI](gauge-evals/pr-setup-github-cli.md) | `cli/cli` | Native Go executable and release archives; no first-class native auto-installer. Recognize the boundary and give a candidate-preserving fallback. |
| [FastAPI](gauge-evals/pr-setup-fastapi.md) | `fastapi/fastapi` | Python wheel/sdist consumer delivery; distinguish file transport from automatic Python installation. |
| [Astro docs](gauge-evals/pr-setup-astro-docs.md) | `withastro/docs` | Cloudflare previews outside the current Mintlify website adapter; explain what source/static-file alternatives cannot measure. |

The four new cases each run **one sample on two OpenCode targets**:
`accounts/fireworks/models/deepseek-v4p1-flash` and `z-ai/glm-5.3`.
This is eight exploratory sessions plus the existing Codex regression: **nine
sessions per eligible PR update or explicit rerun**. Each new case has three
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

The three boundary cases do not require an impossible automatic integration.
They accept supported file transport plus explicit consumer-side steps, or an
actionable handoff where the requested outcome remains unavailable. They reject
invented Gauge fields, silent substitution of a released package, and calling a
docs-source test equivalent to a rendered-preview test. A correct refusal with
no useful next step does not satisfy the fallback criterion.

The shared public-fixture persona supplies only the workspace (`gauge-x6af`),
local-experiment authorization, and scope/access facts. It does not supply a
support verdict or solution. The prompts identify the desired product surface
without revealing the expected limitation. The existing alg-specific persona
and regression remain unchanged.

Read the transcript and any linked-worktree patch before attributing a failure
to the Skill. Separate unsupported-product behavior, misleading instructions,
agent errors, invented persona constraints, unavailable tools/network, and
fixture/preparation failures. Record model, sample count, criterion evidence,
and session link. One sample per target is exploratory; confirm consequential
findings with repeated samples or a frontier model before generalizing.

Case notes live here rather than under `gauge-evals/`: the default discovery glob
would otherwise interpret a README there as an eval case. The cases' criteria
and these notes are not staged into the consumer fixture as Skill instructions.
