import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { JsonPipe } from "@angular/common";
import {
  UIAutocomplete,
  type AutocompleteDatasource,
} from "../../autocomplete.component";

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

// ── Demo wrapper components ────────────────────────────────────────

/**
 * Basic single-select demo with plain strings.
 */
@Component({
  selector: "ui-ac-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete, JsonPipe],
  templateUrl: "./basic.story.html",
  styleUrl: "./basic.story.scss",
})
export class BasicDemo {
  public readonly placeholder = input<string>("Search fruits...");

  public readonly minChars = input<number>(1);

  public readonly disabled = input<boolean>(false);

  public readonly ariaLabel = input<string>("Fruit search");

  public readonly itemSelected = output<string>();

  public readonly itemRemoved = output<string>();

  public readonly ds = new FruitDatasource();

  public readonly selected = signal<readonly string[]>([]);
}
