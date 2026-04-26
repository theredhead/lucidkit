#!/usr/bin/env node

import { createServer } from "node:http";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

import overrides from "./storybook-screenshot-overrides.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const storybookDir = path.resolve(repoRoot, "dist/storybook");
const storyIndexPath = path.join(storybookDir, "index.json");
const options = parseArgs(process.argv.slice(2));
const captureConfig = {
  themes: ["light", "dark"],
  viewport: { width: 1440, height: 960 },
  selector: "#storybook-root",
  shrinkWrap: true,
  delayMs: 150,
  cropPadding: 16,
  outputDir: "artifacts/storybook-screenshots",
  includeDocs: false,
  components: {},
  stories: {},
  ...overrides,
};

if (!existsSync(storyIndexPath)) {
  console.error(
    "Missing dist/storybook/index.json. Run `npm run build-storybook` first.",
  );
  process.exit(1);
}

const index = JSON.parse(readFileSync(storyIndexPath, "utf8"));
const outputDir = path.resolve(repoRoot, captureConfig.outputDir);
mkdirSync(outputDir, { recursive: true });

const components = buildComponentEntries(index, captureConfig, options);

if (components.length === 0) {
  console.error("No Storybook stories matched the screenshot selection.");
  process.exit(1);
}

const manifest = options.manifestOnly
  ? buildManifestFromFiles(components, captureConfig, outputDir)
  : await captureManifest(components, captureConfig, outputDir);

writeFileSync(
  path.join(outputDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(
  `Wrote ${countManifestShots(manifest)} screenshots to ${path.relative(repoRoot, outputDir)}.`,
);

if (manifest.failures.length > 0) {
  console.warn(`${manifest.failures.length} captures failed. See manifest.json for details.`);
  process.exitCode = 1;
}

async function captureManifest(components, config, outputDir) {
  const server = await startStaticServer(storybookDir);
  const browser = await chromium.launch({ headless: true });
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: server.baseUrl,
    outputDir: path.relative(repoRoot, outputDir),
    components: [],
    failures: [],
  };

  console.log(
    `Capturing ${countStories(components) * config.themes.length} screenshots from ${components.length} components in ${config.themes.join(", ")} mode...`,
  );

  try {
    for (const component of components) {
      const componentOutputDir = path.join(outputDir, ...component.outputSegments);
      rmSync(componentOutputDir, { recursive: true, force: true });
      mkdirSync(componentOutputDir, { recursive: true });

      const componentRecord = createManifestComponentRecord(component, componentOutputDir);

      for (const story of component.stories) {
        const storyConfig = mergeStoryConfig(config, component.title, story.id);
        for (const theme of storyConfig.themes) {
          const page = await browser.newPage({ viewport: storyConfig.viewport });
          const filePath = path.join(
            componentOutputDir,
            `${slugify(story.name)}-${theme}.png`,
          );

          try {
            const storyUrl = `${server.baseUrl}/iframe.html?id=${story.id}&viewMode=story`;
            await page.goto(storyUrl, { waitUntil: "networkidle" });
            await prepareCaptureSurface(page, theme, storyConfig);
            await page.waitForSelector(storyConfig.selector, { timeout: 15_000 });
            await page.waitForFunction(
              (selector) => {
                const element = document.querySelector(selector);
                if (!element) {
                  return false;
                }
                const rect = element.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
              },
              storyConfig.selector,
              { timeout: 15_000 },
            );
            await page.evaluate(async () => {
              if (document.fonts?.ready) {
                await document.fonts.ready;
              }
            });
            if (storyConfig.delayMs > 0) {
              await page.waitForTimeout(storyConfig.delayMs);
            }

            const clip = await page.evaluate(
              ({ selector, cropPadding }) => {
                const element = document.querySelector(selector);
                if (!element) {
                  return null;
                }
                const rect = element.getBoundingClientRect();
                const body = document.body;
                const documentWidth = Math.max(
                  body.scrollWidth,
                  Math.ceil(rect.right + cropPadding),
                );
                const documentHeight = Math.max(
                  body.scrollHeight,
                  Math.ceil(rect.bottom + cropPadding),
                );
                return {
                  x: 0,
                  y: 0,
                  width: documentWidth,
                  height: documentHeight,
                };
              },
              {
                selector: storyConfig.selector,
                cropPadding: storyConfig.cropPadding,
              },
            );

            if (!clip || clip.width <= 0 || clip.height <= 0) {
              throw new Error(`Invalid capture bounds for ${storyConfig.selector}`);
            }

            await page.screenshot({ path: filePath, clip });

            componentRecord.screenshots.push({
              storyId: story.id,
              storyName: story.name,
              theme,
              filePath: path.relative(repoRoot, filePath),
              title: story.title,
            });
            console.log(`  ${component.title} -> ${story.name} (${theme})`);
          } catch (error) {
            manifest.failures.push({
              componentTitle: component.title,
              storyId: story.id,
              storyName: story.name,
              theme,
              message: error instanceof Error ? error.message : String(error),
            });
            console.warn(`  Failed: ${component.title} -> ${story.name} (${theme})`);
          } finally {
            await page.close();
          }
        }
      }

      manifest.components.push(componentRecord);
    }
  } finally {
    await browser.close();
    await server.close();
  }

  return manifest;
}

function buildManifestFromFiles(components, config, outputDir) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl: "",
    outputDir: path.relative(repoRoot, outputDir),
    components: [],
    failures: [],
  };

  console.log(
    `Rebuilding screenshot manifest from existing files for ${components.length} components...`,
  );

  for (const component of components) {
    const componentOutputDir = path.join(outputDir, ...component.outputSegments);
    const componentRecord = createManifestComponentRecord(component, componentOutputDir);

    for (const story of component.stories) {
      const storyConfig = mergeStoryConfig(config, component.title, story.id);
      for (const theme of storyConfig.themes) {
        const filePath = path.join(
          componentOutputDir,
          `${slugify(story.name)}-${theme}.png`,
        );

        if (!existsSync(filePath)) {
          manifest.failures.push({
            componentTitle: component.title,
            storyId: story.id,
            storyName: story.name,
            theme,
            message: `Missing screenshot file: ${path.relative(repoRoot, filePath)}`,
          });
          continue;
        }

        componentRecord.screenshots.push({
          storyId: story.id,
          storyName: story.name,
          theme,
          filePath: path.relative(repoRoot, filePath),
          title: story.title,
        });
      }
    }

    manifest.components.push(componentRecord);
  }

  return manifest;
}

function createManifestComponentRecord(component, componentOutputDir) {
  return {
    title: component.title,
    category: component.category,
    importPath: component.importPath,
    primaryStoryId: component.primaryStoryId,
    outputDir: path.relative(repoRoot, componentOutputDir),
    screenshots: [],
  };
}

function parseArgs(argv) {
  const parsed = {
    limit: undefined,
    titleFilter: undefined,
    storyFilter: undefined,
    manifestOnly: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--limit=")) {
      parsed.limit = Number.parseInt(arg.slice("--limit=".length), 10);
      continue;
    }
    if (arg.startsWith("--title=")) {
      parsed.titleFilter = arg.slice("--title=".length).toLowerCase();
      continue;
    }
    if (arg.startsWith("--story=")) {
      parsed.storyFilter = arg.slice("--story=".length).toLowerCase();
      continue;
    }
    if (arg === "--manifest-only") {
      parsed.manifestOnly = true;
    }
  }

  return parsed;
}

function buildComponentEntries(index, config, cliOptions) {
  const grouped = new Map();

  for (const entry of Object.values(index.entries)) {
    if (entry.type !== "story") {
      continue;
    }

    if (!config.includeDocs && /--docs$|--documentation$/i.test(entry.id)) {
      continue;
    }

    if (cliOptions.titleFilter && !entry.title.toLowerCase().includes(cliOptions.titleFilter)) {
      continue;
    }

    if (cliOptions.storyFilter) {
      const storyHaystack = `${entry.id} ${entry.name}`.toLowerCase();
      if (!storyHaystack.includes(cliOptions.storyFilter)) {
        continue;
      }
    }

    const componentConfig = config.components[entry.title] ?? {};
    const storyConfig = config.stories[entry.id] ?? {};
    if (componentConfig.exclude === true || storyConfig.exclude === true) {
      continue;
    }

    const existing = grouped.get(entry.title) ?? {
      title: entry.title,
      category: getCategory(entry.title),
      importPath: entry.importPath,
      outputSegments: storyTitleToSegments(entry.title),
      stories: [],
      primaryStoryId: undefined,
    };

    existing.stories.push({
      id: entry.id,
      name: entry.name,
      title: entry.title,
    });

    grouped.set(entry.title, existing);
  }

  const components = [...grouped.values()]
    .map((component) => {
      component.stories.sort(compareStories);
      component.primaryStoryId = component.stories[0]?.id;
      return component;
    })
    .sort((left, right) => left.title.localeCompare(right.title));

  if (typeof cliOptions.limit === "number" && Number.isFinite(cliOptions.limit)) {
    return components.slice(0, Math.max(cliOptions.limit, 0));
  }

  return components;
}

function compareStories(left, right) {
  return storyPriority(left.name) - storyPriority(right.name) || left.name.localeCompare(right.name);
}

function storyPriority(name) {
  const normalized = name.toLowerCase();
  if (normalized === "playground") {
    return 0;
  }
  if (normalized === "default") {
    return 1;
  }
  if (normalized === "showcase") {
    return 2;
  }
  if (normalized === "documentation") {
    return 99;
  }
  return 10;
}

function getCategory(title) {
  const [, category = "Stories"] = title.split("/").map((part) => part.trim());
  return category;
}

function storyTitleToSegments(title) {
  const parts = title
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts[0]?.startsWith("@")) {
    parts.shift();
  }
  return parts.map(slugify);
}

function mergeStoryConfig(config, title, storyId) {
  const componentConfig = config.components[title] ?? {};
  const storyConfig = config.stories[storyId] ?? {};
  return {
    themes: storyConfig.themes ?? componentConfig.themes ?? config.themes,
    viewport: storyConfig.viewport ?? componentConfig.viewport ?? config.viewport,
    selector: storyConfig.selector ?? componentConfig.selector ?? config.selector,
    shrinkWrap:
      storyConfig.shrinkWrap ?? componentConfig.shrinkWrap ?? config.shrinkWrap,
    delayMs: storyConfig.delayMs ?? componentConfig.delayMs ?? config.delayMs,
    cropPadding:
      storyConfig.cropPadding ?? componentConfig.cropPadding ?? config.cropPadding,
  };
}

async function prepareCaptureSurface(page, theme, storyConfig) {
  const shrinkWrapStyles = storyConfig.shrinkWrap
    ? `
      html,
      body {
        width: max-content !important;
        min-width: 0 !important;
      }

      ${storyConfig.selector} {
        display: inline-block !important;
        width: max-content !important;
        max-width: none !important;
        min-width: 0 !important;
      }
    `
    : "";

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }

      html,
      body {
        margin: 0 !important;
        padding: ${storyConfig.cropPadding}px !important;
        box-sizing: border-box !important;
      }

      body {
        overflow: hidden !important;
      }

      ui-story-toolbar,
      .story-toolbar {
        display: none !important;
      }

      ${shrinkWrapStyles}
    `,
  });

  await page.evaluate((selectedTheme) => {
    const root = document.documentElement;
    root.classList.remove("light-theme", "dark-theme");
    root.classList.add(selectedTheme === "dark" ? "dark-theme" : "light-theme");
  }, theme);
}

function countStories(components) {
  return components.reduce((count, component) => count + component.stories.length, 0);
}

function countManifestShots(manifest) {
  return manifest.components.reduce(
    (count, component) => count + component.screenshots.length,
    0,
  );
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function startStaticServer(rootDir) {
  const server = createServer((request, response) => {
    const requestPath = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    const filePath = resolveFilePath(rootDir, requestPath);

    if (!filePath) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    try {
      const content = readFileSync(filePath);
      response.writeHead(200, { "Content-Type": contentType(filePath) });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 6006;

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
}

function resolveFilePath(rootDir, requestPath) {
  const normalizedPath = decodeURIComponent(requestPath === "/" ? "/index.html" : requestPath);
  const absolutePath = path.resolve(rootDir, `.${normalizedPath}`);
  if (!absolutePath.startsWith(rootDir)) {
    return undefined;
  }

  if (existsSync(absolutePath) && statSync(absolutePath).isFile()) {
    return absolutePath;
  }

  const indexPath = path.join(absolutePath, "index.html");
  if (existsSync(indexPath) && statSync(indexPath).isFile()) {
    return indexPath;
  }

  return undefined;
}

function contentType(filePath) {
  switch (path.extname(filePath)) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}