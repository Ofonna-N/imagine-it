import { createCookieSessionStorage } from "react-router";

// It's crucial to use a strong, unique secret, preferably from an environment variable.
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is not set. Cookie signing requires a secret.");
}

export const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__theme",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret], // Use the secret for signing
  },
});

export async function getThemeSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return themeSessionStorage.getSession(cookie);
}
