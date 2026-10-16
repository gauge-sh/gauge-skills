### Check CLI capabilities before starting setup

`Low severity` · Agent friction · [github-setup.md:201–208](https://github.com/gauge-sh/gauge-skills/blob/caa940ff5714da215f630c03257a89528348a434/gauge-agents/references/github-setup.md#L201-L208)

The upgrade check comes **after** the configuration and CI instructions. Agents with an older CLI can reach final verification before discovering that the required command is missing.

```markdown
Before committing, run `gauge evals verify -o json`.
...
If the installed CLI lacks `verify`, update it while preserving the selected
Skill (`GAUGE_SKIP_SKILL_INSTALL=1 npm install -g @withgauge/cli`).
```

**Sample evidence** · Earlier Astro sessions, recorded in [this PR’s EVALS.md:86–95](https://github.com/gauge-sh/gauge-skills/blob/caa940ff5714da215f630c03257a89528348a434/EVALS.md#L86-L95):

| Agent | Recorded behavior |
| :--- | :--- |
| [DeepSeek](https://agents.withgauge.com/gauge-x6af/runs/cmuxh5muq000n0iuqzzp0sjs5) · [GLM](https://agents.withgauge.com/gauge-x6af/runs/cmuxh5muq000o0iuq51jdpqu9) | CLI 0.14.0 lacked `verify`; both used external schema/regex validation. |

**Suggested fix** · Add a preflight before “Inspect and choose the input”:

```diff
+ Check that `gauge evals verify --help` is available before setup.
+ If missing, upgrade while preserving the selected Skill, then reload
+ `gauge instructions`. If still unavailable, report the blocker.
```

<details>
<summary>Evidence context</summary>

These sessions predate the latest run; their failures were attributed to rubric wording, not this friction. Moving the check earlier is a review suggestion, not a measured improvement.

</details>

---

✅ **Configured evals: 9/9 passed** · [Latest results](https://github.com/gauge-sh/gauge-skills/pull/2#issuecomment-6005590376)

<sub>Gauge review concept · Based on PR #2 · No new sessions run</sub>
