# Agent Experience evals

An eval gives an agent a task a developer would give it, then judges the result
against a few checks. Its main finding is **friction**: where the agent
struggled, guessed, retried, or read the wrong page, whether or not it passed.
The pass or fail result matters, but friction is what points to the docs page,
error message, or tool description to change.

Evals run when something the team owns changes, not on a timer: after a docs
rewrite, an SDK release, a renamed CLI flag, a new MCP tool description. So
every eval records which surfaces it covers.

## Choosing the task

Each eval is one theme from the evidence: a task developers actually attempt.
Good tasks come from the docs pages agents read most, MCP tools that fail most,
the setup questions people ask in support and GitHub issues, and the
integration steps customers describe in calls. The documented first task (the
quickstart) is a good first eval when nothing else stands out, but it should
not be the only one.

Some tasks end outside the sandbox: real DNS changes, a live API key, a real
email delivered, a dashboard click. Do not drop a strong theme for that reason.
Test up to the boundary and check the handoff: the agent does every step it
can (adds the domain through the SDK, reads the key from an environment
variable) and tells the user exactly what remains (the DNS records to add, where
to get the key). Friction before the boundary is still friction the docs can
fix.

## The eval prompt

- Write what a real developer would type, in one or two sentences: the goal and
  the stack. "Set up <Product> in this Next.js app so page views are recorded."
- Name the product, not the steps. Do not name the API, function, flag, or
  concept the docs teach. If the agent only succeeds when the prompt names it,
  the docs did not help.
- Do not add requirements just to make grading easier (file names, exact
  commands, UI clicks). Requirements in the checks that the prompt does not ask
  for make the eval unfair.
- Keep a one-line note, outside the prompt, of what the prompt leaves out on
  purpose, so the next editor does not "fix" it.

## Surfaces it covers

Record the owned surfaces the task exercises, as paths in the repository where
possible:

```
Covers: docs/webhooks/**, packages/node/src/webhooks/**, the `verify` MCP tool
```

This is what decides which evals to rerun when something changes. With PR
checks, these paths become the eval's `config.checks.paths`, so a pull request
that touches the webhooks docs runs the webhooks eval and nothing else.

## Good checks

Each check is `{"name": "...", "rubric": "..."}`. Two to four per eval.

- **Observable.** Graded from files, command output, or the transcript:
  "package.json lists `<package>`", "the app starts and the first event is
  sent", "the API key is read from an environment variable, not hard-coded".
- **Grounded in the docs.** Name the exact package, option, or step the docs
  give. The judge does not read your docs; the rubric must carry the fact.
- **Independent.** One failure should fail one check, not three.
- **Approach-neutral.** Accept equivalent supported approaches. "Uses a
  supported SDK for this runtime" beats "calls `init()` in `main.ts`".
- **Tests what the docs add.** Prefer checks an agent working from memory would
  miss: a required option, a newer API, a step marked required.
- **Stable names.** Keep check names fixed (`sdk-installed`, `key-from-env`,
  `project-builds`) so results compare across runs. Edit rubric text in place
  with `gauge eval edit <id> --criteria-file criteria.json --hosted`, including
  each check's `id` from `gauge eval get <id> --hosted -o json`; a list without
  ids replaces the whole set.

Overfit signs: more than about six checks, checks that restate the docs page
line by line, exact file paths or line numbers, or a rubric only one specific
implementation can satisfy. Split a long eval into two tasks instead.

Shared checks many evals reuse, with fixed names and text:

| Name | Rubric |
| --- | --- |
| `project-builds` | After the change, the project installs and builds (or starts) without errors. |
| `key-from-env` | Credentials are read from environment variables or a secrets mechanism; no key is hard-coded. |
| `verified` | The agent ran the code or a command that shows the integration works, and reported the result. |
| `no-unrequested-changes` | The agent did not remove or rewrite unrelated existing functionality. |

Do not add a check for which docs pages the agent read; `gauge run web <run-id>
--hosted` lists every URL it fetched and every search.

## The check run: is this eval worth keeping?

Run each eval once per agent. Read the friction (`gauge issues list --type
friction --hosted -o json`, `gauge run insight <run-id> --hosted -o json`), the
check results, and for anything surprising the trace (`gauge run trace`,
`gauge run web`, `gauge run commands`). Then sort the eval:

| What you see | Action |
| --- | --- |
| Friction tied to something the team owns: an outdated example, a missing step, a confusing error, no page answering the agent's question, a misleading tool description. With or without a failed check. | Keep. Report the surface and the edit. This is what the eval is for. |
| Passes cleanly on every agent with little friction | Keep as a regression check that reruns when its surfaces change. Do not drop it, and do not schedule it. |
| A check failed a correct approach, demanded something the prompt did not ask, or passed a clearly broken result | Fix the rubric and re-judge without a new session: `gauge run regrade <run-id> --hosted`. Say the check changed. |
| One agent failed where others passed with the same inputs, and the docs it read were correct | An agent miss. Note it; do not change docs for it. |
| `EXECUTION_FAILED`, `INPUT_FAILED`, `JUDGE_FAILED`, or `INCOMPLETE`; a missing credential; setup script errors; the agent never reached the task | Not a product finding. Fix the setup or drop the eval; report the error verbatim with `gauge feedback`. Do not speculate about the cause. |

One session per agent shows friction well enough to act on. Before claiming a
change worked, rerun with two sessions per agent on each side.

## After a change ships

- Rerun the evals that cover the changed surface, with the same agents, and
  compare with the run before the change (`gauge run compare`).
- `gauge issues recheck <issue-id> --hosted` previews rerunning the past
  sessions that showed an issue; `--confirm` launches them. If the issue no
  longer appears, mark it with `gauge issues fix <id> --hosted`; it reopens if
  agents hit it again.
- For a change that is not shipped yet, write the eval first and expect it to
  fail until the change lands; "now passing" says the change is ready.
- A regular schedule is only worth it to catch changes on the agents' side
  (new model releases) for the most important task, and then monthly at most.
  Confirm that cost separately.
