/**
 * Standard JWT registered header fields (RFC 7515 / RFC 7519).
 *
 * Consumers may extend this with additional custom header claims by
 * intersecting with their own type.
 */
export interface JwtHeader {

  /** Algorithm used to sign the token (e.g. `"RS256"`, `"HS256"`). */
  readonly alg: string;

  /** Token type — almost always `"JWT"`. */
  readonly typ?: string;

  /** Key ID hint for signature verification. */
  readonly kid?: string;

  /** Allow arbitrary additional header claims. */
  readonly [key: string]: unknown;
}

/**
 * Standard JWT registered payload claims (RFC 7519 §4.1).
 *
 * All registered claims are optional. The index signature allows
 * consumers to read custom claims without casting.
 */
export interface JwtPayload {

  /** Issuer — identifies the principal that issued the JWT. */
  readonly iss?: string;

  /** Subject — identifies the principal that is the subject. */
  readonly sub?: string;

  /** Audience — recipient(s) the JWT is intended for. */
  readonly aud?: string | readonly string[];

  /**
   * Expiration time — NumericDate (seconds since Unix epoch) after
   * which the JWT must not be accepted.
   */
  readonly exp?: number;

  /**
   * Not-before time — NumericDate before which the JWT must not be
   * accepted.
   */
  readonly nbf?: number;

  /**
   * Issued-at time — NumericDate when the JWT was issued.
   */
  readonly iat?: number;

  /** JWT ID — unique identifier for the token. */
  readonly jti?: string;

  /** Allow arbitrary additional payload claims. */
  readonly [key: string]: unknown;
}

/**
 * A decoded JWT token with typed header and payload.
 *
 * The raw signature is preserved as-is (base64url-encoded) because
 * signature *verification* is out of scope — it requires server-side
 * keys or a JWKS endpoint.
 */
export interface JwtToken<TPayload extends JwtPayload = JwtPayload> {

  /** Decoded JOSE header. */
  readonly header: JwtHeader;

  /** Decoded payload claims. */
  readonly payload: TPayload;

  /** Raw base64url-encoded signature (not verified). */
  readonly signature: string;

  /** The original compact-serialisation string. */
  readonly raw: string;
}

/**
 * Severity levels for JWT validation results.
 */
export type JwtValidationSeverity = "error" | "warning";

/**
 * A single validation issue found when inspecting a JWT.
 */
export interface JwtValidationIssue {

  /** Machine-readable error code. */
  readonly code: JwtValidationCode;

  /** Human-readable description of the issue. */
  readonly message: string;

  /** Whether this issue should prevent the token from being used. */
  readonly severity: JwtValidationSeverity;
}

/**
 * Machine-readable validation codes returned by the JWT validators.
 */
export type JwtValidationCode =
  | "MALFORMED"
  | "INVALID_JSON"
  | "MISSING_ALG"
  | "TOKEN_EXPIRED"
  | "TOKEN_NOT_YET_VALID"
  | "ISSUER_MISMATCH"
  | "AUDIENCE_MISMATCH"
  | "MISSING_SUBJECT"
  | "MISSING_CLAIM";

/**
 * Options for {@link validateJwt}.
 *
 * All fields are optional — only the checks whose options are
 * provided will be executed.
 */
export interface JwtValidationOptions {

  /**
   * If set, the token's `iss` claim must match this value.
   */
  readonly issuer?: string;

  /**
   * If set, the token's `aud` claim must include this value.
   */
  readonly audience?: string;

  /**
   * If `true`, the token must have a `sub` claim.
   */
  readonly requireSubject?: boolean;

  /**
   * Additional claim names that must be present in the payload.
   */
  readonly requiredClaims?: readonly string[];

  /**
   * Clock tolerance in **seconds** for `exp` and `nbf` checks.
   * Defaults to `0`.
   */
  readonly clockToleranceSeconds?: number;

  /**
   * Reference timestamp in **seconds since epoch** for time-based
   * checks. Defaults to `Math.floor(Date.now() / 1000)`.
   */
  readonly nowSeconds?: number;
}
