# After the first finding

Offer these only after the user has seen a first result, and do only what they
pick. Anything that launches sessions or puts measurements on a schedule spends
credits: show the session count and cost, and get approval for that step.

## Check a fix

When a finding names a docs page, README section, error message, or package
metadata, make the edit the user agrees to, then rerun only the eval or prompt
that showed the problem, with the same agents:

```sh
gauge run --hosted --eval <id> --samples 2 --yes -o json
gauge run compare --hosted --baseline request=<before-request-id> --candidate request=<after-request-id>
```

Two samples per agent on each side makes a difference more believable; one
sample is still only a signal. If the fix is to a docs site that is not
deployed yet, use the before-you-ship flow in [evals-kit.md](evals-kit.md).
When an issue no longer shows up, mark it fixed with
`gauge issues fix <id> --hosted`; it reopens if agents hit it again.

## Track agent choice on a schedule

Put the prompts that produced a useful signal on Gauge's schedule. The schedule
and its agent list are shared by the whole org, and `--agent` replaces the
list, so show the current setting before changing it.

```sh
gauge preference tracking show --hosted -o json
gauge preference tracking set --hosted --cadence weekly --day monday --agent claude-code --agent codex
gauge preference track <id> <id> --hosted
```

Tell the user the cost per cycle: tracked prompts x tracked agents x the
average credits per session. To fill out tracking, add three to five more
category prompts across distinct situations and one head-to-head per main
competitor; [sources-and-prompts.md](sources-and-prompts.md) has the patterns.
`gauge stats rankings --hosted -o json` shows how often agents pick each brand
once runs accumulate.

Saved evals can repeat too (`gauge eval edit <id> --cadence weekly --hosted`);
confirm that cost separately.

## Test the next tasks

Add one eval per next task a new developer does (often: authenticate, the
second most common API call, deploy). Ask once whether the user has sources
worth mining (signup survey answers, sales-call notes, support questions); they
stay on this machine, and only prompts you derive from them go to Gauge. See
[sources-and-prompts.md](sources-and-prompts.md) and
[rubrics.md](rubrics.md).

Use a persona only when it changes the outcome, for example a developer with
no account or API key yet: `gauge personas add --hosted --name "<who>"
--description "The user is ..."`, then `--persona <id>` on the eval.

## Keep evals in this repository

When the team wants evals that change in the same pull request as the docs or
code they test, and run before shipping, follow [evals-kit.md](evals-kit.md):
case files in `gauge-cases/`, a small runner, and an optional scheduled
workflow. Turn the evals from the first test into case files; leave a reviewable
change and commit only if the user asks.

## Write GAUGE.md

Write `GAUGE.md` at the repository root from [context-file.md](context-file.md)
and add one line pointing to it from `AGENTS.md` or `CLAUDE.md`. Ask before
writing it; it holds no secrets and no raw customer material.
