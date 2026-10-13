export const AUTH_PATHS = ["/login", "/signup", "/register", "/sign-in", "/sign-up"];
export const SOCIAL_PROVIDERS = ["Google", "Facebook", "Apple"] as const;
export type SocialProvider = typeof SOCIAL_PROVIDERS[number];

export function isAuthPath(pathname: string) {
  return AUTH_PATHS.includes(pathname);
}

// Only return to known customer screens; never navigate to an arbitrary URL.
export function authReturnPath(value: string | null) {
  const allowed = ["/", "/explore", "/checkout", "/account", "/account/tickets", "/account/orders", "/account/saved", "/account/notifications", "/account/profile", "/account/refunds"];
  return value && allowed.includes(value) ? value : "/account";
}
