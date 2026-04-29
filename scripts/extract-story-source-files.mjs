#!/usr/bin/env node

import {
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const packagesRoot = path.join(repoRoot, "packages");

const args = new Set(process.argv.slice(2));
const matchArg = process.argv
  .slice(2)
  .find((argument) => argument.startsWith("--match="));

const shouldWrite = args.has("--write");
const matchText = matchArg?.slice("--match=".length).toLowerCase() ?? "";

const storyFiles = ts.sys
  .readDirectory(packagesRoot, [".stories.ts"], undefined, ["**/*.stories.ts"])
  .filter(
    (filePath) => !/\/stories\/[^/]+\/[^/]+\.stories\.ts$/u.test(filePath),
  )
  .filter((filePath) => {
    if (matchText.length === 0) {
      return true;
    }

    return filePath.toLowerCase().includes(matchText);
  })
  .sort((left, right) => left.localeCompare(right));

const summary = {
  filesScanned: 0,
  storiesWritten: 0,
  storiesGeneratedFromDocs: 0,
  storiesGeneratedFromLocalComponent: 0,
  storiesGeneratedFromRenderTemplate: 0,
  storiesSkipped: 0,
};

const warnings = [];

for (const storyFilePath of storyFiles) {
  summary.filesScanned += 1;
  processStoryFile(storyFilePath);
}

const modeLabel = shouldWrite ? "write" : "dry-run";

console.log(
  `[extract-story-source-files] ${modeLabel}: scanned ${summary.filesScanned} files, ` +
    `prepared ${summary.storiesWritten} stories, skipped ${summary.storiesSkipped}.`,
);
console.log(
  `[extract-story-source-files] sources: docs=${summary.storiesGeneratedFromDocs}, ` +
    `component=${summary.storiesGeneratedFromLocalComponent}, ` +
    `render=${summary.storiesGeneratedFromRenderTemplate}.`,
);

if (warnings.length > 0) {
  console.log("[extract-story-source-files] warnings:");

  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

function processStoryFile(storyFilePath) {
  const sourceText = readFileSync(storyFilePath, "utf8");
  const sourceFile = ts.createSourceFile(
    storyFilePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const classMap = getClassMap(sourceFile);
  const selectorMap = getSelectorMap(classMap);
  const metaComponentClassName = getMetaComponentClassName(sourceFile);
  const topLevelDeclarationMap = getTopLevelDeclarationMap(sourceFile);
  const preservedImports = sourceFile.statements
    .filter(ts.isImportDeclaration)
    .map((statement) => sourceText.slice(statement.getFullStart(), statement.end))
    .filter((statementText) => !statementText.includes("@storybook/angular"));

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    if (!hasExportModifier(statement)) {
      continue;
    }

    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name)) {
        continue;
      }

      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
        continue;
      }

      const exportName = declaration.name.text;
      const storyName = toKebabCase(exportName);
      const storyObject = declaration.initializer;
      const sourceCode = getNestedStringProperty(storyObject, [
        "parameters",
        "docs",
        "source",
        "code",
      ]);
      const renderTemplate = getRenderTemplate(storyObject);
      const output =
        getSectionOutput(sourceCode) ??
        getLocalComponentOutput(
          sourceText,
          sourceFile,
          classMap,
          topLevelDeclarationMap,
          sourceCode,
          storyName,
        ) ??
        getRenderedComponentOutput(
          sourceText,
          sourceFile,
          classMap,
          selectorMap,
          topLevelDeclarationMap,
          renderTemplate,
          storyName,
        ) ??
        getMetaComponentOutput(
          sourceText,
          sourceFile,
          classMap,
          topLevelDeclarationMap,
          metaComponentClassName,
          storyName,
        ) ??
        getRenderTemplateOutput(storyFilePath, exportName, renderTemplate, storyName);

      if (!output) {
        summary.storiesSkipped += 1;
        warnings.push(
          `${path.relative(repoRoot, storyFilePath)} :: ${exportName} has no extractable source block.`,
        );
        continue;
      }

      if (output.mode === "docs") {
        summary.storiesGeneratedFromDocs += 1;
      } else if (output.mode === "component") {
        summary.storiesGeneratedFromLocalComponent += 1;
      } else {
        summary.storiesGeneratedFromRenderTemplate += 1;
      }

      const targetDir = path.join(path.dirname(storyFilePath), "stories", storyName);
      const baseName = `${storyName}.story`;
      const tsContent = output.ts ?? buildFallbackTs(storyFilePath, exportName, storyName, preservedImports);
      const scssContent = output.scss ?? "/* No custom styles extracted yet. */\n";

      writeOutputFile(path.join(targetDir, `${baseName}.html`), ensureTrailingNewline(output.html));
      writeOutputFile(path.join(targetDir, `${baseName}.ts`), ensureTrailingNewline(tsContent));
      writeOutputFile(path.join(targetDir, `${baseName}.scss`), ensureTrailingNewline(scssContent));

      summary.storiesWritten += 1;
    }
  }
}

function getClassMap(sourceFile) {
  const classMap = new Map();

  for (const statement of sourceFile.statements) {
    if (ts.isClassDeclaration(statement) && statement.name) {
      classMap.set(statement.name.text, statement);
    }
  }

  return classMap;
}

function getSelectorMap(classMap) {
  const selectorMap = new Map();

  for (const componentClass of classMap.values()) {
    const componentMetadata = getComponentMetadata(componentClass);

    if (!componentMetadata.selector) {
      continue;
    }

    selectorMap.set(componentMetadata.selector, componentClass);
  }

  return selectorMap;
}

function getTopLevelDeclarationMap(sourceFile) {
  const declarationMap = new Map();

  for (const statement of sourceFile.statements) {
    for (const declaredName of getStatementDeclaredNames(statement)) {
      declarationMap.set(declaredName, statement);
    }
  }

  return declarationMap;
}

function getStatementDeclaredNames(statement) {
  const declaredNames = [];

  if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name)) {
        declaredNames.push(declaration.name.text);
      }
    }
  }

  if (
    (ts.isClassDeclaration(statement) ||
      ts.isInterfaceDeclaration(statement) ||
      ts.isTypeAliasDeclaration(statement) ||
      ts.isFunctionDeclaration(statement)) &&
    statement.name
  ) {
    declaredNames.push(statement.name.text);
  }

  if (ts.isEnumDeclaration(statement)) {
    declaredNames.push(statement.name.text);
  }

  return declaredNames;
}

function getMetaComponentClassName(sourceFile) {
  const metaObject = getMetaObjectLiteral(sourceFile);

  if (!metaObject) {
    return undefined;
  }

  const componentProperty = getProperty(metaObject, "component");

  if (!componentProperty || !ts.isPropertyAssignment(componentProperty)) {
    return undefined;
  }

  if (!ts.isIdentifier(componentProperty.initializer)) {
    return undefined;
  }

  return componentProperty.initializer.text;
}

function getMetaObjectLiteral(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isExportAssignment(statement) || statement.isExportEquals) {
      continue;
    }

    if (!ts.isIdentifier(statement.expression)) {
      continue;
    }

    const metaIdentifier = statement.expression.text;

    for (const candidate of sourceFile.statements) {
      if (!ts.isVariableStatement(candidate)) {
        continue;
      }

      for (const declaration of candidate.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) {
          continue;
        }

        if (declaration.name.text !== metaIdentifier) {
          continue;
        }

        if (!declaration.initializer) {
          continue;
        }

        if (ts.isObjectLiteralExpression(declaration.initializer)) {
          return declaration.initializer;
        }

        if (
          ts.isSatisfiesExpression(declaration.initializer) &&
          ts.isObjectLiteralExpression(declaration.initializer.expression)
        ) {
          return declaration.initializer.expression;
        }
      }
    }
  }

  return undefined;
}

function hasExportModifier(statement) {
  return (statement.modifiers ?? []).some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );
}

function getProperty(objectLiteral, propertyName) {
  return objectLiteral.properties.find((property) => {
    if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
      return false;
    }

    const name = property.name;

    if (!name) {
      return false;
    }

    if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
      return name.text === propertyName;
    }

    return false;
  });
}

function getNestedStringProperty(objectLiteral, pathParts) {
  let current = objectLiteral;

  for (const part of pathParts) {
    const property = getProperty(current, part);

    if (!property || !ts.isPropertyAssignment(property)) {
      return undefined;
    }

    const initializer = property.initializer;

    if (part === pathParts.at(-1)) {
      return getStringLiteralValue(initializer);
    }

    if (!ts.isObjectLiteralExpression(initializer)) {
      return undefined;
    }

    current = initializer;
  }

  return undefined;
}

function getRenderTemplate(storyObject) {
  const renderProperty = getProperty(storyObject, "render");

  if (!renderProperty || !ts.isPropertyAssignment(renderProperty)) {
    return undefined;
  }

  const renderInitializer = renderProperty.initializer;

  if (!ts.isArrowFunction(renderInitializer) && !ts.isFunctionExpression(renderInitializer)) {
    return undefined;
  }

  let body = renderInitializer.body;

  if (ts.isParenthesizedExpression(body)) {
    body = body.expression;
  }

  if (!ts.isObjectLiteralExpression(body)) {
    return undefined;
  }

  const templateProperty = getProperty(body, "template");

  if (!templateProperty || !ts.isPropertyAssignment(templateProperty)) {
    return undefined;
  }

  return getStringLiteralValue(templateProperty.initializer);
}

function getStringLiteralValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }

  return undefined;
}

function getSectionOutput(sourceCode) {
  if (!sourceCode || !sourceCode.includes("// ── HTML ──")) {
    return undefined;
  }

  const sections = splitSourceSections(sourceCode);

  if (!sections.html) {
    return undefined;
  }

  return {
    mode: "docs",
    html: sections.html,
    ts: sections.ts,
    scss: sections.scss,
  };
}

function splitSourceSections(sourceCode) {
  const markerPattern = /^\/\/ ── (HTML|TypeScript|SCSS) ──$/gmu;
  const matches = Array.from(sourceCode.matchAll(markerPattern));
  const sections = {};

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const key = current[1];
    const sectionStart = (current.index ?? 0) + current[0].length;
    const sectionEnd = next?.index ?? sourceCode.length;
    const sectionText = sourceCode.slice(sectionStart, sectionEnd).trim();

    if (key === "HTML") {
      sections.html = sectionText;
    }

    if (key === "TypeScript") {
      sections.ts = sectionText;
    }

    if (key === "SCSS") {
      sections.scss = sectionText;
    }
  }

  return sections;
}

function getLocalComponentOutput(
  sourceText,
  sourceFile,
  classMap,
  topLevelDeclarationMap,
  sourceCode,
  storyName,
) {
  const match = sourceCode?.trim().match(/^See\s+([A-Za-z0-9_]+)\s+component in stories file\.$/u);

  if (!match) {
    return undefined;
  }

  const componentClass = classMap.get(match[1]);

  return getComponentOutput(
    sourceText,
    sourceFile,
    componentClass,
    topLevelDeclarationMap,
    storyName,
  );
}

function getMetaComponentOutput(
  sourceText,
  sourceFile,
  classMap,
  topLevelDeclarationMap,
  componentClassName,
  storyName,
) {
  if (!componentClassName) {
    return undefined;
  }

  const componentClass = classMap.get(componentClassName);

  return getComponentOutput(
    sourceText,
    sourceFile,
    componentClass,
    topLevelDeclarationMap,
    storyName,
  );
}

function getRenderedComponentOutput(
  sourceText,
  sourceFile,
  classMap,
  selectorMap,
  topLevelDeclarationMap,
  renderTemplate,
  storyName,
) {
  if (!renderTemplate) {
    return undefined;
  }

  const selectorMatch = renderTemplate.trim().match(/^<([a-z][a-z0-9-]*)\b/u);

  if (!selectorMatch) {
    return undefined;
  }

  const componentClass = selectorMap.get(selectorMatch[1]);

  return getComponentOutput(
    sourceText,
    sourceFile,
    componentClass,
    topLevelDeclarationMap,
    storyName,
  );
}

function getComponentOutput(
  sourceText,
  sourceFile,
  componentClass,
  topLevelDeclarationMap,
  storyName,
) {
  if (!componentClass) {
    return undefined;
  }

  const componentMetadata = getComponentMetadata(componentClass);
  const template = componentMetadata.template;

  if (!template) {
    return undefined;
  }

  const componentDependencies = collectComponentDependencies(
    sourceText,
    sourceFile,
    componentClass,
    topLevelDeclarationMap,
  );
  const imports = sourceFile.statements
    .filter(ts.isImportDeclaration)
    .map((statement) => sourceText.slice(statement.getFullStart(), statement.end))
    .filter((statementText) => !statementText.includes("@storybook/angular"))
    .map((statementText) =>
      rewriteImportSpecifiers(
        statementText,
        sourceFile.fileName,
        path.join(
          path.dirname(sourceFile.fileName),
          "stories",
          storyName,
          `${storyName}.story.ts`,
        ),
      ),
    )
    .join("")
    .trim();
  const componentWithExternalFiles = rewriteComponentClassSource(
    ensureExportedClassSource(componentDependencies.classSource),
    storyName,
    Boolean(componentMetadata.styles ?? componentMetadata.styleUrl),
  );
  const dependencyBlock = componentDependencies.dependencySources.join("\n\n").trim();
  const declarations = [dependencyBlock, componentWithExternalFiles]
    .filter((value) => value.length > 0)
    .join("\n\n");

  return {
    mode: "component",
    html: template,
    ts: `${imports}\n\n${declarations}`,
    scss:
      componentMetadata.styles ??
      readExternalStyle(sourceFile.fileName, componentMetadata.styleUrl) ??
      "/* No custom styles extracted yet. */",
  };
}

function collectComponentDependencies(
  sourceText,
  sourceFile,
  componentClass,
  topLevelDeclarationMap,
) {
  const includedStatements = new Set([componentClass]);
  const pendingStatements = [componentClass];

  while (pendingStatements.length > 0) {
    const currentStatement = pendingStatements.pop();

    for (const referencedName of getReferencedTopLevelNames(
      currentStatement,
      topLevelDeclarationMap,
    )) {
      const referencedStatement = topLevelDeclarationMap.get(referencedName);

      if (!referencedStatement || includedStatements.has(referencedStatement)) {
        continue;
      }

      includedStatements.add(referencedStatement);
      pendingStatements.push(referencedStatement);
    }
  }

  const orderedStatements = sourceFile.statements.filter((statement) =>
    includedStatements.has(statement),
  );
  const classSource = sourceText.slice(
    componentClass.getFullStart(),
    componentClass.end,
  ).trim();
  const dependencySources = orderedStatements
    .filter((statement) => statement !== componentClass)
    .map((statement) => sourceText.slice(statement.getFullStart(), statement.end).trim());

  return {
    classSource,
    dependencySources,
  };
}

function getReferencedTopLevelNames(statement, topLevelDeclarationMap) {
  const referencedNames = new Set();

  function visit(node) {
    if (ts.isIdentifier(node) && topLevelDeclarationMap.has(node.text)) {
      referencedNames.add(node.text);
    }

    ts.forEachChild(node, visit);
  }

  visit(statement);

  for (const declaredName of getStatementDeclaredNames(statement)) {
    referencedNames.delete(declaredName);
  }

  return referencedNames;
}

function rewriteImportSpecifiers(importStatement, sourceFilePath, targetFilePath) {
  return importStatement.replace(
    /from\s+["'](\.[^"']*)["']/gu,
    (_match, specifier) => {
      const resolvedImportPath = path.resolve(path.dirname(sourceFilePath), specifier);
      let relativeSpecifier = path.relative(
        path.dirname(targetFilePath),
        resolvedImportPath,
      );

      if (!relativeSpecifier.startsWith(".")) {
        relativeSpecifier = `./${relativeSpecifier}`;
      }

      return `from "${relativeSpecifier.replace(/\\/gu, "/")}"`;
    },
  );
}

function ensureExportedClassSource(classSource) {
  if (/^export\s+class\s+/mu.test(classSource)) {
    return classSource;
  }

  return classSource.replace(/(^|\n)(class\s+)/u, "$1export $2");
}

function getComponentMetadata(componentClass) {
  const decorators = ts.getDecorators(componentClass) ?? [];

  for (const decorator of decorators) {
    if (!ts.isCallExpression(decorator.expression)) {
      continue;
    }

    if (!ts.isIdentifier(decorator.expression.expression)) {
      continue;
    }

    if (decorator.expression.expression.text !== "Component") {
      continue;
    }

    const [argument] = decorator.expression.arguments;

    if (!argument || !ts.isObjectLiteralExpression(argument)) {
      continue;
    }

    const selector = getPropertyStringValue(argument, "selector");
    const template = getPropertyStringValue(argument, "template");
    const styleUrl = getPropertyStringValue(argument, "styleUrl");
    const styles = getFirstArrayStringValue(argument, "styles");

    return { selector, template, styleUrl, styles };
  }

  return {};
}

function getPropertyStringValue(objectLiteral, propertyName) {
  const property = getProperty(objectLiteral, propertyName);

  if (!property || !ts.isPropertyAssignment(property)) {
    return undefined;
  }

  return getStringLiteralValue(property.initializer);
}

function getFirstArrayStringValue(objectLiteral, propertyName) {
  const property = getProperty(objectLiteral, propertyName);

  if (!property || !ts.isPropertyAssignment(property)) {
    return undefined;
  }

  if (!ts.isArrayLiteralExpression(property.initializer)) {
    return undefined;
  }

  const [firstElement] = property.initializer.elements;

  if (!firstElement) {
    return undefined;
  }

  return getStringLiteralValue(firstElement);
}

function rewriteComponentClassSource(classSource, storyName, hasStyles) {
  let updatedClassSource = classSource.replace(
    /template:\s*`[\s\S]*?`/u,
    `templateUrl: "./${storyName}.story.html"`,
  );

  if (/styleUrl:\s*/u.test(updatedClassSource)) {
    updatedClassSource = updatedClassSource.replace(
      /styleUrl:\s*["'][^"']+["']/u,
      `styleUrl: "./${storyName}.story.scss"`,
    );
  } else if (/styles:\s*\[[\s\S]*?\]/u.test(updatedClassSource)) {
    updatedClassSource = updatedClassSource.replace(
      /styles:\s*\[[\s\S]*?\]/u,
      `styleUrl: "./${storyName}.story.scss"`,
    );
  } else if (hasStyles) {
    updatedClassSource = updatedClassSource.replace(
      /templateUrl:\s*["'][^"']+["']/u,
      `templateUrl: "./${storyName}.story.html",\n  styleUrl: "./${storyName}.story.scss"`,
    );
  }

  return updatedClassSource;
}

function readExternalStyle(storyFilePath, styleUrl) {
  if (!styleUrl) {
    return undefined;
  }

  const resolvedStylePath = path.resolve(path.dirname(storyFilePath), styleUrl);

  try {
    return readFileSync(resolvedStylePath, "utf8");
  } catch {
    return undefined;
  }
}

function getRenderTemplateOutput(storyFilePath, exportName, renderTemplate, storyName) {
  if (!renderTemplate) {
    return undefined;
  }

  return {
    mode: "render",
    html: renderTemplate.trim(),
    ts: buildFallbackTs(storyFilePath, exportName, storyName),
    scss: "/* Review required: add story-specific styles if needed. */",
  };
}

function buildFallbackTs(storyFilePath, exportName, storyName, imports = []) {
  const relativePath = path.relative(repoRoot, storyFilePath);
  const importBlock = Array.isArray(imports) ? imports.join("").trim() : imports.trim();
  const prefix = importBlock.length > 0 ? `${importBlock}\n\n` : "";

  return `${prefix}import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-${storyName}-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./${storyName}.story.html",
  styleUrl: "./${storyName}.story.scss",
})
export class ${exportName}StorySource {
  // Review required: this scaffold was generated from ${relativePath}.
}`;
}

function writeOutputFile(filePath, content) {
  if (!shouldWrite) {
    console.log(`[dry-run] ${path.relative(repoRoot, filePath)}`);
    return;
  }

  mkdirSync(path.dirname(filePath), { recursive: true });

  if (content.trim().length === 0) {
    rmSync(filePath, { force: true });
    return;
  }

  writeFileSync(filePath, content, "utf8");
}

function ensureTrailingNewline(content) {
  return content.endsWith("\n") ? content : `${content}\n`;
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/gu, "$1-$2")
    .replace(/[_\s]+/gu, "-")
    .toLowerCase();
}