import { createCookieSessionStorage } from "react-router";

export const themeSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__theme",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getThemeSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return themeSessionStorage.getSession(cookie);
}
