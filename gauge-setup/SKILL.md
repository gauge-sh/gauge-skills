---
name: gauge-setup
description: Get a team from a Gauge account to a first finding about their own product, fast. Reads the repository, proposes one small first test (can an agent complete the product's first task, and do agents pick the product when asked for its category), gets a single approval with the session count and cost, launches it through the Gauge CLI, and reports what agents did with links to the sessions. Then offers tracking, more evals, or evals kept as files in the repository. Use when someone asks to set up, onboard to, configure, or get started with Gauge or Gauge Agents, or asks what to test first. Not for reading existing results only (use gauge-agents) or AI-search visibility (use gauge-chat).
---

# Gauge setup

The goal is one thing: the user looking at a finding about their own product
that they care about, as early as possible. Gauge runs real coding agents in
sandboxes and answers two questions:

- **Can agents use the product?** An agent gets a developer's request (for
  example "add <Product> to this app") and Gauge judges whether it succeeded and
  where it struggled.
- **Do agents pick the product?** An agent gets a request for the category,
  without the product's name, and Gauge records what it chose.

Do the work in four steps. Ask the user for one thing only: approval of the
first test. Everything else, infer from the repository and show as a default
they can change.

1. Check the CLI and the org (silent)
2. Read the repository and draft the first test (silent)
3. Show the first test and get one approval
4. Launch, wait, and report the first finding

After the first finding, offer what comes next (tracking, more evals, evals as
files in the repository). Do not set any of that up before the user has seen a
result.

## Ground rules

- **Spend nothing without approval.** Creating evals and prompts is free;
  launching sessions, rechecks, and schedules spend credits. Approval covers the
  launch it was given for, not the next one.
- **Talk about the product, not about Gauge.** The user should hear "can an
  agent add <Product> to a Next.js app?", not "eval set", "criteria",
  "preference prompt", "persona", "scenario", or "gauge.json". Use Gauge's terms
  only when the user asks how it works.
- **Do not invent facts.** Every competitor, feature, and task in the test must
  come from the repository, its docs, or the user. If no competitor is named in
  their materials, leave the head-to-head out rather than guess.
- **Only derived text leaves the machine.** Send Gauge the prompts and checks
  you wrote, never raw files, tickets, notes, or customer data. No secrets in
  any prompt or check.
- **Report errors as they are.** Quote the failing command and its error. Check
  `gauge <command> --help` before retrying; list what exists before retrying a
  create so a retry does not make a duplicate. If the CLI blocks you, say so and
  send `gauge feedback -m "<what happened>" --kind friction|missing|bug`.
- **Keep output short.** The user does not see CLI output. Never paste JSON or
  tables at them.
- **Pass `--hosted` on every command.** In some workspaces the CLI defaults to
  local mode, and then listings read this machine instead of the org.

## 1. Check the CLI and the org

Run these without commentary. Tell the user only if something blocks you.

```sh
gauge --version                      # needs 0.31.0 or later; update: gauge update
gauge auth status                    # not signed in: gauge auth login
gauge orgs list                      # several orgs: ask which one, then pass --org <slug>
gauge status --hosted -o json
gauge eval list --hosted -o json
gauge preference list --hosted -o json
gauge billing status --hosted -o json
```

- No Gauge account: `gauge onboard --website <their site>` creates one.
- The org already has runs with results: the fastest finding is one that
  already exists. Read `gauge issues list --hosted -o json` and lead with the
  top issue (step 4's report shape) before proposing anything new.
- The org already has evals or prompts that fit the product: reuse them in the
  first test instead of writing new ones. Never delete anything without asking.

## 2. Read the repository and draft the first test

Spend a few minutes, not an hour. Read the README, package manifests (package
names, CLI `bin` names), the docs folder's quickstart or getting-started page,
examples, any `llms.txt`, `SKILL.md`, or MCP server config, and any comparison
or "alternatives" page. Do not go looking in private systems.

Write down, locally:

- the product in one sentence, and its category in a developer's words
  ("an email API", "a rate-limiting library")
- **the first task**: what a new developer does first, as the quickstart
  describes it (install, configure, the first call that shows it works)
- the competitors named in the repository or docs, if any

Then draft the first test:

- **One "can agents use it" eval** for the first task. The prompt is one or two
  sentences a developer would type, naming the product and the goal but not the
  steps ("Add <Product> to this Express app and send a test email when a user
  signs up."). Two to four checks, each observable and grounded in what the
  quickstart says, for example: the right package is installed; credentials come
  from an environment variable; the documented first call is made correctly; the
  agent ran something that shows it works, or said exactly what blocked it. See
  [references/rubrics.md](references/rubrics.md) for what makes a check fair.
- **One "do agents pick it" prompt** for the category, phrased the way a
  developer asks inside a repository, without naming any product ("Send a
  welcome email when someone signs up."). See
  [references/sources-and-prompts.md](references/sources-and-prompts.md).
- **One head-to-head**, only if the materials name a competitor: "We're
  choosing between <Product> and <Competitor> for <capability>. Which should we
  use here, and why? No code yet."
- **Agents**: two, one sample each, from `gauge models list --hosted -o json`
  (it lists only what this org can run; some plans run open models only).
  Prefer `claude-code` with its default model when it is listed, plus one open
  model (an `opencode:<model>` target). Use what the user asks for instead, if
  they say.
- **Where the agent works**: Gauge's default starter project, or a small public
  starter repository on the developer's stack (a framework's official template).
  Never the team's own private repository.

That is 4 to 6 sessions. Estimate cost from the org's history
(`gauge usage --since 30d --hosted -o json`: the average `RUN_DEBIT`). With no
history, say the cost is measured on this first launch and give the balance.

## 3. Show the first test and get one approval

Send one message in this shape, and nothing longer:

```
Here is a first test for <Product>. About <n> minutes, <n> sessions, ~<credits> credits (balance <b>).

1. Can an agent set it up? "<eval prompt>"
   Passes if: <check>; <check>; <check>.
2. Do agents pick <Product>? "<category prompt>"
3. <Product> or <Competitor>? "<head-to-head prompt>"     (only if a competitor was found)

Agents: <agent> and <agent>, once each. Source: <README / quickstart / comparison page>.
Reply "go" to run it, or tell me what to change.
```

If something is genuinely ambiguous (two products in one repository, no
quickstart at all), ask about it in this same message, with your best guess as
the default. Do not ask about budget, schedules, personas, data sources, or
long-term plans now; those come after the first finding.

Edits to the plan do not need a second full round: apply them and launch if the
user's reply already approves ("go, but use Python").

## 4. Launch, wait, and report the first finding

After approval, create only what was approved, tagged `setup`, then launch.
Run `gauge <command> --help` before first use of a command; flags change between
releases.

```sh
gauge brands list --hosted -o json          # add the product once if missing:
gauge brands add "<Product>" --kind owned --websites <url> --package <name>:npm --hosted

gauge eval create --hosted --name "<first task>" --text "<eval prompt>" \
  --criteria-file checks.json --agent <target> --agent <target> \
  --tag setup [--repo <starter-repo-url>]
gauge preference create --hosted --kind open-ended --name "<category>" \
  --text "<category prompt>" --tag setup
gauge preference create --hosted --kind head-to-head --brand-a "<Product>" \
  --brand-b "<Competitor>" --name "<Product> vs <Competitor>" --text "<prompt>" --tag setup

gauge watch --hosted                                   # link for the user
gauge run --hosted --eval <id> --samples 1 --yes -o json        # prints runRequestId
gauge run --hosted --preference <id> --agent <target> --agent <target> --samples 1 --yes -o json
```

`checks.json` is a JSON array of `{"name": "...", "rubric": "..."}`. Preference
prompts do not store agents; pass them on the launch.

Tell the user in two lines how many sessions started and where to watch, then
wait:

```sh
gauge run wait <runRequestId> --hosted -o json         # the eval
gauge run list --preference <id> --hosted -o json      # the prompts; poll until each run has a verdict
```

Before calling a failure a product problem, read the evidence for it:
`gauge run insight <run-id> --hosted -o json`, and for the steps,
`gauge run trace <run-id> --hosted` and `gauge run web <run-id> --hosted`. Sort
it as a docs or product problem, an agent miss, a bad check, or a setup or
platform failure ([references/rubrics.md](references/rubrics.md) has the
table). Fix a bad check and re-judge with `gauge run regrade <run-id> --hosted`
instead of rerunning.

Report in this shape:

```
<One sentence: e.g. "Both agents set up <Product>, but one hard-coded the API key; neither picked <Product> for 'send a welcome email' (both chose <X>).">

What agents did
1. <what happened> - <which agents> - <session link>
   Change: <the docs page, README section, error message, or package metadata to edit>
2. ...

Not about <Product>: <bad checks fixed, setup failures, one-off agent misses; one line each>
This was one session per agent: a signal, not a rate.
```

Name the surface the team owns and the edit, not a general theme. At most three
findings.

## After the first finding

End with a short menu and act only on what the user picks. Each item that
spends credits needs its own approval. Details are in
[references/after-first-result.md](references/after-first-result.md).

1. **Check a fix**: make the change, then rerun the eval or prompt that showed
   the problem.
2. **Track agent choice weekly**: put the prompts that told you something on
   Gauge's schedule, with a cost per week.
3. **Test the next tasks**: add evals for the next two or three things a new
   developer does; mine support questions, call notes, or survey answers the
   user points to for realistic prompts.
4. **Keep evals in this repository**: write them as files that run before a docs
   or product change ships, optionally on a schedule in CI.
5. **Write `GAUGE.md`**: a short shared record of what is measured and why, so
   the next agent session starts from it.
