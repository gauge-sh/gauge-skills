# Sources and prompt patterns

How to turn what a team already knows into preference prompts that look like
real developer requests. Everything here happens locally; only the finished
prompt text goes to Gauge.

## Mining sources

| Source | What to extract | What never leaves the machine |
| --- | --- | --- |
| Signup survey ("what did you ask to find us?") | The capability words and situations people use; group them into 3 to 6 themes | Individual answers, names, emails |
| Sales-call notes, objections | Competitors named, the job the buyer was hiring for, reasons they hesitated | Company names, people, deal details, quotes |
| Support tickets, community questions | The first tasks people attempt and where they get stuck (these become evals) | Ticket text, account ids, logs |
| Competitor docs and comparison pages | The use cases competitors claim; the situations where they position against you | Nothing private; still paraphrase |
| Docs analytics, install paths | Which quickstarts and SDKs matter most | Raw exports |
| Your own README, docs, pricing | Category language, surfaces, the documented first steps | Internal links, unreleased features |

Rules:

- Aggregate first. A theme seen across many sources beats one vivid quote.
  Exact user questions are usually too specific to track over time; turn them
  into the general situation they represent.
- Rewrite every prompt in your own words. A prompt must not identify a customer,
  a person, or a deal.
- Keep a local list of which theme each prompt came from, so the plan can show
  its source without exposing the material.
- Successful-discovery data (people who found you) is biased toward prompts you
  already win. Add situations from lost deals and competitor positioning too.

## Head-to-head prompts

One prompt per competitor pair. The prompt names both products, states the
situation, and asks for a decision before any code. Asking "what else did you
consider" reopens the field and blurs the verdict.

Patterns:

- "We're down to A and B for <capability>. Don't write code yet. Which one
  should we use here, and why?"
- "A or B for <capability> in this <stack> app? Pick one and explain the choice.
  No code yet."
- "We need <capability> for <situation, e.g. a side project with no budget /
  a team that must self-host>. Should we use A or B?"

Use one or two situations that matter to the team (cost, self-hosting,
compliance, scale, ease of first setup) rather than many near-duplicates.

## Open-ended category prompts

These measure whether agents reach for you unprompted. The prompt must not name
your product, its packages, or a competitor. Phrase it the way a developer talks
to an agent inside a repository: a goal, a little context, no shopping list.

Good:

- "Add error tracking to this app so we get alerted when the checkout page
  crashes."
- "Send a welcome email when someone signs up."
- "Add full-text search to the products page."
- "Rate-limit the public API endpoints so one client cannot starve the rest."

Weak:

- "What is the best error-tracking tool?" (a chat question, not a coding task)
- "Compare the top 5 auth providers." (asks for a list, not a choice)
- "Use a modern, developer-friendly observability platform." (steers toward a
  brand by its marketing words)

Vary only what changes the choice: starting repository (empty project vs. an
existing app on a common stack), constraints the developer states, and persona.
Three to five prompts across distinct situations beat twenty paraphrases.

A branded open-ended prompt ("Set up <Product> in this app") measures something
else: whether agents can complete the job once the product is chosen. That is
usually better as an eval.

## Choosing where agents work

- Empty project: tests first choice with no existing stack pulling the agent.
- Small public starter on the developer's stack (for example a framework's
  official template): tests the choice in realistic context.
- The team's own repository: only for evals that change it, never for
  preference prompts the team wants to compare over time.

Add a second scenario to a prompt (`gauge preference scenarios add <id> --repo
<url>`) rather than duplicating the prompt.

## Personas

A persona is the simulated user who answers the agent's questions. Use one only
when it changes the outcome, for example "has no account and no API key yet",
"a staff engineer who will push back on vendor lock-in", or "new to the
language". Write the description as facts about the user ("The user is ..."),
never instructions to pick a product. Reuse existing personas from
`gauge personas list` before creating new ones.
