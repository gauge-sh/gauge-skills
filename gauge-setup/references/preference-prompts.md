# Agent Preference prompts

A preference prompt asks an agent to solve a problem where choosing a product is
part of the job, and records what it chose and why. Its main finding is the
**objection**: the reason an agent gave for choosing something else. How often
the product is chosen matters, but the objections are what the team can act on.

Preference prompts run on a schedule so the team can see the competitive
landscape move: new agent models, a competitor's launch, the team's own docs
and positioning changes.

## Where the prompts come from

| Evidence | Becomes |
| --- | --- |
| Calls and lost-deal notes naming a competitor and a deciding constraint | A head-to-head built around that constraint |
| The situations customers describe when they needed the category | Open-ended prompts in their words, in a matching starting repository |
| Signup survey answers, docs assistant questions, category words in searches | The phrasing of open-ended prompts |
| Comparison and migration pages in the repository | Competitors to consider, if the evidence above does not name them |
| Docs and MCP analytics showing which agents developers use | Which agents to run the prompts on |

Successful-discovery data (people who found you) is biased toward situations
you already win. Add situations from lost deals and competitor positioning too.
Rewrite everything in your own words; a prompt must not identify a customer, a
person, or a deal.

## Open-ended prompts

These measure whether agents reach for the product unprompted. The prompt must
not name the product, its packages, or a competitor. Phrase it the way a
developer talks to an agent inside a repository: a goal, a little context, no
shopping list.

Good:

- "Add error tracking to this app so we get alerted when the checkout page
  crashes."
- "Send a welcome email when someone signs up."
- "Rate-limit the public API endpoints so one client cannot starve the rest."

Weak:

- "What is the best error-tracking tool?" (a chat question, not a coding task)
- "Compare the top 5 auth providers." (asks for a list, not a choice)
- "Use a modern, developer-friendly observability platform." (steers toward a
  brand by its marketing words)

Vary only what changes the choice: the starting repository (an empty project
or an existing app on a common stack), constraints the developer states, and
who the developer is. Three to five prompts across distinct situations beat
twenty paraphrases. Add a second starting repository to a prompt
(`gauge preference scenarios add <id> --hosted --repo <url>`) rather than
duplicating the prompt.

A prompt that names the product ("Set up <Product> in this app") measures
whether agents can complete the job once the product is chosen. That is an
Agent Experience eval, not a preference prompt.

## Head-to-head prompts

One prompt per competitor and deciding constraint. The prompt names both
products, states the situation, and asks for a decision before any code.
Asking "what else did you consider" reopens the field and blurs the verdict.

- "We're down to A and B for <capability>. We have to <constraint>. Don't write
  code yet. Which one should we use here, and why?"
- "A or B for <capability> in this <stack> app? Pick one and explain the choice.
  No code yet."

Build each head-to-head around the constraint that decided real deals (cost,
self-hosting, compliance, scale, ease of first setup). Without a constraint,
agents often answer "it depends", which measures nothing.

## The check run: is this prompt worth tracking?

Run each draft prompt twice per agent before it goes on the schedule, then
check five things. Unlike evals, a prompt that gives the same answer
everywhere is not automatically useless: losing everywhere for one
correctable reason is the strongest finding a prompt can produce.

1. **Did the agent make a choice?**
   - Head-to-head: "it depends" or "either works" means the prompt does not
     force a decision. Add the deciding constraint from the evidence.
   - Open-ended: the agent may write the feature by hand, reuse something
     already in the starting repository, or use a framework built-in. If
     building it yourself is a real alternative in this category (as with rate
     limiting), keep that as a valid outcome. If not, change the situation so a
     product choice is natural, or change the starting repository.
2. **Did agents choose among the expected products?** Compare the choices with
   the competitors in the evidence.
   - Choices from a different category mean the prompt describes a different
     problem than intended. Reword it.
   - A product Gauge did not recognize means the brand list needs it, or an
     alias (`gauge brands add <name> --kind competitor --hosted`,
     `gauge brands edit <id> --aliases <list> --hosted`). Otherwise the results
     undercount it.
3. **Are the objections something the team can change?** Read
   `gauge issues list --type objection --hosted -o json` and `gauge run insight
   <run-id> --hosted -o json`.
   - Worth tracking: objections that cite a capability that is out of date or
     wrong, a missing docs page, a pricing misunderstanding, an unclear setup
     story, or "not familiar with it".
   - Low value: objections that are only popularity ("X is the standard
     choice"). Keep at most one such prompt as a baseline.
4. **Does the wording flip the result?** Compare each prompt with its second
   phrasing from the check run (budgeted in step 6 of SKILL.md; do not launch
   extra phrasings without a new approval). If the choice flips, the prompt
   measures phrasing, not preference. Either way, keep one phrasing (the one
   closest to how the evidence describes the situation) and remove the other.
   Both were created in this setup, so say so in the report rather than asking
   first; existing measurements still need the user's OK before removal.
5. **How often should it run, and how many sessions each time?** See below.

Then keep, rewrite, or drop each prompt, and tell the user why in one line.

## Sampling and cadence

A tracked prompt is a trend over time, and choice results are noisy. To tell a
real change from noise, each period being compared needs roughly this many
sessions of that prompt:

| Change to detect | Sessions per period (about) |
| --- | --- |
| A flip, such as 25% to 75% | 12 |
| A large move, such as 40% to 70% | 40 |
| A moderate move, such as 50% to 70% | 90 |

So, for example, three agents with one session each, weekly, is 12 sessions a
month: enough to notice a flip within a month, not a 20-point drift. Put this
in plain words in the tracking plan: "weekly on three agents, about N sessions
a month, enough to notice a big swing within a month."

What follows:

- Track fewer prompts with more sessions each, rather than many prompts with
  one session each.
- Judge movement over several cycles, never from one run.
- Prompts the product always wins or always loses for an unchanging reason can
  run less often, as guards; they still tell you when something changes.
- The schedule and its agents are shared across the org; sessions per prompt
  are set per prompt (`--samples`).

## Personas

A persona is the simulated developer who answers the agent's questions. Use one
only when it changes the outcome, for example "has no account and no API key
yet", "a staff engineer who will push back on vendor lock-in", or "new to the
language". Write the description as facts about the user ("The user is ..."),
never instructions to pick a product. Reuse existing personas from
`gauge personas list --hosted` before creating new ones.
