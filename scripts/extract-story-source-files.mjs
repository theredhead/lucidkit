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
  const metaObject = getMetaObjectLiteral(sourceFile);
  const metaComponentClassName = getMetaComponentClassName(sourceFile);
  const topLevelDeclarationMap = getTopLevelDeclarationMap(sourceFile);
  const importEntries = getImportEntries(sourceText, sourceFile);
  const fallbackImportNames = getFallbackImportNames(metaObject);
  let eligibleStoryCount = 0;
  let writtenStoryCount = 0;

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

      eligibleStoryCount += 1;

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

      const targetDir = path.join(path.dirname(storyFilePath), "stories", storyName);
      const targetTsPath = path.join(targetDir, `${storyName}.story.ts`);
      const fallbackComponentImports = [...fallbackImportNames].filter((name) =>
        importEntries.some((entry) => entry.importedNames.has(name)),
      );
      const fallbackImportStatements = getRelevantImportStatements(
        importEntries,
        storyFilePath,
        targetTsPath,
        fallbackImportNames,
      );

      if (output.mode === "docs") {
        summary.storiesGeneratedFromDocs += 1;
      } else if (output.mode === "component") {
        summary.storiesGeneratedFromLocalComponent += 1;
      } else {
        summary.storiesGeneratedFromRenderTemplate += 1;
      }

      const baseName = `${storyName}.story`;
      const tsContent =
        output.mode === "component"
          ? output.ts
          : buildFallbackTs(
              storyFilePath,
              exportName,
              storyName,
              fallbackImportStatements,
              fallbackComponentImports,
              output.mode === "render"
                ? getTemplateContextFields(output.html, storyObject, sourceText)
                : [],
            );
      const scssContent = output.scss ?? "/* No custom styles extracted yet. */\n";
      const storySourceInfo = getGeneratedStorySourceInfo(tsContent);

      if (!storySourceInfo) {
        summary.storiesSkipped += 1;
        warnings.push(
          `${path.relative(repoRoot, storyFilePath)} :: ${exportName} generated no parseable story source component.`,
        );
        continue;
      }

      const wrapperContent = buildWrapperContent({
        sourceText,
        sourceFile,
        storyFilePath,
        metaObject,
        storyObject,
        exportName,
        storyName,
        storySourceInfo,
        importEntries,
        outputMode: output.mode,
      });

      writeOutputFile(path.join(targetDir, `${baseName}.html`), ensureTrailingNewline(output.html));
      writeOutputFile(path.join(targetDir, `${baseName}.ts`), ensureTrailingNewline(tsContent));
      writeOutputFile(path.join(targetDir, `${baseName}.scss`), ensureTrailingNewline(scssContent));
      writeOutputFile(path.join(targetDir, `${storyName}.stories.ts`), ensureTrailingNewline(wrapperContent));

      summary.storiesWritten += 1;
      writtenStoryCount += 1;
    }
  }

  if (eligibleStoryCount === 0 || eligibleStoryCount !== writtenStoryCount) {
    if (shouldWrite && writtenStoryCount > 0 && eligibleStoryCount !== writtenStoryCount) {
      warnings.push(
        `${path.relative(repoRoot, storyFilePath)} :: original story file was retained because only ${writtenStoryCount}/${eligibleStoryCount} stories converted.`,
      );
    }

    return;
  }

  if (!shouldWrite) {
    console.log(`[dry-run] retire ${path.relative(repoRoot, storyFilePath)}`);
    return;
  }

  rmSync(storyFilePath, { force: true });
}

function getImportEntries(sourceText, sourceFile) {
  return sourceFile.statements
    .filter(ts.isImportDeclaration)
    .filter((statement) => {
      const statementText = sourceText.slice(statement.getFullStart(), statement.end);
      return !statementText.includes("@storybook/angular");
    })
    .map((statement) => ({
      statement,
      importedNames: getImportedNames(statement),
    }));
}

function getImportedNames(importDeclaration) {
  const importedNames = new Set();
  const clause = importDeclaration.importClause;

  if (!clause) {
    return importedNames;
  }

  if (clause.name) {
    importedNames.add(clause.name.text);
  }

  if (!clause.namedBindings) {
    return importedNames;
  }

  if (ts.isNamespaceImport(clause.namedBindings)) {
    importedNames.add(clause.namedBindings.name.text);
    return importedNames;
  }

  for (const element of clause.namedBindings.elements) {
    importedNames.add(element.name.text);
  }

  return importedNames;
}

function getFallbackImportNames(metaObject) {
  const fallbackImportNames = new Set();

  if (!metaObject) {
    return fallbackImportNames;
  }

  const componentProperty = getProperty(metaObject, "component");

  if (
    componentProperty &&
    ts.isPropertyAssignment(componentProperty) &&
    ts.isIdentifier(componentProperty.initializer)
  ) {
    fallbackImportNames.add(componentProperty.initializer.text);
  }

  const decoratorsProperty = getProperty(metaObject, "decorators");

  if (
    !decoratorsProperty ||
    !ts.isPropertyAssignment(decoratorsProperty) ||
    !ts.isArrayLiteralExpression(decoratorsProperty.initializer)
  ) {
    return fallbackImportNames;
  }

  for (const element of decoratorsProperty.initializer.elements) {
    if (!ts.isCallExpression(element)) {
      continue;
    }

    if (!ts.isIdentifier(element.expression) || element.expression.text !== "moduleMetadata") {
      continue;
    }

    const [argument] = element.arguments;

    if (!argument || !ts.isObjectLiteralExpression(argument)) {
      continue;
    }

    const importsProperty = getProperty(argument, "imports");

    if (
      !importsProperty ||
      !ts.isPropertyAssignment(importsProperty) ||
      !ts.isArrayLiteralExpression(importsProperty.initializer)
    ) {
      continue;
    }

    for (const importElement of importsProperty.initializer.elements) {
      if (ts.isIdentifier(importElement)) {
        fallbackImportNames.add(importElement.text);
      }
    }
  }

  return fallbackImportNames;
}

function getRelevantImportStatements(importEntries, sourceFilePath, targetFilePath, requiredNames) {
  if (requiredNames.size === 0) {
    return [];
  }

  return importEntries
    .map((entry) => buildImportStatement(entry.statement, sourceFilePath, targetFilePath, requiredNames))
    .filter((statement) => statement !== undefined);
}

function buildImportStatement(importDeclaration, sourceFilePath, targetFilePath, requiredNames) {
  const clause = importDeclaration.importClause;

  if (!clause) {
    return undefined;
  }

  const defaultImport = clause.name?.text;
  const includeDefaultImport = defaultImport ? requiredNames.has(defaultImport) : false;
  const namedBindings = clause.namedBindings;
  let bindingText;

  if (namedBindings) {
    if (ts.isNamespaceImport(namedBindings)) {
      if (requiredNames.has(namedBindings.name.text)) {
        bindingText = `* as ${namedBindings.name.text}`;
      }
    } else {
      const importSpecifiers = namedBindings.elements.filter((element) =>
        requiredNames.has(element.name.text),
      );

      if (importSpecifiers.length > 0) {
        bindingText = `{ ${importSpecifiers.map(formatImportSpecifier).join(", ")} }`;
      }
    }
  }

  if (!includeDefaultImport && !bindingText) {
    return undefined;
  }

  const importClauseText = [includeDefaultImport ? defaultImport : undefined, bindingText]
    .filter((part) => part && part.length > 0)
    .join(", ");
  const moduleSpecifier = rewriteImportPath(
    importDeclaration.moduleSpecifier.text,
    sourceFilePath,
    targetFilePath,
  );

  return `import ${clause.isTypeOnly ? "type " : ""}${importClauseText} from "${moduleSpecifier}";`;
}

function formatImportSpecifier(importSpecifier) {
  const parts = [];

  if (importSpecifier.isTypeOnly) {
    parts.push("type ");
  }

  if (importSpecifier.propertyName) {
    parts.push(importSpecifier.propertyName.text);
    parts.push(" as ");
  }

  parts.push(importSpecifier.name.text);

  return parts.join("");
}

function getGeneratedStorySourceInfo(tsContent) {
  const sourceFile = ts.createSourceFile(
    "generated-story.ts",
    tsContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const classMap = getClassMap(sourceFile);

  for (const componentClass of classMap.values()) {
    const metadata = getComponentMetadata(componentClass);

    if (!metadata.selector) {
      continue;
    }

    return {
      className: componentClass.name.text,
      selector: metadata.selector,
    };
  }

  return undefined;
}

function buildWrapperContent({
  sourceText,
  storyFilePath,
  metaObject,
  storyObject,
  exportName,
  storyName,
  storySourceInfo,
  importEntries,
  outputMode,
}) {
  const metaProperties = getMetaWrapperProperties(metaObject, sourceText);
  const storyProperties = getStoryWrapperProperties(storyObject, sourceText);
  const targetWrapperPath = path.join(
    path.dirname(storyFilePath),
    "stories",
    storyName,
    `${storyName}.stories.ts`,
  );
  const referencedNames = collectReferencedImportNames(
    [...metaProperties.nodes, ...storyProperties.nodes],
    importEntries,
  );
  const wrapperImports = getRelevantImportStatements(
    importEntries,
    storyFilePath,
    targetWrapperPath,
    referencedNames,
  );
  const metaType = metaProperties.componentTypeName
    ? `Meta<${metaProperties.componentTypeName}>`
    : "Meta";
  const storyType = metaProperties.componentTypeName
    ? `StoryObj<${metaProperties.componentTypeName}>`
    : "StoryObj";
  const importBlock = wrapperImports.length > 0 ? `${wrapperImports.join("\n")}\n\n` : "";
  const metaBody = [...metaProperties.texts, `decorators: [moduleMetadata({ imports: [${storySourceInfo.className}] })]`].join(",\n");
  const originalRenderText = outputMode === "render" ? getRenderPropertyText(storyObject, sourceText) : undefined;
  const storyBody = [
    ...storyProperties.texts,
    originalRenderText ?? `render: () => ({\n    template: "<${storySourceInfo.selector} />",\n  })`,
  ].join(",\n");

  return `import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

${importBlock}import { ${storySourceInfo.className} } from "./${storyName}.story";

const meta = {
${indentLines(metaBody, 2)}
} satisfies ${metaType};

export default meta;
type Story = ${storyType};

export const ${exportName}: Story = {
${indentLines(storyBody, 2)}
};`;
}

function getMetaWrapperProperties(metaObject, sourceText) {
  if (!metaObject) {
    return { texts: [], nodes: [], componentTypeName: undefined };
  }

  const texts = [];
  const nodes = [];
  let componentTypeName;

  for (const propertyName of ["title", "component", "tags", "parameters", "argTypes"]) {
    const property = getProperty(metaObject, propertyName);

    if (!property || !ts.isPropertyAssignment(property)) {
      continue;
    }

    if (propertyName === "component" && ts.isIdentifier(property.initializer)) {
      componentTypeName = property.initializer.text;
    }

    texts.push(getNormalizedNodeText(property, sourceText));
    nodes.push(property);
  }

  return { texts, nodes, componentTypeName };
}

function getStoryWrapperProperties(storyObject, sourceText) {
  const texts = [];
  const nodes = [];

  for (const property of storyObject.properties) {
    if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
      continue;
    }

    const propertyName = getPropertyNameText(property.name);

    if (!propertyName || propertyName === "render" || propertyName === "decorators") {
      continue;
    }

    if (
      propertyName === "parameters" &&
      ts.isPropertyAssignment(property) &&
      ts.isObjectLiteralExpression(property.initializer)
    ) {
      texts.push(`parameters: ${sanitizeObjectLiteral(property.initializer, sourceText, ["parameters"])}`);
      nodes.push(property.initializer);
      continue;
    }

    texts.push(getNormalizedNodeText(property, sourceText));
    nodes.push(property);
  }

  return { texts, nodes };
}

function getRenderPropertyText(storyObject, sourceText) {
  const renderProperty = getProperty(storyObject, "render");

  if (!renderProperty || !ts.isPropertyAssignment(renderProperty)) {
    return undefined;
  }

  return getNormalizedNodeText(renderProperty, sourceText);
}

function getPropertyNameText(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteral(nameNode)) {
    return nameNode.text;
  }

  return undefined;
}

function sanitizeObjectLiteral(objectLiteral, sourceText, pathParts = []) {
  const propertyTexts = [];

  for (const property of objectLiteral.properties) {
    if (ts.isSpreadAssignment(property)) {
      propertyTexts.push(getNormalizedNodeText(property, sourceText));
      continue;
    }

    if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
      propertyTexts.push(getNormalizedNodeText(property, sourceText));
      continue;
    }

    const propertyName = getPropertyNameText(property.name);

    if (!propertyName) {
      propertyTexts.push(getNormalizedNodeText(property, sourceText));
      continue;
    }

    if (pathParts.at(-1) === "docs" && propertyName === "source") {
      continue;
    }

    if (ts.isPropertyAssignment(property) && ts.isObjectLiteralExpression(property.initializer)) {
      const propertyNameText = sourceText.slice(property.name.getStart(), property.name.end);
      propertyTexts.push(
        `${propertyNameText}: ${sanitizeObjectLiteral(property.initializer, sourceText, [...pathParts, propertyName])}`,
      );
      continue;
    }

    propertyTexts.push(getNormalizedNodeText(property, sourceText));
  }

  if (propertyTexts.length === 0) {
    return "{}";
  }

  return `{\n${indentLines(propertyTexts.join(",\n"), 2)}\n}`;
}

function collectReferencedImportNames(nodes, importEntries) {
  const availableImportNames = new Set(
    importEntries.flatMap((entry) => [...entry.importedNames]),
  );
  const referencedNames = new Set();

  for (const node of nodes) {
    visit(node);
  }

  return referencedNames;

  function visit(node) {
    if (ts.isIdentifier(node) && availableImportNames.has(node.text)) {
      referencedNames.add(node.text);
    }

    ts.forEachChild(node, visit);
  }
}

function indentLines(content, spaces) {
  const indent = " ".repeat(spaces);

  return content
    .split("\n")
    .map((line) => (line.length > 0 ? `${indent}${line}` : line))
    .join("\n");
}

function getNormalizedNodeText(node, sourceText) {
  return normalizeBlockIndent(sourceText.slice(node.getStart(), node.end).trim());
}

function normalizeBlockIndent(content) {
  const lines = content.split("\n");

  if (lines.length <= 1) {
    return content;
  }

  const nonEmptyLines = lines.slice(1).filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) {
    return content;
  }

  const commonIndent = Math.min(
    ...nonEmptyLines.map((line) => line.match(/^\s*/u)?.[0].length ?? 0),
  );

  if (commonIndent === 0) {
    return content;
  }

  return [lines[0], ...lines.slice(1).map((line) => line.slice(Math.min(commonIndent, line.length)))].join("\n");
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
  const targetTsPath = path.join(
    path.dirname(sourceFile.fileName),
    "stories",
    storyName,
    `${storyName}.story.ts`,
  );
  const importEntries = getImportEntries(sourceText, sourceFile);
  const referencedImportNames = collectReferencedImportNames(
    componentDependencies.orderedStatements,
    importEntries,
  );
  const imports = getRelevantImportStatements(
    importEntries,
    sourceFile.fileName,
    targetTsPath,
    referencedImportNames,
  ).join("\n");
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
    orderedStatements,
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
      return `from "${rewriteImportPath(specifier, sourceFilePath, targetFilePath)}"`;
    },
  );
}

function rewriteImportPath(specifier, sourceFilePath, targetFilePath) {
  if (!specifier.startsWith(".")) {
    return specifier;
  }

  const resolvedImportPath = path.resolve(path.dirname(sourceFilePath), specifier);
  let relativeSpecifier = path.relative(
    path.dirname(targetFilePath),
    resolvedImportPath,
  );

  if (!relativeSpecifier.startsWith(".")) {
    relativeSpecifier = `./${relativeSpecifier}`;
  }

  return relativeSpecifier.replace(/\\/gu, "/");
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
    scss: "/* Review required: add story-specific styles if needed. */",
  };
}

function buildFallbackTs(
  storyFilePath,
  exportName,
  storyName,
  importStatements = [],
  componentImports = [],
  templateContextFields = [],
) {
  const relativePath = path.relative(repoRoot, storyFilePath);
  const importBlock = Array.isArray(importStatements)
    ? importStatements.join("\n").trim()
    : importStatements.trim();
  const prefix = importBlock.length > 0 ? `${importBlock}\n\n` : "";
  const importsMetadata =
    componentImports.length > 0
      ? `,\n  imports: [${componentImports.join(", ")}]`
      : "";
  const fieldBlock = templateContextFields.length > 0
    ? `\n\n${templateContextFields
        .map(({ name, initializerText }) =>
          initializerText === "undefined as unknown"
            ? `  public ${name} = undefined as never;`
            : `  public ${name} = (${initializerText}) as const;`,
        )
        .join("\n")}`
    : "";

  return `${prefix}import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-${storyName}-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush${importsMetadata},
  templateUrl: "./${storyName}.story.html",
  styleUrl: "./${storyName}.story.scss",
})
export class ${exportName}StorySource {
  // Review required: this scaffold was generated from ${relativePath}.${fieldBlock}
}`;
}

function getTemplateContextNames(template) {
  const names = new Set();
  const patterns = [
    /\[\(?[A-Za-z0-9_-]+\)?\]\s*=\s*"([A-Za-z_][A-Za-z0-9_]*)"/gu,
    /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/gu,
  ];

  for (const pattern of patterns) {
    for (const match of template.matchAll(pattern)) {
      names.add(match[1]);
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right));
}

function getTemplateContextFields(template, storyObject, sourceText) {
  const argsObject = getStoryArgsObject(storyObject);

  return getTemplateContextNames(template).map((name) => ({
    name,
    initializerText: getArgsInitializerText(argsObject, name, sourceText) ?? "undefined as unknown",
  }));
}

function getStoryArgsObject(storyObject) {
  const argsProperty = getProperty(storyObject, "args");

  if (!argsProperty || !ts.isPropertyAssignment(argsProperty)) {
    return undefined;
  }

  if (!ts.isObjectLiteralExpression(argsProperty.initializer)) {
    return undefined;
  }

  return argsProperty.initializer;
}

function getArgsInitializerText(argsObject, propertyName, sourceText) {
  if (!argsObject) {
    return undefined;
  }

  const property = getProperty(argsObject, propertyName);

  if (!property) {
    return undefined;
  }

  if (ts.isPropertyAssignment(property)) {
    return sourceText.slice(property.initializer.getStart(), property.initializer.end).trim();
  }

  if (ts.isShorthandPropertyAssignment(property)) {
    return property.name.text;
  }

  return undefined;
}

function writeOutputFile(filePath, content) {
  if (!shouldWrite) {
    console.log(`[dry-run] ${path.relative(repoRoot, filePath)}`);
    return;
  }

  mkdirSync(path.dirname(filePath), { recursive: true });

  const normalizedContent =
    filePath.endsWith(".story.html") && content.trim().length === 0
      ? "<!-- intentionally blank -->\n"
      : content;

  if (normalizedContent.trim().length === 0) {
    rmSync(filePath, { force: true });
    return;
  }

  writeFileSync(filePath, normalizedContent, "utf8");
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