import type { IDataDetector } from "./template-processor";

/** @internal */
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

/** @internal */
const URL_PATTERN = /https?:\/\/[^\s<]+[^\s<.,!?;:)]/gi;

/** @internal */
const PHONE_PATTERN = /(?:\+?\d[\d().\-\s]{5,}\d)/g;

/** @internal */
const EMOTICON_TO_EMOJI = new Map<string, string>([
  [":-)", "🙂"],
  [":)", "🙂"],
  [":-(", "🙁"],
  [":(", "🙁"],
  [";-)", "😉"],
  [";)", "😉"],
  [":-D", "😄"],
  [":D", "😄"],
  [":-P", "😛"],
  [":P", "😛"],
  [":-p", "😛"],
  [":p", "😛"],
  [":-O", "😮"],
  [":O", "😮"],
  [":-o", "😮"],
  [":o", "😮"],
  [":'(", "😢"],
  ["<3", "❤️"],
]);

/** @internal */
const EMOTICON_PATTERN = new RegExp(
  Array.from(EMOTICON_TO_EMOJI.keys())
    .sort((left, right) => right.length - left.length)
    .map(escapeRegExp)
    .join("|"),
  "g",
);

/**
 * Detects and links email addresses.
 */
export class EmailDetector implements IDataDetector {
  /** @inheritdoc */
  public detect(text: string): boolean {
    EMAIL_PATTERN.lastIndex = 0;
    return EMAIL_PATTERN.test(text);
  }

  /** @inheritdoc */
  public process(text: string): string {
    return replaceMatches(text, EMAIL_PATTERN, (match) => {
      const email = match[0];
      return `<a href="mailto:${escapeAttribute(email)}">${escapeHtml(email)}</a>`;
    });
  }
}

/**
 * Detects and links HTTP and HTTPS URLs.
 */
export class UrlDetector implements IDataDetector {
  /** @inheritdoc */
  public detect(text: string): boolean {
    URL_PATTERN.lastIndex = 0;
    return URL_PATTERN.test(text);
  }

  /** @inheritdoc */
  public process(text: string): string {
    return replaceMatches(text, URL_PATTERN, (match) => {
      const url = match[0];
      return `<a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`;
    });
  }
}

/**
 * Detects and links phone numbers.
 */
export class PhoneNumberDetector implements IDataDetector {
  /** @inheritdoc */
  public detect(text: string): boolean {
    PHONE_PATTERN.lastIndex = 0;
    return Array.from(text.matchAll(PHONE_PATTERN)).some((match) =>
      isLikelyPhoneNumber(match[0]),
    );
  }

  /** @inheritdoc */
  public process(text: string): string {
    return replaceMatches(text, PHONE_PATTERN, (match) => {
      const phoneNumber = match[0];
      if (!isLikelyPhoneNumber(phoneNumber)) {
        return escapeHtml(phoneNumber);
      }
      return `<a href="tel:${escapeAttribute(normalizePhoneNumber(phoneNumber))}">${escapeHtml(phoneNumber)}</a>`;
    });
  }
}

/**
 * Detects old-school plaintext emoticons and converts them to emoji.
 */
export class EmojiDetector implements IDataDetector {
  /** @inheritdoc */
  public detect(text: string): boolean {
    return findEmoticonMatch(text) !== null;
  }

  /** @inheritdoc */
  public process(text: string): string {
    let result = "";
    let lastIndex = 0;
    EMOTICON_PATTERN.lastIndex = 0;
    for (const match of text.matchAll(EMOTICON_PATTERN)) {
      const emoticon = match[0];
      const index = match.index ?? 0;
      if (!isEmoticonBoundary(text, index, index + emoticon.length)) {
        continue;
      }
      result += escapeHtml(text.slice(lastIndex, index));
      result += EMOTICON_TO_EMOJI.get(emoticon) ?? escapeHtml(emoticon);
      lastIndex = index + emoticon.length;
    }
    result += escapeHtml(text.slice(lastIndex));
    return result;
  }
}

/** @internal */
function replaceMatches(
  text: string,
  pattern: RegExp,
  replaceMatch: (match: RegExpMatchArray) => string,
): string {
  let result = "";
  let lastIndex = 0;
  pattern.lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    result += escapeHtml(text.slice(lastIndex, index));
    result += replaceMatch(match);
    lastIndex = index + match[0].length;
  }
  result += escapeHtml(text.slice(lastIndex));
  return result;
}

/** @internal */
function normalizePhoneNumber(phoneNumber: string): string {
  const trimmed = phoneNumber.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");
  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

/** @internal */
function isLikelyPhoneNumber(value: string): boolean {
  return value.replace(/\D/g, "").length >= 7;
}

/** @internal */
function findEmoticonMatch(text: string): RegExpMatchArray | null {
  EMOTICON_PATTERN.lastIndex = 0;
  for (const match of text.matchAll(EMOTICON_PATTERN)) {
    const index = match.index ?? 0;
    if (isEmoticonBoundary(text, index, index + match[0].length)) {
      return match;
    }
  }
  return null;
}

/** @internal */
function isEmoticonBoundary(
  text: string,
  startIndex: number,
  endIndex: number,
): boolean {
  const previous = startIndex > 0 ? text[startIndex - 1] : "";
  const next = endIndex < text.length ? text[endIndex] : "";
  return (
    isEmoticonBoundaryCharacter(previous) && isEmoticonBoundaryCharacter(next)
  );
}

/** @internal */
function isEmoticonBoundaryCharacter(value: string): boolean {
  return value === "" || /[\s([{'"<>,.!?\]-]/.test(value);
}

/** @internal */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** @internal */
function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

/** @internal */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
