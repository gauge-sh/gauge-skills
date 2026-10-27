---
criteria:
  - name: Reviewable PR configuration
    rubric: Produces a coherent supported Gauge PR setup for the requested npm CLI, with a real executable package, PR packaging workflow, matching input paths, and one relevant eval case. Uses the supplied organization identity without inventing account details. Preserves separation of package inputs and consumer task.
  - name: Verification and handoff
    rubric: Uses the installed CLI to statically validate the working-tree setup and fixes definite errors. Demonstrates the tarball can be installed and its command invoked. Accurately states any external GitHub App or live CI prerequisites. Does not push, create remote resources, or launch nested sessions.
config:
  agents:
    - agent: OPENCODE
      models: [z-ai/glm-5.3]
  sampleCount: 1
  inputs: [gauge-agents, cli-release]
---

Create a tiny npm CLI project in a new directory called hello-cli. Its hello command should print Hello followed by the supplied name. Set up Gauge PR checks so an agent tests the package built from the PR, using a single task that runs the CLI for Ada and checks the greeting. Our Gauge organization is gauge, ID 88855afc-7ea3-48bd-929d-9fd7eda59aba. Use the installed Gauge CLI and leave a locally verified patch ready for review. You can build and install packages locally; don't push, contact GitHub to change settings, or launch paid sessions.
