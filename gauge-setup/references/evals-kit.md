# Evals as files in the repository

Use this when the team wants agent-experience evals that live beside the
product and docs, change in the same pull request, and run on a schedule or
before shipping. It uses Gauge's own case-file format, so the Gauge CLI
validates, previews, and launches the files directly. The runner only adds
selection, budgeting, one confirmation, and a short summary.

## Layout

```
gauge.json                          inputs the cases receive (docs, package, skill, preview)
gauge-cases/
  smoke/<mirror of source path>.<check>.md   cheap; scheduled and before shipping
  deep/<mirror of source path>.<check>.md    costlier; on request
  pending/<mirror of source path>.<check>.md written before a change; expected to fail until it ships
gauge-kit/
  gauge-kit.mjs                     the runner (copy from this skill's assets/)
  kit.json                          {"creditsPerSession": null, "rotationDays": 14}
  rubrics.md                        the shared criteria library (see rubrics.md)
  README.md                         how to add an eval and run the kit
.github/workflows/gauge-evals.yml   optional schedule (copy from assets/)
GAUGE.md                            shared context (see context-file.md)
```

Mirror paths keep each eval next to what it tests without putting extra files
inside the docs tree, where a docs generator could publish them. The eval for
`docs/install/react.mdx` is `gauge-cases/smoke/docs/install/react.install.md`;
`--changed` uses that mapping to find the evals for a changed page. Keep every
non-case file out of `gauge-cases/`: every `.md` file there is parsed as a case.

Add `gauge-kit/last-results.*` to `.gitignore`. Keep `.gauge/` ignored; it is
private local state.

## gauge.json

Start minimal and add only inputs the cases need. Run `gauge run --help` and
`gauge instructions run` for current input types.

```json
{
  "version": 2,
  "inputs": {
    "docs": {
      "type": "files",
      "source": { "type": "git" },
      "paths": ["docs/**/*.md", "docs/**/*.mdx"]
    }
  }
}
```

Notes:

- With no `orgId` in `gauge.json`, Gauge does not run these cases as pull-request
  checks; the runner and the scheduled workflow choose the org with
  `GAUGE_ORG` or the API key. Add `orgId` (via `gauge orgs use <slug> --project`)
  only if the team wants automatic PR checks and accepts their cost.
- Everything a `files` input matches, and the repository URL, is sent to Gauge.
  Point it only at paths the team is happy to share; leave internal or
  unreleased docs out unless the user has approved sending them.
- A `files` input hands the docs to the agent as files. That tests whether the
  docs content works, not whether agents find the docs on their own. For
  discovery, give the case no docs input and let the agent search; for a
  rendered preview, use a `website` input (hosted, needs the Gauge GitHub App).
- Other inputs: `npm-package` (a packed `.tgz` from CI or a local path),
  `binary`, `skill`, `web-fixture`. The `gauge-agents` skill's GitHub setup
  reference covers them.

## A case file

Front matter holds exactly one of `criteria` or `preference`, plus `config`.
The body is the user's request. Criteria never reach the coding agent.

```markdown
---
criteria:
  - name: sdk-installed
    rubric: The app's package manifest lists the product's JavaScript SDK package.
  - name: key-from-env
    rubric: The API key is read from an environment variable; no key is hard-coded.
  - name: first-event
    rubric: The agent ran the app or a script and showed one event reaching the product, or explained exactly what blocked it.
  - name: builds
    rubric: After the change, the project installs and builds without errors.
config:
  agents:
    - agent: CLAUDE_CODE
    - agent: CODEX_CLI
  sampleCount: 1
  repoUrl: https://github.com/<org>/<public-starter-repo>
  inputs: []
---
Set up <Product> in this React app so we can see page views.
```

- Keep the check's purpose and what the prompt leaves out on purpose in
  `gauge-kit/README.md` or a comment in the pull request, not in the body (the
  body is sent to the agent).
- `config.persona` can define a persona inline (`name`, `description`), or
  `profileId` can reference one from `gauge personas list`.
- `inputs: []` runs without docs (discovery baseline); `inputs: [docs]` hands
  over the docs. Two cases with the same prompt and criteria that differ only in
  inputs compare directly.
- Preference cases use `preference: {kind: open-ended}` or `{kind: head-to-head,
  brandA, brandB}` instead of `criteria`. They measure choices; they do not
  enter the org's tracked rankings. For tracking over time, use saved
  preference prompts ([after-first-result.md](after-first-result.md)).

Validate after every edit (no login, no cost):

```sh
node gauge-kit/gauge-kit.mjs verify        # wraps gauge run --verify --hosted -o json
```

## Running

```sh
node gauge-kit/gauge-kit.mjs list --suite smoke
node gauge-kit/gauge-kit.mjs plan --suite all --max-sessions 40   # free preview of session counts
node gauge-kit/gauge-kit.mjs run --changed origin/main            # asks before launching
node gauge-kit/gauge-kit.mjs results                              # wait for and summarize the last run
```

The runner previews with `gauge run --hosted --dry-run`, asks once, launches one
request per case with `gauge run --hosted --files <case> --yes`, waits with
`gauge run wait <request> --hosted --check -o json`, and writes a table to
`gauge-kit/last-results.md` (and the GitHub job summary when present).

## Budget

- Measure cost once: after the first run, read `creditsCharged` from
  `gauge run get <run-id> -o json` for a few sessions, or `gauge usage`, and put
  the average in `gauge-kit/kit.json` as `creditsPerSession`. Then `--budget
  <credits>` works; until then use `--max-sessions`.
- Monthly budget / runs per month = budget per run. When the selected cases
  exceed it, the runner takes a rotating subset so every case runs over
  successive periods (`rotationDays`).
- Scheduled runs use `smoke` only. Run `deep` before a launch or on request.

## Scheduled workflow

Copy `assets/gauge-evals.yml` to `.github/workflows/`. It installs a pinned CLI,
authenticates with the `GAUGE_API_TOKEN` secret (an organization API key with
read & write access, created in the Gauge web app), runs the smoke suite under a
session cap, and posts the summary to the job page. The user creates the secret;
never print or commit the key.

## Before you ship

Run the evals that cover a change against the candidate and the current version,
then compare. Keep prompts, criteria, agents, and samples identical between the
two sides; use 2 or 3 samples per agent so a difference means something.

Docs delivered as files:

```sh
# current version: export the base branch's docs to a scratch folder, outside the repo
base=$(mktemp -d) && git archive origin/main docs | tar -x -C "$base"
gauge run --hosted --files <case paths> --input docs="$base/docs/**/*.md" --yes -o json   # baseline request
gauge run --hosted --files <case paths> --input docs --yes -o json                                 # candidate (working tree)
gauge run wait <request> --hosted -o json      # for each
gauge run compare --hosted --baseline request=<baseline-id> --candidate request=<candidate-id>
```

A packed package: the same, with `--input <name>=./path/to/package.tgz` for the
candidate and the published version (or the base branch's build) for the
baseline. A rendered docs preview: use a `website` input; Gauge resolves the
preview for the commit, which needs the Gauge GitHub App on the repository.

Report:

```
Change: <PR or branch>   Evals: <n>   Sessions: <baseline n / candidate n>
Better: <criteria or cases that now pass more often, with counts>
Worse:  <anything that regressed, with a session link>
Same:   <the rest>
Verdict: ship / fix first / no measurable difference at this sample size
```

Small samples rarely prove a difference. Say "no measurable difference" when
that is the honest answer, and say what a larger run would cost.

Cases in `pending/` are the test-first version of this: written before the docs
change, expected to fail, and reported as "ready" once they pass.
