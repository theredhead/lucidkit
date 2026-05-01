# Storybook Review Findings

Date: 2026-05-01

## Scope

This pass re-checked the remaining Storybook story components and wrappers under `packages/**/stories/**` after the recent cleanup work, with focus on:

- single-instance stories whose controls still do not affect the rendered demo
- redundant `default` / `playground` pairs where one story is already the correct live surface
- stories that document interaction but still do not expose meaningful Storybook actions
- current, confirmed issues only

## Recently Resolved

### `Table View` family is no longer a current findings target

Files:

- `packages/ui-kit/src/lib/table-view/stories/**`

What changed:

- The remaining table stories were normalized onto live `args`-driven renders instead of fixed wrapper mounts.
- Inline-style violations in the touched table story templates were moved into colocated `.story.scss` files.
- The obsolete `density-playground` story was removed entirely.
- The current docs carrier, `filtered-table`, now exposes a real density control and uses a 10,000-row deterministic dataset, which makes the docs surface materially more representative of real filtering and pagination behavior.

Why it is no longer listed below:

- The earlier table-view issue class was Storybook wiring inconsistency. That is no longer the limiting problem for this family, so it should not remain mixed into the active findings backlog.

## Confirmed Remaining Issues

### 1. `Split Container` default story still exposes dead controls

Files:

- `packages/ui-kit/src/lib/split-container/stories/default/default.stories.ts`
- `packages/ui-kit/src/lib/split-container/stories/default/default.story.ts`

What is wrong:

- The story defines `orientation`, `dividerWidth`, `disabled`, and `ariaLabel` controls.
- `render()` ignores `args` and mounts a fixed `<ui-default-story-demo />`.
- `DefaultStorySource` exposes no signal inputs at all.

Impact:

- The default story presents itself as the canonical interactive example, but the controls panel is inert.

### 2. `Dropdown Menu` basic story still has dead controls and no useful action surface

Files:

- `packages/ui-kit/src/lib/dropdown-menu/stories/basic/basic.stories.ts`
- `packages/ui-kit/src/lib/dropdown-menu/stories/basic/basic.story.ts`

What is wrong:

- The story advertises `align` and `ariaLabel` controls, but `render()` still mounts a fixed `<ui-basic-story-demo />` without `props: args`.
- The wrapper component does expose `input()` members, so the story is one small step away from working and is currently miswired rather than intentionally static.
- The demo methods `onEdit()`, `onDuplicate()`, and `onArchive()` are empty, and the story does not expose Storybook actions for those interactions.

Impact:

- The main dropdown story is visually interactive but Storybook does not actually let users verify its configured inputs or emitted actions.

### 3. `Theme Toggle` keeps a redundant dead `Default` story beside a live `Playground`

Files:

- `packages/ui-kit/src/lib/theme-toggle/stories/default/default.stories.ts`
- `packages/ui-kit/src/lib/theme-toggle/stories/playground/playground.stories.ts`

What is wrong:

- `Playground` is already the correct live single-instance story: it uses `args`, `props: args`, and a direct template binding.
- `Default` still ignores `args` and mounts a fixed wrapper, even though it exposes the same control surface.

Impact:

- The story family currently violates the new rule in the most confusing way: the canonical `Default` story is the broken one, while the secondary `Playground` is the real interactive example.

### 4. `Dropdown List` has the same redundant `Default` / `Playground` split

Files:

- `packages/ui-kit/src/lib/dropdown-list/stories/default/default.stories.ts`
- `packages/ui-kit/src/lib/dropdown-list/stories/playground/playground.stories.ts`

What is wrong:

- `Playground` is already a proper interactive single-instance story with live args.
- `Default` still ignores the exact same control surface and mounts `<ui-default-story-demo />` with no arg forwarding.

Impact:

- Consumers land on a misleading default story first, then discover a second story that is effectively the real default.

### 5. `Progress` has the inverse problem: the live story is `Default`, but `Playground` is broken

Files:

- `packages/ui-kit/src/lib/progress/stories/default/default.stories.ts`
- `packages/ui-kit/src/lib/progress/stories/playground/playground.stories.ts`

What is wrong:

- `Default` is already a correct live single-instance story using `props: args`.
- `Playground` declares the same args but still renders a fixed `<ui-playground-story-demo />` without forwarding them.

Impact:

- The `Playground` story is redundant and misleading. It looks like the exploratory surface but is less functional than `Default`.

### 6. `Search View` default story still presents a dead control surface

Files:

- `packages/ui-blocks/src/lib/search-view/stories/default/default.stories.ts`
- `packages/ui-blocks/src/lib/search-view/stories/default/default.story.ts`

What is wrong:

- The story exposes a large control surface: `title`, `layout`, `showFilter`, `filterExpanded`, `filterModeLocked`, `showPagination`, `pageSize`, `placeholder`, and `ariaLabel`.
- `render()` still ignores `args` and mounts a fixed wrapper.
- The wrapper only defines static sample data and does not expose the corresponding signal inputs.

Impact:

- This is a high-cost misleading story because the visible controls imply the whole composed layout is explorable, when none of those controls currently mutate the demo.

### 7. `UI Forms / Form` playground is still a dead wrapper despite being the named exploratory story

Files:

- `packages/ui-forms/src/lib/components/stories/playground/playground.stories.ts`
- `packages/ui-forms/src/lib/components/stories/playground/playground.story.ts`

What is wrong:

- The story is explicitly named `Playground` and defines `args` such as `schema`, `submitLabel`, and `showSubmit`.
- `render()` still mounts a fixed `<ui-story-playground />` with no `props: args` forwarding.

Impact:

- This is exactly the class of issue the cleanup is trying to eliminate: the story most expected to be interactive is currently inert.

## Pattern-Level Conclusions

### 1. The remaining breakages are no longer mostly documentation stubs

The earlier empty documentation-story problem is largely cleaned up. The remaining issues are now mostly canonical single-instance stories whose wrappers still do not honor Storybook `args`.

The `Table View` family no longer belongs in that bucket after the latest normalization pass.

### 2. The highest-friction problem is now `default` / `playground` role inversion

Confirmed examples:

- `Theme Toggle`: broken `Default`, live `Playground`
- `Dropdown List`: broken `Default`, live `Playground`
- `Progress`: live `Default`, broken `Playground`

This is worse than having only one broken story because it actively obscures which story consumers should trust.

### 3. Event/action wiring is still lagging behind visual interactivity

Confirmed example:

- `packages/ui-kit/src/lib/dropdown-menu/stories/basic/basic.stories.ts`

The component looks interactive, but Storybook still does not expose the meaningful actions a user would expect to inspect.

## Removed From Findings Since Last Pass

- `Table View` docs interactivity regressions
- `Table View` family-wide fixed-wrapper render inconsistencies
- obsolete `Table View` `density-playground` story

## Suggested Next Sweep

If continuing immediately, the highest-value follow-up order is:

1. `packages/ui-kit/src/lib/theme-toggle/stories/**`
2. `packages/ui-kit/src/lib/dropdown-list/stories/**`
3. `packages/ui-kit/src/lib/progress/stories/**`
4. `packages/ui-kit/src/lib/split-container/stories/**`
5. `packages/ui-kit/src/lib/dropdown-menu/stories/**`
6. `packages/ui-blocks/src/lib/search-view/stories/**`
7. `packages/ui-forms/src/lib/components/stories/**`

That order prioritizes:

- families where a dead `Default` conflicts directly with a live `Playground`
- canonical default stories that currently misrepresent the component API surface
- named playground stories that are still inert
