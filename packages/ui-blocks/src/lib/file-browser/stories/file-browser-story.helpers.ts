import { signal } from "@angular/core";

import type {
  DirectoryChangeEvent,
  FileActivateEvent,
  FileBrowserDatasource,
  FileBrowserEntry,
  MetadataField,
} from "../file-browser.types";

export interface FileMeta {
  size?: string;
  modified?: string;
  type?: string;
}

const SAMPLE_ENTRIES: Record<string, FileBrowserEntry<FileMeta>[]> = {
  // ── Root ──────────────────────────────────────────────────────────
  root: [
    createDirectory("src", "src"),
    createDirectory("docs", "docs"),
    createDirectory("tests", "tests"),
    createDirectory("github", ".github"),
    createFile("readme", "README.md", { size: "4.2 KB", modified: "2026-04-12", type: "Markdown" }),
    createFile("package-json", "package.json", { size: "1.8 KB", modified: "2026-04-28", type: "JSON" }),
    createFile("tsconfig", "tsconfig.json", { size: "0.6 KB", modified: "2026-04-10", type: "JSON" }),
    createFile("angular-json", "angular.json", { size: "8.4 KB", modified: "2026-04-15", type: "JSON" }),
    createFile("eslint", "eslint.config.js", { size: "2.2 KB", modified: "2026-03-30", type: "JavaScript" }),
  ],

  // ── src/ ──────────────────────────────────────────────────────────
  src: [
    createDirectory("src-app", "app"),
    createDirectory("src-assets", "assets"),
    createDirectory("src-environments", "environments"),
    createFile("src-main", "main.ts", { size: "0.4 KB", modified: "2026-04-28", type: "TypeScript" }),
    createFile("src-styles", "styles.scss", { size: "1.1 KB", modified: "2026-04-28", type: "SCSS" }),
    createFile("src-index", "index.html", { size: "0.5 KB", modified: "2026-04-01", type: "HTML" }),
  ],

  // ── src/app/ ──────────────────────────────────────────────────────
  "src-app": [
    createDirectory("src-app-components", "components"),
    createDirectory("src-app-pages", "pages"),
    createDirectory("src-app-services", "services"),
    createDirectory("src-app-models", "models"),
    createFile("src-app-component", "app.component.ts", { size: "2.1 KB", modified: "2026-04-27", type: "TypeScript" }),
    createFile("src-app-component-html", "app.component.html", { size: "0.8 KB", modified: "2026-04-27", type: "HTML" }),
    createFile("src-app-component-scss", "app.component.scss", { size: "0.3 KB", modified: "2026-04-20", type: "SCSS" }),
    createFile("src-app-config", "app.config.ts", { size: "0.9 KB", modified: "2026-04-27", type: "TypeScript" }),
    createFile("src-app-routes", "app.routes.ts", { size: "1.4 KB", modified: "2026-04-27", type: "TypeScript" }),
  ],

  // ── src/app/components/ ───────────────────────────────────────────
  "src-app-components": [
    createDirectory("src-app-components-header", "header"),
    createDirectory("src-app-components-sidebar", "sidebar"),
    createDirectory("src-app-components-toolbar", "toolbar"),
    createDirectory("src-app-components-footer", "footer"),
  ],

  // ── src/app/components/header/ ────────────────────────────────────
  "src-app-components-header": [
    createFile("header-ts", "header.component.ts", { size: "3.2 KB", modified: "2026-04-25", type: "TypeScript" }),
    createFile("header-html", "header.component.html", { size: "1.4 KB", modified: "2026-04-25", type: "HTML" }),
    createFile("header-scss", "header.component.scss", { size: "2.0 KB", modified: "2026-04-24", type: "SCSS" }),
    createFile("header-spec", "header.component.spec.ts", { size: "4.1 KB", modified: "2026-04-26", type: "TypeScript" }),
  ],

  // ── src/app/components/sidebar/ ───────────────────────────────────
  "src-app-components-sidebar": [
    createFile("sidebar-ts", "sidebar.component.ts", { size: "4.8 KB", modified: "2026-04-23", type: "TypeScript" }),
    createFile("sidebar-html", "sidebar.component.html", { size: "2.1 KB", modified: "2026-04-23", type: "HTML" }),
    createFile("sidebar-scss", "sidebar.component.scss", { size: "3.5 KB", modified: "2026-04-22", type: "SCSS" }),
    createFile("sidebar-spec", "sidebar.component.spec.ts", { size: "6.2 KB", modified: "2026-04-24", type: "TypeScript" }),
  ],

  // ── src/app/components/toolbar/ ───────────────────────────────────
  "src-app-components-toolbar": [
    createFile("toolbar-ts", "toolbar.component.ts", { size: "2.6 KB", modified: "2026-04-21", type: "TypeScript" }),
    createFile("toolbar-html", "toolbar.component.html", { size: "0.9 KB", modified: "2026-04-21", type: "HTML" }),
    createFile("toolbar-scss", "toolbar.component.scss", { size: "1.2 KB", modified: "2026-04-20", type: "SCSS" }),
  ],

  // ── src/app/components/footer/ ────────────────────────────────────
  "src-app-components-footer": [
    createFile("footer-ts", "footer.component.ts", { size: "1.3 KB", modified: "2026-04-18", type: "TypeScript" }),
    createFile("footer-html", "footer.component.html", { size: "0.6 KB", modified: "2026-04-18", type: "HTML" }),
    createFile("footer-scss", "footer.component.scss", { size: "0.9 KB", modified: "2026-04-18", type: "SCSS" }),
  ],

  // ── src/app/pages/ ────────────────────────────────────────────────
  "src-app-pages": [
    createDirectory("src-app-pages-home", "home"),
    createDirectory("src-app-pages-dashboard", "dashboard"),
    createDirectory("src-app-pages-settings", "settings"),
    createDirectory("src-app-pages-profile", "profile"),
  ],

  // ── src/app/pages/home/ ───────────────────────────────────────────
  "src-app-pages-home": [
    createFile("home-ts", "home.component.ts", { size: "3.8 KB", modified: "2026-04-26", type: "TypeScript" }),
    createFile("home-html", "home.component.html", { size: "5.2 KB", modified: "2026-04-26", type: "HTML" }),
    createFile("home-scss", "home.component.scss", { size: "2.7 KB", modified: "2026-04-25", type: "SCSS" }),
  ],

  // ── src/app/pages/dashboard/ ──────────────────────────────────────
  "src-app-pages-dashboard": [
    createFile("dashboard-ts", "dashboard.component.ts", { size: "6.1 KB", modified: "2026-04-28", type: "TypeScript" }),
    createFile("dashboard-html", "dashboard.component.html", { size: "8.4 KB", modified: "2026-04-28", type: "HTML" }),
    createFile("dashboard-scss", "dashboard.component.scss", { size: "4.2 KB", modified: "2026-04-27", type: "SCSS" }),
    createFile("dashboard-spec", "dashboard.component.spec.ts", { size: "7.3 KB", modified: "2026-04-29", type: "TypeScript" }),
  ],

  // ── src/app/pages/settings/ ───────────────────────────────────────
  "src-app-pages-settings": [
    createFile("settings-ts", "settings.component.ts", { size: "4.4 KB", modified: "2026-04-22", type: "TypeScript" }),
    createFile("settings-html", "settings.component.html", { size: "6.0 KB", modified: "2026-04-22", type: "HTML" }),
    createFile("settings-scss", "settings.component.scss", { size: "2.1 KB", modified: "2026-04-21", type: "SCSS" }),
  ],

  // ── src/app/pages/profile/ ────────────────────────────────────────
  "src-app-pages-profile": [
    createFile("profile-ts", "profile.component.ts", { size: "3.0 KB", modified: "2026-04-19", type: "TypeScript" }),
    createFile("profile-html", "profile.component.html", { size: "4.5 KB", modified: "2026-04-19", type: "HTML" }),
    createFile("profile-scss", "profile.component.scss", { size: "1.8 KB", modified: "2026-04-18", type: "SCSS" }),
  ],

  // ── src/app/services/ ─────────────────────────────────────────────
  "src-app-services": [
    createFile("svc-auth", "auth.service.ts", { size: "5.6 KB", modified: "2026-04-27", type: "TypeScript" }),
    createFile("svc-api", "api.service.ts", { size: "8.2 KB", modified: "2026-04-28", type: "TypeScript" }),
    createFile("svc-storage", "storage.service.ts", { size: "2.4 KB", modified: "2026-04-20", type: "TypeScript" }),
    createFile("svc-theme", "theme.service.ts", { size: "1.9 KB", modified: "2026-04-15", type: "TypeScript" }),
  ],

  // ── src/app/models/ ───────────────────────────────────────────────
  "src-app-models": [
    createFile("model-user", "user.model.ts", { size: "1.2 KB", modified: "2026-04-10", type: "TypeScript" }),
    createFile("model-project", "project.model.ts", { size: "1.5 KB", modified: "2026-04-10", type: "TypeScript" }),
    createFile("model-settings", "settings.model.ts", { size: "0.8 KB", modified: "2026-04-10", type: "TypeScript" }),
  ],

  // ── src/assets/ ───────────────────────────────────────────────────
  "src-assets": [
    createDirectory("src-assets-images", "images"),
    createDirectory("src-assets-fonts", "fonts"),
    createDirectory("src-assets-icons", "icons"),
  ],

  // ── src/assets/images/ ────────────────────────────────────────────
  "src-assets-images": [
    createFile("img-logo", "logo.svg", { size: "3.1 KB", modified: "2026-03-15", type: "SVG" }),
    createFile("img-banner", "banner.png", { size: "142.4 KB", modified: "2026-03-15", type: "PNG" }),
    createFile("img-avatar", "default-avatar.png", { size: "8.7 KB", modified: "2026-03-10", type: "PNG" }),
    createFile("img-og", "og-image.jpg", { size: "96.0 KB", modified: "2026-03-15", type: "JPEG" }),
  ],

  // ── src/assets/fonts/ ─────────────────────────────────────────────
  "src-assets-fonts": [
    createFile("font-regular", "inter-regular.woff2", { size: "58.2 KB", modified: "2026-01-01", type: "Font" }),
    createFile("font-medium", "inter-medium.woff2", { size: "60.1 KB", modified: "2026-01-01", type: "Font" }),
    createFile("font-bold", "inter-bold.woff2", { size: "61.4 KB", modified: "2026-01-01", type: "Font" }),
    createFile("font-mono", "jetbrains-mono.woff2", { size: "72.9 KB", modified: "2026-01-01", type: "Font" }),
  ],

  // ── src/assets/icons/ ─────────────────────────────────────────────
  "src-assets-icons": [
    createFile("icon-favicon", "favicon.ico", { size: "15.1 KB", modified: "2026-03-15", type: "ICO" }),
    createFile("icon-apple", "apple-touch-icon.png", { size: "22.4 KB", modified: "2026-03-15", type: "PNG" }),
  ],

  // ── src/environments/ ─────────────────────────────────────────────
  "src-environments": [
    createFile("env-dev", "environment.ts", { size: "0.3 KB", modified: "2026-04-01", type: "TypeScript" }),
    createFile("env-prod", "environment.prod.ts", { size: "0.3 KB", modified: "2026-04-01", type: "TypeScript" }),
    createFile("env-staging", "environment.staging.ts", { size: "0.3 KB", modified: "2026-04-01", type: "TypeScript" }),
  ],

  // ── docs/ ─────────────────────────────────────────────────────────
  docs: [
    createDirectory("docs-guides", "guides"),
    createDirectory("docs-api", "api"),
    createDirectory("docs-examples", "examples"),
    createFile("docs-changelog", "CHANGELOG.md", { size: "18.6 KB", modified: "2026-04-29", type: "Markdown" }),
    createFile("docs-index", "index.md", { size: "2.1 KB", modified: "2026-04-20", type: "Markdown" }),
    createFile("docs-contributing", "CONTRIBUTING.md", { size: "6.3 KB", modified: "2026-04-01", type: "Markdown" }),
  ],

  // ── docs/guides/ ──────────────────────────────────────────────────
  "docs-guides": [
    createFile("guide-start", "getting-started.md", { size: "8.3 KB", modified: "2026-04-20", type: "Markdown" }),
    createFile("guide-install", "installation.md", { size: "4.5 KB", modified: "2026-04-15", type: "Markdown" }),
    createFile("guide-config", "configuration.md", { size: "6.2 KB", modified: "2026-04-18", type: "Markdown" }),
    createFile("guide-deploy", "deployment.md", { size: "9.1 KB", modified: "2026-04-22", type: "Markdown" }),
    createFile("guide-auth", "authentication.md", { size: "11.4 KB", modified: "2026-04-24", type: "Markdown" }),
  ],

  // ── docs/api/ ─────────────────────────────────────────────────────
  "docs-api": [
    createFile("api-components", "components.md", { size: "24.7 KB", modified: "2026-04-28", type: "Markdown" }),
    createFile("api-directives", "directives.md", { size: "14.2 KB", modified: "2026-04-26", type: "Markdown" }),
    createFile("api-services", "services.md", { size: "18.5 KB", modified: "2026-04-27", type: "Markdown" }),
    createFile("api-pipes", "pipes.md", { size: "5.1 KB", modified: "2026-04-20", type: "Markdown" }),
  ],

  // ── docs/examples/ ────────────────────────────────────────────────
  "docs-examples": [
    createFile("ex-basic", "basic-usage.md", { size: "3.8 KB", modified: "2026-04-14", type: "Markdown" }),
    createFile("ex-advanced", "advanced-usage.md", { size: "7.2 KB", modified: "2026-04-16", type: "Markdown" }),
    createFile("ex-custom", "customisation.md", { size: "5.9 KB", modified: "2026-04-17", type: "Markdown" }),
  ],

  // ── tests/ ────────────────────────────────────────────────────────
  tests: [
    createDirectory("tests-unit", "unit"),
    createDirectory("tests-e2e", "e2e"),
    createDirectory("tests-fixtures", "fixtures"),
    createFile("tests-setup", "setup.ts", { size: "0.9 KB", modified: "2026-04-10", type: "TypeScript" }),
    createFile("tests-config", "vitest.config.ts", { size: "1.2 KB", modified: "2026-04-10", type: "TypeScript" }),
  ],

  // ── tests/unit/ ───────────────────────────────────────────────────
  "tests-unit": [
    createDirectory("tests-unit-components", "components"),
    createDirectory("tests-unit-services", "services"),
  ],

  // ── tests/unit/components/ ────────────────────────────────────────
  "tests-unit-components": [
    createFile("spec-header", "header.component.spec.ts", { size: "4.1 KB", modified: "2026-04-26", type: "TypeScript" }),
    createFile("spec-sidebar", "sidebar.component.spec.ts", { size: "6.2 KB", modified: "2026-04-24", type: "TypeScript" }),
    createFile("spec-dashboard", "dashboard.component.spec.ts", { size: "7.3 KB", modified: "2026-04-29", type: "TypeScript" }),
    createFile("spec-settings", "settings.component.spec.ts", { size: "3.8 KB", modified: "2026-04-23", type: "TypeScript" }),
  ],

  // ── tests/unit/services/ ──────────────────────────────────────────
  "tests-unit-services": [
    createFile("spec-auth-svc", "auth.service.spec.ts", { size: "5.4 KB", modified: "2026-04-27", type: "TypeScript" }),
    createFile("spec-api-svc", "api.service.spec.ts", { size: "8.9 KB", modified: "2026-04-28", type: "TypeScript" }),
    createFile("spec-storage-svc", "storage.service.spec.ts", { size: "2.1 KB", modified: "2026-04-20", type: "TypeScript" }),
  ],

  // ── tests/e2e/ ────────────────────────────────────────────────────
  "tests-e2e": [
    createDirectory("tests-e2e-flows", "flows"),
    createFile("e2e-app", "app.e2e.ts", { size: "2.2 KB", modified: "2026-04-18", type: "TypeScript" }),
  ],

  // ── tests/e2e/flows/ ──────────────────────────────────────────────
  "tests-e2e-flows": [
    createFile("e2e-login", "login.e2e.ts", { size: "3.6 KB", modified: "2026-04-18", type: "TypeScript" }),
    createFile("e2e-dashboard", "dashboard.e2e.ts", { size: "4.2 KB", modified: "2026-04-18", type: "TypeScript" }),
    createFile("e2e-settings", "settings.e2e.ts", { size: "2.8 KB", modified: "2026-04-18", type: "TypeScript" }),
  ],

  // ── tests/fixtures/ ───────────────────────────────────────────────
  "tests-fixtures": [
    createFile("fix-users", "users.json", { size: "1.4 KB", modified: "2026-04-05", type: "JSON" }),
    createFile("fix-projects", "projects.json", { size: "2.1 KB", modified: "2026-04-05", type: "JSON" }),
  ],

  // ── .github/ ──────────────────────────────────────────────────────
  github: [
    createDirectory("github-workflows", "workflows"),
    createFile("github-pr-template", "PULL_REQUEST_TEMPLATE.md", { size: "1.1 KB", modified: "2026-03-01", type: "Markdown" }),
    createFile("github-codeowners", "CODEOWNERS", { size: "0.4 KB", modified: "2026-03-01", type: "Text" }),
  ],

  // ── .github/workflows/ ────────────────────────────────────────────
  "github-workflows": [
    createFile("wf-ci", "ci.yml", { size: "2.8 KB", modified: "2026-04-20", type: "YAML" }),
    createFile("wf-release", "release.yml", { size: "1.9 KB", modified: "2026-04-15", type: "YAML" }),
    createFile("wf-codeql", "codeql.yml", { size: "1.2 KB", modified: "2026-03-10", type: "YAML" }),
  ],
};

export class SampleFileBrowserDatasource implements FileBrowserDatasource<FileMeta> {
  public getChildren(
    parent: FileBrowserEntry<FileMeta> | null,
  ): FileBrowserEntry<FileMeta>[] {
    return SAMPLE_ENTRIES[parent?.id ?? "root"] ?? [];
  }

  public isDirectory(entry: FileBrowserEntry<FileMeta>): boolean {
    return entry.isDirectory;
  }
}

export abstract class UIFileBrowserStoryBase {
  protected readonly ds = new SampleFileBrowserDatasource();
  protected readonly lastEvent = signal<string>("");

  protected onFileActivated(event: FileActivateEvent<FileMeta>): void {
    this.lastEvent.set(`Opened: ${event.entry.name}`);
  }

  protected onDirChange(event: DirectoryChangeEvent<FileMeta>): void {
    const path = event.path.map((entry) => entry.name).join("/");
    this.lastEvent.set(`Navigated to: /${path || "(root)"}`);
  }
}

export function fileBrowserMetadataProvider(
  entry: FileBrowserEntry<FileMeta>,
): MetadataField[] {
  const fields: MetadataField[] = [];

  if (entry.meta?.size) {
    fields.push({ label: "Size", value: entry.meta.size });
  }

  if (entry.meta?.type) {
    fields.push({ label: "Type", value: entry.meta.type });
  }

  if (entry.meta?.modified) {
    fields.push({ label: "Modified", value: entry.meta.modified });
  }

  return fields;
}

function createDirectory(
  id: string,
  name: string,
  icon?: string,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: true, icon };
}

function createFile(
  id: string,
  name: string,
  meta?: FileMeta,
  icon?: string,
): FileBrowserEntry<FileMeta> {
  return { id, name, isDirectory: false, meta, icon };
}
