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
| Skill | `skill`, Git source | Committed directory with `SKILL.md` at its root |
| Source documentation files | `files`, Git source | Committed paths/globs; this tests files, not the rendered site |
| Rendered docs site | `website`, deployment source | Existing supported public Mintlify PR preview |

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

For website inputs, `url` is the canonical HTTPS docs origin without a path.
The environment must match the provider's GitHub Deployment. Gauge resolves a
successful deployment for the exact candidate SHA and reads its status's
`environment_url`. The supported adapter accepts public Mintlify preview origins;
a production custom domain, private preview, or another provider is not a substitute.
No separate Actions build is needed for this input.

Optional `checks.paths` globs filter relevant changes. Include source and build
configuration that affect the selected surface. Ensure CI's own path filters also
run for configuration and case changes that need a fresh candidate artifact.

The published config schema is
https://agents.withgauge.com/schemas/gauge/v2.2.0/gauge.json.
Associate it in an editor or validate against it externally; do not add `$schema`
to `gauge.json`, whose runtime schema is strict. Use current CLI help and the
published schema if repository examples disagree with these shapes.

## Reuse CI for npm packages

Prefer extending an existing suitable PR build with pack/upload steps. If the only
build publishes releases or needs release secrets, add a focused PR packaging job
or workflow without changing release behavior. Respect the repository's package
manager, lockfile, workspace dependencies, runtime, and build scripts.

The resulting path must:

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

## Verify and hand off

Validate the config shape and selected paths. For a CLI, reproduce the relevant CI
build from a clean dependency state, inspect the packed files, install the tarball
in a separate consumer directory, and invoke its declared command (such as help).
Use that evidence to catch missing bundled files or dependencies.

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
