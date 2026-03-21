import type {
  JwtPayload,
  JwtToken,
  JwtValidationCode,
  JwtValidationIssue,
  JwtValidationOptions,
  JwtValidationSeverity,
} from "./jwt.types";

// ── Helpers ────────────────────────────────────────────────────────

/** @internal */
function issue(
  code: JwtValidationCode,
  message: string,
  severity: JwtValidationSeverity = "error",
): JwtValidationIssue {
  return { code, message, severity };
}

// ── Single-purpose validators ──────────────────────────────────────

/**
 * Check whether a decoded JWT is expired.
 *
 * @param payload              - The decoded JWT payload.
 * @param nowSeconds           - Current time in seconds since epoch.
 *   Defaults to `Math.floor(Date.now() / 1000)`.
 * @param clockToleranceSeconds - Grace period in seconds. Defaults to `0`.
 * @returns `true` if the token has an `exp` claim and it is in the past.
 *
 * @example
 * ```ts
 * if (isExpired(jwt.payload)) {
 *   // refresh or redirect to login
 * }
 * ```
 */
export function isExpired(
  payload: JwtPayload,
  nowSeconds: number = Math.floor(Date.now() / 1000),
  clockToleranceSeconds = 0,
): boolean {
  if (payload.exp === undefined) return false;
  return nowSeconds >= payload.exp + clockToleranceSeconds;
}

/**
 * Check whether a decoded JWT is not yet valid (the `nbf` claim is
 * in the future).
 *
 * @param payload              - The decoded JWT payload.
 * @param nowSeconds           - Current time in seconds since epoch.
 * @param clockToleranceSeconds - Grace period in seconds. Defaults to `0`.
 * @returns `true` if the token has an `nbf` claim and it is in the future.
 */
export function isNotYetValid(
  payload: JwtPayload,
  nowSeconds: number = Math.floor(Date.now() / 1000),
  clockToleranceSeconds = 0,
): boolean {
  if (payload.nbf === undefined) return false;
  return nowSeconds < payload.nbf - clockToleranceSeconds;
}

/**
 * Calculate the number of seconds until a JWT expires.
 *
 * @param payload    - The decoded JWT payload.
 * @param nowSeconds - Current time in seconds since epoch.
 * @returns Seconds remaining, or `Infinity` if there is no `exp` claim.
 *   A negative value means the token is already expired.
 *
 * @example
 * ```ts
 * const remaining = secondsUntilExpiry(jwt.payload);
 * if (remaining < 300) {
 *   // less than 5 minutes — trigger silent refresh
 * }
 * ```
 */
export function secondsUntilExpiry(
  payload: JwtPayload,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): number {
  if (payload.exp === undefined) return Infinity;
  return payload.exp - nowSeconds;
}

// ── Composite validator ────────────────────────────────────────────

/**
 * Validate a decoded JWT against a set of configurable rules.
 *
 * Returns an array of {@link JwtValidationIssue} objects. An empty
 * array means the token passed all requested checks.
 *
 * This function does **not** verify the cryptographic signature.
 *
 * @param token   - A decoded {@link JwtToken}.
 * @param options - Which checks to perform and their parameters.
 * @returns An array of validation issues (empty = valid).
 *
 * @example
 * ```ts
 * const issues = validateJwt(jwt, {
 *   issuer: 'https://auth.example.com',
 *   audience: 'my-app',
 *   requireSubject: true,
 *   requiredClaims: ['role', 'permissions'],
 * });
 *
 * if (issues.length > 0) {
 *   console.warn('JWT validation failed:', issues);
 * }
 * ```
 */
export function validateJwt(
  token: JwtToken,
  options: JwtValidationOptions = {},
): readonly JwtValidationIssue[] {
  const issues: JwtValidationIssue[] = [];
  const {
    issuer,
    audience,
    requireSubject,
    requiredClaims,
    clockToleranceSeconds = 0,
    nowSeconds = Math.floor(Date.now() / 1000),
  } = options;

  const { header, payload } = token;

  // ── Header checks ──────────────────────────────────────────────

  if (!header.alg) {
    issues.push(issue("MISSING_ALG", 'JWT header is missing the "alg" field.'));
  }

  // ── Time-based checks ──────────────────────────────────────────

  if (isExpired(payload, nowSeconds, clockToleranceSeconds)) {
    issues.push(
      issue(
        "TOKEN_EXPIRED",
        `Token expired at ${payload.exp} (now: ${nowSeconds}, tolerance: ${clockToleranceSeconds}s).`,
      ),
    );
  }

  if (isNotYetValid(payload, nowSeconds, clockToleranceSeconds)) {
    issues.push(
      issue(
        "TOKEN_NOT_YET_VALID",
        `Token is not valid before ${payload.nbf} (now: ${nowSeconds}, tolerance: ${clockToleranceSeconds}s).`,
      ),
    );
  }

  // ── Issuer check ───────────────────────────────────────────────

  if (issuer !== undefined && payload.iss !== issuer) {
    const actualIss = payload.iss ?? "(none)";
    issues.push(
      issue(
        "ISSUER_MISMATCH",
        'Expected issuer "' + issuer + '", got "' + actualIss + '".',
      ),
    );
  }

  // ── Audience check ─────────────────────────────────────────────

  if (audience !== undefined) {
    const aud = payload.aud;
    const audArray =
      typeof aud === "string" ? [aud] : Array.isArray(aud) ? aud : [];
    if (!audArray.includes(audience)) {
      const actualAud = String(aud ?? "(none)");
      issues.push(
        issue(
          "AUDIENCE_MISMATCH",
          'Expected audience "' + audience + '", got "' + actualAud + '".',
        ),
      );
    }
  }

  // ── Subject check ──────────────────────────────────────────────

  if (requireSubject && !payload.sub) {
    issues.push(issue("MISSING_SUBJECT", 'Token is missing the "sub" claim.'));
  }

  // ── Required custom claims ─────────────────────────────────────

  if (requiredClaims) {
    for (const claim of requiredClaims) {
      if (payload[claim] === undefined) {
        issues.push(
          issue(
            "MISSING_CLAIM",
            `Token is missing the required "${claim}" claim.`,
          ),
        );
      }
    }
  }

  return issues;
}

/**
 * Convenience predicate: returns `true` when a decoded JWT passes
 * all validation checks defined in `options`.
 *
 * @param token   - A decoded {@link JwtToken}.
 * @param options - Validation rules.
 * @returns `true` if no issues were found.
 */
export function isJwtValid(
  token: JwtToken,
  options: JwtValidationOptions = {},
): boolean {
  return validateJwt(token, options).length === 0;
}
