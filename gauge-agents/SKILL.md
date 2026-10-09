---
name: gauge-agents
description: Core instructions and guide to use the Gauge Agents product and CLI. Reference whenever working with Gauge.
---

# Gauge Agents

## Install the CLI

If `gauge` is not installed, install it with Node.js 22.12 or later:

```sh
npm install -g @withgauge/cli
```

The CLI and this Skill are installed separately.

## Load the instructions

Before using Gauge, run:

```sh
gauge instructions
```

Follow the returned instructions for setup and operation. They ship with the CLI and are the source of truth for agent workflows. Use `gauge instructions <topic>` to reload a specific topic and `gauge <command> --help` for flags.

## Set up repository PR checks

When asked to set up Gauge PR checks, run evals from CI or local builds, author
Git-based eval cases, or connect a repository, read
[references/github-setup.md](references/github-setup.md). It covers choosing
inputs for an npm package, native CLI, docs preview, or Skill, reusing the
repository’s CI, authorizing fork evaluations, supplying local inputs, reading
JSON results, and verifying setup before committing.

## What Gauge is

Gauge helps you optimize how coding agents discover and use your product. It runs coding-agent sessions under stable conditions so you can evaluate performance and test improvements.

- **Agent experience:** How successfully do agents use your product, where do they struggle, and how can you reduce friction?
- **Agent preference:** Which tools do agents select for a given task, and why?

Use the CLI to configure measurements, run sessions, inspect evidence, and test changes to your docs and skills headlessly.
