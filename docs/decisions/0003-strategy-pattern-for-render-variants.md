# ADR-0003: Strategy Pattern for Render Variants

## Status

Accepted

## Context

Several components in the library need to produce dramatically different visual
output while sharing the same data model and interaction contract. Examples:

- A **chart** can render as a line graph, bar graph, pie chart, or scatter plot.
- A **gauge** can render as an analog dial, VU meter, digital readout, or LCD
  display.
- A **rich-text editor** can operate in HTML mode or Markdown mode with
  different toolbars and parsing.
- A **carousel** can scroll items linearly or apply a coverflow 3D effect.
- A **media player** can embed YouTube, Vimeo, or Dailymotion via different
  provider APIs.

Using component variants (e.g. `@if` / `@switch` blocks in the template) would
produce monolithic components with tangled rendering logic. Separate components
per variant would duplicate data-binding, accessibility, and interaction code.

## Decision

We use the **Strategy pattern**: each component accepts a strategy object as an
input, and delegates rendering or behaviour to that strategy.

```ts
// Chart example
readonly strategy = input.required<GraphPresentationStrategy>();

// Consumer usage
<ui-chart [strategy]="lineStrategy" [layers]="data" />
<ui-chart [strategy]="pieStrategy"  [layers]="data" />
```

Each strategy family has a base interface or abstract class, and concrete
implementations are shipped alongside the component:

| Component          | Base                        | Concrete Strategies                 |
| ------------------ | --------------------------- | ----------------------------------- |
| `UIChart`          | `GraphPresentationStrategy` | Line, Bar, StackedBar, Pie, Scatter |
| `UIGauge`          | `GaugePresentationStrategy` | Analog, VuMeter, Digital, Lcd, Bar  |
| `UIRichTextEditor` | `RichTextEditorStrategy`    | HtmlEditing, MarkdownEditing        |
| `UICarousel`       | `CarouselStrategy`          | Scroll, Coverflow                   |
| `UIMediaPlayer`    | `MediaEmbedProvider`        | YouTube, Vimeo, Dailymotion         |

Consumers can also provide **custom strategies** by implementing the interface.

## Consequences

### Positive

- **Single component, multiple renderings:** One `<ui-chart>` handles all chart
  types. Consumers switch output by changing the strategy input.
- **Open for extension:** New chart types can be added without modifying the
  core component — implement the strategy interface and pass it in.
- **Testable in isolation:** Strategies are plain TypeScript classes that can be
  unit-tested independently of the Angular component.
- **Clean separation:** Data binding, accessibility, keyboard handling, and
  lifecycle live in the component; rendering logic lives in the strategy.

### Negative

- **Indirection:** Developers must understand the strategy contract before
  implementing a custom variant.
- **Input ergonomics:** The consumer must instantiate a strategy object rather
  than just setting a string variant. This is more verbose but more powerful.
