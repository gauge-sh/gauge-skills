# Test and iterate on new measurements

Use this after new evals or preference prompts are created (for example by the
setup workflow in [setup.md](setup.md), which tags them `setup`), or whenever the user asks whether
their measurements are any good. A short test run shows which ones tell the team
something now, instead of waiting several scheduled cycles, and which need
rewriting.

Talk about the product, not Gauge's vocabulary: "the webhooks setup test", not
"eval set" or "samples". Never paste JSON or raw tables at the user. Pass
`--hosted` on every command, and `--org <slug>` if the user chose an org.

## 1. See what already ran

List the measurements (`gauge eval list --hosted -o json`,
`gauge preference list --hosted -o json`) and take the ones the user named, or
those tagged `setup`. Tracked prompts may already have scheduled sessions
(`gauge run list --hosted --preference <id> -o json`). Read those first; test
only what has no results yet.

## 2. Size the run and get approval

Default size:

- each eval once per agent
- each preference prompt twice per agent, to see whether agents commit to a
  choice and give consistent reasons
- a second wording of each preference prompt, once, on one agent, to see
  whether the wording alone flips the choice

Keep one run to about 40 sessions. If the measurements need more, do not trim
the rules above. Split the measurements into batches instead: the first batch
takes the strongest measurements (the order the user confirmed them in, or the
themes in `GAUGE.md`), preference prompts and evals in the same proportion,
until it reaches 40. Offer the rest as a second batch after the first report.
Estimate credits from `gauge usage --since 30d --hosted -o json` (the average
`RUN_DEBIT`). With no history, which is usual right after setup, say the cost
per session is not known yet, give the session count and the balance, and
report the actual cost after the run.

```
Test run for <Product>: <n> sessions on <agents>, about <n> minutes, ~<credits> credits or "cost measured on this run" (balance <b>).
Covers tests 1-3 and prompts 4-7, plus a second wording of each prompt. <Tests 8-9 can go in a second run.>
Reply "go", or tell me what to change.
```

The approval covers exactly this run. Anything else, including a rerun after a
rewrite, needs its own approval.

## 3. Launch and wait for every request

The second wording is its own prompt: create it untracked, with **different
text** that describes the same situation (reorder the sentences, use different
everyday words, keep the constraint and the stack). Same text measures nothing.

```sh
gauge preference create --hosted --kind <kind> [--brand-a ... --brand-b ...] \
  --name "<name> (wording B)" --text "<the same situation, worded differently>" --tag setup

gauge watch --hosted                                          # link for the user
gauge run --hosted --eval <id> --samples 1 --yes -o json      # prints runRequestId
gauge run --hosted --preference <id> --agent <target> --agent <target> --samples 2 --yes -o json
gauge run --hosted --preference <wording-b-id> --agent <target> --samples 1 --yes -o json
```

Each `gauge run` is its own launch request with its own `runRequestId`; note
every one. Tell the user in two lines how many sessions started and where to
watch, then wait on each (`gauge run wait <runRequestId> --hosted -o json`,
once per id). Judge nothing until every request has settled.

## 4. Decide what to keep

### Agent Experience evals

Read the friction (`gauge issues list --type friction --hosted -o json`,
`gauge run insight <run-id> --hosted -o json`), the check results, and for
anything surprising the trace (`gauge run trace`, `gauge run web`,
`gauge run commands`). A passing session with heavy friction is a finding.

| What you see | Action |
| --- | --- |
| Friction tied to something the team owns: an outdated example, a missing step, a confusing error, no page answering the agent's question, a misleading tool description. With or without a failed check. | Keep. Report the surface and the edit. This is what the eval is for. |
| Passes cleanly on every agent with little friction | Keep as a regression check that reruns when its surfaces change. Do not drop it, and do not schedule it. |
| A check failed a correct approach, demanded something the prompt did not ask, or passed a clearly broken result | Fix the rubric and re-judge without a new session: `gauge run regrade <run-id> --hosted`. Say the check changed. |
| One agent failed where others passed with the same inputs, and the docs it read were correct | An agent miss. Note it; do not change docs for it. |
| `EXECUTION_FAILED`, `INPUT_FAILED`, `JUDGE_FAILED`, or `INCOMPLETE`; a missing credential; setup script errors; the agent never reached the task | Not a product finding. Fix the setup or drop the eval; report the error verbatim with `gauge feedback`. Do not speculate about the cause. |

### Agent Preference prompts

Read the objections (`gauge issues list --type objection --hosted -o json`,
`gauge run insight <run-id> --hosted -o json`) and what each session chose.
Unlike evals, a prompt that gives the same answer everywhere is not
automatically useless: losing everywhere for one correctable reason is the
strongest finding a prompt can produce. Check five things:

1. **Did the agent make a choice?**
   - Head-to-head: "it depends" or "either works" means the prompt does not
     force a decision. Add the deciding constraint from the evidence.
   - Open-ended: the agent may write the feature by hand, reuse something
     already in the starting repository, or use a framework built-in. If
     building it yourself is a real alternative in this category (as with rate
     limiting), keep that as a valid outcome. If not, change the situation so a
     product choice is natural, or change the starting repository.
2. **Did agents choose among the expected products?**
   - Choices from a different category mean the prompt describes a different
     problem than intended. Reword it.
   - A product Gauge did not recognize needs adding, or an alias
     (`gauge brands add <name> --kind competitor --hosted`,
     `gauge brands edit <id> --aliases <list> --hosted`). Otherwise the results
     undercount it.
3. **Are the objections something the team can change?**
   - Worth tracking: objections that cite a capability that is out of date or
     wrong, a missing docs page, a pricing misunderstanding, an unclear setup
     story, or "not familiar with it".
   - Low value: objections that are only popularity ("X is the standard
     choice"). Keep at most one such prompt as a baseline.
4. **Does the wording flip the result?** Compare the prompt with its second
   wording. If the choice flips, the prompt measures phrasing, not preference.
   Keep the wording closest to how the evidence describes the situation: if
   that is wording B, move its text onto the tracked prompt
   (`gauge preference edit <id> --text "<wording B>" --hosted`). Either way,
   remove wording B afterwards (`gauge preference rm <wording-b-id> --hosted`),
   whether or not the choice flipped, so later test runs do not pick it up. It
   was created for this test, so say so in the report rather than asking first.
5. **Is it sampled enough?** Choice results are noisy. Each period compared
   needs about 12 sessions of the prompt to show a flip (25% to 75%), 40 for a
   large move (40% to 70%), and 90 for a moderate one (50% to 70%). One session
   per agent weekly on three agents is 12 a month: enough to notice a flip
   within a month, not a 20-point drift. Raise `--samples` on the prompts that
   matter most rather than tracking more prompts.

Rewrite what can be fixed. Untrack, drop, or delete existing measurements only
with the user's confirmation.

## 5. Report

```
<One sentence: the most important thing agents showed, e.g. "Agents set up <Product> but most guessed the webhook signing step; in the self-hosting comparison every agent chose <Competitor> because it believes <Product> is cloud-only.">

Where agents struggled
1. <friction> - <which agents, n of m sessions> - <session link>
   Change: <the docs page, README section, error message, tool description, or package metadata to edit>

Why agents chose something else
2. <objection> - <which agents, n of m sessions> - <session link>
   Change: <the claim to correct, the page to add>

Keeping <n> of <m>: <one line on what was rewritten or should be dropped, and why>
These are a few sessions each: signals, not rates.
```

Name the surface the team owns and the edit, not a general theme. At most four
findings. If there is a second batch, offer it here with its size and cost.

## After a change ships

- Rerun the evals that cover the changed surface, with the same agents and
  the same sessions per agent as the run before the change, and compare:

  ```sh
  gauge run --hosted --eval <id> --samples <same as before> --yes -o json
  gauge run compare --hosted --baseline request=<before-request-id> --candidate request=<after-request-id>
  ```

  One session per agent shows friction well enough to act on. To claim a change
  worked, both sides need two sessions per agent: if the test run used one,
  run the baseline again with `--samples 2` before the change ships, then the
  candidate with `--samples 2` after. If the change already shipped without a
  matching baseline, report the comparison as a signal, not a result.
- `gauge issues recheck <issue-id> --hosted` previews rerunning the past
  sessions that showed an issue; `--confirm` launches them. If the issue no
  longer appears, mark it with `gauge issues fix <id> --hosted`; it reopens if
  agents hit it again.
- For a change that is not shipped yet, write the eval first and expect it to
  fail until the change lands; "now passing" says the change is ready.
- For tracked prompts, judge movement over several cycles, never one run.

Each rerun spends credits; show the session count and get approval first.
