# After setup

Offer these only after the user has seen the check run's results, and do only
what they pick. Anything that launches sessions or puts measurements on a
schedule spends credits: show the session count and cost, and get approval for
that step.

## Agent Preference on a schedule

Track the prompts that kept their place in the check run. The schedule and its
agent list are shared by the whole org, and `--agent` replaces the list, so show
the current setting before changing it.

```sh
gauge preference tracking show --hosted -o json
gauge preference tracking set --hosted --cadence weekly --day monday --agent <target> --agent <target>
gauge preference edit <id> --samples <n> --hosted     # sessions per prompt per cycle
gauge preference track <id> <id> --hosted
```

Tell the user, in plain words:

- the cadence and the agents
- sessions per cycle (tracked prompts x tracked agents x sessions per prompt)
  and credits per month (sessions x the average credits per session)
- what size of change it can show, using the sampling table in
  [preference-prompts.md](preference-prompts.md)

Prompts the product always wins or always loses for an unchanging reason can
use fewer sessions per cycle as guards. Once runs accumulate,
`gauge stats rankings --hosted -o json` shows how often agents choose each
brand, and `gauge issues list --type objection --hosted -o json` shows which
objections persist. Judge movement over several cycles, never one run.

## Agent Experience when surfaces change

Do not put evals on a schedule by default. Offer one of these:

- **PR checks (recommended when the surfaces live in a repository the team
  controls).** Each kept eval becomes a case file in that repository, and its
  `config.checks.paths` lists the surfaces it covers, so a pull request that
  touches those paths runs that eval against the pull request's own docs
  preview, package, or CLI build. The gauge-agents skill sets this up (its
  "Set up repository PR checks" section); hand over the evals, their checks,
  and their covered paths rather than redoing that work here. Leave a
  reviewable change and commit only if the user asks.
- **Rerun after shipping.** For surfaces outside a repository (a hosted docs
  site, a public API), rerun the covering evals after the change goes live and
  compare:

  ```sh
  gauge run --hosted --eval <id> --samples 2 --yes -o json
  gauge run compare --hosted --baseline request=<before-request-id> --candidate request=<after-request-id>
  ```

Either way, explain the loop in one or two sentences: change the page or tool
that caused the friction, rerun the evals that cover it, see whether the
friction disappeared. `gauge issues recheck <issue-id> --hosted` previews
rerunning the sessions that showed a specific issue; `--confirm` launches them.
Mark a resolved issue with `gauge issues fix <id> --hosted`; it reopens if
agents hit it again.

A preference case can also run on pull requests that change positioning (a
comparison page, the README's pitch), to see whether objections move before the
change ships. Keep it advisory; the scheduled prompts remain the trend.

## Write GAUGE.md

Write `GAUGE.md` at the repository root from [context-file.md](context-file.md)
and add one line pointing to it from `AGENTS.md` or `CLAUDE.md`. Ask before
writing it. It records sources, themes, and reasoning so a refresh starts from
them; it holds no secrets and no raw customer material.

## Refresh

About a month later, or when the user asks, re-read the same sources and
compare with `GAUGE.md`:

- new themes, competitors, or deciding constraints: propose new measurements
- friction that stopped appearing after a fix: keep the eval as a regression
  check
- objections that stopped appearing: note what changed
- prompts whose result has not moved in months: run less often or retire
- measurements whose evidence no longer appears in any source: propose retiring
  them

Each addition or retirement goes through the same plan, approval, and check
run as the first setup.
