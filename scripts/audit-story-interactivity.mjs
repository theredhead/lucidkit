#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname);
const roots = ["packages/ui-kit/src", "packages/ui-blocks/src", "packages/ui-forms/src"];
const findings = {
  disconnectedArgs: [],
  disconnectedWrapper: [],
};

for (const root of roots) {
  walk(path.join(repoRoot, root));
}

const totalFindings = findings.disconnectedArgs.length + findings.disconnectedWrapper.length;
if (totalFindings === 0) {
  console.log("Story interactivity audit passed: no high-confidence wiring gaps found.");
  process.exit(0);
}

console.log(`Found ${totalFindings} likely Storybook interactivity gap(s):`);
printGroup("Args declared but not forwarded", findings.disconnectedArgs);
printGroup("Interactive wrapper registered without props", findings.disconnectedWrapper);
process.exitCode = 1;

function printGroup(label, group) {
  if (group.length === 0) return;
  console.log(`\n${label} (${group.length}):`);
  for (const finding of group) {
    console.log(`- ${finding}`);
  }
}

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(filePath);
      continue;
    }
    if (entry.name.endsWith(".stories.ts")) inspect(filePath);
  }
}

function inspect(filePath) {
  const source = readFileSync(filePath, "utf8");
  const relativePath = path.relative(repoRoot, filePath);

  // A story with args/argTypes must forward args into its rendered template or
  // Angular wrapper. A zero-argument render silently disconnects controls.
  const hasArgs = /\bargs\s*:\s*\{/.test(source);
  const hasArgTypes = /\bargTypes\s*:\s*\{/.test(source);
  const hasZeroArgumentRender = /render\s*:\s*\(\s*\)\s*=>/.test(source);
  const controlsDisabled = /controls\s*:\s*\{[\s\S]*?disable\s*:\s*true/.test(source);
  if (hasArgs && hasZeroArgumentRender && !controlsDisabled) {
    findings.disconnectedArgs.push(`${relativePath}: story args declared but render() accepts no args`);
  }

  // A wrapper source component with public literal inputs is a common signal
  // that the template is hardcoded instead of driven by Storybook args.
  const wrapperImport = source.match(/import\s*\{\s*([A-Za-z0-9_]+StorySource)\s*\}/)?.[1];
  if (wrapperImport && hasArgs && hasZeroArgumentRender && !controlsDisabled) {
    findings.disconnectedWrapper.push(`${relativePath}: ${wrapperImport} is registered with args but render() does not forward props`);
  }
}
