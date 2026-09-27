import type { EventRecord } from "@/types/domain";

const artwork: Record<string, string> = {
  "crescendo-colombo": "/images/crescendo-hero.webp",
  "colombo-afterglow": "/images/crescendo-hero.webp",
  "serendib-skies": "/images/cinema.jpg",
  "hamlet-colombo": "/images/theatre.jpg",
  "future-forum": "/images/conference.jpg",
  "lions-v-kandy": "/images/sports.jpg",
  "coastline-festival": "/images/festival.jpg",
  "midnight-table": "/images/dinner.jpg",
};

// Resolve seeded artwork for both fresh and previously persisted demo sessions.
export function eventArtwork(event: EventRecord) {
  const image = artwork[event.id] ?? event.image;
  return image.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${image}` : image;
}
export function eventHref(event: EventRecord) {
  return `/${event.isMovie ? "movies" : "events"}/${event.id}`;
}
