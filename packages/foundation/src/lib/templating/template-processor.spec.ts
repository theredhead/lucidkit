import { afterEach, describe, expect, it } from "vitest";
import {
  TextTemplateProcessor,
  haveRegisteredTextTemplateDirective,
  registerTextTemplateDirective,
  unregisterTextTemplateDirective,
} from "./template-processor";

// ── helpers ──────────────────────────────────────────────────────────────────

function proc(
  missingKey?: "keep" | "empty" | "error" | ((k: string) => string),
) {
  return new TextTemplateProcessor(missingKey ? { missingKey } : {});
}

// ── identifier substitution ───────────────────────────────────────────────────

describe("TextTemplateProcessor — identifier substitution", () => {
  it("replaces a simple {{key}}", () => {
    expect(proc().expand("Hello, {{name}}!", { name: "World" })).toBe(
      "Hello, World!",
    );
  });

  it("handles {{ key }} with spaces", () => {
    expect(proc().expand("Hello, {{ name }}!", { name: "World" })).toBe(
      "Hello, World!",
    );
  });

  it("replaces multiple keys", () => {
    expect(proc().expand("{{a}} and {{b}}", { a: "foo", b: "bar" })).toBe(
      "foo and bar",
    );
  });

  it("converts numbers to string", () => {
    expect(proc().expand("{{n}}", { n: 42 })).toBe("42");
  });

  it("converts null to empty string", () => {
    expect(proc().expand("{{v}}", { v: null })).toBe("");
  });

  it("converts undefined to empty string", () => {
    expect(proc().expand("{{v}}", { v: undefined })).toBe("");
  });

  it("does not re-process substituted values containing {{", () => {
    expect(proc().expand("{{a}}", { a: "{{b}}", b: "SHOULD NOT APPEAR" })).toBe(
      "{{b}}",
    );
  });
});

// ── missing key behaviour ─────────────────────────────────────────────────────

describe("TextTemplateProcessor — missing key behaviour", () => {
  it("defaults to 'keep' — leaves {{key}} in place", () => {
    expect(proc().expand("{{missing}}", {})).toBe("{{missing}}");
  });

  it("'keep' leaves token in place", () => {
    expect(proc("keep").expand("{{x}}", {})).toBe("{{x}}");
  });

  it("'empty' replaces with empty string", () => {
    expect(proc("empty").expand("{{x}}", {})).toBe("");
  });

  it("'error' throws RangeError", () => {
    expect(() => proc("error").expand("{{x}}", {})).toThrow(RangeError);
  });

  it("'error' message includes key name", () => {
    expect(() => proc("error").expand("{{myKey}}", {})).toThrow("myKey");
  });

  it("function handler receives key and its return value is used", () => {
    const result = proc((k) => `[${k}]`).expand("{{x}}", {});
    expect(result).toBe("[x]");
  });
});

// ── @if block ─────────────────────────────────────────────────────────────────

describe("TextTemplateProcessor — @if / @endif", () => {
  it("renders body when condition is truthy", () => {
    expect(proc().expand("{{ @if show }}yes{{ @endif }}", { show: true })).toBe(
      "yes",
    );
  });

  it("suppresses body when condition is falsy", () => {
    expect(
      proc().expand("{{ @if show }}yes{{ @endif }}", { show: false }),
    ).toBe("");
  });

  it("treats non-empty array as truthy", () => {
    expect(
      proc().expand("{{ @if items }}has items{{ @endif }}", {
        items: [1, 2],
      }),
    ).toBe("has items");
  });

  it("treats empty array as falsy", () => {
    expect(
      proc().expand("{{ @if items }}has items{{ @endif }}", { items: [] }),
    ).toBe("");
  });

  it("treats 0 as falsy", () => {
    expect(proc().expand("{{ @if n }}yes{{ @endif }}", { n: 0 })).toBe("");
  });

  it("treats non-zero number as truthy", () => {
    expect(proc().expand("{{ @if n }}yes{{ @endif }}", { n: 1 })).toBe("yes");
  });

  it("expands identifiers inside the body", () => {
    expect(
      proc().expand("{{ @if ok }}Hello, {{ name }}!{{ @endif }}", {
        ok: true,
        name: "Alice",
      }),
    ).toBe("Hello, Alice!");
  });

  it("missing condition key is falsy (keep mode)", () => {
    expect(proc().expand("{{ @if missing }}yes{{ @endif }}", {})).toBe("");
  });

  it("works alongside plain identifiers outside the block", () => {
    expect(
      proc().expand("{{ greeting }}{{ @if show }}, world{{ @endif }}!", {
        greeting: "Hello",
        show: true,
      }),
    ).toBe("Hello, world!");
  });
});

// ── @loop block ───────────────────────────────────────────────────────────────

describe("TextTemplateProcessor — @loop / @endloop", () => {
  it("iterates over an array of objects", () => {
    expect(
      proc().expand("{{ @loop items }}- {{ name }}\n{{ @endloop }}", {
        items: [{ name: "Alice" }, { name: "Bob" }],
      }),
    ).toBe("- Alice\n- Bob\n");
  });

  it("returns empty string for an empty array", () => {
    expect(
      proc().expand("{{ @loop items }}x{{ @endloop }}", { items: [] }),
    ).toBe("");
  });

  it("returns empty string when key is null", () => {
    expect(
      proc().expand("{{ @loop items }}x{{ @endloop }}", { items: null }),
    ).toBe("");
  });

  it("wraps scalar items as { value }", () => {
    expect(
      proc().expand("{{ @loop nums }}{{value}} {{ @endloop }}", {
        nums: [1, 2, 3],
      }),
    ).toBe("1 2 3 ");
  });

  it("throws TypeError when key is not an array", () => {
    expect(() =>
      proc().expand("{{ @loop x }}y{{ @endloop }}", { x: "not-an-array" }),
    ).toThrow(TypeError);
  });

  it("two consecutive loops work independently", () => {
    const tpl =
      "{{ @loop a }}{{ v }}{{ @endloop }}/{{ @loop b }}{{ v }}{{ @endloop }}";
    expect(
      proc().expand(tpl, {
        a: [{ v: "1" }, { v: "2" }],
        b: [{ v: "A" }, { v: "B" }],
      }),
    ).toBe("12/AB");
  });
});

// ── block + outer context ─────────────────────────────────────────────────────

describe("TextTemplateProcessor — blocks use outer context", () => {
  it("@if body can access outer context keys", () => {
    expect(
      proc().expand("{{ @if show }}{{ greeting }}{{ @endif }}", {
        show: true,
        greeting: "hi",
      }),
    ).toBe("hi");
  });
});

// ── nesting ───────────────────────────────────────────────────────────────────

describe("TextTemplateProcessor — nesting", () => {
  // ── @if inside @loop ──────────────────────────────────────────────────────

  it("@if nested inside @loop — filters items", () => {
    expect(
      proc().expand(
        "{{ @loop items }}{{ @if active }}- {{ name }}\n{{ @endif }}{{ @endloop }}",
        {
          items: [
            { name: "Alice", active: true },
            { name: "Bob", active: false },
            { name: "Eve", active: true },
          ],
        },
      ),
    ).toBe("- Alice\n- Eve\n");
  });

  it("@loop nested inside @if — skips loop when condition is false", () => {
    expect(
      proc().expand(
        "{{ @if show }}{{ @loop items }}{{ name }},{{ @endloop }}{{ @endif }}",
        { show: false, items: [{ name: "A" }] },
      ),
    ).toBe("");
  });

  it("@loop nested inside @if — iterates when condition is true", () => {
    expect(
      proc().expand(
        "{{ @if show }}{{ @loop items }}{{ name }},{{ @endloop }}{{ @endif }}",
        { show: true, items: [{ name: "A" }, { name: "B" }] },
      ),
    ).toBe("A,B,");
  });

  // ── same-type nesting: @if ────────────────────────────────────────────────

  it("two-deep @if — both truthy", () => {
    expect(
      proc().expand(
        "{{ @if outer }}({{ @if inner }}yes{{ @endif }}){{ @endif }}",
        { outer: true, inner: true },
      ),
    ).toBe("(yes)");
  });

  it("two-deep @if — outer false suppresses everything", () => {
    expect(
      proc().expand(
        "{{ @if outer }}({{ @if inner }}yes{{ @endif }}){{ @endif }}",
        { outer: false, inner: true },
      ),
    ).toBe("");
  });

  it("two-deep @if — outer true, inner false", () => {
    expect(
      proc().expand(
        "{{ @if outer }}({{ @if inner }}yes{{ @endif }}){{ @endif }}",
        { outer: true, inner: false },
      ),
    ).toBe("()");
  });

  it("three-deep @if — all truthy", () => {
    expect(
      proc().expand(
        "{{ @if a }}{{ @if b }}{{ @if c }}deep{{ @endif }}{{ @endif }}{{ @endif }}",
        { a: true, b: true, c: true },
      ),
    ).toBe("deep");
  });

  it("three-deep @if — middle level false", () => {
    expect(
      proc().expand(
        "{{ @if a }}{{ @if b }}{{ @if c }}deep{{ @endif }}{{ @endif }}{{ @endif }}",
        { a: true, b: false, c: true },
      ),
    ).toBe("");
  });

  it("three-deep @if — outermost false", () => {
    expect(
      proc().expand(
        "{{ @if a }}{{ @if b }}{{ @if c }}deep{{ @endif }}{{ @endif }}{{ @endif }}",
        { a: false, b: true, c: true },
      ),
    ).toBe("");
  });

  // ── sibling same-type blocks inside a parent ──────────────────────────────

  it("two @if siblings inside outer @if — both truthy", () => {
    expect(
      proc().expand(
        "{{ @if outer }}{{ @if x }}X{{ @endif }}{{ @if y }}Y{{ @endif }}{{ @endif }}",
        { outer: true, x: true, y: true },
      ),
    ).toBe("XY");
  });

  it("two @if siblings inside outer @if — first false", () => {
    expect(
      proc().expand(
        "{{ @if outer }}{{ @if x }}X{{ @endif }}{{ @if y }}Y{{ @endif }}{{ @endif }}",
        { outer: true, x: false, y: true },
      ),
    ).toBe("Y");
  });

  it("two @if siblings with text between them inside outer @if", () => {
    expect(
      proc().expand(
        "{{ @if outer }}before{{ @if x }}X{{ @endif }}mid{{ @if y }}Y{{ @endif }}after{{ @endif }}",
        { outer: true, x: true, y: false },
      ),
    ).toBe("beforeXmidafter");
  });

  it("three consecutive @if siblings at root level", () => {
    expect(
      proc().expand(
        "{{ @if a }}A{{ @endif }}{{ @if b }}B{{ @endif }}{{ @if c }}C{{ @endif }}",
        { a: true, b: false, c: true },
      ),
    ).toBe("AC");
  });

  // ── same-type nesting: @loop ──────────────────────────────────────────────

  it("two-deep @loop — matrix expansion", () => {
    expect(
      proc().expand(
        "{{ @loop rows }}[{{ @loop cols }}{{ v }}{{ @endloop }}]{{ @endloop }}",
        {
          rows: [
            { cols: [{ v: "1" }, { v: "2" }] },
            { cols: [{ v: "3" }, { v: "4" }] },
          ],
        },
      ),
    ).toBe("[12][34]");
  });

  it("three-deep @loop — cube expansion", () => {
    expect(
      proc().expand(
        "{{ @loop a }}{{ @loop b }}{{ @loop c }}{{ v }}{{ @endloop }}|{{ @endloop }}/{{ @endloop }}",
        {
          a: [
            {
              b: [{ c: [{ v: "1" }, { v: "2" }] }, { c: [{ v: "3" }] }],
            },
          ],
        },
      ),
    ).toBe("12|3|/");
  });

  it("two @loop siblings inside outer @loop", () => {
    expect(
      proc().expand(
        "{{ @loop rows }}{{ @loop as }}{{ v }}{{ @endloop }}-{{ @loop bs }}{{ v }}{{ @endloop }}\n{{ @endloop }}",
        {
          rows: [
            { as: [{ v: "A" }, { v: "B" }], bs: [{ v: "1" }] },
            { as: [{ v: "C" }], bs: [{ v: "2" }, { v: "3" }] },
          ],
        },
      ),
    ).toBe("AB-1\nC-23\n");
  });

  // ── mixed three-level nesting ─────────────────────────────────────────────

  it("@if inside @loop inside @if — three levels mixed", () => {
    expect(
      proc().expand(
        "{{ @if enabled }}{{ @loop items }}{{ @if active }}{{ name }}{{ @endif }},{{ @endloop }}{{ @endif }}",
        {
          enabled: true,
          items: [
            { name: "A", active: true },
            { name: "B", active: false },
          ],
        },
      ),
    ).toBe("A,,");
  });

  it("identifiers resolve correctly at each nesting level", () => {
    expect(
      proc().expand(
        "{{ label }}:{{ @if show }}{{ @loop items }}-{{ name }}{{ @if active }}*{{ @endif }}{{ @endloop }}{{ @endif }}",
        {
          label: "list",
          show: true,
          items: [
            { name: "A", active: true },
            { name: "B", active: false },
          ],
        },
      ),
    ).toBe("list:-A*-B");
  });
});

// ── unknown directive ─────────────────────────────────────────────────────────

describe("TextTemplateProcessor — unknown directive", () => {
  it("throws RangeError for an unknown block directive", () => {
    expect(() => proc().expand("{{ @foo bar }}x{{ @endfoo }}", {})).toThrow(
      RangeError,
    );
  });

  it("error message includes the directive name", () => {
    expect(() => proc().expand("{{ @foo bar }}x{{ @endfoo }}", {})).toThrow(
      "@foo",
    );
  });
});

// ── custom directive registration ─────────────────────────────────────────────

describe("TextTemplateProcessor — custom directive registration", () => {
  afterEach(() => {
    unregisterTextTemplateDirective("upper");
    unregisterTextTemplateDirective("repeat");
    unregisterTextTemplateDirective("greet");
    unregisterTextTemplateDirective("shout");
  });

  it("registered directive is called", () => {
    registerTextTemplateDirective("upper", {
      isSelfClosing: () => false,
      handle: (_arg, body, ctx, p) => p.expand(body, ctx).toUpperCase(),
    });
    expect(
      proc().expand("{{ @upper }}hello {{ name }}{{ @endupper }}", {
        name: "world",
      }),
    ).toBe("HELLO WORLD");
  });

  it("directive receives arg and context", () => {
    registerTextTemplateDirective("repeat", {
      isSelfClosing: () => false,
      handle: (arg, body, ctx, p) =>
        p.expand(body, ctx).repeat(Number(ctx[arg]) || 1),
    });
    expect(
      proc().expand("{{ @repeat times }}ha{{ @endrepeat }}", { times: 3 }),
    ).toBe("hahaha");
  });

  it("all processor instances share the registry", () => {
    registerTextTemplateDirective("upper", {
      isSelfClosing: () => false,
      handle: (_arg, body, ctx, p) => p.expand(body, ctx).toUpperCase(),
    });
    const a = new TextTemplateProcessor();
    const b = new TextTemplateProcessor({ missingKey: "empty" });
    expect(a.expand("{{ @upper }}x{{ @endupper }}", {})).toBe("X");
    expect(b.expand("{{ @upper }}x{{ @endupper }}", {})).toBe("X");
  });

  it("built-in @if is registered", () => {
    expect(haveRegisteredTextTemplateDirective("if")).toBe(true);
  });

  it("built-in @loop is registered", () => {
    expect(haveRegisteredTextTemplateDirective("loop")).toBe(true);
  });
});

// ── standalone directives (no close tag) ──────────────────────────────────────

describe("TextTemplateProcessor — standalone directives", () => {
  afterEach(() => {
    unregisterTextTemplateDirective("greet");
    unregisterTextTemplateDirective("shout");
  });

  it("standalone tag calls handler with empty body", () => {
    registerTextTemplateDirective("greet", {
      isSelfClosing: () => true,
      handle: (_arg, body) => {
        expect(body).toBe("");
        return "hi";
      },
    });
    expect(proc().expand("{{ @greet }}", {})).toBe("hi");
  });

  it("standalone tag receives its argument", () => {
    registerTextTemplateDirective("shout", {
      isSelfClosing: () => true,
      handle: (arg, _body, ctx) => String(ctx[arg] ?? arg).toUpperCase(),
    });
    expect(proc().expand("{{ @shout name }}", { name: "world" })).toBe("WORLD");
  });

  it("standalone tag can appear inline with text", () => {
    registerTextTemplateDirective("greet", {
      isSelfClosing: () => true,
      handle: () => "Hello",
    });
    expect(proc().expand("Say: {{ @greet }}!", {})).toBe("Say: Hello!");
  });

  it("block directive still works when close tag present", () => {
    registerTextTemplateDirective("shout", {
      isSelfClosing: () => false,
      handle: (_arg, body, ctx, p) => p.expand(body, ctx).toUpperCase(),
    });
    expect(
      proc().expand("{{ @shout }}hello {{ name }}{{ @endshout }}", {
        name: "world",
      }),
    ).toBe("HELLO WORLD");
  });

  it("block directive missing its close tag throws SyntaxError", () => {
    registerTextTemplateDirective("shout", {
      isSelfClosing: () => false,
      handle: (_arg, body, ctx, p) => p.expand(body, ctx).toUpperCase(),
    });
    expect(() => proc().expand("{{ @shout }}hello world", {})).toThrow(
      SyntaxError,
    );
  });

  it("SyntaxError message names the missing close tag", () => {
    registerTextTemplateDirective("shout", {
      isSelfClosing: () => false,
      handle: () => "",
    });
    expect(() => proc().expand("{{ @shout }}hello world", {})).toThrow(
      "@endshout",
    );
  });

  it("unknown directive (no close tag) throws RangeError", () => {
    expect(() => proc().expand("{{ @unknown }}", {})).toThrow(RangeError);
  });

  it("unknown directive (with close tag) throws RangeError", () => {
    expect(() =>
      proc().expand("{{ @unknown }}body{{ @endunknown }}", {}),
    ).toThrow(RangeError);
  });
});
