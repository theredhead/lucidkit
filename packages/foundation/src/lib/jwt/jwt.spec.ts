import { describe, expect, it } from "vitest";

import { decodeJwt, extractClaim, extractPermissions } from "./jwt.parser";
import {
  isExpired,
  isJwtValid,
  isNotYetValid,
  secondsUntilExpiry,
  validateJwt,
} from "./jwt.validators";
import type { JwtPayload } from "./jwt.types";

// ── Test helpers ───────────────────────────────────────────────────

/** Encode a JS object as a base64url JWT segment. */
function encodeSegment(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Build a fake JWT from header and payload objects. */
function buildToken(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  signature = "fake-sig",
): string {
  return `${encodeSegment(header)}.${encodeSegment(payload)}.${signature}`;
}

const STANDARD_HEADER = { alg: "RS256", typ: "JWT" };

// ── decodeJwt ──────────────────────────────────────────────────────

describe("decodeJwt", () => {
  it("should decode a well-formed JWT", () => {
    const token = buildToken(STANDARD_HEADER, {
      sub: "user-123",
      iss: "test",
      exp: 9999999999,
    });

    const jwt = decodeJwt(token);

    expect(jwt.header.alg).toBe("RS256");
    expect(jwt.header.typ).toBe("JWT");
    expect(jwt.payload.sub).toBe("user-123");
    expect(jwt.payload.iss).toBe("test");
    expect(jwt.payload.exp).toBe(9999999999);
    expect(jwt.signature).toBe("fake-sig");
    expect(jwt.raw).toBe(token);
  });

  it("should decode a payload with custom claims", () => {
    interface CustomPayload extends JwtPayload {
      readonly role: string;
      readonly permissions: readonly string[];
    }

    const token = buildToken(STANDARD_HEADER, {
      sub: "u1",
      role: "admin",
      permissions: ["user.read", "user.write"],
    });

    const jwt = decodeJwt<CustomPayload>(token);

    expect(jwt.payload.role).toBe("admin");
    expect(jwt.payload.permissions).toEqual(["user.read", "user.write"]);
  });

  it("should handle UTF-8 characters in claims", () => {
    const token = buildToken(STANDARD_HEADER, {
      sub: "user-123",
      name: "José García",
    });

    const jwt = decodeJwt(token);

    expect(jwt.payload["name"]).toBe("José García");
  });

  it("should throw for an empty string", () => {
    expect(() => decodeJwt("")).toThrow("non-empty string");
  });

  it("should throw for a non-3-segment string", () => {
    expect(() => decodeJwt("abc.def")).toThrow("3 segments");
    expect(() => decodeJwt("a.b.c.d")).toThrow("3 segments");
  });

  it("should throw for invalid base64url in header", () => {
    const payload = encodeSegment({ sub: "x" });
    expect(() => decodeJwt(`!!!.${payload}.sig`)).toThrow("header");
  });

  it("should throw for invalid base64url in payload", () => {
    const header = encodeSegment(STANDARD_HEADER);
    expect(() => decodeJwt(`${header}.!!!.sig`)).toThrow("payload");
  });
});

// ── extractClaim ───────────────────────────────────────────────────

describe("extractClaim", () => {
  it("should extract a registered claim", () => {
    const token = buildToken(STANDARD_HEADER, { sub: "u42" });
    expect(extractClaim(token, "sub")).toBe("u42");
  });

  it("should extract a custom claim", () => {
    const token = buildToken(STANDARD_HEADER, { tenant: "acme" });
    expect(extractClaim(token, "tenant")).toBe("acme");
  });

  it("should return undefined for a missing claim", () => {
    const token = buildToken(STANDARD_HEADER, { sub: "u1" });
    expect(extractClaim(token, "nonexistent")).toBeUndefined();
  });
});

// ── extractPermissions ─────────────────────────────────────────────

describe("extractPermissions", () => {
  it("should extract an array of permissions", () => {
    const token = buildToken(STANDARD_HEADER, {
      permissions: ["user.read", "user.write"],
    });

    expect(extractPermissions(token)).toEqual(["user.read", "user.write"]);
  });

  it("should extract from a custom claim name", () => {
    const token = buildToken(STANDARD_HEADER, {
      roles: ["admin", "editor"],
    });

    expect(extractPermissions(token, "roles")).toEqual(["admin", "editor"]);
  });

  it("should parse a space-delimited scope string", () => {
    const token = buildToken(STANDARD_HEADER, {
      scope: "openid profile email",
    });

    expect(extractPermissions(token, "scope")).toEqual([
      "openid",
      "profile",
      "email",
    ]);
  });

  it("should return an empty array when the claim is missing", () => {
    const token = buildToken(STANDARD_HEADER, { sub: "u1" });
    expect(extractPermissions(token)).toEqual([]);
  });

  it("should filter non-string values from an array claim", () => {
    const token = buildToken(STANDARD_HEADER, {
      permissions: ["valid", 42, null, "also-valid"],
    });

    expect(extractPermissions(token)).toEqual(["valid", "also-valid"]);
  });
});

// ── isExpired ──────────────────────────────────────────────────────

describe("isExpired", () => {
  it("should return false when exp is in the future", () => {
    expect(isExpired({ exp: 2000 }, 1000)).toBe(false);
  });

  it("should return true when exp is in the past", () => {
    expect(isExpired({ exp: 1000 }, 2000)).toBe(true);
  });

  it("should return true when exp equals now (boundary)", () => {
    expect(isExpired({ exp: 1000 }, 1000)).toBe(true);
  });

  it("should return false when no exp claim exists", () => {
    expect(isExpired({}, 1000)).toBe(false);
  });

  it("should respect clock tolerance", () => {
    // exp=1000, now=1005, tolerance=10 → 1005 >= 1000+10 → false
    expect(isExpired({ exp: 1000 }, 1005, 10)).toBe(false);
    // exp=1000, now=1010, tolerance=10 → 1010 >= 1000+10 → true
    expect(isExpired({ exp: 1000 }, 1010, 10)).toBe(true);
  });
});

// ── isNotYetValid ──────────────────────────────────────────────────

describe("isNotYetValid", () => {
  it("should return false when nbf is in the past", () => {
    expect(isNotYetValid({ nbf: 1000 }, 2000)).toBe(false);
  });

  it("should return true when nbf is in the future", () => {
    expect(isNotYetValid({ nbf: 2000 }, 1000)).toBe(true);
  });

  it("should return false when no nbf claim exists", () => {
    expect(isNotYetValid({}, 1000)).toBe(false);
  });

  it("should respect clock tolerance", () => {
    // nbf=2000, now=1995, tolerance=10 → 1995 < 2000-10 → false
    expect(isNotYetValid({ nbf: 2000 }, 1995, 10)).toBe(false);
    // nbf=2000, now=1985, tolerance=10 → 1985 < 2000-10 → true
    expect(isNotYetValid({ nbf: 2000 }, 1985, 10)).toBe(true);
  });
});

// ── secondsUntilExpiry ─────────────────────────────────────────────

describe("secondsUntilExpiry", () => {
  it("should return the correct number of seconds", () => {
    expect(secondsUntilExpiry({ exp: 2000 }, 1500)).toBe(500);
  });

  it("should return a negative number for expired tokens", () => {
    expect(secondsUntilExpiry({ exp: 1000 }, 1500)).toBe(-500);
  });

  it("should return Infinity when no exp claim exists", () => {
    expect(secondsUntilExpiry({}, 1000)).toBe(Infinity);
  });
});

// ── validateJwt ────────────────────────────────────────────────────

describe("validateJwt", () => {
  function makeToken(
    header: Record<string, unknown> = STANDARD_HEADER,
    payload: Record<string, unknown> = {},
  ) {
    return decodeJwt(buildToken(header, payload));
  }

  it("should return no issues for a valid token", () => {
    const jwt = makeToken(STANDARD_HEADER, {
      sub: "u1",
      iss: "auth.example.com",
      aud: "my-app",
      exp: 9999999999,
    });

    const issues = validateJwt(jwt, {
      issuer: "auth.example.com",
      audience: "my-app",
      requireSubject: true,
    });

    expect(issues).toEqual([]);
  });

  it("should report missing alg", () => {
    const jwt = makeToken({ typ: "JWT" }, {});
    const issues = validateJwt(jwt);

    expect(issues).toHaveLength(1);
    expect(issues[0].code).toBe("MISSING_ALG");
  });

  it("should report TOKEN_EXPIRED", () => {
    const jwt = makeToken(STANDARD_HEADER, { exp: 1000 });
    const issues = validateJwt(jwt, { nowSeconds: 2000 });

    expect(issues.some((i) => i.code === "TOKEN_EXPIRED")).toBe(true);
  });

  it("should report TOKEN_NOT_YET_VALID", () => {
    const jwt = makeToken(STANDARD_HEADER, { nbf: 3000 });
    const issues = validateJwt(jwt, { nowSeconds: 1000 });

    expect(issues.some((i) => i.code === "TOKEN_NOT_YET_VALID")).toBe(true);
  });

  it("should report ISSUER_MISMATCH", () => {
    const jwt = makeToken(STANDARD_HEADER, { iss: "wrong" });
    const issues = validateJwt(jwt, { issuer: "expected" });

    expect(issues.some((i) => i.code === "ISSUER_MISMATCH")).toBe(true);
  });

  it("should report ISSUER_MISMATCH when iss is missing", () => {
    const jwt = makeToken(STANDARD_HEADER, {});
    const issues = validateJwt(jwt, { issuer: "expected" });

    expect(issues.some((i) => i.code === "ISSUER_MISMATCH")).toBe(true);
  });

  it("should report AUDIENCE_MISMATCH with string aud", () => {
    const jwt = makeToken(STANDARD_HEADER, { aud: "other-app" });
    const issues = validateJwt(jwt, { audience: "my-app" });

    expect(issues.some((i) => i.code === "AUDIENCE_MISMATCH")).toBe(true);
  });

  it("should pass when aud array contains the expected value", () => {
    const jwt = makeToken(STANDARD_HEADER, {
      aud: ["app-a", "my-app", "app-b"],
    });
    const issues = validateJwt(jwt, { audience: "my-app" });

    expect(issues.some((i) => i.code === "AUDIENCE_MISMATCH")).toBe(false);
  });

  it("should report MISSING_SUBJECT when requireSubject is true", () => {
    const jwt = makeToken(STANDARD_HEADER, {});
    const issues = validateJwt(jwt, { requireSubject: true });

    expect(issues.some((i) => i.code === "MISSING_SUBJECT")).toBe(true);
  });

  it("should report MISSING_CLAIM for each missing required claim", () => {
    const jwt = makeToken(STANDARD_HEADER, { role: "admin" });
    const issues = validateJwt(jwt, {
      requiredClaims: ["role", "permissions", "tenant"],
    });

    const missingClaims = issues.filter((i) => i.code === "MISSING_CLAIM");
    expect(missingClaims).toHaveLength(2); // permissions + tenant
  });

  it("should respect clock tolerance for expiry", () => {
    const jwt = makeToken(STANDARD_HEADER, { exp: 1000 });
    // now=1005, exp=1000, tolerance=10 → not expired (1005 < 1000+10)
    const issues = validateJwt(jwt, {
      nowSeconds: 1005,
      clockToleranceSeconds: 10,
    });

    expect(issues.some((i) => i.code === "TOKEN_EXPIRED")).toBe(false);
  });
});

// ── isJwtValid ─────────────────────────────────────────────────────

describe("isJwtValid", () => {
  it("should return true for a valid token", () => {
    const jwt = decodeJwt(
      buildToken(STANDARD_HEADER, { sub: "u1", exp: 9999999999 }),
    );
    expect(isJwtValid(jwt)).toBe(true);
  });

  it("should return false for an expired token", () => {
    const jwt = decodeJwt(buildToken(STANDARD_HEADER, { exp: 1000 }));
    expect(isJwtValid(jwt, { nowSeconds: 2000 })).toBe(false);
  });
});
