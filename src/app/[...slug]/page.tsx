import { Suspense } from "react";
import { PrototypeRouter } from "@/components/prototype-router";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { initialEvents, venues } from "@/data/mock-data";
import { ORGANIZER_PREVIEW_ONLY } from "@/lib/demo-access";
import { AUTH_PATHS } from "@/lib/demo-auth";

// GitHub Pages needs each directly loadable route emitted as a static file.
// The wizard uses a stable demo ID so its event and booking routes can exist
// before an organizer submits it in local storage.
export function generateStaticParams() {
  const routes = [
    ...AUTH_PATHS.map((path) => path.slice(1)),
    "explore", "checkout", "payment/result", "help", "legal/terms", "legal/refunds", "demo",
    "account", ...["tickets", "orders", "saved", "notifications", "profile", "refunds"].map((section) => `account/${section}`),
    "seller", ...["events", "events/create", "events/colombo-afterglow", "onboarding", "movies", "orders", "attendees", "inventory", "promotions", "communications", "reports", "payouts", "team", "settings"].map((section) => `seller/${section}`),
    ...(!ORGANIZER_PREVIEW_ONLY ? [
      "venue-manager", ...["venues", "halls", "layouts", "layouts/builder", "calendar", "bookings", "reports", "team", "settings"].map((section) => `venue-manager/${section}`),
      "box-office", ...["sales", "reissues", "activity"].map((section) => `box-office/${section}`),
      "check-in", ...["stats", "activity"].map((section) => `check-in/${section}`),
      "admin", ...["sellers", "events", "venues", "orders", "refunds", "disputes", "settlements", "content", "risk", "audit", "settings"].map((section) => `admin/${section}`),
    ] : []),
    "events/colombo-afterglow", "booking/session-afterglow/seats",
    ...initialEvents.flatMap((event) => [
      `${event.isMovie ? "movies" : "events"}/${event.id}`,
      `seller/events/${event.id}`,
      ...event.sessions.map((session) => `booking/${session.id}/seats`),
    ]),
    ...venues.map((venue) => `venues/${venue.id}`),
    ...new Set(initialEvents.map((event) => `organizers/${event.organizerId}`)),
  ];
  return [...new Set(routes)].map((route) => ({ slug: route.split("/") }));
}

export default function RoutedPrototypePage() {
  return <Suspense fallback={<PageSkeleton />}><PrototypeRouter /></Suspense>;
}
