import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from "@angular/core";

import { UISourceTabs, type UISourceTab } from "@theredhead/lucid-blocks";

interface StoryIndexEntry {
  readonly importPath?: string;
  readonly componentPath?: string;
  readonly exportName?: string;
}

interface StoryIndexPayload {
  readonly entries?: Record<string, StoryIndexEntry>;
}

const STORY_INDEX_URL = "/index.json";
const STORY_SOURCE_ROOT_URL = "/workspace";

let storyIndexPromise: Promise<Record<string, StoryIndexEntry>> | undefined;

const storyTabsCache = new Map<string, Promise<readonly UISourceTab[]>>();

function getStoryIndex(): Promise<Record<string, StoryIndexEntry>> {
  storyIndexPromise ??= fetch(STORY_INDEX_URL)
    .then(async (response) => {
      if (!response.ok) {
        return {};
      }

      const payload = (await response.json()) as StoryIndexPayload;
      return payload.entries ?? {};
    })
    .catch(() => ({}));

  return storyIndexPromise;
}

function getSourceUrl(path: string): string | undefined {
  const normalizedPath = path.replace(/^\.\//u, "");

  if (!normalizedPath.startsWith("packages/")) {
    return undefined;
  }

  return `${STORY_SOURCE_ROOT_URL}/${normalizedPath}`;
}

function getFilename(path: string): string {
  return path.split("/").at(-1) ?? path;
}

function getTabLabel(path: string): string {
  if (path.endsWith(".story.ts")) {
    return "Source";
  }

  if (path.endsWith(".story.html")) {
    return "Markup";
  }

  if (path.endsWith(".story.scss")) {
    return "Styles";
  }

  if (path.endsWith(".stories.ts")) {
    return "Story";
  }

  if (path.endsWith(".component.html")) {
    return "Markup";
  }

  if (path.endsWith(".component.scss")) {
    return "Styles";
  }

  if (path.endsWith(".component.ts")) {
    return "Component";
  }

  if (path.endsWith(".mdx")) {
    return "Docs";
  }

  return getFilename(path);
}

function getLanguage(path: string): string {
  if (path.endsWith(".ts")) {
    return "TypeScript";
  }

  if (path.endsWith(".html")) {
    return "HTML";
  }

  if (path.endsWith(".scss")) {
    return "SCSS";
  }

  if (path.endsWith(".mdx")) {
    return "MDX";
  }

  return "Text";
}

function getStructuredStoryBase(path: string): string | undefined {
  const match = /^(.*\/stories\/[^/]+\/)([^/]+)\.stories\.ts$/u.exec(path);

  if (!match) {
    return undefined;
  }

  return `${match[1]}${match[2]}.story`;
}

function getComponentStoryBase(path: string | undefined): string | undefined {
  if (!path?.endsWith(".story.ts")) {
    return undefined;
  }

  return path.slice(0, -3);
}

function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/gu, "$1-$2")
    .replace(/[_\s]+/gu, "-")
    .toLowerCase();
}

function getLegacyStoryBase(
  importPath: string,
  exportName: string | undefined,
): string | undefined {
  if (!exportName) {
    return undefined;
  }

  const fileName = getFilename(importPath);
  const directoryPath = importPath.slice(
    0,
    Math.max(0, importPath.length - fileName.length),
  );
  const storyName = toKebabCase(exportName);

  return `${directoryPath}stories/${storyName}/${storyName}.story`;
}

function extractStoryExport(
  code: string,
  exportName: string | undefined,
): string {
  if (!exportName) {
    return code;
  }

  const exportMarker = `export const ${exportName}`;
  const exportStart = code.indexOf(exportMarker);

  if (exportStart < 0) {
    return code;
  }

  const nextExportStart = code.indexOf(
    "\nexport const ",
    exportStart + exportMarker.length,
  );

  const exportEnd = nextExportStart >= 0 ? nextExportStart : code.length;

  return code.slice(exportStart, exportEnd).trim();
}

function getCandidatePaths(
  entry: StoryIndexEntry | undefined,
): readonly string[] {
  const componentStoryBase = getComponentStoryBase(entry?.componentPath);

  if (componentStoryBase) {
    return [
      `${componentStoryBase}.ts`,
      `${componentStoryBase}.html`,
      `${componentStoryBase}.scss`,
    ];
  }

  if (!entry?.importPath) {
    return [];
  }

  const structuredStoryBase = getStructuredStoryBase(entry.importPath);

  if (structuredStoryBase) {
    return [
      `${structuredStoryBase}.ts`,
      `${structuredStoryBase}.html`,
      `${structuredStoryBase}.scss`,
    ];
  }

  const legacyStoryBase = getLegacyStoryBase(
    entry.importPath,
    entry.exportName,
  );

  if (legacyStoryBase) {
    return [
      `${legacyStoryBase}.ts`,
      `${legacyStoryBase}.html`,
      `${legacyStoryBase}.scss`,
    ];
  }

  return [entry.importPath];
}

function getFallbackCandidatePaths(
  entry: StoryIndexEntry | undefined,
): readonly string[] {
  if (!entry?.importPath) {
    return [];
  }

  return [entry.importPath];
}

async function loadSourceTab(
  path: string,
  exportName?: string,
): Promise<UISourceTab | undefined> {
  const sourceUrl = getSourceUrl(path);

  if (!sourceUrl) {
    return undefined;
  }

  try {
    const response = await fetch(sourceUrl);

    if (!response.ok) {
      return undefined;
    }

    const rawCode = await response.text();
    const code = path.endsWith(".stories.ts")
      ? extractStoryExport(rawCode, exportName)
      : rawCode;

    if (code.trim().length === 0) {
      return undefined;
    }

    return {
      label: getTabLabel(path),
      filename: getFilename(path),
      language: getLanguage(path),
      code,
    };
  } catch {
    return undefined;
  }
}

function loadStoryTabs(storyId: string): Promise<readonly UISourceTab[]> {
  const cachedTabs = storyTabsCache.get(storyId);

  if (cachedTabs) {
    return cachedTabs;
  }

  const tabsPromise = getStoryIndex().then(async (entries) => {
    const entry = entries[storyId];
    const candidatePaths = getCandidatePaths(entry);
    const tabs = await Promise.all(
      candidatePaths.map((path) => loadSourceTab(path, entry?.exportName)),
    );
    const resolvedTabs = tabs.filter(
      (tab): tab is UISourceTab => tab !== undefined,
    );

    if (resolvedTabs.length > 0) {
      return resolvedTabs;
    }

    const fallbackTabs = await Promise.all(
      getFallbackCandidatePaths(entry).map((path) =>
        loadSourceTab(path, entry?.exportName),
      ),
    );

    return fallbackTabs.filter((tab): tab is UISourceTab => tab !== undefined);
  });

  storyTabsCache.set(storyId, tabsPromise);

  return tabsPromise;
}

/**
 * Internal Storybook wrapper used to render live story content together with
 * theme-aware source tabs in canvas view.
 *
 * @internal
 */
@Component({
  selector: "ui-story-chrome",
  standalone: true,
  imports: [UISourceTabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="story-chrome">
      <div class="story-preview">
        <ng-content />
      </div>

      @if (tabs().length > 0) {
        <ui-source-tabs [tabs]="tabs()" ariaLabel="Story implementation" />
      }
    </div>
  `,
  styles: `
    .story-chrome {
      display: grid;
      gap: 1rem;
      color: var(--ui-text, #1d232b);
      background: transparent;
    }

    .story-preview {
      min-width: 0;
    }
  `,
})
export class StoryChrome {
  /** Storybook story id used to resolve actual source files. */
  public readonly storyId = input<string>("");

  protected readonly tabs = signal<readonly UISourceTab[]>([]);

  private readonly syncTabsEffect = effect(() => {
    void this.syncTabs(this.storyId());
  });

  private async syncTabs(storyId: string): Promise<void> {
    if (!storyId) {
      this.tabs.set([]);
      return;
    }

    const tabs = await loadStoryTabs(storyId);

    if (this.storyId() !== storyId) {
      return;
    }

    this.tabs.set(tabs);
  }
}
