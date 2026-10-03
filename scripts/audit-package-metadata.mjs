#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const failures = [];
let packages = 0;

for (const entry of readdirSync(path.join(root, "packages"), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const sourceDirectory = path.join(root, "packages", entry.name);
  const configurationPath = path.join(sourceDirectory, "ng-package.json");
  if (!existsSync(configurationPath)) continue;
  const configuration = JSON.parse(readFileSync(configurationPath, "utf8"));
  const directory = path.resolve(sourceDirectory, configuration.dest);
  const manifestPath = path.join(directory, "package.json");
  if (!existsSync(manifestPath)) {
    failures.push(`${entry.name}: missing built package; run npm run build first`);
    continue;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const declared = new Set([
    ...Object.keys(manifest.dependencies ?? {}),
    ...Object.keys(manifest.peerDependencies ?? {}),
  ]);
  const imports = new Set();
  for (const file of files(path.join(directory, "fesm2022"))) {
    if (!file.endsWith(".mjs")) continue;
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest);
    for (const statement of source.statements) {
      if ((ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) &&
          statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        const specifier = statement.moduleSpecifier.text;
        if (!specifier.startsWith(".")) {
          imports.add(specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0]);
        }
      }
    }
  }
  for (const dependency of imports) {
    if (!declared.has(dependency)) failures.push(`${manifest.name}: undeclared bundle import ${dependency}`);
  }
  for (const target of exportTargets(manifest.exports)) {
    if (!existsSync(path.resolve(directory, target))) failures.push(`${manifest.name}: missing export target ${target}`);
  }
  packages++;
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Package metadata audit passed: ${packages} built packages declare their imports and export existing files.`);
}

function* files(directory) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* files(file);
    else yield file;
  }
}

function* exportTargets(value) {
  if (typeof value === "string") yield value;
  else if (value && typeof value === "object") {
    for (const target of Object.values(value)) yield* exportTargets(target);
  }
}
