/**
 * Central fetch wrapper for client-side API calls.
 *
 * Automatically triggers logout and redirects to /login when any
 * protected API returns 401 or 403 — avoiding stale dashboard states
 * and ensuring users are never silently stuck in a broken session.
 *
 * Auth endpoints are intentionally excluded so that login errors are
 * shown normally without causing an auto-logout loop.
 */

const AUTH_ENDPOINT_PREFIXES = ["/api/auth/", "/api/v1/auth/"];

function isAuthEndpoint(input: RequestInfo | URL): boolean {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : (input as Request).url;

  return AUTH_ENDPOINT_PREFIXES.some((prefix) => url.includes(prefix));
}

async function triggerAutoLogout(): Promise<void> {
  if (typeof window === "undefined") return;
  const { signOut } = await import("next-auth/react");
  void signOut({ callbackUrl: "/login", redirect: true });
}

/**
 * Drop-in replacement for `fetch` in client-side feature API files.
 * On 401/403 from protected endpoints, clears the session and navigates
 * to /login. The response is still returned so callers can handle errors
 * normally before the redirect completes.
 */
export async function appFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, init);

  if (
    (response.status === 401 || response.status === 403) &&
    !isAuthEndpoint(input)
  ) {
    void triggerAutoLogout();
  }

  return response;
}
