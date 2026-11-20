---
name: gauge-setup
description: Set up Gauge Agents so a team measures things worth measuring. Reads the repository and, with the user's permission, the team's own context (product and MCP analytics, docs analytics, call recordings, support questions, GitHub issues) to find what developers actually try to do and which products they weigh. Drafts Agent Experience evals and Agent Preference prompts from that evidence, confirms them with the user in one short table, and creates them with the preference prompts tracked on a schedule. Use when someone asks to set up, onboard to, configure, or get started with Gauge or Gauge Agents, asks what to test or track, or asks to refresh what Gauge tracks. Not for running or iterating on measurements that already exist, or reading results (use gauge-agents), or AI-search visibility (use gauge-chat).
---

# Gauge setup

Most teams have never written an eval. Gauge cannot see their analytics, docs
traffic, sales calls, or support inbox, but you often can. Your job is to
bring the two together: use the team's own context to choose a small set of
measurements that will change what they do, write them well, and get them
running so they produce information over time.

This skill ends once the measurements exist. Running them now to see which
ones are worth keeping is a separate step, done with the gauge-agents skill;
recommend it, but the setup is useful without it, because tracked prompts
produce results on their own schedule.

Gauge measures two things, and they run differently:

| | Agent Experience | Agent Preference |
| --- | --- | --- |
| Question | Can agents use the product? | Do agents choose the product, and why not? |
| Shape | An eval: a developer's task plus checks | A prompt: a category task (open-ended) or a choice between two named products (head-to-head) |
| Main finding | **Friction**: where agents struggled, even in sessions that passed | **Objections**: the reasons agents give for choosing something else |
| When it runs | When a surface the team owns changes (docs, SDK, CLI, API, MCP server, error messages) | On a schedule, to watch the competitive landscape |

Pass rates and how often the product is chosen are secondary. Friction and
objections say what to change.

The flow:

1. Check the CLI and the org (silent)
2. Find the context you can reach (silent)
3. Ask once to read it
4. Turn it into evidence and themes (silent)
5. Draft the measurements
6. Confirm them with the user in one table
7. Create them, with the preference prompts tracked
8. Recommend a test run, and offer PR checks for the evals

## Ground rules

- **Spend nothing without approval.** Creating evals and prompts is free;
  tracking prompts on a schedule and launching sessions spend credits. The
  confirmation in step 6 covers creating the measurements and the tracking
  schedule it shows, nothing else. This skill launches no sessions.
- **Read, never write, in the team's other systems.** Do not change records in
  the CRM, analytics, docs platform, or issue tracker. Do not post comments.
- **Only derived text leaves the machine.** Raw transcripts, tickets, analytics
  exports, and notes stay local. Gauge receives only prompts and checks you
  wrote in your own words, with no customer, prospect, person, or deal named and
  no secrets.
- **Do not invent facts.** Every competitor, situation, and task must come from
  the repository, a source you read, or the user. If you could not reach any
  evidence for something, leave it out rather than guess.
- **Talk about the product, not about Gauge.** Say "the webhooks setup test" or
  "the self-hosting comparison", not "eval set", "criteria", "persona",
  "scenario", "samples", or "gauge.json". "Friction" and "objections" are fine
  with a short gloss the first time ("where agents struggled", "why agents chose
  something else"); the user will see those words in Gauge.
- **Report errors as they are.** Quote the failing command and its error. Check
  `gauge <command> --help` before retrying; list what exists before retrying a
  create. If the CLI blocks you, say so and send
  `gauge feedback -m "<what happened>" --kind friction|missing|bug`.
- **Keep output short.** The user does not see CLI or tool output. Never paste
  JSON, tables of raw data, or transcript excerpts at them.
- **Pass `--hosted` on every Gauge command.** In some workspaces the CLI
  defaults to local mode, and listings then read this machine instead of the
  org. If the user picked an org in step 1, also pass `--org <slug>` on every
  Gauge command, including the ones in the templates below. Do not run
  `gauge orgs use`; it changes the user's saved default.

## 1. Check the CLI and the org

Run these without commentary. Tell the user only if something blocks you.

```sh
gauge --version                      # needs 0.31.0 or later; update: gauge update
gauge auth status                    # not signed in: gauge auth login
gauge orgs list                      # several orgs: ask which one, then pass --org <slug> from here on
gauge status --hosted -o json
gauge eval list --hosted -o json
gauge preference list --hosted -o json
gauge preference tracking show --hosted -o json
gauge brands list --hosted -o json
gauge issues list --hosted -o json
gauge billing status --hosted -o json
gauge models list --hosted -o json   # the agents this org can run
```

- No Gauge account: `gauge onboard --website <their site>` creates one.
- The org already has evals, prompts, or open issues: this is a refresh, not a
  first setup. See "Refreshing an existing setup" at the end.

## 2. Find the context you can reach

Spend a few minutes. First the repository: README, package manifests (package
names, CLI `bin` names), the quickstart or getting-started page, examples, any
`llms.txt`, `SKILL.md`, or MCP server code, and any comparison or
"alternatives" page. Note the surfaces the team owns and where they live in the
repository (docs folder, SDK packages, CLI, MCP server).

Then take stock of other sources by looking, not by asking:

- MCP tools available in this session (for example PostHog, Mintlify, Attio,
  Gong, Intercom, Linear, Notion)
- CLIs on the PATH (`gh`, `mint`, and others) and whether they are signed in
- Whether the repository is on GitHub, and whether its issues and discussions
  are public

[references/context-sources.md](references/context-sources.md) lists what each
source is good for and how to read it. Do not read private data yet.

## 3. Ask once to read it

Send one short message naming each source you found, what you would read, and
how it is handled. For example:

```
To pick tests that matter for <Product>, I'd like to read, on this machine only:
- PostHog: which MCP tools agents call and where they error (last 30 days)
- Mintlify: which docs pages agents read most, and questions the docs assistant could not answer
- Attio: call recordings that mention evaluating <Product> or alternatives
Gauge only gets test prompts I write in my own words, never names or raw text.
Read all three? You can also point me to anything else (a survey export, a support inbox).
```

If something is genuinely ambiguous (two products in one repository), ask in
this same message with your best guess as the default. If you found nothing
beyond the repository and public GitHub, skip this step and say in the plan
that the tests come from the repository only, and that they get better with
real usage or customer context.

## 4. Turn it into evidence and themes

Read each approved source with the recipe in
[references/context-sources.md](references/context-sources.md). Write what you
learn to a local evidence file outside the repository (or in a gitignored path),
in this shape:

```
Theme: <short name, in a developer's words>
Kind: experience | preference
Evidence: <source> - <count or measure>; <source> - <count or measure>
Surfaces (experience): <docs pages, packages, CLI commands, MCP tools involved>
Situation (preference): <the constraint or context that drives the choice>
Competitors named: <only names found in the evidence>
```

Then do what first-time eval writers skip:

1. **Read before you categorize.** Note what went wrong or what was asked in
   each item before grouping. Do not start from a list of expected problems.
2. **Group into themes and count them.** A theme seen in several sources beats
   one vivid example.
3. **Rank by value.** Rank by how often it happens and whether someone on the
   team could act on the result (a page to rewrite, a tool to rename, a claim to
   correct). Drop themes nobody could act on.
4. **Keep the set representative.** Include the main things developers do, not
   only the worst failures, and include situations from deals the team lost, not
   only from people who found the product.

## 5. Draft the measurements

Draft a small set. Fewer, well-chosen measurements beat many weak ones.

**Agent Experience evals: two to four.** Each is one theme: a task developers
actually attempt, written as a developer would ask it, naming the product but
not the steps. Two to four checks each, observable and grounded in the docs.
Record which owned surfaces it exercises. See
[references/agent-experience-evals.md](references/agent-experience-evals.md).

**Agent Preference prompts: three to six.**

- Open-ended prompts for the situations developers are in when they need the
  category. They never name the product or a competitor.
- One head-to-head per competitor the evidence actually names, built around the
  constraint that decided real deals ("we have to self-host", "free tier only").

See [references/preference-prompts.md](references/preference-prompts.md).

For every measurement, keep one line saying where it came from, for example
"from: 40% of agent docs traffic goes to /webhooks; 6 GitHub issues about
signature errors". The user sees these lines in the plan.

**Agents:** two or three different agents (not several models of one agent)
from `gauge models list --hosted -o json`, preferring the agents the evidence
says developers use (docs and MCP analytics often show this). Without such
evidence, use `claude-code` with its default model plus one other agent, such
as an `opencode:<model>` open model. Use what the user asks for instead, if
they say.

**Where the agent works:** Gauge's default starter project, or a small public
starter repository on the stack the evidence points to. Never the team's
private repository.

## 6. Confirm them with the user in one table

Estimate the tracking cost before you ask. Read the org's schedule from
`gauge preference tracking show --hosted -o json`. If it already runs on some
agents, use its cadence and agents and do not change it; it is shared across
the org. A new org has a default schedule with no agents, so tracked prompts
would never run: in that case, or if there is no schedule, propose weekly on
the agents from step 5, and say in the table that this turns tracking on. Choose sessions per prompt
per cycle with the sampling table in
[references/preference-prompts.md](references/preference-prompts.md) (one per
agent weekly is usually enough to notice a big swing within a month). Sessions
a month = tracked prompts x tracked agents x sessions per prompt x cycles a
month (about 4 for weekly); for example 5 prompts on 3 agents, one session
each, weekly, is about 60. Estimate credits from `gauge usage --since 30d --hosted -o json` (the average
`RUN_DEBIT`); with no history, say the cost is measured on the first cycle and
give the balance.

Send one message in this shape, as plain text. Keep each cell short; the
`From` column is what makes the plan believable, so never leave it out. List
each group strongest evidence first; a later test run uses that order to
decide what to test first.

```
Here's what I'd set up for <Product>, based on <sources>.

Can agents use it? (runs when you ask, or on pull requests that touch what it covers)
| # | Task given to the agent           | Passes if                        | Covers                 | From                                  |
| 1 | "<eval prompt>"                   | <check>; <check>                 | <docs pages, packages> | <evidence line>                       |
| 2 | ...                               |                                  |                        |                                       |

Do agents choose it? (tracked <weekly> on <agents>)
| # | Prompt                            | From                                  |
| 3 | "<open-ended prompt>"             | <evidence line>                       |
| 4 | <Product> or <Competitor>, <constraint> | <evidence line>                 |

Tracking costs about <n> sessions, ~<credits> credits a month (balance <b>), in org <org>.
Creating the tests is free; nothing else runs until you ask.
Reply "go", or tell me what to change.
```

The user must see the table before they can confirm it. If you ask through a
question or choice tool, put the whole table in the question itself. Edits
that come with a confirmation ("go, but drop 4") do not need a second round.

## 7. Create them, with the preference prompts tracked

Run `gauge <command> --help` before first use of a command; flags change
between releases. Tag everything `setup`.

```sh
gauge brands add "<Product>" --kind owned --websites <url> --package <name>:npm --hosted   # once, if missing
gauge brands add "<Competitor>" --kind competitor --websites <url> --hosted   # each named competitor, if missing

gauge eval create --hosted --name "<task>" --text "<eval prompt>" --cadence none \
  --criteria-file checks.json --agent <target> --agent <target> --tag setup [--repo <url>]
gauge preference create --hosted --kind open-ended --name "<situation>" --text "<prompt>" \
  --samples <n> --tracked --tag setup
gauge preference create --hosted --kind head-to-head --brand-a "<Product>" --brand-b "<Competitor>" \
  --name "<Product> vs <Competitor>: <constraint>" --text "<prompt>" --samples <n> --tracked --tag setup

# only if the schedule has no agents yet (a new org), after the user confirmed it:
gauge preference tracking set --hosted --cadence weekly --day monday --agent <target> --agent <target>
```

`checks.json` is a JSON array of `{"name": "...", "rubric": "..."}`. Evals stay
unscheduled (`--cadence none`): they are meant to run when the surfaces they
cover change, not on a timer.

## 8. Recommend a test run, and offer PR checks

Get the link with `gauge watch --hosted`, then send one short message:

```
Set up in <org>: <n> agent tests and <n> tracked prompts. First scheduled run: <day>. <link>

Recommended next: a short test run to see which of these tell you something now,
rather than after a few weekly cycles. Say "test these" and I'll show the size and cost first.
<If the evals' surfaces are in a repository the team controls:> I can also set up PR checks
so each agent test reruns when a pull request changes what it covers.
```

- **Test run.** If the user asks for it, use the gauge-agents skill; its
  testing reference covers sizing, approval, and what to keep. Do not launch
  anything from this skill.
- **PR checks.** If the user asks, hand over to the gauge-agents skill's
  "Set up repository PR checks" section with each eval, its checks, and its
  covered paths (see [references/after-setup.md](references/after-setup.md)).
- **A shared record.** Offer to write `GAUGE.md`
  ([references/context-file.md](references/context-file.md)) so the next
  session, or a refresh, starts from the same evidence and reasoning.

## Refreshing an existing setup

When the org already has measurements, or the user asks to refresh, repeat
steps 2 to 8 against what exists: re-read the sources, compare themes with
`GAUGE.md` if there is one, and propose additions, rewrites, and retirements,
for example a new competitor appearing in calls, friction that stopped
appearing after a fix, or a prompt whose result has not moved in months.

In the step 6 table, start every row with its status (`new`, `changed`, or
`retire`), and list the retirements together under their own heading, saying
what each one does: "stops tracking, history kept" for a prompt, "deletes the
test, run history kept" for an eval. Replace the line "Creating the tests is
free" with one that names what will change. A "go" covers only the rows shown;
if the user's reply is unclear about a retirement, ask again for that row.

In step 7, create only the `new` rows. Apply the others to the existing
measurement rather than creating a second one:

```sh
gauge eval edit <id> --hosted --text "<new prompt>"            # changed eval prompt; checks keep their history
gauge preference edit <id> --hosted --text "<new prompt>" --samples <n>
gauge preference untrack <id> --hosted     # retire a prompt; its history stays
gauge eval rm <id> --hosted                # retire an eval; run history stays
```

To change an eval's checks, first read their ids with
`gauge eval get <id> --hosted -o json`, then pass `--criteria-file` with every
check to keep, each with its `id` (only new checks go without one). A criteria
list without ids replaces the whole set and drops each check's history.

Prefer `untrack` over `rm` for preference prompts, so their trend stays
readable.
