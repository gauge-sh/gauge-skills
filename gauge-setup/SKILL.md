---
name: gauge-setup
description: Set up Gauge Agents so a team measures things worth measuring. Reads the repository and, with the user's permission, the team's own context (product and MCP analytics, docs analytics, call recordings, support questions, GitHub issues) to find what developers actually try to do and which products they weigh. Turns that evidence into Agent Preference prompts that run on a schedule and Agent Experience evals that rerun when docs or product change, checks them with one small approved run before anything is scheduled, and reports the friction and objections agents showed. Use when someone asks to set up, onboard to, configure, or get started with Gauge or Gauge Agents, asks what to test or track, or asks to refresh what Gauge tracks. Not for reading existing results only (use gauge-agents) or AI-search visibility (use gauge-chat).
---

# Gauge setup

Most teams have never written an eval. Gauge cannot see their analytics, docs
traffic, sales calls, or support inbox, but you often can. Your job is to
bring the two together: use the team's own context to choose a small set of
measurements that will change what they do, write them well, and prove each one
tells them something before it costs money every week.

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
6. Show the plan and get one approval for the check run
7. Run the check run, keep what is worth keeping, and report
8. Leave it running: preference prompts on a schedule, evals ready to rerun on change

## Ground rules

- **Spend nothing without approval.** Creating evals and prompts is free;
  launching sessions, rechecks, and schedules spend credits. Approval covers the
  launch it was given for, not the next one.
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
  first setup. Treat existing measurements as drafts to keep, fix, or retire in
  step 5, and never delete anything without asking.

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

## 6. Show the plan and get one approval

The approval covers creating the measurements and one check run (step 7). Size
the check run:

- each eval once per agent
- each preference prompt twice per agent, to see whether agents commit to a
  choice and give consistent reasons
- a second phrasing of each preference prompt, once per agent, to see whether
  the wording alone flips the choice (see
  [references/preference-prompts.md](references/preference-prompts.md))

Keep it to about 40 sessions unless the user asks for more; trim prompts or
agents rather than skipping the second phrasing. Nothing outside this count is
launched without a new approval. Estimate credits
from `gauge usage --since 30d --hosted -o json` (the average `RUN_DEBIT`); with
no history, say the cost is measured on this run and give the balance.

Send one message in this shape:

```
Here is what I'd measure for <Product>, based on <sources>.

Can agents use it? (rerun when your docs or SDK change)
1. "<eval prompt>" - passes if <check>; <check>.
   From: <evidence line>. Covers: <docs pages, SDK modules, CLI commands, or MCP tools>
2. ...

Do agents choose it? (tracked weekly)
3. "<open-ended prompt>" - From: <evidence line>
4. <Product> or <Competitor> when <constraint>? - From: <evidence line>
...

First, a check run to see which of these tell you something: <n> sessions on <agents> (including a second wording of each "choose it" prompt), about <n> minutes, ~<credits> credits (balance <b>), in org <org>.
Nothing is scheduled until you've seen the results.
Reply "go", or tell me what to change.
```

The user must see the plan before they can approve it. If you ask through a
question or choice tool, put the whole plan in the question itself. Edits that
come with an approval ("go, but drop 4") do not need a second round.

## 7. Run the check run and report

After approval, create what was approved, tagged `setup`, then launch.
Run `gauge <command> --help` before first use of a command; flags change between
releases.

```sh
gauge brands add "<Product>" --kind owned --websites <url> --package <name>:npm --hosted   # once, if missing
gauge brands add "<Competitor>" --kind competitor --websites <url> --hosted   # each named competitor, if missing

gauge eval create --hosted --name "<task>" --text "<eval prompt>" --cadence none \
  --criteria-file checks.json --agent <target> --agent <target> --tag setup [--repo <url>]
gauge preference create --hosted --kind open-ended --name "<situation>" --text "<prompt>" --tag setup
gauge preference create --hosted --kind head-to-head --brand-a "<Product>" --brand-b "<Competitor>" \
  --name "<Product> vs <Competitor>: <constraint>" --text "<prompt>" --tag setup
# second phrasing of each preference prompt: same command, --name "<name> (wording B)"

gauge watch --hosted                                         # link for the user
gauge run --hosted --eval <id> --samples 1 --yes -o json     # prints runRequestId
gauge run --hosted --preference <id> --agent <target> --agent <target> --samples 2 --yes -o json
gauge run --hosted --preference <wording-b-id> --agent <target> --agent <target> --samples 1 --yes -o json
```

`checks.json` is a JSON array of `{"name": "...", "rubric": "..."}`. Do not pass
`--tracked` yet. Each `gauge run` is its own launch request with its own
`runRequestId`; note every one. Tell the user in two lines how many sessions
started and where to watch, then wait on each request
(`gauge run wait <runRequestId> --hosted -o json`, once per id). Do not judge
any measurement until every request has settled.

Then decide, for each measurement, whether it is worth keeping. The two kinds
are judged differently:

- **Agent Experience:** read the friction (`gauge issues list --type friction
  --hosted -o json`, `gauge run insight <run-id> --hosted -o json`), not just the
  verdict. A passing session with heavy friction is a finding. Sort each eval
  with the table in
  [references/agent-experience-evals.md](references/agent-experience-evals.md):
  friction the team can fix (keep), clean everywhere (keep as a regression check
  for when its surfaces change), unfair check (fix and re-judge with
  `gauge run regrade`), setup failure (fix or drop).
- **Agent Preference:** read the objections (`gauge issues list --type objection
  --hosted -o json`) and what each session chose. Check the five things in
  [references/preference-prompts.md](references/preference-prompts.md): did agents
  commit to a choice, did they choose among the expected products, are the
  objections something the team can change, does the wording flip the result,
  and how often it needs to run. A prompt the product loses everywhere for the
  same correctable reason is the strongest one to keep.

Rewrite what can be fixed; rerunning a rewritten measurement needs its own
approval. Then report:

```
<One sentence: the most important thing agents showed, e.g. "Agents set up <Product> but most guessed the webhook signing step; in the self-hosting comparison every agent chose <Competitor> because it believes <Product> is cloud-only.">

Where agents struggled
1. <friction> - <which agents, n of m sessions> - <session link>
   Change: <the docs page, README section, error message, tool description, or package metadata to edit>

Why agents chose something else
2. <objection> - <which agents, n of m sessions> - <session link>
   Change: <the claim to correct, the page to add>

Keeping <n> of <m>: <one line on what was dropped or rewritten and why>
These are a few sessions each: signals, not rates.
```

Name the surface the team owns and the edit, not a general theme. At most four
findings. Never paste raw JSON or tables.

## 8. Leave it running

Offer the two halves together, each with its own approval where it spends
credits. Details are in [references/after-setup.md](references/after-setup.md).

- **Agent Preference on a schedule.** Track the prompts that kept their place.
  Show the cadence, the agents, sessions per cycle, credits per month, and what
  size of change that will be able to show (see the sampling table in
  [references/preference-prompts.md](references/preference-prompts.md)).
  Prompts the product always wins can run less often as regression guards.
- **Agent Experience when surfaces change.** Do not put evals on a schedule by
  default. Offer PR checks on the repository that holds the surfaces each eval
  covers (the gauge-agents skill sets these up, selecting each eval by the paths
  it covers), and explain the recheck loop: ship the fix, rerun the evals that
  cover it, see whether the friction disappeared.
- **A shared record.** Offer to write `GAUGE.md`
  ([references/context-file.md](references/context-file.md)) so the next
  session, or a refresh, starts from the same evidence and reasoning.

## Refreshing an existing setup

When the user asks to refresh, or about a month after setup, repeat steps 2
to 7 against what exists: re-read the sources, compare themes with `GAUGE.md`,
and propose additions, rewrites, and retirements, for example a new competitor
appearing in calls, friction that stopped appearing after a fix, or a prompt
whose result has not moved in months.
