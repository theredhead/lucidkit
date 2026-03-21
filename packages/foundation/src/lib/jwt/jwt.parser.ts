import type { JwtHeader, JwtPayload, JwtToken } from "./jwt.types";

/**
 * Decode a base64url-encoded string to a UTF-8 string.
 *
 * Handles the base64url → base64 conversion (padding, URL-safe
 * characters) before delegating to `atob`.
 *
 * @param base64url - A base64url-encoded string.
 * @returns The decoded UTF-8 string.
 *
 * @internal
 */
function base64UrlDecode(base64url: string): string {
  // Replace URL-safe characters with standard base64 characters
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");

  // Restore padding
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";

  // Decode and handle multi-byte UTF-8
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Parse a single base64url-encoded JWT segment into a typed object.
 *
 * @param segment - A base64url-encoded JSON segment.
 * @param label   - Human-readable segment name for error messages.
 * @returns The parsed object.
 * @throws {Error} If the segment is not valid base64url or valid JSON.
 *
 * @internal
 */
function parseSegment<T>(segment: string, label: string): T {
  try {
    const json = base64UrlDecode(segment);
    return JSON.parse(json) as T;
  } catch {
    throw new Error(`JWT ${label} is not valid base64url-encoded JSON.`);
  }
}

/**
 * Decode a compact-serialisation JWT string into its constituent
 * parts: header, payload, and raw signature.
 *
 * **This function does NOT verify the token's signature.** Signature
 * verification requires access to the signing key or a JWKS endpoint
 * and is the responsibility of the consumer's backend or auth
 * library.
 *
 * @param token - A JWT in compact serialisation
 *   (`header.payload.signature`).
 * @returns A {@link JwtToken} with decoded header and payload.
 * @throws {Error} If the token structure is malformed or the JSON is
 *   invalid.
 *
 * @example
 * ```ts
 * import { decodeJwt } from '@theredhead/foundation';
 *
 * const jwt = decodeJwt(rawTokenString);
 * console.log(jwt.payload.sub);  // "user-123"
 * console.log(jwt.payload.exp);  // 1742601600
 * ```
 */
export function decodeJwt<TPayload extends JwtPayload = JwtPayload>(
  token: string,
): JwtToken<TPayload> {
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("JWT must be a non-empty string.");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error(
      `JWT must have exactly 3 segments (header.payload.signature), received ${parts.length}.`,
    );
  }

  const [headerSegment, payloadSegment, signature] = parts;

  const header = parseSegment<JwtHeader>(headerSegment, "header");
  const payload = parseSegment<TPayload>(payloadSegment, "payload");

  return {
    header,
    payload,
    signature,
    raw: token,
  };
}

/**
 * Extract a specific claim value from a JWT payload.
 *
 * This is a convenience wrapper around {@link decodeJwt} for
 * quick one-off claim reads.
 *
 * @param token - A JWT in compact serialisation.
 * @param claim - The claim name to extract.
 * @returns The claim value, or `undefined` if absent.
 *
 * @example
 * ```ts
 * const sub = extractClaim(rawToken, 'sub');   // "user-123"
 * const role = extractClaim(rawToken, 'role'); // "editor"
 * ```
 */
export function extractClaim<T = unknown>(
  token: string,
  claim: string,
): T | undefined {
  const { payload } = decodeJwt(token);
  return payload[claim] as T | undefined;
}

/**
 * Extract an array of permission strings from a JWT payload.
 *
 * Many authorization systems encode permissions in a custom claim
 * (e.g. `"permissions"`, `"scope"`, `"roles"`). This helper
 * normalises the value to a `readonly string[]`.
 *
 * @param token     - A JWT in compact serialisation.
 * @param claimName - The claim that holds the permissions.
 *   Defaults to `"permissions"`.
 * @returns A readonly array of permission strings.
 *   Returns an empty array if the claim is absent or not an array.
 *
 * @example
 * ```ts
 * const perms = extractPermissions(rawToken);
 * // ["user.read", "user.write"]
 *
 * const scopes = extractPermissions(rawToken, 'scope');
 * // ["openid", "profile"]
 * ```
 */
export function extractPermissions(
  token: string,
  claimName = "permissions",
): readonly string[] {
  const value = extractClaim(token, claimName);

  // Handle space-delimited scope strings (OAuth 2.0 convention)
  if (typeof value === "string") {
    return value.split(/\s+/).filter((s) => s.length > 0);
  }

  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }

  return [];
}
