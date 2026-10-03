# Review report of: [LucidKit’s `feature/look-and-feel` branch](https://github.com/theredhead/lucidkit/tree/feature/look-and-feel)

> Historical source review, written before `5192d281` (`fix: address pre-publish review findings`).
> Items 1–5 and the ThemeService listener cleanup were subsequently addressed and covered by tests.
> The original findings below are retained as review history, not as the current release status.
> The `fix/release-readiness` branch adds package dependency corrections, caption preservation,
> keyboard event guards, connected Storybook controls, and complete six-package release tooling.

## Original findings

The gallery's overall structure makes sense: the directive registers media, the service owns collection state, and the viewer handles presentation. The public API also exports the new component, directive, service and configuration tokens.

There are, however, a few concrete issues I would address before publishing.

### 1. Gallery focus management is incomplete

High priority · Accessibility

The fullscreen viewer declares `role="dialog"` and `aria-modal="true"`, but I don't see anything that moves focus into it, contains keyboard focus while it's open, or restores focus to the originating media when it closes.

That means keyboard users can still tab into the page behind the gallery, even though it is presented as a modal.

I'd add focus management at the viewer boundary, preferably using Angular CDK's focus-trap utilities if you're comfortable with that dependency. Otherwise, a small reusable focus-management utility would fit LucidKit's architecture.

Also, the controls become visually hidden after the idle timeout, but keyboard focus should make them visible again. Pointer inactivity and keyboard accessibility need separate handling.

[Relevant component](https://github.com/theredhead/lucidkit/blob/feature/look-and-feel/packages/ui-kit/src/lib/media-gallery/media-gallery.component.ts) 

### 2. The gallery registry has a replacement race

Medium priority · Correctness

In `MediaGalleryService.register()`, the returned cleanup function unconditionally deletes the registered ID.

Consider this sequence:

1. Item A registers under ID `x`.

2. Item B registers under the same ID, replacing A.

3. A's cleanup executes and deletes B.

Your directive generates unique IDs, so this isn't likely during ordinary use. But the service is public and accepts arbitrary items.

I'd make cleanup conditional on the registry still containing the exact item that registered it:

TypeScript

```
if (this.registry.get(item.id) !== item) return;
this.registry.delete(item.id);
```

There's a related ordering consideration: updating an existing ID preserves its original insertion position in the map. If you want gallery order to follow DOM order, registry insertion order alone won't guarantee that when items are reordered without being destroyed.

[Relevant service](https://github.com/theredhead/lucidkit/blob/feature/look-and-feel/packages/ui-kit/src/lib/media-gallery/media-gallery.service.ts) 

### 3. The gallery directive can interfere with video playback

Medium priority · Interaction

The directive correctly avoids opening the gallery when someone clicks a button, input, select or textarea inside the media player.

However, its host-level Enter and Space handlers don't make that distinction. A keyboard event from a focused native playback control can bubble to the directive and open the gallery instead.

I'd check the event target for keyboard activation as well, and avoid giving the entire media-player host button semantics when it contains other interactive controls. A dedicated gallery-open affordance would avoid nested interactive semantics.

[Relevant directive](https://github.com/theredhead/lucidkit/blob/feature/look-and-feel/packages/ui-kit/src/lib/media-gallery/media-gallery.directive.ts)


### 4. Zoom handling also captures video and inline scrolling

Medium priority · Usability

`onWheel()` always calls `preventDefault()` and changes the zoom signal. But the zoom transform is only applied to images.

This means scrolling over an inline video gallery can be intercepted without producing any useful result. The same applies to ordinary scrolling over an inline image gallery.

I'd limit wheel zoom to images in fullscreen mode, or at least make inline wheel zoom explicitly opt-in. I'd also restrict pointer panning to images, since the stage currently captures pointer interactions for both media types.

One more detail: `touch-action: none` on the stage disables native touch gestures. That's reasonable for an interactive image viewer, but less desirable for inline content.

### 5. The new theme's contrast calculation needs attention

Medium priority · Theming

The new generative theme is an interesting direction. Deriving a coherent palette from a small number of seed colors is much nicer for consumers than requiring them to supply dozens of individual tokens.

However, the `_on()` function in `_generative.scss` chooses a light or dark foreground using a fixed HSL lightness threshold of 60%.

That doesn't guarantee sufficient contrast. A saturated yellow, blue or green can behave quite differently from another color with similar HSL lightness.

Since the whole point is to let consumers provide arbitrary brand colors, I'd use relative luminance and actual contrast ratios when choosing foregrounds. For colors that can't produce sufficient contrast with either predefined foreground, consider adjusting the generated background or documenting that the seed requires validation.

This is particularly relevant to `--ui-accent-contrast`, badge text and status colors.

[Generative theme source](https://github.com/theredhead/lucidkit/blob/feature/look-and-feel/packages/ui-theme/src/lib/styles/_generative.scss) 

### 6. The old theme service is still present

Cleanup · API consistency

Removing the light/dark switch from the UI is fine. I wouldn't necessarily remove the ability to override the system preference from the library.

The existing `ThemeService` still exposes `toggleTheme()`, `setTheme()` and `resetToSystem()`, and persists preferences. That's useful for applications that want explicit theme selection.

There is one small issue in its implementation: the `matchMedia` change listener is registered without corresponding cleanup. Because the service is root-provided, this is unlikely to matter in an ordinary application, but it can matter in tests or applications with multiple Angular roots.

I'd also update its documentation to distinguish the optional theme-preference service from the new generative SCSS API.

## Before publishing

There are a few additional release checks I'd make, particularly because this branch changes the appearance of so many components.

Release checklist

0 of 6

Verify the generated npm package contains the new generative SCSS entry point and gallery exports.

Test the gallery with two collections, reordered items and dynamically removed media.

Test fullscreen keyboard navigation, focus restoration and Escape while video controls are focused.

Check generated colors for contrast in both light and dark mode.

Check gallery behavior on a touch device, including inline page scrolling.

Confirm that the theme changes don't introduce unintended visual regressions in existing Storybook components.

I found existing gallery tests covering navigation, idle controls, inline expansion, zoom and collection isolation. That's a useful baseline, but the missing cases above are where I'd concentrate the next tests. I haven't run the branch's build or test suite, so this is a source review rather than a verified release check.

The main thing I'd fix first is modal focus management. The gallery architecture is straightforward, and the new theme generator provides a much more customizable foundation. The remaining issues are mostly interaction edge cases rather than reasons to redesign either feature.
