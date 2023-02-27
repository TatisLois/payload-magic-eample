import { serialize } from "cookie";

const session_expires_days = 5;
const MAX_AGE_COOKIE_SESSION_AGE = 60 * 60 * 24 * session_expires_days;

export function setTokenCookie({ res, token, token_name }) {
  const cookie = serialize(token_name, token, {
    maxAge: MAX_AGE_COOKIE_SESSION_AGE,
    expires: new Date(Date.now() + MAX_AGE_COOKIE_SESSION_AGE * 1000),
    httpOnly: true,
    // if true, cookie will only be set if https (won't be set if http)
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
  res.setHeader("Set-Cookie", cookie);
}

export function removeTokenCookie({ res, token_name }) {
  const cookie = serialize(token_name, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}
