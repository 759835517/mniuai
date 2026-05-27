const ACCESS_KEY = "mniu_access_token";
const REFRESH_KEY = "mniu_refresh_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return isBrowser() ? localStorage.getItem(ACCESS_KEY) : null;
  },
  setAccessToken(token: string): void {
    if (isBrowser()) localStorage.setItem(ACCESS_KEY, token);
  },
  getRefreshToken(): string | null {
    return isBrowser() ? localStorage.getItem(REFRESH_KEY) : null;
  },
  setRefreshToken(token: string): void {
    if (isBrowser()) localStorage.setItem(REFRESH_KEY, token);
  },
  clear(): void {
    if (isBrowser()) {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }
  },
};
