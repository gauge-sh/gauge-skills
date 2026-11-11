# GitHub App review concept

The draft PR demonstrates two separate surfaces:

- `github-agent-review.md`: the parent comment with review and required-eval status.
- `github-agent-finding.md`: a short inline finding on `example/docs/quickstart.md:8`, with embedded session evidence and a one-line fix.

The Acme SDK, candidate quickstart, session events, and three passing required evals are fictional. The sample evals represent existing integration tests that start with the SDK installed; an exploratory docs review exposes the installation problem outside that coverage. No real run or measured regression is claimed. No evals were launched.

## Session screenshot

`session-preview/session-evidence.png` is a browser screenshot of the real Gauge `RunLogView`, including its command execution cards, styles, theme, and fonts. The surrounding header is a small presentation wrapper. `sample-events.json` supplies invented events. The screenshot labels that provenance visibly.

To reproduce from this repository's root:

1. Set `GAUGE_SOURCE` to a Gauge application checkout with installed dependencies, then run `node mockups/session-preview/build.mjs`.
2. Serve `.rendered-session/` on localhost port 43871.
3. With `playwright` resolvable, run `node mockups/session-preview/capture.mjs`. Optional `CHROME_PATH` selects an existing Chromium executable; `PREVIEW_URL` changes the local URL.

The build reads Gauge components without modifying that checkout, stubs only Next navigation for this standalone render, and makes no backend requests. Generated JS, CSS, and copied fonts remain ignored in `.rendered-session/`; only the final screenshot is committed.
