import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  return process.env.SESSION_SECRET ?? "dev-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function createSessionCookie() {
  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt);
  return {
    name: COOKIE_NAME,
    value: `${issuedAt}.${signature}`,
    maxAge: MAX_AGE_SECONDS,
  };
}

export function verifySessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const [issuedAt, signature] = value.split(".");
  if (!issuedAt || !signature) return false;

  const expected = sign(issuedAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  const age = (Date.now() - Number(issuedAt)) / 1000;
  return age >= 0 && age <= MAX_AGE_SECONDS;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export { COOKIE_NAME };
