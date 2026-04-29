import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { UIRichTextEditor } from "../../rich-text-editor.component";
import {
  UIButton,
  UIRichTextView,
  UISplitContainer,
  UISplitPanel,
} from "@theredhead/lucid-kit";
import type {
  RichTextPlaceholder,
  RichTextImageHandler,
} from "../../rich-text-editor.types";
import type { RichTextEditorMode } from "../../rich-text-editor.strategy";
import {
  MARKDOWN_PARSER,
  createMarkedParser,
  createMarkdownItParser,
  type MarkdownParser,
} from "../../markdown-parser";
import { TextTemplateProcessor } from "@theredhead/lucid-foundation";

// ── Mail-merge story ───────────────────────────────────────────────────────

interface InvoiceLine {
  description: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
}

interface MailMergeRecord {
  firstName: string;
  lastName: string;
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  birthdate: string;
  email: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  accountRef: string;
  orderId: string;
  lines: InvoiceLine[];
  totalExVat: string;
  vatAmount: string;
  totalIncVat: string;
}

const mailMergeMembers: MailMergeRecord[] = [
  {
    firstName: "Alice",
    lastName: "Hartwell",
    fullName: "Alice Hartwell",
    addressLine1: "14 Maple Street",
    addressLine2: "Brighton BN1 4JT",
    birthdate: "12 March 1985",
    email: "alice.hartwell@example.com",
    invoiceNumber: "INV-2026-0041",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00142",
    orderId: "ORD-88421",
    lines: [
      {
        description: "Professional License — LucidKit UI",
        quantity: "1",
        unitPrice: "£249.00",
        lineTotal: "£249.00",
      },
      {
        description: "Priority Support (12 months)",
        quantity: "1",
        unitPrice: "£49.00",
        lineTotal: "£49.00",
      },
    ],
    totalExVat: "£298.00",
    vatAmount: "£59.60",
    totalIncVat: "£357.60",
  },
  {
    firstName: "Benjamin",
    lastName: "Okafor",
    fullName: "Benjamin Okafor",
    addressLine1: "Flat 3, Ashdown House",
    addressLine2: "Manchester M4 2LG",
    birthdate: "7 August 1979",
    email: "b.okafor@example.com",
    invoiceNumber: "INV-2026-0042",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00198",
    orderId: "ORD-88434",
    lines: [
      {
        description: "Enterprise License — LucidKit UI (×3 seats)",
        quantity: "3",
        unitPrice: "£599.00",
        lineTotal: "£1,797.00",
      },
      {
        description: "Onboarding Workshop (half day)",
        quantity: "1",
        unitPrice: "£395.00",
        lineTotal: "£395.00",
      },
      {
        description: "Priority Support (12 months)",
        quantity: "3",
        unitPrice: "£49.00",
        lineTotal: "£147.00",
      },
    ],
    totalExVat: "£2,339.00",
    vatAmount: "£467.80",
    totalIncVat: "£2,806.80",
  },
  {
    firstName: "Chloé",
    lastName: "Dupont",
    fullName: "Chloé Dupont",
    addressLine1: "22 rue des Lilas",
    addressLine2: "Paris 75011",
    birthdate: "30 November 1992",
    email: "chloe.dupont@example.fr",
    invoiceNumber: "INV-2026-0043",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00207",
    orderId: "ORD-88451",
    lines: [
      {
        description: "Starter License — LucidKit UI",
        quantity: "1",
        unitPrice: "€89.00",
        lineTotal: "€89.00",
      },
    ],
    totalExVat: "€89.00",
    vatAmount: "€17.80",
    totalIncVat: "€106.80",
  },
  {
    firstName: "Tariq",
    lastName: "Al-Rashid",
    fullName: "Tariq Al-Rashid",
    addressLine1: "9 Westfield Gardens",
    addressLine2: "Edinburgh EH3 7SN",
    birthdate: "22 June 1988",
    email: "tariq.alrashid@example.com",
    invoiceNumber: "INV-2026-0044",
    invoiceDate: "18 April 2026",
    dueDate: "18 May 2026",
    accountRef: "ACT-00231",
    orderId: "ORD-88463",
    lines: [
      {
        description: "Professional License — LucidKit UI",
        quantity: "2",
        unitPrice: "£249.00",
        lineTotal: "£498.00",
      },
      {
        description: "Component Customisation Pack",
        quantity: "1",
        unitPrice: "£125.00",
        lineTotal: "£125.00",
      },
      {
        description: "Extended Support (6 months)",
        quantity: "2",
        unitPrice: "£29.00",
        lineTotal: "£58.00",
      },
    ],
    totalExVat: "£681.00",
    vatAmount: "£136.20",
    totalIncVat: "£817.20",
  },
];

const mailMergePlaceholders: RichTextPlaceholder[] = [
  { key: "firstName", label: "First Name", category: "Contact" },
  { key: "lastName", label: "Last Name", category: "Contact" },
  { key: "fullName", label: "Full Name", category: "Contact" },
  { key: "addressLine1", label: "Address Line 1", category: "Contact" },
  { key: "addressLine2", label: "Address Line 2", category: "Contact" },
  { key: "birthdate", label: "Date of Birth", category: "Contact" },
  { key: "email", label: "Email Address", category: "Contact" },
  { key: "invoiceNumber", label: "Invoice Number", category: "Invoice" },
  { key: "invoiceDate", label: "Invoice Date", category: "Invoice" },
  { key: "dueDate", label: "Due Date", category: "Invoice" },
  { key: "accountRef", label: "Account Reference", category: "Invoice" },
  { key: "orderId", label: "Order ID", category: "Invoice" },
  { key: "totalExVat", label: "Total (ex. VAT)", category: "Totals" },
  { key: "vatAmount", label: "VAT Amount", category: "Totals" },
  { key: "totalIncVat", label: "Total (inc. VAT)", category: "Totals" },
];

const mailMergeProcessor = new TextTemplateProcessor({ missingKey: "keep" });

const htmlMailMergeTemplate = [
  "<section>",
  "  <p>",
  "    <strong><placeholder key=\"fullName\" /></strong><br />",
  "    <placeholder key=\"addressLine1\" /><br />",
  "    <placeholder key=\"addressLine2\" />",
  "  </p>",
  "  <p>",
  "    DOB: <placeholder key=\"birthdate\" /><br />",
  "    <placeholder key=\"email\" />",
  "  </p>",
  "  <hr />",
  "  <h2>Invoice <placeholder key=\"invoiceNumber\" /></h2>",
  "  <p>",
  "    <strong>Invoice date:</strong> <placeholder key=\"invoiceDate\" /><br />",
  "    <strong>Due date:</strong> <placeholder key=\"dueDate\" /><br />",
  "    <strong>Account ref:</strong> <placeholder key=\"accountRef\" /><br />",
  "    <strong>Order:</strong> <placeholder key=\"orderId\" />",
  "  </p>",
  "  <h3>Line items</h3>",
  "  <table>",
  "    <thead>",
  "      <tr>",
  "        <th>Description</th>",
  "        <th>Qty</th>",
  "        <th>Unit Price</th>",
  "        <th>Total</th>",
  "      </tr>",
  "    </thead>",
  "    <tbody>",
  "      <loop items=\"lines\">",
  "        <tr>",
  "          <td><placeholder key=\"description\" /></td>",
  "          <td><placeholder key=\"quantity\" /></td>",
  "          <td><placeholder key=\"unitPrice\" /></td>",
  "          <td><placeholder key=\"lineTotal\" /></td>",
  "        </tr>",
  "      </loop>",
  "    </tbody>",
  "    <tfoot>",
  "      <tr>",
  "        <td colspan=\"3\">Subtotal</td>",
  "        <td><placeholder key=\"totalExVat\" /></td>",
  "      </tr>",
  "      <tr>",
  "        <td colspan=\"3\">VAT (20%)</td>",
  "        <td><placeholder key=\"vatAmount\" /></td>",
  "      </tr>",
  "      <tr>",
  "        <td colspan=\"3\"><strong>Total due</strong></td>",
  "        <td><strong><placeholder key=\"totalIncVat\" /></strong></td>",
  "      </tr>",
  "    </tfoot>",
  "  </table>",
  "  <p>Please arrange payment by <strong><placeholder key=\"dueDate\" /></strong>.</p>",
  "  <p>Thank you for your business, <placeholder key=\"firstName\" />.</p>",
  "</section>",
].join("\n");

@Component({
  selector: "ui-demo-html-mail-merge",
  standalone: true,
  imports: [
    UIRichTextEditor,
    UIRichTextView,
    UIButton,
    UISplitContainer,
    UISplitPanel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style:
      "display: flex; flex-direction: column; height: 100vh; overflow: hidden;",
  },
  templateUrl: "./html-mail-merge.story.html",
})
export class DemoHtmlMailMerge {
  protected readonly currentIndex = signal(0);

  protected readonly content = signal(htmlMailMergeTemplate);

  protected readonly renderedContent = computed(() => {
    const member = this.members[this.currentIndex()] as unknown as Record<
      string,
      unknown
    >;
    return mailMergeProcessor.expand(this.content(), member);
  });

  protected readonly members = mailMergeMembers;

  protected readonly placeholders = mailMergePlaceholders;

  protected readonly placeholderContext = mailMergeMembers[0];

  protected prev(): void {
    this.currentIndex.update((i) => Math.max(0, i - 1));
  }

  protected next(): void {
    this.currentIndex.update((i) => Math.min(this.members.length - 1, i + 1));
  }
}
