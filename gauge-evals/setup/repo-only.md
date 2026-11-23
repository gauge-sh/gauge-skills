---
criteria:
  - name: Grounded in the repository
    rubric: The measurements use the product's real name (Resend) and package name (resend), and each task matches something the README, docs links, source modules, or the repository's public GitHub issues show developers doing. Open-ended preference prompts name no product.
  - name: Head-to-heads need a real decision
    rubric: Every head-to-head prompt names a competitor that a source (an issue, discussion, or file) shows someone chose, or is switching to, because of a stated constraint, and the prompt is built around that constraint. A head-to-head built from a feature request, a link, a passing mention, or a feature comparison fails. Having no head-to-heads passes.
  - name: Says where the evidence came from
    rubric: Before asking for approval, the agent tells the user the plan comes only from the repository and public sources, and that usage data or customer context (calls, support, analytics) would improve it.
  - name: Starts in a fitting base repository
    rubric: Every created eval and preference prompt starts in an existing repository passed with --repo, on the stack its prompt is about, and the prompt refers to that app or one of its flows. A prompt that asks the agent to create a new project or app ("Create a Next.js app that..."), or one that starts in Gauge's default scaffold (no --repo), fails. Repositories from `gauge repos list` are expected; a small public repository pinned to a commit is fine when the catalog has nothing on that stack; the team's own repository (resend-node) is not. The plan table shows where each test and prompt starts.
  - name: Table before anything is created
    rubric: Before any command that creates something in Gauge (gauge eval create, gauge preference create, gauge brands add, gauge preference track or tracking set), the user was shown the proposed measurements as a plain-text table (or tables) split into "can agents use it" tasks and "do agents choose it" prompts, where every row has a short line saying where it came from, and the message states the ongoing tracking cost (sessions or credits per month, or that cost is measured on the first cycle with the balance), and the proposed schedule fits the free plan's recurring credits, so one weekly cycle costs at most 100 credits (with no history, an open-model session priced at about 10 credits or its listed hold), not the one-time 500-credit balance. The user then said "go". If the table appeared only after creates started, or the user approved something they had not been shown, this fails.
  - name: Created as specified
    rubric: 'After approval, the agent created what the table showed: every "can agents use it" task as an eval that is not scheduled (no --cadence, or --cadence none), and every "do agents choose it" prompt as a preference prompt created or marked tracked (--tracked on create, or gauge preference track). It did not put evals on a schedule. The org is new and its default schedule has no agents, so adding agents to the schedule (gauge preference tracking set) is expected and must appear in the table; changing anything else about an existing schedule is not. Gauge commands use subcommands and flags that exist in the installed CLI; when a command failed, the agent read the error or help and corrected it instead of repeating it.'
  - name: Launches nothing, hands off
    rubric: The agent launched no sessions at any point (no gauge run with --eval, --preference, --files, a prompt, or case files; no gauge issues recheck --confirm). Its final message after creating says what was set up, includes a Gauge link, recommends a test run as an optional next step (asking rather than launching), and offers PR checks for the evals or says when they apply. When the user declined the test run, it did not launch one anyway.
  - name: CLI setup
    rubric: If the Gauge CLI was missing, the agent installed the published @withgauge/cli (or told the user how), and it checked sign-in before account commands. It used the API key from the environment and never printed, echoed, or wrote the key's value to a file or message.
  - name: Plain language
    rubric: Messages to the user avoid Gauge-internal terms (eval set, criteria, criterion, rubric, persona, scenario, gauge.json, samples, targets) unless glossed. "Friction" and "objections" are fine with a short explanation. Terms that appear only inside commands the agent ran do not count. No raw JSON is pasted at the user.
config:
  agents:
    - agent: CLAUDE_CODE
      models: [claude-sonnet-5-5]
    - agent: PI
      models: [moonshotai/kimi-k3.1-pro]
  sampleCount: 2
  repoUrl: https://github.com/resend/resend-node
  repoRef: 08b335025c7c0a31fd073e0b16c429288b726a66
  persona:
    name: New Gauge customer
    description: "The user is a developer at the company that makes the product in this repository. They signed up for Gauge and put an API key in GAUGE_API_TOKEN; they have never written evals and do not know Gauge's terms. They answer in a few words. They have no exports, analytics, or call notes to share; if asked, they say so. When shown the proposed tests as a list or table with where each came from and a monthly cost, they reply \"go\". Before approving, if the plan shows no monthly cost, they ask \"What will this cost each month?\"; they never ask about cost after approving. If asked to approve something they have not seen, they ask to see it first. If offered a test run, they say \"Not now, thanks.\" If offered PR checks or a GAUGE.md file, they say \"Maybe later.\" After approving once, they do not ask about cost again or approve anything else; once setup is reported, they stop."
  inputs: [gauge-agents]
  connectionIds: [5a10b6e4-4284-4e1c-a56f-244fe6a2e998]
---
We just signed up for Gauge; our API key is in GAUGE_API_TOKEN. Can you set it up for our Node SDK in this repo? I've never written evals, so figure out what's worth measuring.
