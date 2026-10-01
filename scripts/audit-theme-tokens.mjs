#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const scanRoots = ["packages", "styles.scss"];
const sourceExtensions = new Set([".scss", ".ts", ".html"]);
const declarationPattern = /(--ui-[a-z0-9-]+)\s*:/g;
const usagePattern = /var\((--ui-[a-z0-9-]+)/g;
const runtimePattern = /setProperty\(\s*["'`](--ui-[a-z0-9-]+)["'`]/g;

const files = [];

async function collect(path) {
    const fileInfo = await stat(path);
    if (fileInfo.isFile()) {
        files.push(path);
        return;
    }

    const entries = await readdir(path, { withFileTypes: true });
    for (const entry of entries) {
        const entryPath = join(path, entry.name);
        if (entry.isDirectory()) {
            await collect(entryPath);
            continue;
        }
        if (sourceExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
            files.push(entryPath);
        }
    }
}

for (const scanRoot of scanRoots) {
    await collect(join(root, scanRoot));
}

const contents = new Map();
for (const file of files) {
    contents.set(file, await readFile(file, "utf8"));
}

const declared = new Set();
const runtime = new Set();
for (const content of contents.values()) {
    for (const match of content.matchAll(declarationPattern)) declared.add(match[1]);
    for (const match of content.matchAll(runtimePattern)) runtime.add(match[1]);
}

const failures = [];
const extensionPoints = [];
for (const [file, content] of contents) {
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
        for (const match of line.matchAll(usagePattern)) {
            const token = match[1];
            if (declared.has(token) || runtime.has(token)) continue;

            const usage = line.slice(match.index ?? 0);
            const hasRootFallback = /,\s*var\(--ui-[a-z0-9-]+/.test(usage);
            const hasColorFallback = /,\s*(#|rgba?\(|hsla?\(|white\b|black\b)/i.test(usage);
            if (!hasColorFallback) continue;
            const location = `${relative(root, file)}:${index + 1}`;
            if (hasRootFallback) {
                extensionPoints.push(`${location} ${token}`);
            } else {
                failures.push(`${location} ${token} has no root-token fallback`);
            }
        }
    });
}

console.log(`Declared --ui-* tokens: ${declared.size}`);
console.log(`Runtime --ui-* tokens: ${runtime.size}`);
console.log(`Chained extension points: ${extensionPoints.length}`);

if (failures.length > 0) {
    console.error("\nTheme token audit failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
} else {
    console.log("Theme token audit passed: every undeclared color extension point chains to a root token.");
}
