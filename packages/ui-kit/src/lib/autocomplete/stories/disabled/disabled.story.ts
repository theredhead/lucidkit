import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIAutocomplete, type AutocompleteDatasource } from "../../autocomplete.component";

// ── Helpers ────────────────────────────────────────────────────────

/** A trivial string datasource that does case-insensitive prefix matching. */
class FruitDatasource implements AutocompleteDatasource<string> {
  private readonly fruits = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Blackberry",
    "Blueberry",
    "Cherry",
    "Coconut",
    "Cranberry",
    "Dragonfruit",
    "Fig",
    "Grape",
    "Guava",
    "Kiwi",
    "Lemon",
    "Lime",
    "Lychee",
    "Mango",
    "Melon",
    "Nectarine",
    "Orange",
    "Papaya",
    "Peach",
    "Pear",
    "Pineapple",
    "Plum",
    "Pomegranate",
    "Raspberry",
    "Strawberry",
    "Watermelon",
  ];

  completeFor(query: string, selection: readonly string[]): string[] {
    const lq = query.toLowerCase();
    return this.fruits.filter(
      (f) => f.toLowerCase().includes(lq) && !selection.includes(f),
    );
  }
}

/**
 * Disabled state demo.
 */
@Component({
  selector: "ui-ac-disabled-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete],
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledDemo {
  readonly ds = new FruitDatasource();
}
