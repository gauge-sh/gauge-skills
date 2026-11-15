#!/usr/bin/env node
// gauge-kit: a small runner over the Gauge CLI for eval files kept in this repo.
//
// Layout it expects (see the setup skill's references/evals-kit.md):
//   gauge.json                      Gauge inputs (and optionally the org)
//   gauge-cases/smoke/**.md         cheap, run on schedule and before shipping
//   gauge-cases/deep/**.md          slower or costlier, run on request
//   gauge-cases/pending/**.md       written before a change; expected to fail until it ships
//   gauge-kit/kit.json              runner settings (credits per session, rotation)
//
// A case for a source file mirrors its path: docs/install/react.mdx is covered by
// gauge-cases/<suite>/docs/install/react.<check>.md (or react.md).
//
// Commands:
//   list    [selection]                       print the selected case files
//   verify                                    static check of gauge.json and cases (no login, no cost)
//   plan    [selection] [budget]              preview session counts with the CLI (free; contacts Gauge)
//   run     [selection] [budget] [--yes] [--no-wait]
//   results                                   wait for and summarize the last run
// Selection: --suite smoke|deep|pending|all (default smoke)  --match <text>  --changed <git-ref>
// Budget:    --max-sessions <n>  --budget <credits> (needs creditsPerSession in kit.json)
// Env:       GAUGE_ORG selects the organization; GAUGE_API_TOKEN authenticates in CI.
//
// Requires Node.js 22+ and the Gauge CLI on PATH. No other dependencies.

import { spawnSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, sep } from "node:path";
import { createInterface } from "node:readline/promises";

const CASES_DIR = "gauge-cases";
const SUITES = ["smoke", "deep", "pending"];
const KIT_DIR = "gauge-kit";
const RESULTS_JSON = join(KIT_DIR, "last-results.json");
const RESULTS_MD = join(KIT_DIR, "last-results.md");
const MAX_FILES_PER_PLAN = 20;

function fail(message) {
  console.error(`gauge-kit: ${message}`);
  process.exit(2);
}

function loadConfig() {
  const defaults = { creditsPerSession: null, rotationDays: 14 };
  const path = join(KIT_DIR, "kit.json");
  if (!existsSync(path)) return defaults;
  return { ...defaults, ...JSON.parse(readFileSync(path, "utf8")) };
}

function parseArgs(argv) {
  const opts = { cmd: argv[0], suite: "smoke", yes: false, wait: true };
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) fail(`${a} needs a value`);
      return argv[++i];
    };
    if (a === "--suite") opts.suite = next();
    else if (a === "--match") opts.match = next();
    else if (a === "--changed") opts.changed = next();
    else if (a === "--max-sessions") opts.maxSessions = Number(next());
    else if (a === "--budget") opts.budget = Number(next());
    else if (a === "--yes") opts.yes = true;
    else if (a === "--no-wait") opts.wait = false;
    else fail(`unknown option ${a}`);
  }
  for (const [flag, value] of [
    ["--max-sessions", opts.maxSessions],
    ["--budget", opts.budget],
  ]) {
    if (value !== undefined && !(Number.isFinite(value) && value > 0))
      fail(`${flag} must be a positive number`);
  }
  if (opts.suite !== "all" && !SUITES.includes(opts.suite))
    fail(`--suite must be one of ${SUITES.join(", ")}, all`);
  return opts;
}

// ---- Gauge CLI -----------------------------------------------------------

function gauge(args, { allowFail = false } = {}) {
  const full = [
    ...(process.env.GAUGE_ORG ? ["--org", process.env.GAUGE_ORG] : []),
    ...args,
  ];
  const res = spawnSync("gauge", full, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.error) fail(`could not start gauge: ${res.error.message}`);
  if (res.status !== 0 && !allowFail) {
    fail(`gauge ${full.join(" ")} exited ${res.status}:\n${res.stderr}`);
  }
  return { status: res.status, stdout: res.stdout, stderr: res.stderr };
}

function gaugeJson(args, options) {
  const res = gauge([...args, "-o", "json"], options);
  try {
    return JSON.parse(res.stdout);
  } catch {
    fail(`expected JSON from gauge ${args.join(" ")}, got:\n${res.stdout}\n${res.stderr}`);
  }
}

// ---- Selection -------------------------------------------------------------

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.isFile() && e.name.endsWith(".md") ? [p] : [];
  });
}

const toPosix = (p) => p.split(sep).join("/");
const stripExt = (p) => p.replace(/\.[^./]+$/, "");

function caseKeys(casePath) {
  // gauge-cases/<suite>/docs/install/react.install.md -> docs/install/react.install, docs/install/react
  const inSuite = toPosix(casePath).split("/").slice(2).join("/");
  const bare = stripExt(inSuite);
  return [bare, stripExt(bare)];
}

function changedFiles(ref) {
  const lines = (args) => {
    const r = spawnSync("git", args, { encoding: "utf8" });
    if (r.status !== 0) fail(`git ${args.join(" ")} failed:\n${r.stderr}`);
    return r.stdout.split("\n").filter(Boolean);
  };
  return new Set([
    ...lines(["diff", "--name-only", `${ref}...HEAD`]),
    ...lines(["diff", "--name-only"]),
  ]);
}

function selectCases(opts) {
  const suites = opts.suite === "all" ? ["smoke", "deep"] : [opts.suite];
  let cases = suites.flatMap((s) => walk(join(CASES_DIR, s))).map(toPosix).sort();
  if (opts.match) cases = cases.filter((c) => c.includes(opts.match));
  if (opts.changed) {
    const changed = changedFiles(opts.changed);
    if (!changed.has("gauge.json")) {
      const changedKeys = new Set([...changed].map(stripExt));
      cases = cases.filter(
        (c) => changed.has(c) || caseKeys(c).some((k) => changedKeys.has(k)),
      );
    }
  }
  return cases;
}

// ---- Plan and budget ------------------------------------------------------------

function planCases(cases) {
  const planned = [];
  for (let i = 0; i < cases.length; i += MAX_FILES_PER_PLAN) {
    const chunk = cases.slice(i, i + MAX_FILES_PER_PLAN);
    const plan = gaugeJson(["run", "--hosted", "--dry-run", "--files", ...chunk]);
    if (plan.canRun === false)
      console.error("warning: Gauge reports some inputs are not ready; see `gauge run --hosted --dry-run`.");
    const byPath = new Map((plan.cases ?? []).map((c) => [toPosix(c.path), c]));
    chunk.forEach((path, j) => {
      const c = byPath.get(path) ?? plan.cases?.[j];
      planned.push({ path, sessions: c?.expectedRuns ?? 0 });
    });
  }
  return planned;
}

function applyBudget(planned, opts, config) {
  let capacity = Number.isFinite(opts.maxSessions) ? opts.maxSessions : Infinity;
  if (Number.isFinite(opts.budget)) {
    if (!config.creditsPerSession)
      fail("--budget needs creditsPerSession in gauge-kit/kit.json; use --max-sessions instead");
    capacity = Math.min(capacity, Math.floor(opts.budget / config.creditsPerSession));
  }
  const total = planned.reduce((s, c) => s + c.sessions, 0);
  if (total <= capacity) return { chosen: planned, skipped: [] };
  // Rotate through the list so every case runs over successive periods.
  const avg = Math.max(1, total / planned.length);
  const perPeriod = Math.max(1, Math.floor(capacity / avg));
  const period = Math.floor(Date.now() / 86_400_000 / config.rotationDays);
  const offset = (period * perPeriod) % planned.length;
  const rotated = [...planned.slice(offset), ...planned.slice(0, offset)];
  const chosen = [];
  let used = 0;
  for (const c of rotated) {
    if (used + c.sessions <= capacity) {
      chosen.push(c);
      used += c.sessions;
    }
  }
  const keep = new Set(chosen.map((c) => c.path));
  return { chosen, skipped: planned.filter((c) => !keep.has(c.path)) };
}

function describePlan({ chosen, skipped }, config) {
  const sessions = chosen.reduce((s, c) => s + c.sessions, 0);
  for (const c of chosen) console.log(`  ${String(c.sessions).padStart(3)}  ${c.path}`);
  if (skipped.length) console.log(`  (${skipped.length} cases left for a later rotation)`);
  const credits = config.creditsPerSession
    ? `~${Math.round(sessions * config.creditsPerSession)} credits`
    : "credits not estimated (set creditsPerSession in gauge-kit/kit.json)";
  const line = `${chosen.length} cases, ${sessions} sessions, ${credits}`;
  console.log(line);
  return { sessions, line };
}

async function confirm(question, yes) {
  if (yes) return true;
  if (!process.stdin.isTTY) fail("not a terminal; pass --yes to launch");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${question} [y/N] `);
  rl.close();
  return /^y(es)?$/i.test(answer.trim());
}

// ---- Results ---------------------------------------------------------------------

function waitFor(requestId) {
  // --check makes stdout JSON only; its exit code 1 means "not passed", which is a result.
  return gaugeJson(["run", "wait", requestId, "--hosted", "--check"], { allowFail: true });
}

function summarize(launches) {
  const rows = [];
  for (const l of launches) {
    const runs = (l.result?.batches ?? []).flatMap((b) => b.runs ?? []);
    const count = (r) => runs.filter((x) => x.result === r).length;
    const failedCriteria = new Map();
    for (const run of runs)
      for (const cr of run.criterionResults ?? [])
        if (cr.passed === false)
          failedCriteria.set(cr.name, (failedCriteria.get(cr.name) ?? 0) + 1);
    const operational =
      count("EXECUTION_FAILED") + count("INPUT_FAILED") + count("JUDGE_FAILED") + count("INCOMPLETE");
    const pending = l.path.startsWith(`${CASES_DIR}/pending/`);
    const passed = count("PASSED");
    const measured = count("MEASURED");
    const firstLink = (runs.find((r) => r.result !== "PASSED") ?? runs[0])?.url ?? "";
    let status;
    if (!l.result?.settled) status = "running";
    else if (operational) status = "setup error";
    else if (measured) status = "measured";
    else if (passed === runs.length) status = pending ? "ready (now passes)" : "pass";
    else status = pending ? "not yet (expected)" : "FAIL";
    rows.push({
      case: l.path,
      status,
      passed: `${passed}/${runs.length}`,
      failing: [...failedCriteria].map(([n, k]) => `${n} (${k})`).join(", "),
      link: firstLink,
    });
  }
  const order = { FAIL: 0, "setup error": 1, "ready (now passes)": 2 };
  rows.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  const lines = [
    "| Case | Status | Passed | Failing criteria | Session |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map(
      (r) =>
        `| ${r.case} | ${r.status} | ${r.passed} | ${r.failing || "-"} | ${r.link ? `[open](${r.link})` : "-"} |`,
    ),
  ];
  return lines.join("\n");
}

function writeResults(launches, header) {
  mkdirSync(KIT_DIR, { recursive: true });
  writeFileSync(RESULTS_JSON, JSON.stringify({ header, launches }, null, 2));
  const md = `## Gauge evals\n\n${header}\n\n${summarize(launches)}\n`;
  writeFileSync(RESULTS_MD, md);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  console.log(md);
}

// ---- Commands --------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const config = loadConfig();
  switch (opts.cmd) {
    case "list":
      for (const c of selectCases(opts)) console.log(c);
      return;
    case "verify": {
      const res = gauge(["run", "--verify", "--hosted", "-o", "json"], { allowFail: true });
      console.log(res.stdout || res.stderr);
      process.exit(res.status ?? 1);
    }
    case "plan": {
      const cases = selectCases(opts);
      if (!cases.length) return console.log("No cases selected.");
      describePlan(applyBudget(planCases(cases), opts, config), config);
      return;
    }
    case "run": {
      const cases = selectCases(opts);
      if (!cases.length) return console.log("No cases selected; nothing to run.");
      const selection = applyBudget(planCases(cases), opts, config);
      const { sessions, line } = describePlan(selection, config);
      if (!sessions) return console.log("Nothing to launch.");
      if (!(await confirm(`Launch ${sessions} sessions? This spends credits.`, opts.yes)))
        return console.log("Not launched.");
      // One request per case keeps every result attributable to its file.
      const launches = selection.chosen.map((c) => {
        const res = gaugeJson(["run", "--hosted", "--files", c.path, "--yes"]);
        return { path: c.path, requestId: res.runRequestId, url: res.aggregateUrl };
      });
      console.log(`Launched ${launches.length} requests. Live view: gauge watch --hosted`);
      if (!opts.wait) return writeResults(launches, `${line} (launched; run \`results\` later)`);
      for (const l of launches) l.result = waitFor(l.requestId);
      return writeResults(launches, line);
    }
    case "results": {
      if (!existsSync(RESULTS_JSON)) fail(`no ${RESULTS_JSON}; run \`run\` first`);
      const saved = JSON.parse(readFileSync(RESULTS_JSON, "utf8"));
      for (const l of saved.launches) if (!l.result?.settled) l.result = waitFor(l.requestId);
      return writeResults(saved.launches, saved.header);
    }
    default:
      console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 24).join("\n"));
  }
}

main();
