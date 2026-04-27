import { afterEach, describe, expect, it } from "vitest";
import {
  TextTemplateProcessor,
  XmlTemplateParser,
  XmlTemplateSerializer,
  haveRegisteredTextTemplateBlockProvider,
  registerTextTemplateBlockProvider,
  unregisterTextTemplateBlockProvider,
  type TemplateBlockProvider,
} from "./template-processor";

function proc(
  missingKey?: "keep" | "empty" | "error" | ((k: string) => string),
): TextTemplateProcessor {
  return new TextTemplateProcessor(missingKey ? { missingKey } : {});
}

describe("TextTemplateProcessor XML blocks", () => {
  describe("parser and serializer", () => {
    it("parses self-closing and container blocks", () => {
      const document = new XmlTemplateParser().parse(
        'Hi <placeholder key="name" /> <if test="ok">yes</if>',
      );

      expect(document.children.length).toBe(4);
      expect(document.children[1]).toMatchObject({
        kind: "block",
        name: "placeholder",
        attributes: { key: "name" },
        selfClosing: true,
      });
      expect(document.children[3]).toMatchObject({
        kind: "block",
        name: "if",
        attributes: { test: "ok" },
        selfClosing: false,
      });
    });

    it("serializes blocks back to canonical XML", () => {
      const parser = new XmlTemplateParser();
      const serializer = new XmlTemplateSerializer();
      const document = parser.parse(
        'Hi <placeholder key="name" /><if test="ok">yes</if>',
      );

      expect(serializer.serialize(document)).toBe(
        'Hi <placeholder key="name" /><if test="ok">yes</if>',
      );
    });

    it("throws for malformed XML", () => {
      expect(() => new XmlTemplateParser().parse("<if>broken")).toThrow(
        SyntaxError,
      );
    });
  });

  describe("placeholder block", () => {
    it("replaces a self-closing placeholder block", () => {
      expect(
        proc().expand('Hello, <placeholder key="name" />!', {
          name: "World",
        }),
      ).toBe("Hello, World!");
    });

    it("defaults missing placeholders to the original XML block", () => {
      expect(proc().expand('<placeholder key="missing" />', {})).toBe(
        '<placeholder key="missing" />',
      );
    });

    it("supports empty missing-key behavior", () => {
      expect(proc("empty").expand('<placeholder key="missing" />', {})).toBe(
        "",
      );
    });

    it("supports error missing-key behavior", () => {
      expect(() =>
        proc("error").expand('<placeholder key="missing" />', {}),
      ).toThrow(RangeError);
    });

    it("rejects placeholder blocks with children", () => {
      expect(() =>
        proc().expand("<placeholder key=\"name\">bad</placeholder>", {
          name: "World",
        }),
      ).toThrow(SyntaxError);
    });
  });

  describe("if block", () => {
    it("renders children when truthy", () => {
      expect(proc().expand('<if test="show">yes</if>', { show: true })).toBe(
        "yes",
      );
    });

    it("suppresses children when falsy", () => {
      expect(proc().expand('<if test="show">yes</if>', { show: false })).toBe(
        "",
      );
    });

    it("treats empty arrays as falsy", () => {
      expect(proc().expand('<if test="items">yes</if>', { items: [] })).toBe(
        "",
      );
    });

    it("requires a test attribute", () => {
      expect(() => proc().expand("<if>yes</if>", {})).toThrow(SyntaxError);
    });
  });

  describe("loop block", () => {
    it("iterates over object arrays", () => {
      expect(
        proc().expand('<loop items="items">- <placeholder key="name" /> </loop>', {
          items: [{ name: "Alice" }, { name: "Bob" }],
        }),
      ).toBe("- Alice - Bob ");
    });

    it("wraps scalar items as value", () => {
      expect(
        proc().expand('<loop items="nums"><placeholder key="value" /> </loop>', {
          nums: [1, 2, 3],
        }),
      ).toBe("1 2 3 ");
    });

    it("keeps outer context available inside loop items", () => {
      expect(
        proc().expand(
          '<loop items="items"><placeholder key="prefix" /> <placeholder key="name" /> </loop>',
          {
            prefix: "User",
            items: [{ name: "Alice" }],
          },
        ),
      ).toBe("User Alice ");
    });

    it("throws when loop target is not an array", () => {
      expect(() =>
        proc().expand('<loop items="items">x</loop>', { items: "nope" }),
      ).toThrow(TypeError);
    });
  });

  describe("block provider registry", () => {
    const provider: TemplateBlockProvider = {
      name: "upper",
      contentModel: "container",
      expand: (block, context) =>
        context.processor
          .expandNodes(block.children, context.data)
          .toUpperCase(),
    };

    afterEach(() => {
      unregisterTextTemplateBlockProvider("upper");
    });

    it("registers custom block providers", () => {
      registerTextTemplateBlockProvider(provider);

      expect(haveRegisteredTextTemplateBlockProvider("upper")).toBe(true);
      expect(
        proc().expand('<upper>Hello <placeholder key="name" /></upper>', {
          name: "Ada",
        }),
      ).toBe("HELLO ADA");
    });

    it("throws for unknown blocks", () => {
      expect(() => proc().expand("<unknown />", {})).toThrow(RangeError);
    });
  });

  describe("rich content passthrough", () => {
    it("expands template blocks inside XML-compatible HTML", () => {
      expect(
        proc().expand(
          '<section><p>Hello <strong><placeholder key="name" /></strong></p></section>',
          { name: "World" },
        ),
      ).toBe("<section><p>Hello <strong>World</strong></p></section>");
    });
  });
});
