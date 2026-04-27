/**
 * Controls how a template processor reacts when a block references a key that
 * does not exist in the expansion context.
 *
 * - `"keep"` keeps the original XML block in place.
 * - `"empty"` replaces the block with an empty string.
 * - `"error"` throws a `RangeError`.
 * - A function receives the missing key and returns a replacement string.
 */
export type MissingKeyBehavior =
  | "keep"
  | "empty"
  | "error"
  | ((key: string) => string);

/**
 * Options for XML template processing.
 */
export interface TextTemplateOptions {

  /**
   * How to handle a missing key during block expansion.
   * Defaults to `"keep"`.
   */
  readonly missingKey?: MissingKeyBehavior;
}

/**
 * A parsed XML template document.
 */
export interface TemplateDocument {

  /**
   * Top-level text and block nodes.
   */
  readonly children: readonly TemplateNode[];
}

/**
 * Any parsed template node.
 */
export type TemplateNode = TemplateTextNode | TemplateBlockNode;

/**
 * A literal text/content node.
 */
export interface TemplateTextNode {

  /**
   * Node discriminator.
   */
  readonly kind: "text";

  /**
   * Literal text content.
   */
  readonly text: string;
}

/**
 * A block node. All template constructs, including placeholders, use this
 * single representation.
 */
export interface TemplateBlockNode {

  /**
   * Node discriminator.
   */
  readonly kind: "block";

  /**
   * XML tag name.
   */
  readonly name: string;

  /**
   * XML attributes keyed by attribute name.
   */
  readonly attributes: Readonly<Record<string, string>>;

  /**
   * Child nodes for container blocks.
   */
  readonly children: readonly TemplateNode[];

  /**
   * Whether the block was parsed or created as self-closing.
   */
  readonly selfClosing: boolean;
}

/**
 * Controls whether a block must be self-closing or may contain children.
 */
export type TemplateBlockContentModel = "self-closing" | "container" | "any";

/**
 * Context passed to block providers during expansion.
 */
export interface TemplateBlockExpansionContext {

  /**
   * Current data context.
   */
  readonly data: Record<string, unknown>;

  /**
   * Active processor, useful for expanding child nodes with a modified data
   * context.
   */
  readonly processor: ITextTemplateProcessor;
}

/**
 * Runtime and validation contract for a named XML template block.
 */
export interface TemplateBlockProvider {

  /**
   * XML tag name handled by this provider.
   */
  readonly name: string;

  /**
   * Whether this block is self-closing, a container, or accepts either shape.
   */
  readonly contentModel: TemplateBlockContentModel;

  /**
   * Required XML attribute names.
   */
  readonly requiredAttributes?: readonly string[];

  /**
   * Optional XML attribute names. When omitted, any extra attributes are
   * accepted.
   */
  readonly optionalAttributes?: readonly string[];

  /**
   * Expands the block into output content.
   */
  expand(
    block: TemplateBlockNode,
    context: TemplateBlockExpansionContext,
  ): string;
}

/**
 * Contract for XML template processors.
 */
export interface ITextTemplateProcessor {

  /**
   * Fully expands a template string against the given context.
   */
  expand(template: string, context: Record<string, unknown>): string;

  /**
   * Expands an already-parsed document.
   */
  expandDocument(
    document: TemplateDocument,
    context: Record<string, unknown>,
  ): string;

  /**
   * Expands a node collection against the given context.
   */
  expandNodes(
    nodes: readonly TemplateNode[],
    context: Record<string, unknown>,
  ): string;

  /**
   * Processes one XML block by dispatching to the registered block provider.
   */
  processBlock(
    block: TemplateBlockNode,
    context: Record<string, unknown>,
  ): string;

  /**
   * Resolves a data key for built-in replacement-style blocks.
   */
  processIdentifier(key: string, context: Record<string, unknown>): string;
}

/**
 * Legacy directive contract retained only as a source-compatible type alias
 * for older consumers. XML block providers are the runtime extension point.
 *
 * @deprecated Use {@link TemplateBlockProvider}.
 */
export interface ITextTemplateDirective {

  /**
   * Returns whether the directive is self-closing.
   */
  isSelfClosing(): boolean;

  /**
   * Handles the directive.
   */
  handle(
    arg: string,
    body: string,
    context: Record<string, unknown>,
    processor: ITextTemplateProcessor,
  ): string;
}

/** @internal */
const TEMPLATE_ROOT = "template-root";

/** @internal */
const parserErrorSelector = "parsererror";

/** @internal */
const blockProviders = new Map<string, TemplateBlockProvider>();

/**
 * Registers an XML template block provider.
 *
 * Calling this again with the same block name replaces the existing provider.
 */
export function registerTextTemplateBlockProvider(
  provider: TemplateBlockProvider,
): void {
  blockProviders.set(provider.name, provider);
}

/**
 * Removes a previously registered XML template block provider.
 */
export function unregisterTextTemplateBlockProvider(name: string): void {
  blockProviders.delete(name);
}

/**
 * Returns `true` when a provider for the XML block name is registered.
 */
export function haveRegisteredTextTemplateBlockProvider(name: string): boolean {
  return blockProviders.has(name);
}

/**
 * Returns all currently registered XML template block providers.
 */
export function getRegisteredTextTemplateBlockProviders(): TemplateBlockProvider[] {
  return Array.from(blockProviders.values());
}

/**
 * Registers a legacy directive by adapting it to the XML block provider
 * contract.
 *
 * @deprecated Use {@link registerTextTemplateBlockProvider}.
 */
export function registerTextTemplateDirective(
  key: string,
  directive: ITextTemplateDirective,
): void {
  registerTextTemplateBlockProvider({
    name: key,
    contentModel: directive.isSelfClosing() ? "self-closing" : "container",
    expand: (block, context) =>
      directive.handle(
        block.attributes["arg"] ?? "",
        context.processor.expandNodes(block.children, context.data),
        context.data,
        context.processor,
      ),
  });
}

/**
 * Removes a legacy directive/block provider by key.
 *
 * @deprecated Use {@link unregisterTextTemplateBlockProvider}.
 */
export function unregisterTextTemplateDirective(key: string): void {
  unregisterTextTemplateBlockProvider(key);
}

/**
 * Returns `true` if a legacy directive/block provider is registered.
 *
 * @deprecated Use {@link haveRegisteredTextTemplateBlockProvider}.
 */
export function haveRegisteredTextTemplateDirective(key: string): boolean {
  return haveRegisteredTextTemplateBlockProvider(key);
}

/**
 * Returns registered legacy directive-compatible providers.
 *
 * @deprecated Use {@link getRegisteredTextTemplateBlockProviders}.
 */
export function getRegisteredTextTemplateDirectives(): ITextTemplateDirective[] {
  return getRegisteredTextTemplateBlockProviders().map((provider) => ({
    isSelfClosing: () => provider.contentModel === "self-closing",
    handle: (_arg, body, context, processor) =>
      provider.expand(
        {
          kind: "block",
          name: provider.name,
          attributes: {},
          children: [{ kind: "text", text: body }],
          selfClosing: provider.contentModel === "self-closing",
        },
        { data: context, processor },
      ),
  }));
}

/**
 * Parses XML template strings into the canonical document model.
 */
export class XmlTemplateParser {

  /**
   * Parses an XML template fragment.
   */
  public parse(template: string): TemplateDocument {
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      `<${TEMPLATE_ROOT}>${template}</${TEMPLATE_ROOT}>`,
      "application/xml",
    );
    const parserError = xml.querySelector(parserErrorSelector);
    if (parserError) {
      throw new SyntaxError(
        `XmlTemplateParser: malformed XML template (${parserError.textContent?.trim() ?? "unknown parser error"})`,
      );
    }
    const root = xml.documentElement;
    if (!root || root.nodeName !== TEMPLATE_ROOT) {
      throw new SyntaxError("XmlTemplateParser: missing template root");
    }
    return {
      children: Array.from(root.childNodes)
        .map((node) => this.parseNode(node))
        .filter((node): node is TemplateNode => node !== null),
    };
  }

  /** @internal */
  private parseNode(node: Node): TemplateNode | null {
    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
      return { kind: "text", text: node.textContent ?? "" };
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }
    const element = node as Element;
    const attributes: Record<string, string> = {};
    for (const attr of Array.from(element.attributes)) {
      attributes[attr.name] = attr.value;
    }
    return {
      kind: "block",
      name: element.tagName,
      attributes,
      children: Array.from(element.childNodes)
        .map((child) => this.parseNode(child))
        .filter((child): child is TemplateNode => child !== null),
      selfClosing: element.childNodes.length === 0,
    };
  }
}

/**
 * Serializes parsed template documents back to canonical XML.
 */
export class XmlTemplateSerializer {

  /**
   * Serializes a complete template document.
   */
  public serialize(document: TemplateDocument): string {
    return this.serializeNodes(document.children);
  }

  /**
   * Serializes a node collection.
   */
  public serializeNodes(nodes: readonly TemplateNode[]): string {
    return nodes.map((node) => this.serializeNode(node)).join("");
  }

  /**
   * Serializes a single template node.
   */
  public serializeNode(node: TemplateNode): string {
    if (node.kind === "text") {
      return this.escapeText(node.text);
    }
    const attrs = Object.entries(node.attributes)
      .map(([key, value]) => ` ${key}="${this.escapeAttribute(value)}"`)
      .join("");
    if (node.selfClosing || node.children.length === 0) {
      return `<${node.name}${attrs} />`;
    }
    return `<${node.name}${attrs}>${this.serializeNodes(node.children)}</${node.name}>`;
  }

  /** @internal */
  private escapeText(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  /** @internal */
  private escapeAttribute(value: string): string {
    return this.escapeText(value).replace(/"/g, "&quot;");
  }
}

/**
 * XML block template processor.
 */
export class XmlTemplateProcessor implements ITextTemplateProcessor {
  private readonly missingKeyBehavior: MissingKeyBehavior;

  private readonly parser = new XmlTemplateParser();

  private readonly serializer = new XmlTemplateSerializer();

  public constructor(options: TextTemplateOptions = {}) {
    this.missingKeyBehavior = options.missingKey ?? "keep";
  }

  /**
   * Fully expands an XML template string.
   */
  public expand(template: string, context: Record<string, unknown>): string {
    return this.expandDocument(this.parser.parse(template), context);
  }

  /**
   * Fully expands an already parsed template document.
   */
  public expandDocument(
    document: TemplateDocument,
    context: Record<string, unknown>,
  ): string {
    return this.expandNodes(document.children, context);
  }

  /**
   * Expands a node collection.
   */
  public expandNodes(
    nodes: readonly TemplateNode[],
    context: Record<string, unknown>,
  ): string {
    return nodes.map((node) => this.expandNode(node, context)).join("");
  }

  /**
   * Dispatches one block to its registered provider.
   */
  public processBlock(
    block: TemplateBlockNode,
    context: Record<string, unknown>,
  ): string {
    const provider = blockProviders.get(block.name);
    if (!provider) {
      throw new RangeError(
        `XmlTemplateProcessor: unknown block <${block.name}>`,
      );
    }
    this.validateBlock(block, provider);
    return provider.expand(block, { data: context, processor: this });
  }

  /**
   * Resolves a context key for built-in replacement blocks.
   */
  public processIdentifier(
    key: string,
    context: Record<string, unknown>,
  ): string {
    if (Object.prototype.hasOwnProperty.call(context, key)) {
      const val = context[key];
      return val == null ? "" : String(val);
    }
    return this.resolveMissing(key);
  }

  /** @internal */
  private expandNode(
    node: TemplateNode,
    context: Record<string, unknown>,
  ): string {
    if (node.kind === "text") return node.text;
    return this.processBlock(node, context);
  }

  /** @internal */
  private validateBlock(
    block: TemplateBlockNode,
    provider: TemplateBlockProvider,
  ): void {
    if (provider.contentModel === "self-closing" && block.children.length > 0) {
      throw new SyntaxError(
        `XmlTemplateProcessor: <${block.name}> must be self-closing`,
      );
    }
    if (provider.contentModel === "container" && block.selfClosing) {
      throw new SyntaxError(
        `XmlTemplateProcessor: <${block.name}> must contain a closing tag`,
      );
    }
    for (const attr of provider.requiredAttributes ?? []) {
      if (!Object.prototype.hasOwnProperty.call(block.attributes, attr)) {
        throw new SyntaxError(
          `XmlTemplateProcessor: <${block.name}> missing required "${attr}" attribute`,
        );
      }
    }
  }

  /** @internal */
  private resolveMissing(key: string): string {
    if (this.missingKeyBehavior === "keep") {
      return this.serializer.serializeNode({
        kind: "block",
        name: "placeholder",
        attributes: { key },
        children: [],
        selfClosing: true,
      });
    }
    if (this.missingKeyBehavior === "empty") return "";
    if (this.missingKeyBehavior === "error") {
      throw new RangeError(`XmlTemplateProcessor: missing key "${key}"`);
    }
    return this.missingKeyBehavior(key);
  }
}

/**
 * Default processor name retained for consumers that already import
 * `TextTemplateProcessor`. The implementation is XML-only.
 */
export class TextTemplateProcessor extends XmlTemplateProcessor {}

/** @internal */
function registerPassthroughBlock(name: string): void {
  registerTextTemplateBlockProvider({
    name,
    contentModel: "any",
    expand: (block, context) => {
      const attrs = Object.entries(block.attributes)
        .map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`)
        .join("");
      if (block.selfClosing || block.children.length === 0) {
        return `<${block.name}${attrs} />`;
      }
      return `<${block.name}${attrs}>${context.processor.expandNodes(
        block.children,
        context.data,
      )}</${block.name}>`;
    },
  });
}

/** @internal */
function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

/** @internal */
function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;");
}

// ── built-in XML block providers ─────────────────────────────────────────────

registerTextTemplateBlockProvider({
  name: "placeholder",
  contentModel: "self-closing",
  requiredAttributes: ["key"],
  expand: (block, context) =>
    context.processor.processIdentifier(block.attributes["key"] ?? "", context.data),
});

registerTextTemplateBlockProvider({
  name: "if",
  contentModel: "container",
  requiredAttributes: ["test"],
  expand: (block, context) => {
    const val = context.data[block.attributes["test"] ?? ""];
    const truthy = Array.isArray(val) ? val.length > 0 : Boolean(val);
    return truthy ? context.processor.expandNodes(block.children, context.data) : "";
  },
});

registerTextTemplateBlockProvider({
  name: "loop",
  contentModel: "container",
  requiredAttributes: ["items"],
  expand: (block, context) => {
    const items = context.data[block.attributes["items"] ?? ""];
    if (items == null) return "";
    if (!Array.isArray(items)) {
      throw new TypeError(
        `XmlTemplateProcessor <loop>: "${block.attributes["items"] ?? ""}" is not an array (got ${typeof items})`,
      );
    }
    return items
      .map((item) => {
        const itemCtx: Record<string, unknown> =
          typeof item === "object" && item !== null
            ? { ...context.data, ...(item as Record<string, unknown>) }
            : { ...context.data, value: item };
        return context.processor.expandNodes(block.children, itemCtx);
      })
      .join("");
  },
});

for (const tag of [
  "a",
  "article",
  "b",
  "blockquote",
  "br",
  "caption",
  "code",
  "div",
  "del",
  "dl",
  "dt",
  "dd",
  "em",
  "figcaption",
  "figure",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "i",
  "img",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "s",
  "section",
  "span",
  "strike",
  "strong",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]) {
  registerPassthroughBlock(tag);
}
