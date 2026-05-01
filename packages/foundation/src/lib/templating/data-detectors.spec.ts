import { describe, expect, it } from "vitest";

import { applyDataDetectors } from "./template-processor";
import {
  EmailDetector,
  EmojiDetector,
  PhoneNumberDetector,
  UrlDetector,
} from "./data-detectors";

describe("templating data detectors", () => {
  it("links email addresses", () => {
    const detector = new EmailDetector();

    expect(detector.detect("Contact ada@example.com")).toBe(true);
    expect(detector.process("Contact ada@example.com")).toBe(
      'Contact <a href="mailto:ada@example.com">ada@example.com</a>',
    );
  });

  it("links URLs", () => {
    const detector = new UrlDetector();

    expect(detector.detect("Visit https://example.com/docs today")).toBe(true);
    expect(detector.process("Visit https://example.com/docs today")).toBe(
      'Visit <a href="https://example.com/docs" target="_blank" rel="noopener noreferrer">https://example.com/docs</a> today',
    );
  });

  it("links phone numbers", () => {
    const detector = new PhoneNumberDetector();

    expect(detector.detect("Call +1 (555) 123-4567")).toBe(true);
    expect(detector.process("Call +1 (555) 123-4567")).toBe(
      'Call <a href="tel:+15551234567">+1 (555) 123-4567</a>',
    );
  });

  it("converts plaintext emoticons to emoji", () => {
    const detector = new EmojiDetector();

    expect(detector.detect("Looks good :-)")).toBe(true);
    expect(detector.process("Looks good :-)")).toBe("Looks good 🙂");
  });

  it("applies multiple HTML-producing detectors without corrupting prior output", () => {
    expect(
      applyDataDetectors("Mail ada@example.com :-) ", [
        new EmailDetector(),
        new EmojiDetector(),
      ]),
    ).toBe('Mail <a href="mailto:ada@example.com">ada@example.com</a> 🙂 ');
  });

  it("does not treat existing emoji glyphs as plaintext emoticons", () => {
    const detector = new EmojiDetector();

    expect(detector.detect("Already emoji 😀")).toBe(false);
  });

  it("does not treat short numeric fragments as phone numbers", () => {
    const detector = new PhoneNumberDetector();

    expect(detector.detect("Ref 123-45")).toBe(false);
  });
});
