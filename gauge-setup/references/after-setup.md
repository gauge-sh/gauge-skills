# After setup

Offer these in step 8 and do only what the user picks. Anything that launches
sessions or changes the schedule spends credits: show the session count and
cost, and get approval for that step.

## The tracking schedule

Setup creates preference prompts tracked. The schedule and its agent list are
shared by the whole org, and `--agent` replaces the list, so show the current
setting before changing it.

```sh
gauge preference tracking show --hosted -o json
gauge preference tracking set --hosted --cadence weekly --day monday --agent <target> --agent <target>
gauge preference edit <id> --samples <n> --hosted     # sessions per prompt per cycle
gauge preference untrack <id> --hosted                # only with the user's confirmation
```

When describing it, say in plain words: the cadence and the agents, sessions
per cycle (tracked prompts x tracked agents x sessions per prompt), credits per
month, and what size of change it can show (the sampling table in
[preference-prompts.md](preference-prompts.md)). Once runs accumulate,
`gauge stats rankings --hosted -o json` shows how often agents choose each
brand, and `gauge issues list --type objection --hosted -o json` shows which
objections persist. Judge movement over several cycles, never one run.

## PR checks for the evals

Recommend this when the surfaces the evals cover live in a repository the team
controls. Each eval becomes a case file in that repository, and its
`config.checks.paths` lists the surfaces it covers, so a pull request that
touches those paths runs that eval against the pull request's own docs preview,
package, or CLI build. The gauge-agents skill sets this up (its "Set up
repository PR checks" section); hand over the evals, their checks, and their
covered paths rather than redoing that work here. Leave a reviewable change and
commit only if the user asks.

For surfaces outside a repository (a hosted docs site, a public API), the
evals are rerun after a change ships; the gauge-agents skill's test reference
covers that loop.

A preference case can also run on pull requests that change positioning (a
comparison page, the README's pitch), to see whether objections move before the
change ships. Keep it advisory; the tracked prompts remain the trend.

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

Each addition or retirement goes through the same confirmation table as the
first setup.
