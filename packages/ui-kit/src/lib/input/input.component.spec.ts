import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";

import { UIInput } from "./input.component";
import type { TextAdapter } from "./adapters/text-adapter";
import { isPopupAdapter } from "./adapters/popup-text-adapter";
import {
  DecimalTextAdapter,
  EmailTextAdapter,
  FloatTextAdapter,
  HexadecimalTextAdapter,
  IntegerTextAdapter,
  IPAddressTextAdapter,
  MoneyTextAdapter,
  UrlTextAdapter,
  PhoneTextAdapter,
  CreditCardTextAdapter,
  PercentageTextAdapter,
  DateTextAdapter,
  TimeTextAdapter,
  ColorTextAdapter,
  SlugTextAdapter,
  UuidTextAdapter,
  CronTextAdapter,
} from "./adapters";

describe("UIInput", () => {
  let component: UIInput;
  let fixture: ComponentFixture<UIInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIInput],
    }).compileComponents();

    fixture = TestBed.createComponent(UIInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default type to "text"', () => {
      expect(component.type()).toBe("text");
    });

    it('should default value to ""', () => {
      expect(component.value()).toBe("");
    });

    it('should default placeholder to ""', () => {
      expect(component.placeholder()).toBe("");
    });

    it("should default disabled to false", () => {
      expect(component.disabled()).toBe(false);
    });
  });

  describe("type variants", () => {
    it("should set native input type to number", () => {
      fixture.componentRef.setInput("type", "number");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("number");
    });

    it("should set native input type to date", () => {
      fixture.componentRef.setInput("type", "date");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("date");
    });
  });

  describe("input event", () => {
    it("should update value on input event", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "hello";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBe("hello");
    });
  });

  describe("placeholder", () => {
    it("should set the native placeholder attribute", () => {
      fixture.componentRef.setInput("placeholder", "Enter value");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.placeholder).toBe("Enter value");
    });
  });

  describe("disabled state", () => {
    it("should disable the native input", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.disabled).toBe(true);
    });
  });

  describe("host class", () => {
    it("should have the ui-input class on the host", () => {
      const host: HTMLElement = fixture.nativeElement;
      expect(host.classList.contains("ui-input")).toBe(true);
    });
  });

  describe("two-way binding", () => {
    @Component({
      standalone: true,
      imports: [UIInput],
      template: `<ui-input [(value)]="text" />`,
    })
    class TestHost {
      text = "initial";
    }

    it("should propagate value changes to the host", () => {
      const hostFixture = TestBed.createComponent(TestHost);
      hostFixture.detectChanges();

      const input: HTMLInputElement =
        hostFixture.nativeElement.querySelector("input");
      input.value = "updated";
      input.dispatchEvent(new Event("input"));
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.text).toBe("updated");
    });
  });

  describe("accessibility", () => {
    it("should not set aria-label by default", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("aria-label")).toBeNull();
    });

    it("should forward ariaLabel to the native input", () => {
      fixture.componentRef.setInput("ariaLabel", "Search term");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.getAttribute("aria-label")).toBe("Search term");
    });
  });

  describe("multiline mode", () => {
    it("should default multiline to false", () => {
      expect(component.multiline()).toBe(false);
    });

    it("should render a textarea when multiline is true", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.detectChanges();

      const textarea = fixture.nativeElement.querySelector("textarea");
      const input = fixture.nativeElement.querySelector("input");
      expect(textarea).toBeTruthy();
      expect(input).toBeNull();
    });

    it("should render an input when multiline is false", () => {
      const input = fixture.nativeElement.querySelector("input");
      const textarea = fixture.nativeElement.querySelector("textarea");
      expect(input).toBeTruthy();
      expect(textarea).toBeNull();
    });

    it("should apply rows to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("rows", 6);
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.rows).toBe(6);
    });

    it("should default rows to 3", () => {
      expect(component.rows()).toBe(3);
    });

    it("should update value on textarea input event", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      textarea.value = "multiline text";
      textarea.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBe("multiline text");
    });

    it("should add ui-input--multiline host class", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.classList.contains("ui-input--multiline"),
      ).toBe(true);
    });

    it("should forward placeholder to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("placeholder", "Enter description");
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.placeholder).toBe("Enter description");
    });

    it("should forward disabled to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.disabled).toBe(true);
    });

    it("should forward ariaLabel to the textarea", () => {
      fixture.componentRef.setInput("multiline", true);
      fixture.componentRef.setInput("ariaLabel", "Description");
      fixture.detectChanges();

      const textarea: HTMLTextAreaElement =
        fixture.nativeElement.querySelector("textarea");
      expect(textarea.getAttribute("aria-label")).toBe("Description");
    });
  });

  describe("text model", () => {
    it('should default text to ""', () => {
      expect(component.text()).toBe("");
    });

    it("should update text on input event", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "hello";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.text()).toBe("hello");
    });

    it("should keep text and value in sync without adapter", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "synced";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.text()).toBe("synced");
      expect(component.value()).toBe("synced");
    });
  });

  describe("text two-way binding", () => {
    @Component({
      standalone: true,
      imports: [UIInput],
      template: `<ui-input [(text)]="rawText" />`,
    })
    class TextHost {
      rawText = "initial";
    }

    it("should propagate text changes to the host", () => {
      const hostFixture = TestBed.createComponent(TextHost);
      hostFixture.detectChanges();

      const input: HTMLInputElement =
        hostFixture.nativeElement.querySelector("input");
      input.value = "changed";
      input.dispatchEvent(new Event("input"));
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.rawText).toBe("changed");
    });
  });

  describe("adapter", () => {
    it("should process text through the adapter into value", () => {
      fixture.componentRef.setInput("adapter", new EmailTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "Hello@Example.COM";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.text()).toBe("Hello@Example.COM");
      expect(component.value()).toBe("hello@example.com");
    });

    it("should process url text through UrlTextAdapter", () => {
      fixture.componentRef.setInput("adapter", new UrlTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "example.com";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.text()).toBe("example.com");
      expect(component.value()).toBe("https://example.com");
    });

    it("should not prepend https:// if already present", () => {
      fixture.componentRef.setInput("adapter", new UrlTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "https://example.com";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.value()).toBe("https://example.com");
    });

    it("should use identity when no adapter is set", () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "raw text";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.text()).toBe("raw text");
      expect(component.value()).toBe("raw text");
    });
  });

  describe("adapter icons", () => {
    it("should render prefix icon from adapter", () => {
      fixture.componentRef.setInput("adapter", new EmailTextAdapter());
      fixture.detectChanges();

      const prefixBtn = fixture.nativeElement.querySelector(".icon--prefix");
      expect(prefixBtn).toBeTruthy();
      expect(prefixBtn.querySelector("ui-icon")).toBeTruthy();
    });

    it("should render suffix icon from adapter", () => {
      fixture.componentRef.setInput("adapter", new UrlTextAdapter());
      fixture.detectChanges();

      const suffixBtn = fixture.nativeElement.querySelector(".icon--suffix");
      expect(suffixBtn).toBeTruthy();
    });

    it("should not render icons without adapter", () => {
      fixture.detectChanges();

      const icons = fixture.nativeElement.querySelectorAll(".icon");
      expect(icons.length).toBe(0);
    });

    it("should add ui-input--has-prefix host class", () => {
      fixture.componentRef.setInput("adapter", new EmailTextAdapter());
      fixture.detectChanges();

      expect(
        fixture.nativeElement.classList.contains("ui-input--has-prefix"),
      ).toBe(true);
    });

    it("should add ui-input--has-suffix host class", () => {
      fixture.componentRef.setInput("adapter", new UrlTextAdapter());
      fixture.detectChanges();

      expect(
        fixture.nativeElement.classList.contains("ui-input--has-suffix"),
      ).toBe(true);
    });
  });

  describe("adapter inputType", () => {
    it('should default to "text" when no adapter is set', () => {
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("text");
    });

    it('should set type to "email" with EmailTextAdapter', () => {
      fixture.componentRef.setInput("adapter", new EmailTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("email");
    });

    it('should set type to "tel" with PhoneTextAdapter', () => {
      fixture.componentRef.setInput("adapter", new PhoneTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("tel");
    });

    it('should set type to "url" with UrlTextAdapter', () => {
      fixture.componentRef.setInput("adapter", new UrlTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("url");
    });

    it("should fall back to type input when adapter has no inputType", () => {
      const adapter: TextAdapter = {
        toValue: (t: string) => t,
      };
      fixture.componentRef.setInput("adapter", adapter);
      fixture.componentRef.setInput("type", "number");
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(input.type).toBe("number");
    });
  });

  describe("adapter icon clicks", () => {
    it("should call onPrefixClick on prefix icon click", () => {
      const adapter: TextAdapter = {
        prefixIcon: "<path />",
        toValue: (t: string) => t,
        onPrefixClick: vi.fn(),
      };
      fixture.componentRef.setInput("adapter", adapter);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "test";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const prefixBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".icon--prefix");
      prefixBtn.click();

      expect(adapter.onPrefixClick).toHaveBeenCalledWith("test");
    });

    it("should call onSuffixClick on suffix icon click", () => {
      const adapter: TextAdapter = {
        suffixIcon: "<path />",
        toValue: (t: string) => t,
        onSuffixClick: vi.fn(),
      };
      fixture.componentRef.setInput("adapter", adapter);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "test";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      const suffixBtn: HTMLButtonElement =
        fixture.nativeElement.querySelector(".icon--suffix");
      suffixBtn.click();

      expect(adapter.onSuffixClick).toHaveBeenCalledWith("test");
    });
  });

  describe("backward compatibility", () => {
    @Component({
      standalone: true,
      imports: [UIInput],
      template: `<ui-input [(value)]="val" />`,
    })
    class ValueOnlyHost {
      val = "legacy";
    }

    it("should still support [(value)] without [(text)]", () => {
      const hostFixture = TestBed.createComponent(ValueOnlyHost);
      hostFixture.detectChanges();

      const input: HTMLInputElement =
        hostFixture.nativeElement.querySelector("input");
      input.value = "updated-legacy";
      input.dispatchEvent(new Event("input"));
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.val).toBe("updated-legacy");
    });
  });

  describe("validation", () => {
    it("should default valid to true without adapter", () => {
      expect(component.valid()).toBe(true);
    });

    it("should default errors to empty without adapter", () => {
      expect(component.errors()).toEqual([]);
    });

    it("should be valid for empty text with a validating adapter", () => {
      fixture.componentRef.setInput("adapter", new IntegerTextAdapter());
      fixture.detectChanges();

      expect(component.valid()).toBe(true);
    });

    it("should be invalid for non-integer text with IntegerTextAdapter", () => {
      fixture.componentRef.setInput("adapter", new IntegerTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "abc";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.valid()).toBe(false);
      expect(component.errors().length).toBeGreaterThan(0);
    });

    it("should be valid for integer text with IntegerTextAdapter", () => {
      fixture.componentRef.setInput("adapter", new IntegerTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "42";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.valid()).toBe(true);
      expect(component.errors()).toEqual([]);
    });

    it("should add ui-input--invalid host class when invalid", () => {
      fixture.componentRef.setInput("adapter", new IntegerTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "abc";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(
        fixture.nativeElement.classList.contains("ui-input--invalid"),
      ).toBe(true);
    });

    it("should not add ui-input--invalid host class when valid", () => {
      fixture.componentRef.setInput("adapter", new IntegerTextAdapter());
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "42";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(
        fixture.nativeElement.classList.contains("ui-input--invalid"),
      ).toBe(false);
    });

    it("should remain valid when adapter has no validate method", () => {
      const adapter: TextAdapter = {
        toValue: (t: string) => t,
      };
      fixture.componentRef.setInput("adapter", adapter);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      input.value = "anything";
      input.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.valid()).toBe(true);
    });
  });

  describe("IntegerTextAdapter", () => {
    const adapter = new IntegerTextAdapter();

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  42  ")).toBe("42");
    });

    it("should accept positive integers", () => {
      expect(adapter.validate("123").valid).toBe(true);
    });

    it("should accept negative integers", () => {
      expect(adapter.validate("-42").valid).toBe(true);
    });

    it("should accept positive signed integers", () => {
      expect(adapter.validate("+7").valid).toBe(true);
    });

    it("should reject floats", () => {
      expect(adapter.validate("3.14").valid).toBe(false);
    });

    it("should reject non-numeric text", () => {
      expect(adapter.validate("abc").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("FloatTextAdapter", () => {
    const adapter = new FloatTextAdapter();

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  3.14  ")).toBe("3.14");
    });

    it("should accept integers", () => {
      expect(adapter.validate("42").valid).toBe(true);
    });

    it("should accept decimal numbers", () => {
      expect(adapter.validate("3.14").valid).toBe(true);
    });

    it("should accept numbers with leading dot", () => {
      expect(adapter.validate(".5").valid).toBe(true);
    });

    it("should accept scientific notation", () => {
      expect(adapter.validate("1.5e10").valid).toBe(true);
    });

    it("should accept negative scientific notation", () => {
      expect(adapter.validate("-2.5E-3").valid).toBe(true);
    });

    it("should reject non-numeric text", () => {
      expect(adapter.validate("abc").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("DecimalTextAdapter", () => {
    it("should default to 2 decimal places", () => {
      const adapter = new DecimalTextAdapter();
      expect(adapter.maxDecimals).toBe(2);
    });

    it("should accept a number within decimal limit", () => {
      const adapter = new DecimalTextAdapter(2);
      expect(adapter.validate("12.34").valid).toBe(true);
    });

    it("should reject a number exceeding decimal limit", () => {
      const adapter = new DecimalTextAdapter(2);
      expect(adapter.validate("12.345").valid).toBe(false);
    });

    it("should accept integers", () => {
      const adapter = new DecimalTextAdapter(2);
      expect(adapter.validate("42").valid).toBe(true);
    });

    it("should accept configurable precision", () => {
      const adapter = new DecimalTextAdapter(4);
      expect(adapter.validate("1.2345").valid).toBe(true);
      expect(adapter.validate("1.23456").valid).toBe(false);
    });

    it("should trim whitespace in toValue", () => {
      const adapter = new DecimalTextAdapter();
      expect(adapter.toValue("  9.99  ")).toBe("9.99");
    });

    it("should reject non-numeric text", () => {
      const adapter = new DecimalTextAdapter();
      expect(adapter.validate("abc").valid).toBe(false);
    });

    it("should accept empty string", () => {
      const adapter = new DecimalTextAdapter();
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("MoneyTextAdapter", () => {
    const adapter = new MoneyTextAdapter();

    it("should strip commas in toValue", () => {
      expect(adapter.toValue("1,234.56")).toBe("1234.56");
    });

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  100  ")).toBe("100");
    });

    it("should accept whole numbers", () => {
      expect(adapter.validate("100").valid).toBe(true);
    });

    it("should accept amounts with two decimals", () => {
      expect(adapter.validate("19.99").valid).toBe(true);
    });

    it("should accept comma-separated amounts", () => {
      expect(adapter.validate("1,234.56").valid).toBe(true);
    });

    it("should reject amounts with more than two decimals", () => {
      expect(adapter.validate("19.999").valid).toBe(false);
    });

    it("should reject non-numeric text", () => {
      expect(adapter.validate("abc").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should default to EUR", () => {
      expect(adapter.currency).toBe("EUR");
    });

    it("should accept explicit currency", () => {
      const eur = new MoneyTextAdapter("EUR");
      expect(eur.currency).toBe("EUR");
    });

    it("should uppercase currency", () => {
      const gbp = new MoneyTextAdapter("gbp");
      expect(gbp.currency).toBe("GBP");
    });

    it("should use 0 decimals for JPY", () => {
      const jpy = new MoneyTextAdapter("JPY");
      expect(jpy.decimals).toBe(0);
    });

    it("should reject decimals for JPY", () => {
      const jpy = new MoneyTextAdapter("JPY");
      expect(jpy.validate("100.50").valid).toBe(false);
    });

    it("should accept whole numbers for JPY", () => {
      const jpy = new MoneyTextAdapter("JPY");
      expect(jpy.validate("100").valid).toBe(true);
    });
  });

  describe("HexadecimalTextAdapter", () => {
    const adapter = new HexadecimalTextAdapter();

    it("should strip 0x prefix and lowercase in toValue", () => {
      expect(adapter.toValue("0xFF")).toBe("ff");
    });

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  0xAB  ")).toBe("ab");
    });

    it("should accept valid hex digits", () => {
      expect(adapter.validate("ff").valid).toBe(true);
    });

    it("should accept hex with 0x prefix", () => {
      expect(adapter.validate("0xFF").valid).toBe(true);
    });

    it("should reject non-hex characters", () => {
      expect(adapter.validate("xyz").valid).toBe(false);
    });

    it("should reject bare 0x prefix with no digits", () => {
      expect(adapter.validate("0x").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("EmailTextAdapter validation", () => {
    const adapter = new EmailTextAdapter();

    it("should accept valid emails", () => {
      expect(adapter.validate("user@example.com").valid).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(adapter.validate("not-an-email").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("UrlTextAdapter validation", () => {
    const adapter = new UrlTextAdapter();

    it("should accept valid URLs", () => {
      expect(adapter.validate("example.com").valid).toBe(true);
    });

    it("should accept URLs with protocol", () => {
      expect(adapter.validate("https://example.com").valid).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(adapter.validate("not a url!").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("IPAddressTextAdapter validation", () => {
    const adapter = new IPAddressTextAdapter();

    it("should accept valid IPv4", () => {
      expect(adapter.validate("192.168.1.1").valid).toBe(true);
    });

    it("should reject out-of-range octets", () => {
      expect(adapter.validate("256.1.2.3").valid).toBe(false);
    });

    it("should reject non-IP text", () => {
      expect(adapter.validate("hello").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("PhoneTextAdapter", () => {
    const adapter = new PhoneTextAdapter();

    it("should strip formatting characters in toValue", () => {
      expect(adapter.toValue("+1 (555) 123-4567")).toBe("+15551234567");
    });

    it("should keep leading + in toValue", () => {
      expect(adapter.toValue("+44 20 7946 0958")).toBe("+442079460958");
    });

    it("should return digits only without leading +", () => {
      expect(adapter.toValue("555-1234")).toBe("5551234");
    });

    it("should return empty for empty input", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should accept valid phone numbers", () => {
      expect(adapter.validate("+1 555 123 4567").valid).toBe(true);
    });

    it("should accept phone with parentheses", () => {
      expect(adapter.validate("(555) 123-4567").valid).toBe(true);
    });

    it("should reject too-short numbers", () => {
      expect(adapter.validate("123").valid).toBe(false);
    });

    it("should reject text with letters", () => {
      expect(adapter.validate("555-CALL-ME").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("CreditCardTextAdapter", () => {
    const adapter = new CreditCardTextAdapter();

    it("should strip spaces and dashes in toValue", () => {
      expect(adapter.toValue("4111 1111 1111 1111")).toBe("4111111111111111");
    });

    it("should strip dashes in toValue", () => {
      expect(adapter.toValue("4111-1111-1111-1111")).toBe("4111111111111111");
    });

    it("should accept valid Visa test number", () => {
      expect(adapter.validate("4111111111111111").valid).toBe(true);
    });

    it("should accept valid card with spaces", () => {
      expect(adapter.validate("4111 1111 1111 1111").valid).toBe(true);
    });

    it("should reject too-short numbers", () => {
      expect(adapter.validate("411111").valid).toBe(false);
    });

    it("should reject failing Luhn checksum", () => {
      expect(adapter.validate("4111111111111112").valid).toBe(false);
    });

    it("should reject non-digit characters", () => {
      expect(adapter.validate("4111-abcd-1111-1111").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("PercentageTextAdapter", () => {
    const adapter = new PercentageTextAdapter();

    it("should strip trailing % in toValue", () => {
      expect(adapter.toValue("75.5%")).toBe("75.5");
    });

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  50  ")).toBe("50");
    });

    it("should accept numeric values", () => {
      expect(adapter.validate("75.5").valid).toBe(true);
    });

    it("should accept values with % sign", () => {
      expect(adapter.validate("75.5%").valid).toBe(true);
    });

    it("should accept negative values", () => {
      expect(adapter.validate("-10").valid).toBe(true);
    });

    it("should reject non-numeric text", () => {
      expect(adapter.validate("abc").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("DateTextAdapter", () => {
    const adapter = new DateTextAdapter();

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  2025-12-31  ")).toBe("2025-12-31");
    });

    it("should accept valid ISO dates", () => {
      expect(adapter.validate("2025-12-31").valid).toBe(true);
    });

    it("should accept leap day", () => {
      expect(adapter.validate("2024-02-29").valid).toBe(true);
    });

    it("should reject invalid calendar date (Feb 30)", () => {
      expect(adapter.validate("2025-02-30").valid).toBe(false);
    });

    it("should reject wrong format", () => {
      expect(adapter.validate("12/31/2025").valid).toBe(false);
    });

    it("should reject non-date text", () => {
      expect(adapter.validate("not-a-date").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("TimeTextAdapter", () => {
    const adapter = new TimeTextAdapter();

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  14:30  ")).toBe("14:30");
    });

    it("should accept valid HH:MM", () => {
      expect(adapter.validate("14:30").valid).toBe(true);
    });

    it("should accept valid HH:MM:SS", () => {
      expect(adapter.validate("14:30:59").valid).toBe(true);
    });

    it("should accept midnight", () => {
      expect(adapter.validate("00:00").valid).toBe(true);
    });

    it("should reject hours > 23", () => {
      expect(adapter.validate("24:00").valid).toBe(false);
    });

    it("should reject minutes > 59", () => {
      expect(adapter.validate("12:60").valid).toBe(false);
    });

    it("should reject seconds > 59", () => {
      expect(adapter.validate("12:30:60").valid).toBe(false);
    });

    it("should reject wrong format", () => {
      expect(adapter.validate("2:30 PM").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("ColorTextAdapter", () => {
    const adapter = new ColorTextAdapter();

    it("should prepend # and lowercase in toValue", () => {
      expect(adapter.toValue("FF6600")).toBe("#ff6600");
    });

    it("should keep existing # in toValue", () => {
      expect(adapter.toValue("#ABC")).toBe("#abc");
    });

    it("should return empty for empty input", () => {
      expect(adapter.toValue("")).toBe("");
    });

    it("should accept 3-digit hex", () => {
      expect(adapter.validate("ABC").valid).toBe(true);
    });

    it("should accept 6-digit hex", () => {
      expect(adapter.validate("#FF6600").valid).toBe(true);
    });

    it("should accept 8-digit hex (with alpha)", () => {
      expect(adapter.validate("#FF660080").valid).toBe(true);
    });

    it("should reject 4-digit hex", () => {
      expect(adapter.validate("#ABCD").valid).toBe(false);
    });

    it("should reject non-hex characters", () => {
      expect(adapter.validate("#GGHHII").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });

    it("should be detected as a popup adapter", () => {
      expect(isPopupAdapter(adapter)).toBe(true);
    });

    it("should have popupPanel", () => {
      expect((adapter as any).popupPanel).toBeTruthy();
      expect(typeof (adapter as any).popupPanel).toBe("function");
    });

    it("should expose hasPopup when set on UIInput", () => {
      fixture.componentRef.setInput("adapter", adapter);
      fixture.detectChanges();
      expect(component.hasPopup()).toBe(true);
    });

    it("should render prefix icon as clickable button", () => {
      fixture.componentRef.setInput("adapter", adapter);
      fixture.detectChanges();
      const prefixBtn = fixture.nativeElement.querySelector(".icon--prefix");
      expect(prefixBtn).toBeTruthy();
    });
  });

  describe("SlugTextAdapter", () => {
    const adapter = new SlugTextAdapter();

    it("should convert to slug in toValue", () => {
      expect(adapter.toValue("Hello World!")).toBe("hello-world");
    });

    it("should replace underscores with hyphens", () => {
      expect(adapter.toValue("my_page_title")).toBe("my-page-title");
    });

    it("should collapse consecutive hyphens", () => {
      expect(adapter.toValue("a---b")).toBe("a-b");
    });

    it("should strip leading/trailing hyphens", () => {
      expect(adapter.toValue("-hello-")).toBe("hello");
    });

    it("should accept valid slugs", () => {
      expect(adapter.validate("my-page-title").valid).toBe(true);
    });

    it("should accept single word slugs", () => {
      expect(adapter.validate("hello").valid).toBe(true);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("UuidTextAdapter", () => {
    const adapter = new UuidTextAdapter();

    it("should lowercase in toValue", () => {
      expect(adapter.toValue("550E8400-E29B-41D4-A716-446655440000")).toBe(
        "550e8400-e29b-41d4-a716-446655440000",
      );
    });

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  550e8400-e29b-41d4-a716-446655440000  ")).toBe(
        "550e8400-e29b-41d4-a716-446655440000",
      );
    });

    it("should accept valid UUID", () => {
      expect(
        adapter.validate("550e8400-e29b-41d4-a716-446655440000").valid,
      ).toBe(true);
    });

    it("should accept uppercase UUID", () => {
      expect(
        adapter.validate("550E8400-E29B-41D4-A716-446655440000").valid,
      ).toBe(true);
    });

    it("should accept NIL UUID", () => {
      expect(
        adapter.validate("00000000-0000-0000-0000-000000000000").valid,
      ).toBe(true);
    });

    it("should reject wrong format", () => {
      expect(adapter.validate("not-a-uuid").valid).toBe(false);
    });

    it("should reject UUID without dashes", () => {
      expect(adapter.validate("550e8400e29b41d4a716446655440000").valid).toBe(
        false,
      );
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });

  describe("CronTextAdapter", () => {
    const adapter = new CronTextAdapter();

    it("should trim whitespace in toValue", () => {
      expect(adapter.toValue("  0 * * * *  ")).toBe("0 * * * *");
    });

    it("should accept standard 5-field cron", () => {
      expect(adapter.validate("0 * * * *").valid).toBe(true);
    });

    it("should accept 6-field cron (with seconds)", () => {
      expect(adapter.validate("0 0 * * * *").valid).toBe(true);
    });

    it("should accept ranges and lists", () => {
      expect(adapter.validate("0 9-17 * * 1,3,5").valid).toBe(true);
    });

    it("should accept step values", () => {
      expect(adapter.validate("*/5 * * * *").valid).toBe(true);
    });

    it("should reject too few fields", () => {
      expect(adapter.validate("0 *").valid).toBe(false);
    });

    it("should reject too many fields", () => {
      expect(adapter.validate("0 0 0 0 0 0 0").valid).toBe(false);
    });

    it("should accept empty string", () => {
      expect(adapter.validate("").valid).toBe(true);
    });
  });
});
