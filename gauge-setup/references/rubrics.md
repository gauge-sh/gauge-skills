# Writing, triaging, and maintaining criteria

Criteria are the expensive part of agent-experience evals: easy to write badly,
slow to keep correct. Aim for few, observable, independent criteria that accept
any correct approach.

## The eval prompt

- Write what a real developer would type, in one or two sentences: the goal and
  the stack. "Set up <Product> in this Next.js app so page views are recorded."
- Do not name the API, function, flag, or concept the docs teach. If the agent
  only succeeds when the prompt names it, the docs did not help.
- Do not add requirements just to make grading easier (file names, exact
  commands, UI clicks). Hidden requirements in criteria that the prompt does not
  ask for make the eval unfair.
- Keep a one-line note, outside the prompt, of what the prompt leaves out on
  purpose, so the next editor does not "fix" it.

## Good criteria

Each criterion is `{"name": "...", "rubric": "..."}`. Two to five per eval.

- **Observable.** Graded from files, command output, or the transcript:
  "package.json lists `<package>`", "the app starts and the first event is
  sent", "the API key is read from an environment variable, not hard-coded".
- **Grounded in the docs.** Name the exact package, option, or step the docs
  give. The judge does not read your docs; the rubric must carry the fact.
- **Independent.** One failure should fail one criterion, not three.
- **Approach-neutral.** Accept equivalent supported approaches. "Uses a
  supported SDK for this runtime" beats "calls `init()` in `main.ts`".
- **Tests what the docs add.** Prefer checks an agent working from memory would
  miss: a required option, a newer API, a step marked required.
- **Stable names.** Keep criterion names fixed (`sdk-installed`,
  `key-from-env`, `project-builds`) so results compare across runs. Edit rubric text in
  place with `gauge eval edit <id> --criteria-file criteria.json`, including each
  criterion's `id` from `gauge eval get <id> -o json`; a list without ids
  replaces the whole set.

Overfit signs: more than about six criteria, criteria that restate the docs page
line by line, exact file paths or line numbers, or a rubric only one specific
implementation can satisfy. Split a long eval into two tasks instead.

## Shared criteria

Keep a short library of criteria that many evals reuse, with fixed names and
text, for example:

| Name | Rubric |
| --- | --- |
| `project-builds` | After the change, the project installs and builds (or starts) without errors. |
| `key-from-env` | Credentials are read from environment variables or a secrets mechanism; no key is hard-coded. |
| `verified` | The agent ran the code or a command that shows the integration works, and reported the result. |
| `no-unrequested-changes` | The agent did not remove or rewrite unrelated existing functionality. |

Copy the exact text into each eval. When a shared rubric changes, change every
copy in the same edit and say so in the change description, because it breaks
comparison with earlier runs.

To see which docs pages agents found on their own, read `gauge run web <run-id>`
rather than adding a criterion for it; it lists the URLs and searches directly.

## Triage: why did this fail?

Read `gauge run insight <run-id>`, the criterion reasoning, and the trace
(`gauge run trace`, `gauge run web`, `gauge run commands`) before deciding.

| Verdict | Signs | Action |
| --- | --- | --- |
| Docs or product problem | Several agents or samples fail the same way; the trace shows the agent following the docs, an outdated example, a missing step, a confusing error message, or no page answering its question | Report it with the page or message to change. This is the useful finding. |
| Agent miss | One agent or one sample fails; others pass with the same inputs; the docs it read were correct | Note it; do not change docs for it. Rerun only if the decision depends on it. |
| Bad criterion | The judge's reasoning shows the rubric demanded something the prompt did not ask for, was ambiguous, or failed a correct alternative approach; or a clearly broken result passed | Fix the rubric, then `gauge run regrade <run-id>` to re-judge without a new session. Disclose that the criterion changed. |
| Setup or platform failure | Result is `EXECUTION_FAILED`, `INPUT_FAILED`, `JUDGE_FAILED`, or `INCOMPLETE`; a missing credential or connection; setup script errors; the agent never reached the task | Not a product finding. Fix the setup, or report the error verbatim with `gauge feedback`. Do not speculate about the cause. |

A preference session where the agent picks a competitor is a measured result,
not a failure. Read its objection (`gauge issues list --type objection`) to see
why.

## Maintenance

- After a docs or product change ships, rerun the evals that covered it. If an
  issue no longer appears, mark it with `gauge issues fix <id>`; it reopens if
  agents hit it again.
- When an eval passes every time on every agent for several weeks, either make
  it harder (a less common stack, a persona without credentials) or run it less
  often.
- When an eval fails every time for a reason you have accepted, move it out of
  the regular set rather than letting it hide new failures.
- For an upcoming release, write the eval before the docs change and expect it
  to fail until the docs land. Keep such evals apart from the regular set and
  report "now passing" as the signal that the docs are ready.
