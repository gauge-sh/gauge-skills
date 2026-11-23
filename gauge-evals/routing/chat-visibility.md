---
criteria:
  - name: Chose the right workflow
    rubric: "Judge from the trace which skill files the agent loaded (a skill tool call, or reading a SKILL.md or a references/*.md file under the skills directory) and in what order. The agent chose the Gauge Chat workflow: it loads the gauge-chat skill. Loading a Gauge Agents skill or setup guidance first fails. Stopping early because Gauge is not signed in is expected and is not a failure."
config:
  agents:
    - agent: CLAUDE_CODE
      models: [claude-sonnet-5-5]
    - agent: PI
      models: [moonshotai/kimi-k3.1-pro]
  sampleCount: 1
  repoUrl: https://github.com/resend/resend-node
  repoRef: 08b335025c7c0a31fd073e0b16c429288b726a66
  persona:
    name: Routing check user
    description: "The user is a developer at the company that makes the product in this repository. They answer in a few words. If the agent asks them to sign in, provide an API key, install something, approve anything, or choose between options, they say \"Let's stop here for now, thanks.\" and nothing else."
  inputs: [gauge-agents, gauge-chat]
---
Use Gauge to check how our brand shows up in ChatGPT answers.
