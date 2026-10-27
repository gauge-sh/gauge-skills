---
name: gauge-agents
description: Test how coding agents discover and use your product. Use when asked to run agent evaluations, test whether agents can use an SDK, API, CLI, or MCP server, find where agents struggle with onboarding, or measure whether docs and skills improve agent success. Runs real agent sessions and scores outcomes through the Gauge CLI. Also use for Gauge Agents tasks; not ordinary unit tests or AI-search visibility tracking.
---

# Gauge Agents

## Install the CLI

Check `gauge --version`. If it is missing, install it with Node.js 22.13 or later:

```sh
npm install -g @withgauge/cli
```

The Skill is already installed. When `gauge instructions` or `gauge init`
recommends `gauge install-skill`, skip it to preserve this selected version and
its references.

Honor a requested CLI version by installing `@withgauge/cli@<version>` from npm.
A locally built package can report the same version as a release; for release
qualification, compare the installed package with the published tarball or reinstall
the exact registry version. Keep that version fixed across baseline and candidate runs.

## Load the instructions

Before using Gauge, run:

```sh
gauge instructions
```

Follow the returned instructions for setup and operation. They ship with the CLI and are the source of truth for agent workflows. Use `gauge instructions <topic>` to reload a specific topic and `gauge <command> --help` for flags.

Choose guidance for the user's task:

| Task | Read |
| --- | --- |
| First pilot or improving a product, skill, or docs | `gauge instructions hillclimb` |
| Workspace and local/hosted selection | `gauge instructions init` |
| Save a reusable task-success evaluation | `gauge instructions eval` |
| Save a product-choice measurement | `gauge instructions preference` |
| Inputs, shared case files, previews, and launches | `gauge instructions run` |
| Read evidence and compare results | `gauge instructions session-analysis` |

Local is the default, independently of login or a configured organization. Use
the intended `--local` or `--hosted` mode when reading guidance and running commands.
Local measurement authoring needs neither Docker nor a Gauge account; execution
needs Docker, the runtime image, and agent credentials. Preserve `.gauge/`: its
SQLite database contains saved measurements and history.

For ongoing local work, save an eval or preference and rerun its ID with the
selected inputs. Use `gauge-cases/` for shared or automated cases. The tested agent
receives only its prompt, selected inputs, and configured consumer repository;
it does not inherit the author's checkout. Preview the selected bytes before
launching. Keep task, criteria, model, and fixtures fixed when testing a skill change.

For replacing HTTPS documentation during a local test, read
[references/web-fixtures.md](references/web-fixtures.md) for a complete fixture
example. A `web-fixture` supports local canonical-URL replacement; a `website`
input resolves GitHub deployment previews and requires hosted execution.

## Set up repository PR checks

When asked to set up Gauge PR checks or connect a repository, read
[references/github-setup.md](references/github-setup.md). It covers choosing
inputs for an npm package, native CLI, docs preview, or Skill, reusing the
repository’s CI, authoring advisory Agent Preference cases, selecting relevant
file changes, and verifying setup before committing.

## What Gauge is

Gauge helps you optimize how coding agents discover and use your product. It runs coding-agent sessions under stable conditions so you can evaluate performance and test improvements.

- **Agent experience:** How successfully do agents use your product, where do they struggle, and how can you reduce friction?
- **Agent preference:** Which tools do agents select for a given task, and why?

Use the CLI to configure measurements, run sessions, inspect evidence, and test changes to your docs and skills headlessly.
