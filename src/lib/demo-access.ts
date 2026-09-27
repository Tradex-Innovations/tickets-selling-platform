import type { DemoRole } from "@/types/domain";

// GitHub Pages is an organizer-facing presentation. Local development keeps
// every role available for the full operations demonstration.
export const ORGANIZER_PREVIEW_ONLY = process.env.NEXT_PUBLIC_ORGANIZER_PREVIEW === "true";

const previewRoles: DemoRole[] = ["customer", "seller"];
const hiddenPortalPrefixes = ["/venue-manager", "/box-office", "/check-in", "/admin"];

export function isRoleAvailable(role: DemoRole, previewOnly = ORGANIZER_PREVIEW_ONLY) {
  return !previewOnly || previewRoles.includes(role);
}

export function isRouteAvailable(pathname: string, previewOnly = ORGANIZER_PREVIEW_ONLY) {
  return !previewOnly || !hiddenPortalPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
