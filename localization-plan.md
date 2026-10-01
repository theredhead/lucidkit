# Localization Remediation Plan

This plan removes literal user-facing text from runtime components and introduces a consistent localization architecture across `@theredhead/lucid-*` packages.

The initial implementation ships `en-US` only. The architecture must support additional cultures without changing component APIs or templates.

## Goals

- [ ] Define a namesake `Intl` interface for every component that owns user-visible text.
- [ ] Implement that interface in language-specific injectable classes named `<Component><Language>Intl`.
- [ ] Include visible labels, placeholders, empty states, validation messages, status text, titles, and accessibility text.
- [ ] Represent interpolated text as typed functions rather than string templates inside components.
- [ ] Annotate every Intl implementation with `@Language("<culture>")`.
- [ ] Resolve the best matching Intl implementation from the active culture.
- [ ] Fall back deterministically to `en-US`.
- [ ] Allow culture selection to be overridden by application configuration or code.
- [ ] Allow consumers to override individual Intl families or language implementations through Angular DI.
- [ ] Add automated checks that prevent new runtime text literals from bypassing this pattern.

## Non-Goals

- Translating the library beyond `en-US` in the first phase.
- Translating consumer-provided content, datasource values, schema labels, or projected content.
- Replacing browser-native locale formatting APIs.
- Localizing Storybook-only prose or test descriptions.
- Adding a runtime dependency on a third-party internationalization framework.

## Terminology

- **Culture:** A normalized BCP 47 language tag such as `en-US`, `en-GB`, or `nl-NL`.
- **Intl interface:** The namesake TypeScript contract containing all text owned by one component or cohesive feature, for example `UIButtonIntl`.
- **Intl implementation:** An injectable language-specific class implementing the namesake interface, for example `UIButtonEnglishIntl`.
- **Intl family:** The namesake interface, its typed Angular injection token, and all language-specific implementations.
- **Active culture:** The culture currently selected by explicit override or environment detection.
- **Fallback culture:** `en-US`.

## Foundation Runtime

### `@Language` Decorator

- [ ] Add a TypeScript class decorator to `@theredhead/lucid-foundation`:

  ```typescript
  export interface UIMediaGalleryIntl {
    readonly close: string;
    readonly previous: string;
    readonly next: string;
    readonly mediaPreviews: string;
    openFullscreen(description: string): string;
    openMedia(description: string): string;
  }

  @Language("en-US")
  @Injectable()
  export class UIMediaGalleryEnglishIntl implements UIMediaGalleryIntl {
    public readonly close = "Close";
    public readonly previous = "Previous";
    public readonly next = "Next";
    public readonly mediaPreviews = "Media previews";

    public openFullscreen(description: string): string {
      return `Open ${description} fullscreen`;
    }

    public openMedia(description: string): string {
      return `Open ${description}`;
    }
  }
  ```

- [ ] Store immutable language metadata on the decorated class.
- [ ] Export a public metadata reader such as `getLanguage(target)`.
- [ ] Validate and canonicalize tags with `Intl.getCanonicalLocales()`.
- [ ] Reject missing, invalid, or duplicate language declarations during registration.
- [ ] Avoid `reflect-metadata`; use a private `Symbol` or `WeakMap` so Foundation retains zero non-Angular runtime dependencies.
- [ ] Add `Language`, its metadata types, and metadata helpers to the Foundation public API and API inventory.

### Intl Contract and Registration

- [ ] Define a typed Angular injection token for every namesake interface because TypeScript interfaces do not exist at runtime.
- [ ] Name family tokens consistently, for example `UI_MEDIA_GALLERY_INTL: InjectionToken<UIMediaGalleryIntl>`.
- [ ] Define a typed registration model that associates the family token and interface with one or more decorated implementations.
- [ ] Preserve Angular DI override through the family token.
- [ ] Support library registration through environment providers, for example:

  ```typescript
  provideIntl<UIMediaGalleryIntl>(UI_MEDIA_GALLERY_INTL, [
    UIMediaGalleryEnglishIntl,
    UIMediaGalleryDutchIntl,
  ]);
  ```

- [ ] Do not instantiate every language implementation eagerly.
- [ ] Detect duplicate implementations for the same canonical culture and Intl family.
- [ ] Keep component injection simple:

  ```typescript
  protected readonly intl = inject(UI_MEDIA_GALLERY_INTL);
  ```

### Culture Resolution

Resolution order:

1. [ ] Runtime override set through `InternationalizationService`.
2. [ ] Application bootstrap override provided through DI/configuration.
3. [ ] Server request `Accept-Language` values when available through an adapter/provider.
4. [ ] Browser `navigator.languages` and `navigator.language`.
5. [ ] `en-US` fallback.

> Browsers do not expose their outgoing HTTP `Accept-Language` header to client JavaScript. Browser-side detection therefore uses `navigator.languages`; SSR or server integrations may provide parsed `Accept-Language` values explicitly.

- [ ] Add an `InternationalizationService` with a signal-backed active culture.
- [ ] Provide methods to set, reset, and inspect the active culture.
- [ ] Canonicalize and de-duplicate preference lists.
- [ ] Match in this order:
  1. exact culture (`nl-NL`),
  2. language-only or closest registered variant (`nl`),
  3. fallback `en-US`.
- [ ] Define deterministic matching when several variants share a language.
- [ ] Runtime culture changes must update locale-aware proxies in place; they must not recreate application components, router state, forms, selections, scroll positions, or other SPA state.
- [ ] Ensure SSR and hydration resolve the same initial culture to avoid text mismatch.

### Internationalization Service

- [ ] Add `InternationalizationService` to `@theredhead/lucid-foundation` as the single runtime API for culture inspection and switching.
- [ ] Expose read-only signals for:
  - active culture,
  - requested culture,
  - loading state,
  - last loading error.
- [ ] Expose an asynchronous API:

  ```typescript
  await internationalization.setCulture("nl-NL");
  internationalization.resetCulture();
  ```

- [ ] Keep the current culture active while a requested culture is loading.
- [ ] Activate a new culture atomically only after all required Intl families for the current application scope have resolved successfully.
- [ ] Preserve normal SPA state by changing only the implementation behind stable locale-aware Intl proxies.
- [ ] Do not reload the page, rebuild the Angular injector tree, recreate routed components, or mutate consumer state.
- [ ] Define switch concurrency semantics: the latest `setCulture()` request wins; stale async results must not reactivate an older request.
- [ ] De-duplicate concurrent requests for the same culture.
- [ ] Cache successfully loaded implementations by Intl family and canonical culture.
- [ ] Define retry behavior after a failed dynamic import.
- [ ] Return a structured switch result containing requested culture, resolved culture, fallback usage, and loaded family count.

### Lazy Language Loading

- [ ] Register language implementations through lazy loader functions rather than eager class arrays for non-default cultures.

  ```typescript
  provideIntl<UIMediaGalleryIntl>(UI_MEDIA_GALLERY_INTL, {
    default: UIMediaGalleryEnglishIntl,
    loaders: {
      "nl-NL": () =>
        import("./intl/media-gallery-dutch.intl").then(
          (module) => module.UIMediaGalleryDutchIntl,
        ),
    },
  });
  ```

- [ ] Bundle `en-US` implementations eagerly as the guaranteed fallback.
- [ ] Place optional cultures in separate build chunks through dynamic imports.
- [ ] Do not preload every registered culture at application startup.
- [ ] Load only the requested culture and only the Intl families registered in the active application scope.
- [ ] Allow optional package-level language bundles to register several family loaders together without eagerly importing their classes.
- [ ] Validate loaded classes against their `@Language` metadata and expected Intl family before caching them.
- [ ] Fall back family-by-family to `en-US` when a requested culture has no loader for that family.
- [ ] Distinguish a missing translation from a failed loader in diagnostics.
- [ ] Permit applications to preload selected likely cultures explicitly as an optimization, but never by default.
- [ ] Consider idle-time or route-aware prefetch hooks as optional application policy outside the core service.

### Stable Proxy Runtime Shape

- [ ] Prefer locale-aware proxy values typed as the namesake interface whose members delegate to the currently selected implementation.
- [ ] Keep component templates signal-compatible so a runtime culture change triggers rendering.
- [ ] Ensure literal properties and formatter functions are both type-safe.
- [ ] Cache selected implementations per Intl family and culture.
- [ ] Avoid component-specific locale resolution logic.
- [ ] Keep each family proxy identity stable across culture switches so injected references remain valid.
- [ ] Make property reads reactive to the active implementation; formatter method calls must delegate to the same active implementation.
- [ ] Ensure overlays, dialogs, services, and lazy-created components share the same service and proxy state.
- [ ] Define behavior for long-lived callbacks that capture Intl methods; recommend calling through the proxy rather than destructuring methods.

## Intl Interface and Implementation Rules

For every runtime component or cohesive feature that owns text:

| Role | Naming pattern | Button example |
| --- | --- | --- |
| Component | `<Component>` | `UIButton` |
| Text contract | `<Component>Intl` | `UIButtonIntl` |
| English implementation | `<Component>EnglishIntl` | `UIButtonEnglishIntl` |
| Additional implementation | `<Component><Language>Intl` | `UIButtonDutchIntl` |
| Angular family token | `UI_<NAME>_INTL` | `UI_BUTTON_INTL` |

- [ ] Create a namesake `<ClassName>Intl` interface, for example `UIButtonIntl`.
- [ ] Create implementations named `<ClassName><Language>Intl`, for example `UIButtonEnglishIntl` and `UIButtonDutchIntl`.
- [ ] Use readable English language names in class names; store the precise culture in `@Language`, not in the class name.
- [ ] Decorate the default `<ClassName>EnglishIntl` implementation with `@Language("en-US")`.
- [ ] Mark implementation classes injectable; interfaces remain pure TypeScript contracts.
- [ ] Create and export a typed family token because the interface cannot be injected directly.
- [ ] Define fixed strings as `readonly` properties on the interface and `public readonly` properties on implementations.
- [ ] Define interpolated strings as interface methods with typed arguments and public implementation methods.
- [ ] Include visible and accessibility text in the same interface unless the feature is large enough to justify a documented sub-interface.
- [ ] Keep strings semantic rather than tied to element type, for example `dismissNotification`, not `buttonAriaLabel`.
- [ ] Do not concatenate translated fragments in templates.
- [ ] Do not use positional placeholder arrays when a typed method is possible.
- [ ] Do not put component behavior, formatting state, or DOM logic in Intl interfaces or implementations.
- [ ] Use `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.ListFormat` for locale-sensitive values.
- [ ] Keep consumer content outside Intl interfaces and implementations.

Example:

```typescript
export interface UITableViewIntl {
  readonly selection: string;
  readonly selectAllRows: string;
  readonly previousPage: string;
  readonly nextPage: string;
  selectRow(index: number): string;
}

@Language("en-US")
@Injectable()
export class UITableViewEnglishIntl implements UITableViewIntl {
  public readonly selection = "Selection";
  public readonly selectAllRows = "Select all rows";
  public readonly previousPage = "Previous page";
  public readonly nextPage = "Next page";

  public selectRow(index: number): string {
    return `Select row ${index + 1}`;
  }
}
```

## Component Migration Rules

A runtime string must move to Intl when it is:

- [ ] Visible text rendered by the component.
- [ ] A placeholder generated by the component.
- [ ] An `aria-label`, `aria-description`, `title`, or equivalent accessibility string.
- [ ] An empty, loading, error, warning, confirmation, or status message.
- [ ] A default action label or dialog title.
- [ ] A validation message generated by library code.
- [ ] Text created programmatically and inserted into the DOM.

A string does not need Intl when it is:

- [ ] Consumer-provided content or schema data.
- [ ] A selector, class, token, enum, protocol value, MIME type, or URL.
- [ ] A logger/debug message not shown in application UI.
- [ ] A developer exception that cannot reach an end user.
- [ ] Storybook/demo-only content.
- [ ] Documentation or tests.

## Phase 1: Foundation Infrastructure

- [ ] Implement and test `@Language`.
- [ ] Implement culture canonicalization and matching.
- [ ] Implement active-culture DI tokens and `InternationalizationService`.
- [ ] Implement Intl-family registration and resolution.
- [ ] Implement lazy loader registration, request de-duplication, loaded-culture caching, and latest-request-wins switching.
- [ ] Implement stable family proxies that swap implementations without recreating consumers.
- [ ] Add browser and SSR preference adapters.
- [ ] Add `en-US` fallback enforcement.
- [ ] Add tests for exact, language-only, unsupported, malformed, and empty preferences.
- [ ] Add tests for explicit runtime and bootstrap overrides.
- [ ] Add tests proving non-default languages are not imported before they are requested.
- [ ] Add tests for concurrent culture requests, stale-result suppression, failed imports, retries, and partial family fallback.
- [ ] Add tests proving component instances and signal/form state survive culture switches.
- [ ] Add tests for SSR/browser initial-culture parity.
- [ ] Update Foundation README, public API, and `components.agents.md`.

## Phase 2: Fixed Visible Text

### UI Kit

- [ ] `UICountdownIntl`: `Expired`.
- [ ] `UISignatureIntl`: drop instruction and replay status.
- [ ] `UIColorPickerIntl`: no-matching-colors state shared by panel and popover.
- [ ] `UIEmojiPickerIntl`: search placeholder and no-results state.
- [ ] `UICalendarMonthViewIntl`: week abbreviation and related visible calendar text.

### UI Blocks

- [ ] `UIChatViewIntl`: empty conversation text.
- [ ] `UICommandPaletteIntl`: no-command-results text.
- [ ] `UIFileBrowserIntl`: empty-folder text across all render modes.
- [ ] `UIKanbanBoardIntl`: empty-column text.
- [ ] `UIRichTextEditorIntl`: placeholder search, no matches, and other visible editor-owned text.
- [ ] `UITemplateBlockDialogIntl`: no-editable-attributes message.

### UI Forms

- [ ] `UIFormIntl`: configuration error text.
- [ ] `UIFormDesignerIntl`: form/group/field property headings.
- [ ] `UIValidationIntl`: required, length, range, pattern, email, and unknown-validator messages as typed formatter methods.
- [ ] Preserve per-rule validation-message overrides above Intl defaults.

### Theme Studio

- [ ] `UIThemeStudioIntl`: title, copy actions, token search placeholder, and copy-result feedback.
- [ ] `UIThemeTokenRowIntl`: reset action label.

## Phase 3: Fixed Accessibility and Navigation Text

### UI Kit

- [ ] `UICalendarMonthViewIntl`: previous month, today, next month, week number.
- [ ] `UICalendarPanelIntl`: previous/next month and year.
- [ ] `UICarouselIntl`: previous/next item.
- [ ] `UIMediaGalleryIntl`: close, previous, next, media previews, open media, open fullscreen, fallback media/video descriptions.
- [ ] `UITableViewIntl`: selection, select all, select row, previous/next page.
- [ ] `UIInputIntl`: textarea resize label.
- [ ] `UIChipIntl`: remove action.
- [ ] `UIChartIntl`: chart legend.
- [ ] `UIFileUploadIntl`: remove file.
- [ ] `UIToastIntl`: dismiss notification.
- [ ] `UIEmojiPickerIntl`: search label.
- [ ] `UIEmojiPickerIntl`: localized `EmojiSearchTerms` metadata for the built-in emoji set; preserve the `emojiSearchTerms` input as the per-instance override.

### UI Blocks

- [ ] `UIFileBrowserIntl`: toolbar, view modes, tree, details panel, and sidebar resize labels.
- [ ] `UIDashboardIntl`: dock, menu, and panel picker.
- [ ] `UIDashboardPanelIntl`: expand, collapse, and remove panel.
- [ ] `UIRichTextEditorIntl`: all toolbar groups/actions, table-size formatter, image/table/link/template actions.
- [ ] `UISearchViewIntl`: saved-searches label.

### UI Forms

- [ ] `UIFormDesignerIntl`: selection and group/field action labels.
- [ ] `UIFormWizardIntl`: form-steps label.

## Phase 4: Existing English Defaults

Migrate defaults that are already consumer-overridable so application-wide localization does not require setting every component input.

### UI Kit

- [ ] Analog Clock
- [ ] Autocomplete
- [ ] Breadcrumb
- [ ] Calendar and Calendar Panel
- [ ] Carousel
- [ ] Chart
- [ ] Color Picker
- [ ] Countdown
- [ ] Dialog and Drawer
- [ ] Dropdown List and Dropdown Menu
- [ ] Emoji Picker
- [ ] Empty State
- [ ] File Upload
- [ ] Gantt Chart and Gauge
- [ ] Image Cropper
- [ ] JSON View and Map View
- [ ] Media Gallery and Media Player
- [ ] Pagination and Progress
- [ ] QR Code and Rating
- [ ] Rich Text View
- [ ] Segmented Control
- [ ] Sidebar Navigation
- [ ] Signature and Skeleton
- [ ] Slider and Split Container
- [ ] Timeline, Toolbar, and Tree View

### UI Blocks

- [ ] Chat View and Command Palette placeholders/labels.
- [ ] Common dialog titles, actions, instructions, labels, and placeholders.
- [ ] Dashboard and File Browser defaults.
- [ ] Kanban Board defaults.
- [ ] Master Detail View title and empty selection text.
- [ ] Navigation Page and Property Sheet labels.
- [ ] Rich Text Editor placeholder and root label.
- [ ] Search View title and empty state.
- [ ] Source Tabs labels and empty message.
- [ ] Wizard back, next, finish, and root labels.

### Compatibility

- [ ] Keep existing text inputs as explicit per-instance overrides.
- [ ] Resolve input text above Intl defaults.
- [ ] Document precedence: explicit input > resolved Intl > `en-US` fallback.
- [ ] Avoid breaking public APIs during migration.

## Phase 5: Dialogs and Validation

- [ ] Add namesake Intl interfaces and English implementation classes for alert, confirm, prompt, open-file, and save-file dialogs.
- [ ] Move service default option values into resolved Intl implementations.
- [ ] Keep caller-supplied service options highest precedence.
- [ ] Move instructional dialog text, labels, placeholders, and cancellation labels into Intl.
- [ ] Add typed methods for dynamic filenames, counts, and selections.
- [ ] Route validator defaults through `UIValidationIntl`.
- [ ] Keep rule-specific `message` overrides highest precedence.

## Phase 6: Automation and Enforcement

- [ ] Add `scripts/audit-localization.mjs`.
- [ ] Scan production `.html` and `.ts` files while excluding stories, specs, docs, generated files, comments, and logs.
- [ ] Flag literal text nodes in component templates.
- [ ] Flag literal accessibility attributes and placeholders.
- [ ] Flag DOM-facing string literals in component TypeScript.
- [ ] Allow protocol values, selectors, enum values, and explicitly annotated exceptions.
- [ ] Require a namesake Intl interface, typed family token, and at least one implementation for every component owning text.
- [ ] Require every Intl implementation to have `@Language`.
- [ ] Require an `en-US` implementation for every Intl family.
- [ ] Add the audit to CI and the verification checklist.
- [ ] Update `AGENTS.md` with the Intl interface/implementation naming pattern and no-literal-runtime-text rules.

## Testing Strategy

### Foundation

- [ ] Decorator metadata tests.
- [ ] Invalid and canonical language-tag tests.
- [ ] Exact-culture matching tests.
- [ ] Language fallback tests.
- [ ] `en-US` final fallback tests.
- [ ] Explicit override precedence tests.
- [ ] Browser preference adapter tests.
- [ ] SSR `Accept-Language` adapter tests.
- [ ] Runtime culture switching tests.
- [ ] Lazy loader invocation and chunk-boundary tests.
- [ ] Loaded implementation caching and request de-duplication tests.
- [ ] Latest-request-wins race tests.
- [ ] Atomic activation and fallback-result tests.
- [ ] Failed loader retry tests.

### Components

For each migrated component:

- [ ] Assert default `en-US` text.
- [ ] Override its typed Intl family token with a test implementation and assert all visible/accessibility text changes.
- [ ] Test formatter methods with representative placeholder values.
- [ ] Assert explicit text inputs still override Intl defaults.
- [ ] Test conditional and pluralized text paths.
- [ ] Update Storybook stories with a non-English test provider where useful to expose layout assumptions.

### Integration

- [ ] Add a host application test that changes culture at runtime.
- [ ] Assert routed component identity, form values, selection, and scroll state survive language changes.
- [ ] Verify all active overlays and dialogs use the current culture.
- [ ] Verify lazy-created services and components use the current culture.
- [ ] Verify non-requested cultures are absent from the initial bundle/load graph.
- [ ] Verify only the selected culture chunk is requested during a switch.
- [ ] Verify SSR and hydration produce identical initial text.
- [ ] Verify unsupported cultures fall back to `en-US` without errors.

## Documentation

- [ ] Write an RFC for the locale runtime, registration model, and runtime switching semantics.
- [ ] Add a MADR decision record for namesake Intl interfaces, language-named implementation classes, typed family tokens, and `@Language` metadata.
- [ ] Document application bootstrap culture configuration.
- [ ] Document server `Accept-Language` integration.
- [ ] Document runtime culture overrides.
- [ ] Document `InternationalizationService.setCulture()` lifecycle, loading UI, errors, fallback results, and concurrency semantics.
- [ ] Document lazy language bundle registration and explicit optional preloading.
- [ ] Document component-level Intl provider overrides.
- [ ] Add migration examples for fixed text, formatter functions, and existing input defaults.
- [ ] Update every package API inventory as Intl interfaces, implementation classes, family tokens, and Foundation exports are added.

## Recommended Execution Order

1. [ ] Approve the RFC and MADR decision.
2. [ ] Implement Foundation language metadata, lazy loaders, stable proxies, and `InternationalizationService`.
3. [ ] Migrate one pilot component with visible and dynamic accessibility text (`UIMediaGallery`).
4. [ ] Validate runtime switching, SSR behavior, and DI overrides with the pilot.
5. [ ] Migrate fixed visible text across packages.
6. [ ] Migrate fixed accessibility text.
7. [ ] Migrate existing overridable English defaults.
8. [ ] Migrate dialogs and validation messages.
9. [ ] Add and enforce the localization audit.
10. [ ] Complete package documentation and full regression verification.

## Pilot: UIMediaGallery

- [ ] Create the `UIMediaGalleryIntl` interface.
- [ ] Create `UIMediaGalleryEnglishIntl implements UIMediaGalleryIntl`, annotated with `@Language("en-US")`.
- [ ] Create the typed `UI_MEDIA_GALLERY_INTL` family token.
- [ ] Move `Media gallery`, `Close`, `Previous`, `Next`, `Media previews`, fallback `media`, fallback `Video`, and dynamic open labels into the interface and English implementation.
- [ ] Inject the resolved `UI_MEDIA_GALLERY_INTL` value into `UIMediaGallery`.
- [ ] Preserve the existing `ariaLabel` input as an explicit override.
- [ ] Add a test implementation of `UIMediaGalleryIntl`, override the family token, and verify all rendered labels.
- [ ] Verify inline and fullscreen modes use the same resolved language.
- [ ] Verify body-appended/fullscreen presentation does not lose injector context.
- [ ] Expose the interface, English implementation class, and family token from the media-gallery barrel and API inventory.

## Completion Criteria

- [ ] Every production component-owned user-facing string is declared by a namesake Intl interface and supplied by a language-specific implementation.
- [ ] Every Intl implementation is annotated with `@Language`.
- [ ] Every Intl family has an `en-US` implementation.
- [ ] Active culture follows explicit override, bootstrap/server/browser preference, then `en-US` fallback.
- [ ] Existing explicit text inputs remain compatible and take precedence.
- [ ] Runtime culture changes update active component and overlay text without recreating components or losing SPA state.
- [ ] Non-default cultures are loaded on demand and are not part of the eager startup path.
- [ ] Culture switching is atomic, cached, race-safe, and exposes loading/error/fallback state.
- [ ] The localization audit passes with no unexplained findings.
- [ ] Foundation and package API inventories are current.
- [ ] `npx tsc --noEmit`, `npx vitest run`, `npm run lint`, and Storybook build all pass.
