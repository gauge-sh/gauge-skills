# PR setup evals

## Manual CLI 0.25.0 skill pilot (2026-10-27)

This pilot tests the published CLI with the skill from `37c96ef`, then changes only
the skill. It is separate from the automatic PR suite below. The installed CLI
initially reported 0.25.0 but differed from npm's release. After reinstalling
`@withgauge/cli@0.25.0` from the public registry, all 17 package files matched the
downloaded tarball. The same verified tarball was attached to every session.

The three cases in `gauge-cases/cli-025/` cover a saved local eval, a local
canonical-URL web fixture, and a small npm CLI's PR-check setup. Each requests
setup and feasible validation, with no nested session launches. Local cases use
OpenCode / DeepSeek V4.1 Flash; PR setup uses OpenCode / GLM 5.3. Each has one
sample per skill variant. These are exploratory observations, not a pass-rate
estimate or broad model comparison. They do not test Gauge Chat or live nested
Docker execution, GitHub activation, or a real PR's artifact delivery.

Reproduce in a new directory outside a Git checkout:

```sh
python3 scripts/prepare-cli-pilot.py /path/to/new-pilot
cd /path/to/new-pilot
gauge run --verify --hosted -o json
gauge run --dry-run --hosted --org <your-org> -o json
# When session spending is authorized:
gauge run --hosted --org <your-org> --yes -o json
gauge run wait <request-id> --hosted --org <your-org> -o json
```

The preparation script verifies the npm tarball's SHA-512 against the published
release. `--tarball` reuses a download, and `--skill` selects a baseline skill
directory. It creates a standalone manifest and copies the three cases, avoiding
changes to this repository's PR discovery or automatic session count. A hosted
preview uploads the selected public inputs; static verification does not.

Requests and input digests:

| Variant | Request | Skill delivery archive SHA-256 |
| --- | --- | --- |
| Baseline, 3 sessions | `cmvqzqx1n000501j3zniz7dn6` | `2bf0b27ea9c121502447b5ec3be8ed2e2a3dd84fbb0d4e1c20b42fda1a96d230` |
| Command/routing revision, 3 sessions | `cmvqzuque000k01j3wx4m11r0` | `87510d7ecaae70281876d216cf5da80b7e46bb246f1916438275f4bf96b50582` |
| Added web-fixture example, 1 session | `cmvr00bvt000101kkyzzalxbm` | `9f79a333ead20884101738ec4793da5605dbe42aec1e7d34ca7a9846801bf093` |

The CLI delivery archive stayed
`07aa02426cca5dc909258da4a271f88f342d830d7519cfaeec698675d687a41d`.
That archive wraps the npm tarball; it is not the npm integrity digest. Preview
comparison confirmed identical prompts, criteria, model pins, and sample counts
for each matched case. The final revision adds a web-specific reference; only
the affected web case is rerun against that complete bundle.

All **7/7 sessions passed**: baseline 3/3, command/routing revision 3/3, and the
web-example follow-up 1/1. No execution or judging failures remained. This is a
friction improvement, not a measured pass-rate increase. The first revision's
pooled median duration worsened because its web case took longer; inspect the
matched task results below rather than claiming an overall timing win.

The web-fixture task passed in all three variants, but the traces distinguish
successful setup from avoidable work:

| Skill | Tool calls | Session duration | CLI bundle searches |
| --- | --- | --- | --- |
| [Baseline](https://agents.withgauge.com/gauge-x6af/runs/cmvqzr6q700150it67nx3zzus) | 36 | 167 s | Page schema and gateway-image command |
| [Command/routing revision](https://agents.withgauge.com/gauge-x6af/runs/cmvqzuwwn001d0it6nctn11r1) | 44 | 361 s | Schema, case fields, and gateway-image command |
| [Concrete fixture example](https://agents.withgauge.com/gauge-x6af/runs/cmvr00kgj003g0it6ryqd0ob0) | 23 | 119 s | None |

The final session read `references/web-fixtures.md` at trace event 9, wrote the
fixture at 51, and invoked static verification and dry-run at 64 and 68. The
baseline's schema/gateway bundle searches appear at 49, 109, 113, and 116.
`gauge run compare` with baseline batch `cmvqzr6q600140it6859y7klf` and final
request `cmvr00bvt000101kkyzzalxbm` confirmed the same eval revision
`505f1fb2b8aa`, both criteria passing, and a 48.7 s duration difference. These are
single observations, not a causal speedup estimate. Tool-call counts include all
harness tools; Gauge's one-turn metric hides this intra-turn work. The first
candidate's web run used execution attempt 2, another reason not to treat timing
as a controlled benchmark.

The reusable local-eval task passed in both the
[baseline](https://agents.withgauge.com/gauge-x6af/runs/cmvqzr6po00130it6jm1pfng2)
and [command/routing revision](https://agents.withgauge.com/gauge-x6af/runs/cmvqzuwwc001b0it6rt00prab).

For PR setup, the
[baseline](https://agents.withgauge.com/gauge-x6af/runs/cmvqzr6qk00170it6vq97598d)
tried `gauge evals --help` at event 31 and received the unknown-command error at
34. It then searched CLI internals and npm versions, treating the skill's stale
command as a newer feature missing from the released CLI. It eventually found
`gauge run --verify`, completed the task, and passed, but its final response still
called `evals verify` the newer command. This is observable skill-induced friction
despite a passing outcome.

The [revised PR session](https://agents.withgauge.com/gauge-x6af/runs/cmvqzuwwx001f0it6s9prqkni)
used current `gauge-cases/` discovery, default merge checkout, and
`gauge run --verify --hosted`. It used 48 tool calls versus 67 in the baseline,
without attempting `gauge evals`. It still searched bundle internals for schemas
and verifier behavior (events 58–94), so the revision did not eliminate all
discovery work. Both agents also had to override the sandbox scaffold's generic
`.NET bin/` ignore rule to retain the npm executable; that is environment friction.
The matched PR comparison reported both criteria passing and session duration
707 s → 579 s, with the same caveat about single samples. The remaining PR
analysis points to a missing compact criteria-case example, confusing `org`
versus `orgId` terminology, offline agent-name discovery, and uncertainty around
artifact upload formats. Those are follow-ups, not resolved by this patch.

Observed CLI follow-ups, separate from skill changes:

- `gauge run --verify --files ...` rejects file selection. Verification checks
  configured discovery, while preview and launch support `--files`.
- An ignored npm tarball was reported missing by static verification, although
  hosted preview packaged it successfully. The standalone pilot avoids this
  discrepancy by keeping its tarball outside ignored Git paths.
- The released CLI's saved organization required reselection after upgrade.
  Passing the discovered current organization with `--org gauge` worked.
- The local web-fixture dry-run did not name a gateway-image pull command;
  `gauge local runtime pull` obtains both required images.
- Local OpenCode credentials defaulted to a Codex login. This surprised agents
  and deserves clearer credential guidance rather than credential-file inspection.
- The staged Gauge CLI input itself distracted agents, which inspected its
  tarball before deciding it was setup tooling rather than the nested eval's
  product. This is a fixture limitation, not evidence against the skill alone.
- One hosted `run get --logs` reader remained alive after emitting its snapshot,
  despite help promising to print events and exit. Later snapshots used a bounded
  command timeout; the remaining reader was stopped after sessions completed.

The skill revisions replace obsolete `evals`/`run-requests` instructions, correct
case discovery and working-tree preview behavior, retain current CI checkout
semantics, route reusable local measurements to the CLI's current guidance, and
provide a concrete canonical-URL fixture example. Static skill validation, the
existing suite's hosted-capability verification, the standalone pilot, and the
web-fixture example all passed. The helper accepted the published tarball and
rejected non-release bytes.

## Existing PR suite

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

Each case also watches `gauge-agents/**` through `config.checks.paths`. On eligible
automatic updates, changes confined to `gauge-chat`, the root README, or these
notes do not select the setup cases. A change to a case selects that case, and
`gauge.json` changes select all cases. Failed or unfinished previous evaluations
and unavailable comparisons run conservatively; explicit GitHub reruns select
the full suite. Input selection alone does not make a case conditional.

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

The shared public-fixture persona supplies only the organization (`gauge`),
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

The suite at `2847660` finished **7/9 passing**. Both failures were Astro docs
(`accounts/fireworks/models/deepseek-v4p1-flash` and `z-ai/glm-5.3`), each with
2/3 criteria passing. Their patches correctly configured canonical-origin
routing and candidate-specific preview discovery; both passed validation and
activation handoff. The rendered-docs criterion failed solely because their
final responses did not repeat the public-origin/live-not-snapshot caveats.
Evidence: [DeepSeek session](https://agents.withgauge.com/gauge-x6af/runs/cmuxh5muq000n0iuqzzp0sjs5)
and [GLM session](https://agents.withgauge.com/gauge-x6af/runs/cmuxh5muq000o0iuq51jdpqu9).
Both sessions installed CLI 0.14.0, then the latest release, and used external
schema/regex validation because `gauge evals verify` was unavailable.

The revised rendered-docs criterion keeps the functional requirements and
rejects unsupported previews, false snapshot claims, and undisclosed blockers.
It no longer requires a generic caveat recital for an otherwise correct setup.
The other criteria, prompts, pinned fixtures, personas, models, samples, inputs,
and candidate Skill are unchanged. CLI 0.16.0 is now npm latest, and alg #1600
and #1604 are deployed, including detailed failure comments. This authorized
rerun is still nine sessions. Record the CLI version actually used in each
session; a latest-version install is not a pinned experimental control.

Because the rubric and available CLI changed, the rerun is a new regression
measurement, not evidence of Skill improvement. Preserve the earlier results
rather than retroactively regrading them to establish a better baseline.

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
