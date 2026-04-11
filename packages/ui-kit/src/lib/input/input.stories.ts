import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from "@angular/core";
import { type Meta, type StoryObj, moduleMetadata } from "@storybook/angular";

import { UIInput } from "./input.component";
import { UIDropdownList } from "../dropdown-list/dropdown-list.component";
import type { TextAdapter } from "./adapters/text-adapter";
import {
  ColorTextAdapter,
  CreditCardTextAdapter,
  CronTextAdapter,
  DateTextAdapter,
  DecimalTextAdapter,
  EmailTextAdapter,
  FloatTextAdapter,
  HexadecimalTextAdapter,
  IbanTextAdapter,
  IntegerTextAdapter,
  IPAddressTextAdapter,
  LowercaseTextAdapter,
  MacAddressTextAdapter,
  MoneyTextAdapter,
  PasswordTextAdapter,
  PercentageTextAdapter,
  PhoneTextAdapter,
  SlugTextAdapter,
  TimeTextAdapter,
  TrimTextAdapter,
  UppercaseTextAdapter,
  UrlTextAdapter,
  UuidTextAdapter,
} from "./adapters";

// ── Adapter registry for the interactive demo ────────────────────────

interface AdapterEntry {
  readonly label: string;
  readonly type: string;
  readonly placeholder: string;
  readonly adapter: TextAdapter;
}

const ADAPTER_MAP: Record<string, AdapterEntry> = {
  none: {
    label: "(no adapter)",
    type: "text",
    placeholder: "Type something…",
    adapter: undefined!,
  },
  email: {
    label: "Email",
    type: "email",
    placeholder: "user@example.com",
    adapter: new EmailTextAdapter(),
  },
  url: {
    label: "URL",
    type: "url",
    placeholder: "example.com",
    adapter: new UrlTextAdapter(),
  },
  ip: {
    label: "IP Address",
    type: "text",
    placeholder: "192.168.1.1",
    adapter: new IPAddressTextAdapter(),
  },
  phone: {
    label: "Phone",
    type: "tel",
    placeholder: "+1 (555) 123-4567",
    adapter: new PhoneTextAdapter(),
  },
  creditCard: {
    label: "Credit Card",
    type: "text",
    placeholder: "4111 1111 1111 1111",
    adapter: new CreditCardTextAdapter(),
  },
  money: {
    label: "Money",
    type: "text",
    placeholder: "1,234.56",
    adapter: new MoneyTextAdapter(),
  },
  integer: {
    label: "Integer",
    type: "text",
    placeholder: "42",
    adapter: new IntegerTextAdapter(),
  },
  float: {
    label: "Float",
    type: "text",
    placeholder: "3.14",
    adapter: new FloatTextAdapter(),
  },
  decimal: {
    label: "Decimal (2)",
    type: "text",
    placeholder: "9.99",
    adapter: new DecimalTextAdapter(2),
  },
  hex: {
    label: "Hexadecimal",
    type: "text",
    placeholder: "0xFF",
    adapter: new HexadecimalTextAdapter(),
  },
  percentage: {
    label: "Percentage",
    type: "text",
    placeholder: "75%",
    adapter: new PercentageTextAdapter(),
  },
  date: {
    label: "Date",
    type: "text",
    placeholder: "2026-03-28",
    adapter: new DateTextAdapter(),
  },
  time: {
    label: "Time",
    type: "text",
    placeholder: "14:30",
    adapter: new TimeTextAdapter(),
  },
  color: {
    label: "Color",
    type: "text",
    placeholder: "#FF5733",
    adapter: new ColorTextAdapter(),
  },
  slug: {
    label: "Slug",
    type: "text",
    placeholder: "my-page-slug",
    adapter: new SlugTextAdapter(),
  },
  uuid: {
    label: "UUID",
    type: "text",
    placeholder: "550e8400-e29b-41d4-a716-446655440000",
    adapter: new UuidTextAdapter(),
  },
  cron: {
    label: "Cron",
    type: "text",
    placeholder: "*/5 * * * *",
    adapter: new CronTextAdapter(),
  },
  uppercase: {
    label: "Uppercase",
    type: "text",
    placeholder: "type anything…",
    adapter: new UppercaseTextAdapter(),
  },
  lowercase: {
    label: "Lowercase",
    type: "text",
    placeholder: "type anything…",
    adapter: new LowercaseTextAdapter(),
  },
  trim: {
    label: "Trim / Normalise",
    type: "text",
    placeholder: "  extra   spaces  ",
    adapter: new TrimTextAdapter(),
  },
  password: {
    label: "Password",
    type: "text",
    placeholder: "Enter password…",
    adapter: new PasswordTextAdapter(),
  },
  iban: {
    label: "IBAN",
    type: "text",
    placeholder: "DE89 3704 0044 0532 0130 00",
    adapter: new IbanTextAdapter(),
  },
  mac: {
    label: "MAC Address",
    type: "text",
    placeholder: "AA:BB:CC:DD:EE:FF",
    adapter: new MacAddressTextAdapter(),
  },
};

// ── Demo wrapper components ──────────────────────────────────────────

@Component({
  selector: "ui-story-email-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        type="email"
        placeholder="user@example.com"
        ariaLabel="Email address"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
      </div>
    </div>
  `,
})
class EmailAdapterDemo {
  protected readonly adapter = new EmailTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
}

@Component({
  selector: "ui-story-url-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        type="url"
        placeholder="example.com"
        ariaLabel="Website URL"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
      </div>
    </div>
  `,
})
class UrlAdapterDemo {
  protected readonly adapter = new UrlTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
}

@Component({
  selector: "ui-story-ip-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="192.168.1.1"
        ariaLabel="IP address"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
      </div>
    </div>
  `,
})
class IPAdapterDemo {
  protected readonly adapter = new IPAddressTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
}

@Component({
  selector: "ui-story-money-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="1,234.56"
        ariaLabel="Monetary amount"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class MoneyAdapterDemo {
  protected readonly adapter = new MoneyTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-integer-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="42"
        ariaLabel="Integer value"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class IntegerAdapterDemo {
  protected readonly adapter = new IntegerTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-float-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="3.14"
        ariaLabel="Float value"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class FloatAdapterDemo {
  protected readonly adapter = new FloatTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-decimal-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="9.99"
        ariaLabel="Decimal value"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
        <div style="opacity: 0.6;">
          max {{ adapter.maxDecimals }} decimal places
        </div>
      </div>
    </div>
  `,
})
class DecimalAdapterDemo {
  protected readonly adapter = new DecimalTextAdapter(2);
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-hex-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="0xFF"
        ariaLabel="Hexadecimal value"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class HexAdapterDemo {
  protected readonly adapter = new HexadecimalTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-phone-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        type="tel"
        placeholder="+1 (555) 123-4567"
        ariaLabel="Phone number"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class PhoneAdapterDemo {
  protected readonly adapter = new PhoneTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-credit-card-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="4111 1111 1111 1111"
        ariaLabel="Credit card number"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class CreditCardAdapterDemo {
  protected readonly adapter = new CreditCardTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-percentage-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="75.5%"
        ariaLabel="Percentage value"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class PercentageAdapterDemo {
  protected readonly adapter = new PercentageTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-date-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="2025-12-31"
        ariaLabel="Date (ISO 8601)"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class DateAdapterDemo {
  protected readonly adapter = new DateTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-time-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="14:30"
        ariaLabel="Time (24-hour)"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class TimeAdapterDemo {
  protected readonly adapter = new TimeTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-color-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="FF6600"
        ariaLabel="Hex colour"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
        @if (processedValue()) {
          <div
            style="width: 24px; height: 24px; border-radius: 4px; margin-top: 4px;"
            [style.background]="processedValue()"
          ></div>
        }
      </div>
    </div>
  `,
})
class ColorAdapterDemo {
  protected readonly adapter = new ColorTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-slug-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="my-page-title"
        ariaLabel="URL slug"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class SlugAdapterDemo {
  protected readonly adapter = new SlugTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-uuid-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="550e8400-e29b-41d4-a716-446655440000"
        ariaLabel="UUID"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class UuidAdapterDemo {
  protected readonly adapter = new UuidTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-cron-adapter-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 360px;"
    >
      <ui-input
        placeholder="0 * * * *"
        ariaLabel="Cron expression"
        [adapter]="adapter"
        [(text)]="rawText"
        [(value)]="processedValue"
      />
      <div
        style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);
               padding: 8px 12px; border-radius: 4px; line-height: 1.5;"
      >
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
        <div><strong>valid:</strong> {{ valid() }}</div>
      </div>
    </div>
  `,
})
class CronAdapterDemo {
  protected readonly adapter = new CronTextAdapter();
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly valid = computed(() => {
    const text = this.rawText();
    return !text || this.adapter.validate(text).valid;
  });
}

@Component({
  selector: "ui-story-all-adapters-demo",
  standalone: true,
  imports: [UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;"
    >
      @for (entry of entries; track entry.label) {
        <div
          style="font-size: 0.8125rem; color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa);"
        >
          <span>{{ entry.label }}</span>
          <ui-input
            [type]="entry.type"
            [placeholder]="entry.placeholder"
            [ariaLabel]="entry.label"
            [adapter]="entry.adapter"
            [(text)]="entry.text"
            [(value)]="entry.value"
          />
          <span style="font-size: 0.75rem; opacity: 0.6;"
            >value: {{ entry.value() || "(empty)" }}</span
          >
        </div>
      }
    </div>
  `,
})
class AllAdaptersDemo {
  protected readonly entries = [
    {
      label: "Email",
      type: "email" as const,
      placeholder: "user@example.com",
      adapter: new EmailTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "URL",
      type: "url" as const,
      placeholder: "example.com",
      adapter: new UrlTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "IP Address",
      type: "text" as const,
      placeholder: "192.168.1.1",
      adapter: new IPAddressTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Phone",
      type: "tel" as const,
      placeholder: "+1 (555) 123-4567",
      adapter: new PhoneTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Credit Card",
      type: "text" as const,
      placeholder: "4111 1111 1111 1111",
      adapter: new CreditCardTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Money",
      type: "text" as const,
      placeholder: "1,234.56",
      adapter: new MoneyTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Integer",
      type: "text" as const,
      placeholder: "42",
      adapter: new IntegerTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Float",
      type: "text" as const,
      placeholder: "3.14",
      adapter: new FloatTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Decimal (4)",
      type: "text" as const,
      placeholder: "0.0000",
      adapter: new DecimalTextAdapter(4),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Hexadecimal",
      type: "text" as const,
      placeholder: "1A2F",
      adapter: new HexadecimalTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Percentage",
      type: "text" as const,
      placeholder: "75%",
      adapter: new PercentageTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Date",
      type: "text" as const,
      placeholder: "2026-03-21",
      adapter: new DateTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Time",
      type: "text" as const,
      placeholder: "14:30",
      adapter: new TimeTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Color",
      type: "text" as const,
      placeholder: "#FF5733",
      adapter: new ColorTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Slug",
      type: "text" as const,
      placeholder: "my-page-slug",
      adapter: new SlugTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "UUID",
      type: "text" as const,
      placeholder: "550e8400-e29b-41d4-a716-446655440000",
      adapter: new UuidTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
    {
      label: "Cron",
      type: "text" as const,
      placeholder: "*/5 * * * *",
      adapter: new CronTextAdapter(),
      text: signal(""),
      value: signal(""),
    },
  ];
}

// ── Demo: Interactive adapter picker ─────────────────────────────────

@Component({
  selector: "ui-story-adapter-picker-demo",
  standalone: true,
  imports: [UIInput, UIDropdownList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .picker {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .info {
        font-size: 0.8125rem;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f7f8fa);
        padding: 8px 12px;
        border-radius: 4px;
        line-height: 1.5;
      }
      .validation-hint {
        font-size: 0.75rem;
        color: var(--ui-danger, #d93025);
        background: color-mix(
          in srgb,
          var(--ui-danger, #d93025) 6%,
          transparent
        );
        padding: 4px 8px;
        border-radius: 4px;
        margin: -4px 0;
      }
    `,
  ],
  template: `
    <div class="picker">
      <ui-dropdown-list
        [options]="adapterOptions"
        [(value)]="adapterKey"
        ariaLabel="Select adapter"
      />

      <ui-input
        [type]="activeType()"
        [placeholder]="activePlaceholder()"
        [disabled]="disabled()"
        [ariaLabel]="activeLabel()"
        [adapter]="activeAdapter()"
        [(text)]="rawText"
        [(value)]="processedValue"
      />

      @if (touched() && !isValid()) {
        <div class="validation-hint">{{ validationMessage() }}</div>
      }

      <div class="info">
        <div><strong>text:</strong> {{ rawText() || "(empty)" }}</div>
        <div><strong>value:</strong> {{ processedValue() || "(empty)" }}</div>
      </div>
    </div>
  `,
})
class AdapterPickerDemo {
  public readonly disabled = input(false);

  protected readonly adapterOptions = Object.entries(ADAPTER_MAP).map(
    ([key, entry]) => ({ value: key, label: entry.label }),
  );

  protected readonly adapterKey = signal("none");
  protected readonly rawText = signal("");
  protected readonly processedValue = signal("");
  protected readonly touched = signal(false);

  protected readonly activeEntry = computed(
    () => ADAPTER_MAP[this.adapterKey()] ?? ADAPTER_MAP["none"],
  );
  protected readonly activeAdapter = computed(() => {
    const entry = this.activeEntry();
    return entry.adapter || undefined;
  });
  protected readonly activeType = computed(() => this.activeEntry().type);
  protected readonly activePlaceholder = computed(
    () => this.activeEntry().placeholder,
  );
  protected readonly activeLabel = computed(() => this.activeEntry().label);
  protected readonly isValid = computed(() => {
    const adapter = this.activeAdapter();
    const text = this.rawText();
    if (!adapter?.validate || !text) return true;
    return adapter.validate(text).valid;
  });
  protected readonly validationMessage = computed(() => {
    const adapter = this.activeAdapter();
    const text = this.rawText();
    if (!adapter?.validate || !text) return "";
    const result = adapter.validate(text);
    return result.valid ? "" : (result.errors[0] ?? "Invalid input");
  });

  public constructor() {
    effect(() => {
      this.adapterKey();
      this.rawText.set("");
      this.processedValue.set("");
      this.touched.set(false);
    });
    effect(() => {
      if (this.rawText()) {
        this.touched.set(true);
      }
    });
  }
}

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta<UIInput> = {
  title: "@theredhead/UI Kit/Input",
  component: UIInput,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        AdapterPickerDemo,
        EmailAdapterDemo,
        UrlAdapterDemo,
        IPAdapterDemo,
        MoneyAdapterDemo,
        IntegerAdapterDemo,
        FloatAdapterDemo,
        DecimalAdapterDemo,
        HexAdapterDemo,
        PhoneAdapterDemo,
        CreditCardAdapterDemo,
        PercentageAdapterDemo,
        DateAdapterDemo,
        TimeAdapterDemo,
        ColorAdapterDemo,
        SlugAdapterDemo,
        UuidAdapterDemo,
        CronAdapterDemo,
        AllAdaptersDemo,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A thin wrapper around a native `<input>` or `<textarea>` element. " +
          "Supports `[(value)]` for simple two-way binding or `[(text)]` + " +
          "`[(value)]` when an adapter transforms raw text into a processed value.\n\n" +
          "**Adapters** can provide prefix/suffix icons and respond to icon clicks.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "number",
        "date",
        "email",
        "password",
        "tel",
        "url",
      ] as const,
      description: "Native input type. Ignored when `multiline` is `true`.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the input is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled.",
    },
    multiline: {
      control: "boolean",
      description:
        "When `true`, renders a `<textarea>` instead of an `<input>`.",
    },
    rows: {
      control: "number",
      description:
        "Number of visible rows (only applies when `multiline` is `true`).",
    },
  },
};

export default meta;
type Story = StoryObj<UIInput>;

// ── Stories ──────────────────────────────────────────────────────────

/**
 * **Default** — An interactive demo with an adapter selector dropdown.
 * Pick any adapter from the list to see how it transforms, validates,
 * and formats text input. The info panel shows raw text, processed
 * value, and validation state.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-story-adapter-picker-demo [disabled]="disabled" />`,
  }),
  args: {
    disabled: false,
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  type="email"
  placeholder="user@example.com"
  ariaLabel="Email address"
  [adapter]="adapter"
  [(text)]="rawText"
  [(value)]="processedValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, EmailTextAdapter } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIInput],
  template: \\\`
    <ui-input
      type="email"
      placeholder="user@example.com"
      [adapter]="adapter"
      [(text)]="rawText"
      [(value)]="processedValue"
    />
  \\\`,
})
export class ExampleComponent {
  readonly adapter = new EmailTextAdapter();
  readonly rawText = signal('');
  readonly processedValue = signal('');
}

// ── SCSS ──
/* No custom styles needed — UIInput tokens handle theming. */
`,
      },
    },
  },
};

/**
 * A plain single-line text field with `[(value)]` and no adapter.
 * Use the controls panel to change the `type`, `placeholder`, and
 * `disabled` state.
 */
export const Plain: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-input
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      ariaLabel="Demo input"
    />`,
  }),
  args: {
    type: "text",
    placeholder: "Type something…",
    disabled: false,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input [(value)]="name" placeholder="Enter your name" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`<ui-input [(value)]="name" placeholder="Enter your name" />\`,
})
export class MyComponent {
  public readonly name = signal('');
}

// ── SCSS ──
/* No custom styles needed — UIInput tokens handle theming. */
`,
      },
    },
  },
};

/**
 * Multiline mode renders a `<textarea>`, useful for longer text.
 */
export const Multiline: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-input
      [multiline]="true"
      [rows]="rows"
      [placeholder]="placeholder"
      [disabled]="disabled"
      ariaLabel="Description"
    />`,
  }),
  args: {
    rows: 4,
    placeholder: "Enter description…",
    disabled: false,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input multiline [rows]="4" [(value)]="description" placeholder="Enter description…" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input multiline [rows]="4" [(value)]="description" placeholder="Enter description…" />
  \`,
})
export class MyComponent {
  public readonly description = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Disabled state — the input appears muted and does not accept interaction.
 */
export const Disabled: Story = {
  render: () => ({
    template: `<ui-input
      placeholder="Cannot edit"
      [disabled]="true"
      ariaLabel="Disabled input"
    />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input [disabled]="true" placeholder="Cannot edit" />

// ── TypeScript ──
import { UIInput } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`<ui-input [disabled]="true" placeholder="Cannot edit" />\`,
})
export class MyComponent {}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `EmailTextAdapter` which trims/lowercases text and displays
 * an at-sign icon. Clicking the icon opens the system mail client.
 */
export const EmailAdapter: Story = {
  render: () => ({
    template: `<ui-story-email-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `EmailTextAdapter` trims whitespace, lowercases the input, and " +
          "shows an **at-sign** prefix icon. Clicking the icon opens a `mailto:` link.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  type="email"
  placeholder="user@example.com"
  ariaLabel="Email address"
  [adapter]="adapter"
  [(text)]="email"
  [(value)]="normalizedEmail"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, EmailTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      type="email"
      placeholder="user@example.com"
      ariaLabel="Email address"
      [adapter]="adapter"
      [(text)]="email"
      [(value)]="normalizedEmail"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new EmailTextAdapter();
  public readonly email = signal('');
  public readonly normalizedEmail = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `UrlTextAdapter` which auto-prepends `https://` and displays
 * a globe prefix icon and an external-link suffix icon.
 */
export const UrlAdapter: Story = {
  render: () => ({
    template: `<ui-story-url-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `UrlTextAdapter` strips whitespace, prepends `https://` when no " +
          "protocol is present, and shows a **globe** prefix and **external-link** " +
          "suffix icon. Clicking the suffix opens the URL in a new tab.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  type="url"
  placeholder="example.com"
  ariaLabel="Website URL"
  [adapter]="adapter"
  [(text)]="rawUrl"
  [(value)]="fullUrl"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, UrlTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      type="url"
      placeholder="example.com"
      ariaLabel="Website URL"
      [adapter]="adapter"
      [(text)]="rawUrl"
      [(value)]="fullUrl"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new UrlTextAdapter();
  public readonly rawUrl = signal('');
  public readonly fullUrl = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `IPAddressTextAdapter` which trims whitespace and displays
 * a network prefix icon.
 */
export const IPAddressAdapter: Story = {
  render: () => ({
    template: `<ui-story-ip-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `IPAddressTextAdapter` strips whitespace and shows a **network** " +
          "prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="192.168.1.1"
  ariaLabel="IP address"
  [adapter]="adapter"
  [(text)]="rawIp"
  [(value)]="ip"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, IPAddressTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="192.168.1.1"
      ariaLabel="IP address"
      [adapter]="adapter"
      [(text)]="rawIp"
      [(value)]="ip"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new IPAddressTextAdapter();
  public readonly rawIp = signal('');
  public readonly ip = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * All three built-in adapters shown together for comparison.
 */
export const AllAdapters: Story = {
  render: () => ({
    template: `<ui-story-all-adapters-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "All three built-in adapters (`EmailTextAdapter`, `UrlTextAdapter`, " +
          "`IPAddressTextAdapter`) shown side-by-side. Each displays its adapter-provided " +
          "icons and processes `text` → `value` in real time.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input type="email" [adapter]="emailAdapter" [(value)]="email" placeholder="user@example.com" />
<ui-input type="url"   [adapter]="urlAdapter"   [(value)]="url"   placeholder="example.com" />
<ui-input              [adapter]="ipAdapter"    [(value)]="ip"    placeholder="192.168.1.1" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import {
  UIInput,
  EmailTextAdapter,
  UrlTextAdapter,
  IPAddressTextAdapter,
} from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input type="email" [adapter]="emailAdapter" [(value)]="email" placeholder="user@example.com" />
    <ui-input type="url"   [adapter]="urlAdapter"   [(value)]="url"   placeholder="example.com" />
    <ui-input              [adapter]="ipAdapter"    [(value)]="ip"    placeholder="192.168.1.1" />
  \`,
})
export class MyComponent {
  public readonly emailAdapter = new EmailTextAdapter();
  public readonly urlAdapter = new UrlTextAdapter();
  public readonly ipAdapter = new IPAddressTextAdapter();

  public readonly email = signal('');
  public readonly url = signal('');
  public readonly ip = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `MoneyTextAdapter` which strips commas, trims whitespace,
 * and validates monetary amounts. Currency is inferred from the browser
 * locale but can be set explicitly or overridden via `provideDefaultCurrency`.
 */
export const MoneyAdapter: Story = {
  render: () => ({
    template: `<ui-story-money-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `MoneyTextAdapter` strips commas and whitespace. Validates the " +
          "amount against the currency's decimal rules (e.g. JPY allows 0 " +
          "decimal places, USD/EUR allow 2). The prefix icon changes to match " +
          "the currency. Currency is inferred from the browser locale by " +
          "default, or set explicitly via the constructor. Use `provideDefaultCurrency()` " +
          "to override the default globally via DI.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="1,234.56"
  ariaLabel="Monetary amount"
  [adapter]="adapter"
  [(text)]="rawAmount"
  [(value)]="amount"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, MoneyTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="1,234.56"
      ariaLabel="Monetary amount"
      [adapter]="adapter"
      [(text)]="rawAmount"
      [(value)]="amount"
    />
  \`,
})
export class MyComponent {
  // Uses locale-inferred currency by default
  public readonly adapter = new MoneyTextAdapter();

  // Or pass an explicit ISO 4217 code:
  // public readonly adapter = new MoneyTextAdapter('EUR');

  public readonly rawAmount = signal('');
  public readonly amount = signal('');
}

// ── DI override (app.config.ts) ──
import { provideDefaultCurrency } from '@theredhead/lucid-kit';

export const appConfig = {
  providers: [provideDefaultCurrency('EUR')],
};

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `IntegerTextAdapter` which validates integer-only input
 * (optional sign, digits only).
 */
export const IntegerAdapter: Story = {
  render: () => ({
    template: `<ui-story-integer-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `IntegerTextAdapter` validates that the input contains only " +
          "an integer (optional `+`/`-` sign and digits). Shows a **hash** " +
          "prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="42"
  ariaLabel="Integer value"
  [adapter]="adapter"
  [(text)]="rawInt"
  [(value)]="intValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, IntegerTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="42"
      ariaLabel="Integer value"
      [adapter]="adapter"
      [(text)]="rawInt"
      [(value)]="intValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new IntegerTextAdapter();
  public readonly rawInt = signal('');
  public readonly intValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `FloatTextAdapter` which validates floating-point numbers
 * including scientific notation.
 */
export const FloatAdapter: Story = {
  render: () => ({
    template: `<ui-story-float-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `FloatTextAdapter` validates floating-point numbers including " +
          "scientific notation (e.g. `1.5e10`). Shows a **calculator** " +
          "prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="3.14"
  ariaLabel="Float value"
  [adapter]="adapter"
  [(text)]="rawFloat"
  [(value)]="floatValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, FloatTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="3.14"
      ariaLabel="Float value"
      [adapter]="adapter"
      [(text)]="rawFloat"
      [(value)]="floatValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new FloatTextAdapter();
  public readonly rawFloat = signal('');
  public readonly floatValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `DecimalTextAdapter` with configurable precision (default 2).
 */
export const DecimalAdapter: Story = {
  render: () => ({
    template: `<ui-story-decimal-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `DecimalTextAdapter` validates decimal numbers with a configurable " +
          "maximum number of decimal places (default **2**). Shows a **decimals** " +
          "prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="9.99"
  ariaLabel="Decimal value"
  [adapter]="adapter"
  [(text)]="rawDec"
  [(value)]="decValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, DecimalTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="9.99"
      ariaLabel="Decimal value"
      [adapter]="adapter"
      [(text)]="rawDec"
      [(value)]="decValue"
    />
  \`,
})
export class MyComponent {
  // Allow up to 4 decimal places
  public readonly adapter = new DecimalTextAdapter(4);
  public readonly rawDec = signal('');
  public readonly decValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `HexadecimalTextAdapter` which strips `0x` prefix,
 * lowercases the result, and validates hex digits.
 */
export const HexadecimalAdapter: Story = {
  render: () => ({
    template: `<ui-story-hex-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `HexadecimalTextAdapter` strips the `0x` prefix, lowercases " +
          "the result, and validates that only hex digits (0-9, a-f) are present. " +
          "Shows a **binary** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="0xFF"
  ariaLabel="Hexadecimal value"
  [adapter]="adapter"
  [(text)]="rawHex"
  [(value)]="hexValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, HexadecimalTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="0xFF"
      ariaLabel="Hexadecimal value"
      [adapter]="adapter"
      [(text)]="rawHex"
      [(value)]="hexValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new HexadecimalTextAdapter();
  public readonly rawHex = signal('');
  public readonly hexValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `PhoneTextAdapter` which strips formatting characters,
 * validates phone number patterns, and opens a `tel:` link on icon click.
 */
export const PhoneAdapter: Story = {
  render: () => ({
    template: `<ui-story-phone-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `PhoneTextAdapter` strips formatting (spaces, dashes, parentheses) " +
          "from phone numbers and keeps only digits and a leading `+`. Shows a " +
          "**phone** prefix icon that opens a `tel:` link.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  type="tel"
  placeholder="+1 (555) 123-4567"
  ariaLabel="Phone number"
  [adapter]="adapter"
  [(text)]="rawPhone"
  [(value)]="phoneValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, PhoneTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      type="tel"
      placeholder="+1 (555) 123-4567"
      ariaLabel="Phone number"
      [adapter]="adapter"
      [(text)]="rawPhone"
      [(value)]="phoneValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new PhoneTextAdapter();
  public readonly rawPhone = signal('');
  public readonly phoneValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `CreditCardTextAdapter` which strips spaces and dashes,
 * validates card length (13–19 digits) and Luhn checksum.
 */
export const CreditCardAdapter: Story = {
  render: () => ({
    template: `<ui-story-credit-card-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `CreditCardTextAdapter` strips spaces and dashes, validates that " +
          "the number has 13–19 digits, and runs a **Luhn checksum**. Shows a " +
          "**credit-card** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="4111 1111 1111 1111"
  ariaLabel="Credit card number"
  [adapter]="adapter"
  [(text)]="rawCard"
  [(value)]="cardNumber"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, CreditCardTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="4111 1111 1111 1111"
      ariaLabel="Credit card number"
      [adapter]="adapter"
      [(text)]="rawCard"
      [(value)]="cardNumber"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new CreditCardTextAdapter();
  public readonly rawCard = signal('');
  public readonly cardNumber = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `PercentageTextAdapter` which strips a trailing `%` sign
 * and validates the remaining numeric value.
 */
export const PercentageAdapter: Story = {
  render: () => ({
    template: `<ui-story-percentage-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `PercentageTextAdapter` strips a trailing `%` sign and validates " +
          "that the remaining value is a valid number. Shows a **percent** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="75.5%"
  ariaLabel="Percentage value"
  [adapter]="adapter"
  [(text)]="rawPct"
  [(value)]="pctValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, PercentageTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="75.5%"
      ariaLabel="Percentage value"
      [adapter]="adapter"
      [(text)]="rawPct"
      [(value)]="pctValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new PercentageTextAdapter();
  public readonly rawPct = signal('');
  public readonly pctValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `DateTextAdapter` which validates ISO 8601 date strings
 * (`YYYY-MM-DD`) including calendar correctness.
 */
export const DateAdapter: Story = {
  render: () => ({
    template: `<ui-story-date-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `DateTextAdapter` validates ISO 8601 date strings (`YYYY-MM-DD`). " +
          "It checks both format and calendar validity (e.g. rejects `2025-02-30`). " +
          "Shows a **calendar** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="2025-12-31"
  ariaLabel="Date (ISO 8601)"
  [adapter]="adapter"
  [(text)]="rawDate"
  [(value)]="dateValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, DateTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="2025-12-31"
      ariaLabel="Date (ISO 8601)"
      [adapter]="adapter"
      [(text)]="rawDate"
      [(value)]="dateValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new DateTextAdapter();
  public readonly rawDate = signal('');
  public readonly dateValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `TimeTextAdapter` which validates 24-hour time strings
 * (`HH:MM` or `HH:MM:SS`).
 */
export const TimeAdapter: Story = {
  render: () => ({
    template: `<ui-story-time-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `TimeTextAdapter` validates 24-hour time strings in `HH:MM` or " +
          "`HH:MM:SS` format. Shows a **clock** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="14:30"
  ariaLabel="Time (24-hour)"
  [adapter]="adapter"
  [(text)]="rawTime"
  [(value)]="timeValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, TimeTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="14:30"
      ariaLabel="Time (24-hour)"
      [adapter]="adapter"
      [(text)]="rawTime"
      [(value)]="timeValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new TimeTextAdapter();
  public readonly rawTime = signal('');
  public readonly timeValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `ColorTextAdapter` which validates hex colour codes
 * (`#RGB`, `#RRGGBB`, `#RRGGBBAA`) and shows a colour swatch.
 */
export const ColorAdapter: Story = {
  render: () => ({
    template: `<ui-story-color-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `ColorTextAdapter` validates CSS hex colour codes. It auto-prepends " +
          "`#` and lowercases the result. The demo shows a preview swatch. " +
          "Shows a **palette** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="FF6600"
  ariaLabel="Hex colour"
  [adapter]="adapter"
  [(text)]="rawColor"
  [(value)]="colorValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, ColorTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="FF6600"
      ariaLabel="Hex colour"
      [adapter]="adapter"
      [(text)]="rawColor"
      [(value)]="colorValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new ColorTextAdapter();
  public readonly rawColor = signal('');
  public readonly colorValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `SlugTextAdapter` which converts input text to a URL-friendly
 * slug (lowercase, hyphens).
 */
export const SlugAdapter: Story = {
  render: () => ({
    template: `<ui-story-slug-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `SlugTextAdapter` transforms input into a URL slug: lowercases, " +
          "replaces spaces/underscores with hyphens, strips special characters, " +
          "and collapses consecutive hyphens. Shows a **link** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="my-page-title"
  ariaLabel="URL slug"
  [adapter]="adapter"
  [(text)]="rawSlug"
  [(value)]="slugValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, SlugTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="my-page-title"
      ariaLabel="URL slug"
      [adapter]="adapter"
      [(text)]="rawSlug"
      [(value)]="slugValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new SlugTextAdapter();
  public readonly rawSlug = signal('');
  public readonly slugValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `UuidTextAdapter` which validates UUID format
 * (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) and lowercases the result.
 */
export const UuidAdapter: Story = {
  render: () => ({
    template: `<ui-story-uuid-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `UuidTextAdapter` validates standard UUID format and lowercases " +
          "the result. Shows a **fingerprint** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="550e8400-e29b-41d4-a716-446655440000"
  ariaLabel="UUID"
  [adapter]="adapter"
  [(text)]="rawUuid"
  [(value)]="uuidValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, UuidTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="550e8400-e29b-41d4-a716-446655440000"
      ariaLabel="UUID"
      [adapter]="adapter"
      [(text)]="rawUuid"
      [(value)]="uuidValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new UuidTextAdapter();
  public readonly rawUuid = signal('');
  public readonly uuidValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Shows the `CronTextAdapter` which validates cron expressions
 * (5 or 6 fields).
 */
export const CronAdapter: Story = {
  render: () => ({
    template: `<ui-story-cron-adapter-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "The `CronTextAdapter` validates standard cron expressions (5 fields, " +
          "or 6 with seconds). Shows a **timer** prefix icon.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input
  placeholder="0 * * * *"
  ariaLabel="Cron expression"
  [adapter]="adapter"
  [(text)]="rawCron"
  [(value)]="cronValue"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, CronTextAdapter } from '@theredhead/lucid-kit';

@Component({
  imports: [UIInput],
  template: \`
    <ui-input
      placeholder="0 * * * *"
      ariaLabel="Cron expression"
      [adapter]="adapter"
      [(text)]="rawCron"
      [(value)]="cronValue"
    />
  \`,
})
export class MyComponent {
  public readonly adapter = new CronTextAdapter();
  public readonly rawCron = signal('');
  public readonly cronValue = signal('');
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};
