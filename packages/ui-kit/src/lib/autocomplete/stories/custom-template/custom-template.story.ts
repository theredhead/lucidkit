import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";

import {
  UIAutocomplete,
  type AutocompleteDatasource,
} from "../../autocomplete.component";

/** A rich-object datasource for the custom-template story. */
interface Contact {
  name: string;
  email: string;
  department: string;
}

const CONTACTS: Contact[] = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
  },
  { name: "Bob Smith", email: "bob@example.com", department: "Design" },
  { name: "Carol White", email: "carol@example.com", department: "Marketing" },
  { name: "Dave Brown", email: "dave@example.com", department: "Engineering" },
  { name: "Eve Davis", email: "eve@example.com", department: "Product" },
  {
    name: "Frank Miller",
    email: "frank@example.com",
    department: "Engineering",
  },
  { name: "Grace Lee", email: "grace@example.com", department: "Design" },
  { name: "Hank Wilson", email: "hank@example.com", department: "Marketing" },
];

class ContactDatasource implements AutocompleteDatasource<Contact> {
  completeFor(query: string, selection: readonly Contact[]): Contact[] {
    const lq = query.toLowerCase();
    const selectedEmails = new Set(selection.map((c) => c.email));
    return CONTACTS.filter(
      (c) =>
        !selectedEmails.has(c.email) &&
        (c.name.toLowerCase().includes(lq) ||
          c.email.toLowerCase().includes(lq) ||
          c.department.toLowerCase().includes(lq)),
    );
  }
}

/**
 * Custom template demo with rich Contact objects.
 */
@Component({
  selector: "ui-ac-template-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAutocomplete, JsonPipe],
  templateUrl: "./custom-template.story.html",
  styleUrl: "./custom-template.story.scss",
})
export class TemplateDemo {
  readonly ds = new ContactDatasource();
  readonly selected = signal<readonly Contact[]>([]);
  readonly displayContact = (c: Contact) => c.name;
  readonly trackByEmail = (c: Contact) => c.email;
}
