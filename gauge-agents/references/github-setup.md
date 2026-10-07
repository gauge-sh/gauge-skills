# Set up Gauge PR checks

Produce a reviewable repository change that lets Gauge consume the product surfaces
changed by a PR. Gauge consumes artifacts from the customer's CI; it does not build
the product. A dedicated Gauge workflow is optional.

## Inspect and choose the input

Read the repository's package manifests, build/release workflows, docs provider
configuration, Skill directories, and existing `gauge.json`. Identify the surface
the user wants tested; ask only when repository context does not establish it.
Use the real Gauge workspace slug from configuration, authenticated org discovery,
or the user. Do not invent a slug or assume the GitHub organization name matches.

| Surface | Input | Existing infrastructure to use |
| --- | --- | --- |
| npm CLI | `npm-package`, `install: "environment"` | PR build producing one packed npm `.tgz` with valid `bin` entries |
| npm library | `npm-package`, `install: "workspace"` | Packed package installed in a consumer application |
| Native CLI | `binary`, `platform: "linux-x64"` | Unpacked Linux x86-64 ELF executable and companion files from the PR build |
| Skill | `skill`, Git source | Committed directory with `SKILL.md` at its root |
| Source documentation files | `files`, Git source | Committed paths/globs; this tests files, not the rendered site |
| Rendered docs site | `website`, deployment or PR-comment source | Existing public HTTPS PR preview with candidate commit identity |

Preserve the requested surface: testing documentation about a CLI does not test
the candidate executable. For Python distributions, `files` can deliver candidate
wheels or sdists, but Gauge has no automatic Python package installer. Describe
the required consumer-side installation and remaining verification explicitly;
do not substitute a registry release for the candidate or invent input types.

The Gauge GitHub App must be installed for the workspace and granted access to this
repository, including newly selected repositories. Check that prerequisite when
access is available; otherwise make the required installation/access step explicit.
A local configuration file cannot grant App access. In Gauge’s Settings → GitHub,
verify repository checks are enabled for the intended PR **base** branches. These
controls are separate from `gauge.json` and GitHub branch protection.

## Author `gauge.json`

The v2 format uses root `org` to enable same-repository PR checks. It has no
`github.enabled` switch, build recipe, or root workflow setting. Preserve existing
inputs and cases. This example shows shapes; choose only relevant inputs and replace
all example values with repository facts:

```json
{
  "version": 2,
  "org": "actual-workspace-slug",
  "inputs": {
    "cli": {
      "type": "npm-package",
      "source": {
        "type": "github-actions",
        "workflow": ".github/workflows/build.yml",
        "artifact": "cli-package"
      },
      "path": "*.tgz",
      "install": "environment"
    },
    "skill": {
      "type": "skill",
      "source": { "type": "git" },
      "path": "skills/product"
    },
    "docs": {
      "type": "website",
      "source": { "type": "github-deployment", "environment": "staging" },
      "url": "https://docs.example.com"
    }
  }
}
```

`source.workflow` is the actual workflow file path, not its display name.
`source.artifact` selects an uploaded artifact name/pattern; `path` selects the
package inside it. Select exactly one `.tgz`. Omit the artifact name only if the
workflow produces exactly one artifact. A Git Skill path names the directory,
not the `SKILL.md` file; use `"."` for a root Skill.

Optional `checks.paths` globs filter relevant changes. Include source and build
configuration that affect the selected surface. Ensure CI's own path filters also
run for configuration and case changes that need a fresh candidate artifact.

The published config schema is
https://agents.withgauge.com/schemas/gauge/v2.4.0/gauge.json.
Associate it in an editor or validate against it externally; do not add `$schema`
to `gauge.json`, whose runtime schema is strict. Use current CLI help and the
published schema if repository examples disagree with these shapes.

## Reuse candidate CI

Prefer extending an existing suitable PR build with pack/upload steps. If the only
build publishes releases or needs release secrets, add a focused PR packaging job
or workflow without changing release behavior. Respect the repository's package
manager, lockfile, workspace dependencies, runtime, and build scripts.

For npm packages, the resulting path must:

- Run for the candidate PR revision. Checkout the PR head when compiling the
  candidate, for example `${{ github.event.pull_request.head.sha || github.sha }}`,
  instead of accidentally packaging GitHub's synthetic merge commit.
- Install dependencies and build the package before packing. Account for monorepo
  dependencies and generated files; a successful build in a developer's populated
  checkout does not prove a clean CI install works.
- Pack into a dedicated directory, then upload the `.tgz` with ordinary
  `actions/upload-artifact`. With v7 use `archive: true`, because Gauge downloads
  the ZIP artifact envelope. Set `if-no-files-found: error`.
- Keep artifact names and internal paths aligned with `gauge.json`, without
  requiring an npm publication or a Gauge API token in the workflow.

Gauge waits for a successful eligible workflow at the candidate SHA. An unrelated
revision, failed latest attempt, missing artifact, or expired artifact cannot prove
that this candidate is ready. Do not introduce privileged `pull_request_target`
execution of untrusted PR code to obtain secrets.

### Native commands

Use a `binary` input to expose a candidate native CLI on PATH. For example, this
input selects files from an uploaded artifact whose root contains `dist/`:

```json
{
  "type": "binary",
  "source": {
    "type": "github-actions",
    "workflow": ".github/workflows/package.yml",
    "artifact": "cli-linux"
  },
  "paths": ["dist/**"],
  "platform": "linux-x64",
  "commands": { "product": "dist/bin/product" }
}
```

Build the exact PR head using the repository's toolchain, then upload already
unpacked files using the same Actions artifact envelope as above. Match `paths`
and each command's explicit relative path to the uploaded artifact layout, not
just the build checkout. Include runtime companion files in the selection. Gauge
validates ELF headers, restores executable permissions, preserves the bundle,
and exposes declared commands on PATH, including login shells. `GAUGE_INPUTS`
identifies the preserved bundle location.

Gauge does not unpack nested release archives, install OS dependencies, change
library search paths, or run arbitrary installers. Use a static binary or one
compatible with the consumer Linux runtime; header checks cannot prove loader or
shared-library compatibility. Scripts, macOS, Windows, and ARM executables are
unsupported. Smoke-test the built executable in a compatible environment when
feasible and report missing tooling or libraries accurately.

A candidate command overrides an installed product command with the same name.
Inputs selected by one case must not expose colliding commands, including npm
environment inputs. Harness/runtime commands such as `node`, `python`, and `git`
are reserved; use a different alias when testing such a product.

### Rendered previews

Use `website.url` for the canonical HTTPS docs origin without a path. Gauge routes
that origin to the candidate preview; source-file delivery does not reproduce
the rendered site. Public HTTPS preview origins from Cloudflare, Vercel, Mintlify,
and other providers use the same admission rules. Private/authenticated previews
and preview URLs with path prefixes are unsupported. Preview content is fetched
live and may change or expire; it is not snapshotted.

Inspect how the repository already reports previews:

- With `github-deployment`, set the actual deployment `environment`. Gauge
  resolves a successful deployment for the exact candidate SHA and reads its
  status's `environment_url`. A workflow display name is not an environment.
- With `github-pr-comment`, use the exact bot `author`, a literal `bodyIncludes`
  marker identifying its preview comment, and a JavaScript regex `pattern`
  matching readiness with named `url` and `sha` captures. The SHA must identify
  the candidate (7–40 hex characters; short SHAs must resolve unambiguously).
  Read the workflow's comment template or an actual comment before configuring
  these fields. Timestamps or a branch alias alone do not identify the candidate.

For example, a provider comment headed `Preview deployment` with a ready line
`Preview ready: <url> Commit: <sha>` could use this source; replace the author and
format with repository evidence:

```json
{
  "type": "github-pr-comment",
  "author": "preview-bot[bot]",
  "bodyIncludes": "Preview deployment",
  "pattern": "Preview ready: (?<url>https://[^\\s]+) Commit: (?<sha>[a-f0-9]{40})"
}
```

Use an identity marker shared by ready, pending, and failed comments when the
provider has one. Gauge selects the newest matching author/marker comment on a
unique open same-repository PR at the candidate head, then extracts readiness.
It will not fall back to an older success if the selected comment is pending or
stale. Optional `failureIncludes` identifies failure text; it is terminal only
with the full candidate SHA in the comment. Test the regex against the provider's
ready, pending, and failed formats and check that the extracted SHA is current.
If existing comments lack commit identity, report that missing prerequisite or
use an available deployment source. No new workflow, provider migration, or
provider token is needed when existing candidate-specific evidence is usable.

## Verify and hand off

Before committing, run `gauge evals verify -o json`. It reads the working tree,
including non-ignored untracked files, without login, network access, a PR, or
paid sessions. Review global and per-input checks: `no` is a definite problem;
`unknown` is a specific static question it could not resolve. Exit 1 means a
definite failure; exit 0 can still contain unknowns. Resolve failures and explain
remaining unknowns. Zero cases is informational and valid for setup-only work.
If the installed CLI lacks `verify`, update it while preserving the selected
Skill (`GAUGE_SKIP_SKILL_INSTALL=1 npm install -g @withgauge/cli`).

Static verification checks config, case references, selected Git paths, and
recognizable workflow declarations. It does not execute workflows or prove
artifact contents, live preview delivery, sandbox execution, or App activation.
For an npm CLI, reproduce the relevant CI build from a clean dependency state,
inspect the packed files, install the tarball in a separate consumer directory,
and invoke its declared command (such as help). For a library, verify consumption
in another app. Use these checks to catch missing bundled files or dependencies;
report actual environment blockers rather than treating static success as proof
of installation.

If cases exist, `gauge evals plan` previews committed definitions without launching
sessions. It reads Git HEAD, not uncommitted edits. Preserve the user's chosen
evaluation scope: setup-only requests can leave cases absent, and the App reports
**No evals configured** as a skipped check without spending credits. The explicit
CLI plan/run path still rejects an empty case selection; that is not evidence the
App setup is broken. Do not add dummy evals merely to make this command pass.

When authorized access is available, open the setup PR and inspect the actual
candidate's CI artifact or docs deployment and Gauge check. Otherwise leave a
reviewable patch and name the missing external step. Report separately what local
validation, CI, and Gauge each proved. A skipped empty-state check verifies the App
integration; artifact staging and agent execution remain unproven until a real eval
uses those inputs. Launch paid evals only within the user's authorized scope.
