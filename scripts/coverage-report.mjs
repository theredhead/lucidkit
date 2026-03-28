#!/usr/bin/env node

/**
 * coverage-report.mjs
 *
 * Analyses the coverage-summary.json produced by `npm run test:coverage` and
 * prints a prioritised report of under-covered source files.
 *
 * Usage:
 *   node scripts/coverage-report.mjs          # analyse existing data
 *   node scripts/coverage-report.mjs --run     # run tests first, then analyse
 *   node scripts/coverage-report.mjs --help
 *
 * The report groups files into three buckets:
 *   🔴  Critical  (< 40 % line coverage)
 *   🟡  Needs work (40–79 %)
 *   🟢  Healthy   (≥ 80 %)
 *
 * Barrel re-exports (index.ts), HTML templates, and SCSS stylesheets are
 * excluded — they are not meaningful coverage targets.
 */

import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const SUMMARY = resolve(ROOT, "coverage", "coverage-summary.json");

// ── CLI flags ──────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Usage:  node scripts/coverage-report.mjs [options]

Options:
  --run       Run test:coverage before analysing (takes ~30 s)
  --json      Output raw JSON instead of the human-readable report
  --all       Include healthy files (>=80 %) in the report
  --threshold <n>  Set the "healthy" cutoff (default: 80)
  --help      Show this message
`);
  process.exit(0);
}

const shouldRun = args.includes("--run");
const outputJson = args.includes("--json");
const showAll = args.includes("--all");
const thresholdIdx = args.indexOf("--threshold");
const HEALTHY = thresholdIdx !== -1 ? Number(args[thresholdIdx + 1]) : 80;
const NEEDS_WORK = 40;

// ── Generate coverage data if requested or missing ─────────────────

if (shouldRun || !existsSync(SUMMARY)) {
  if (!shouldRun) {
    console.log(
      "⚠  No coverage-summary.json found — running test:coverage …\n",
    );
  } else {
    console.log("Running test:coverage …\n");
  }
  try {
    execSync("npx vitest run --coverage", {
      cwd: ROOT,
      stdio: "inherit",
    });
  } catch {
    console.error("❌  test:coverage failed — aborting.");
    process.exit(1);
  }
}

if (!existsSync(SUMMARY)) {
  console.error(
    "❌  coverage-summary.json still not found after test run.",
    "\n   Does vitest.config.ts include json-summary in coverage.reporter?",
  );
  process.exit(1);
}

// ── Parse and classify ─────────────────────────────────────────────

const data = JSON.parse(readFileSync(SUMMARY, "utf8"));

/** Returns true for files we never want in the report. */
function isExcluded(filePath) {
  if (/index\.ts$/.test(filePath)) return true;
  if (filePath.endsWith(".html")) return true;
  if (filePath.endsWith(".scss")) return true;
  if (filePath.endsWith(".stories.ts")) return true;
  if (filePath.endsWith(".spec.ts")) return true;
  return false;
}

const rows = [];

for (const [absPath, metrics] of Object.entries(data)) {
  if (absPath === "total") continue;
  if (isExcluded(absPath)) continue;

  const rel = relative(ROOT, absPath);
  const stmts = metrics.statements?.pct ?? 0;
  const branch = metrics.branches?.pct ?? 0;
  const funcs = metrics.functions?.pct ?? 0;
  const lines = metrics.lines?.pct ?? 0;

  rows.push({ file: rel, stmts, branch, funcs, lines });
}

rows.sort((a, b) => a.lines - b.lines);

const critical = rows.filter((r) => r.lines < NEEDS_WORK);
const needsWork = rows.filter(
  (r) => r.lines >= NEEDS_WORK && r.lines < HEALTHY,
);
const healthy = rows.filter((r) => r.lines >= HEALTHY);

// ── JSON output ────────────────────────────────────────────────────

if (outputJson) {
  const totals = data.total;
  console.log(
    JSON.stringify(
      {
        totals: {
          statements: totals.statements.pct,
          branches: totals.branches.pct,
          functions: totals.functions.pct,
          lines: totals.lines.pct,
        },
        files: rows.length,
        critical: critical.map((r) => r.file),
        needsWork: needsWork.map((r) => r.file),
        healthy: healthy.length,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

// ── Human-readable report ──────────────────────────────────────────

const totals = data.total;

console.log("╔══════════════════════════════════════════════════════════════╗");
console.log("║                  TEST COVERAGE REPORT                      ║");
console.log("╠══════════════════════════════════════════════════════════════╣");
console.log(
  `║  Statements: ${pad(totals.statements.pct)}%   Branches: ${pad(totals.branches.pct)}%            ║`,
);
console.log(
  `║  Functions:  ${pad(totals.functions.pct)}%   Lines:    ${pad(totals.lines.pct)}%            ║`,
);
console.log(
  `║  Source files analysed: ${String(rows.length).padStart(3)}                              ║`,
);
console.log("╚══════════════════════════════════════════════════════════════╝");
console.log();

if (critical.length > 0) {
  console.log(
    `🔴  CRITICAL  (< ${NEEDS_WORK}% lines) — ${critical.length} file(s)`,
  );
  console.log("─".repeat(70));
  printTable(critical);
  console.log();
}

if (needsWork.length > 0) {
  console.log(
    `🟡  NEEDS WORK  (${NEEDS_WORK}–${HEALTHY - 1}% lines) — ${needsWork.length} file(s)`,
  );
  console.log("─".repeat(70));
  printTable(needsWork);
  console.log();
}

if (showAll && healthy.length > 0) {
  console.log(`🟢  HEALTHY  (≥ ${HEALTHY}% lines) — ${healthy.length} file(s)`);
  console.log("─".repeat(70));
  printTable(healthy);
  console.log();
} else {
  console.log(`🟢  ${healthy.length} file(s) at ≥ ${HEALTHY}% line coverage (use --all to list)`);
}

console.log();

// ── Helpers ────────────────────────────────────────────────────────

function pad(n) {
  return String(n.toFixed(1)).padStart(5);
}

function printTable(items) {
  const hdr =
    "  " +
    "File".padEnd(52) +
    "Stmts  Branch  Funcs  Lines";
  console.log(hdr);
  for (const r of items) {
    const shortFile =
      r.file.length > 50 ? "…" + r.file.slice(r.file.length - 49) : r.file;
    console.log(
      "  " +
        shortFile.padEnd(52) +
        fmt(r.stmts) +
        fmt(r.branch) +
        fmt(r.funcs) +
        fmt(r.lines),
    );
  }
}

function fmt(n) {
  return String(n.toFixed(1)).padStart(6) + " ";
}
