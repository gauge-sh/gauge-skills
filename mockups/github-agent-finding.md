### 🟠 Medium · Quickstart installs the wrong package

The install command uses `acme`, but the SDK is `@acme/sdk`. The sample agent follows the docs, hits a 404, and has to discover the correct package before continuing.

![Illustrative Gauge session: the agent follows the quickstart, gets an npm 404, and checks the correct scoped package.](https://raw.githubusercontent.com/gauge-sh/gauge-skills/mockup/agent-review-preview/mockups/session-preview/session-evidence.png)

**Fix:** change the command to `npm install @acme/sdk`.

<sub>Illustrative finding and session data · Actual Gauge viewer components</sub>
