### Gauge · Agent experience review

**Good direction · 2 opportunities to make setup easier for agents**

This change gives agents a clear way to choose the right product input, reuse existing CI, and verify their work. Preserving the selected Skill during CLI installation also prevents setup from replacing the instructions being evaluated.

Two places could still leave agents with extra work or an incomplete handoff:

#### 1. Make the Python fallback actionable

[Python package guidance](https://github.com/gauge-sh/gauge-skills/blob/caa940ff5714da215f630c03257a89528348a434/gauge-agents/references/github-setup.md#inspect-and-choose-the-input) explains that files can deliver a wheel but will not install it. Unlike the npm and native CLI paths, it has no worked example connecting delivery to use in a consumer application.

**Why it matters:** An agent could produce a valid file input and still leave the user unable to test the candidate package.

**Suggested change:** Add a short wheel example showing how to locate the staged candidate, install it in the consumer environment, and verify that the import resolves to that installation. Mark the installation step as manual; keep the remaining activation steps explicit.

#### 2. Check CLI capabilities before authoring configuration

[Verification guidance](https://github.com/gauge-sh/gauge-skills/blob/caa940ff5714da215f630c03257a89528348a434/gauge-agents/references/github-setup.md#verify-and-hand-off) handles a CLI without `evals verify`, but only after the configuration and CI instructions.

**Why it matters:** An agent with an older CLI may follow incompatible help or discover the missing command after writing its patch.

**Suggested change:** Move the capability check to the start of setup. If an upgrade is needed, preserve the selected Skill, reload CLI instructions, then choose the input and write configuration.

---

**Configured evals · ✅ 9/9 sessions passed**

The existing suite covers CLI setup, Vite, GitHub CLI, FastAPI, and Astro docs. Passing those cases supports the tested workflows; the review above identifies opportunities beyond their pass/fail criteria.

<details>
<summary>Eval evidence and review scope</summary>

- [Existing results from PR #2](https://github.com/gauge-sh/gauge-skills/pull/2#issuecomment-6005590376): 27/27 criterion verdicts passed at `caa940ff5714`.
- One sample per configured case/model combination. No new sessions were run for this preview.
- Suggestions come from reading the changed Skill and setup reference. Their effects on agent behavior have not been measured.
- In the proposed app, teams could keep selected configured evals as required checks alongside the broader review. This mock-up does not change branch protection.

</details>

<sub>Concept preview · Sample review of PR #2, prepared for design-partner feedback. This is a proposed GitHub App experience, not a live automated review.</sub>
