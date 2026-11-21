# Context sources

Gauge sees only what you send it. The team's analytics, docs traffic, calls,
and support questions show what developers actually attempt, where they get
stuck, and which products they weigh. Read them locally, with the user's
permission, and turn them into evidence (see step 4 of the skill).

Everything here is read-only. Never change records, post comments, or trigger
workflows in these systems.

## What each source is good for

| Source | Agent Experience evidence | Agent Preference evidence |
| --- | --- | --- |
| MCP and product analytics (for example PostHog) | MCP tools that error or are retried; the first tools agents call; onboarding steps where people drop off | Which agents and clients developers use (sets which agents to test); "how did you hear about us" answers |
| Docs analytics (for example Mintlify) | Pages agents read most; search queries and assistant questions with no good answer; pages with negative feedback | Category words developers use; which agents reach the docs |
| Call recordings and CRM (for example Attio, Gong) | Integration tasks customers describe and where they got stuck | Competitors named; the constraint that decided the deal; why buyers hesitated or chose someone else |
| Support inbox and docs assistant (for example Intercom) | The first tasks people attempt and where they get stuck; error messages they paste | Questions comparing the product with alternatives |
| GitHub issues and discussions | Setup problems, confusing errors, missing examples | "Alternative to X" and migration requests |
| The repository | The documented first task and the surfaces that implement it | Comparison pages, migration guides, competitors the docs name |

Prefer the last 30 to 90 days. Older material describes a product that may have
changed.

## How to read each source

These are starting points. Tools and plans differ; check what the connected
tool or CLI actually offers before you rely on a recipe, and say so in the plan
if a source turned out to be unavailable.

### MCP and product analytics (PostHog)

If the team's MCP server is instrumented with PostHog MCP Analytics, each tool
call is a `$mcp_tool_call` event. Through the PostHog MCP (it needs read access
to MCP analytics) or its SQL query tool, look for:

- tools with the highest error rate, and the errors they return
- the first tool called in a session, and sequences that end in an error or
  are abandoned
- which clients and agent harnesses call the server

Inspect the event's properties before writing a query; names differ between
SDK versions. For a product without an MCP server, look for an onboarding funnel
(sign-up to first successful API call) and the step with the largest drop, and
for survey answers about how people found the product.

Becomes: an Agent Experience eval for the task behind the tool that fails most;
the agent list for every measurement.

### Docs analytics (Mintlify and others)

Mintlify classifies traffic as human or AI agent by user agent, and exposes
page views, visitors, search queries, assistant conversations, and feedback
through its dashboard export, analytics API (an admin key; rate-limited), the
`mint` CLI, or its admin MCP. Analytics needs a paid plan. Look for:

- pages with the most agent traffic, and how that compares with human traffic
- assistant questions and searches that got no useful answer
- pages with negative feedback

Other docs platforms often have similar data: agent versus human traffic, search
terms, and "ask AI" questions. If the docs are self-hosted, server or CDN logs
filtered by agent user agents show the same thing.

Becomes: Agent Experience evals for the tasks behind the most-read pages (the
page is a surface the eval covers); open-ended preference prompts in the words
developers use.

### Call recordings and CRM (Attio, Gong, and others)

Attio's MCP can search call recordings by meaning and fetch a recording's
transcript. Gong is reachable through its API or a community MCP server; if
neither is set up, ask for an export. Search for topics, not exact phrases:

- evaluating the product against alternatives; why a customer chose it or
  chose something else
- the integration work customers describe and where it stalled
- the constraints that came up (self-hosting, compliance, price, scale, a
  specific stack)

Also read the reasons recorded on lost deals, if the CRM has them. Cap the
reading at about 30 recent calls; you need themes, not every call.

Becomes: head-to-heads (the competitor and the deciding constraint); open-ended
situations; occasionally an Agent Experience eval for a painful integration
step.

### Support inbox and docs assistant

Read recent conversations tagged as setup, onboarding, integration, or errors.
Note the task the person was attempting and the step where they got stuck,
including error messages they pasted (paraphrase them; error text can contain
account details).

Becomes: Agent Experience evals and the checks for them.

### GitHub issues and discussions

Available to almost everyone and usually public:

```sh
gh issue list --repo <owner/repo> --state all --limit 100 --search "setup OR install OR error OR example" --json number,title,labels,createdAt,comments
gh issue view <number> --repo <owner/repo> --comments
```

Without `gh`, use GitHub's search API, which can exclude pull requests and
search the same words (no token needed; about 10 searches a minute):

```sh
curl -s "https://api.github.com/search/issues?q=repo:<owner>/<repo>+is:issue+setup+OR+install+OR+error+OR+example&sort=created&order=desc&per_page=100"
curl -s "https://api.github.com/repos/<owner>/<repo>/issues/<number>/comments"
```

Look for repeated setup questions, confusing errors, missing examples, and
"alternative to" or migration requests.

Becomes: Agent Experience evals; occasionally a head-to-head when a migration
request names a competitor.

### Files the user points to

A survey export, a CSV of support tickets, or call notes saved to disk. Read
them where they are; do not copy them into the repository.

## Handling what you read

- Count and summarize; do not collect quotes. "11 of 30 calls mention
  self-hosting" is evidence; a customer's sentence is not something to keep.
- Keep raw material out of the repository, out of `GAUGE.md`, and out of
  anything sent to Gauge. The evidence file holds themes, counts, and source
  names only.
- Name the source type in the plan ("from 6 support conversations"), never a
  customer, person, or deal.
- If a source holds personal data you do not need, stop reading it at the
  first useful aggregate.
