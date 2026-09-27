"use client";

import Link from "next/link";
import { ArrowRight, Film, Globe2, Landmark, Laugh, Mic2, Music2, Sparkles, Trophy, UtensilsCrossed } from "lucide-react";
import { EventCard } from "@/components/marketplace/event-card";
import type { EventRecord } from "@/types/domain";

export const discoveryCategories = [
  { name: "All", icon: Sparkles }, { name: "Music", icon: Music2 }, { name: "Movies", icon: Film },
  { name: "Theatre", icon: Landmark }, { name: "Sports", icon: Trophy }, { name: "Festival", icon: Globe2 },
  { name: "Conference", icon: Mic2 }, { name: "Comedy", icon: Laugh }, { name: "Dinner show", icon: UtensilsCrossed },
];
export function CategoryStrip({ selected = "All", onSelect }: { selected?: string; onSelect?: (value: string) => void }) {
  return <nav className="category-strip no-scrollbar" aria-label="Event categories">{discoveryCategories.map(({ name, icon: Icon }) => {
    const content = <><Icon className="size-[18px]" /><span>{name === "All" ? "For you" : name}</span></>;
    return onSelect ? <button key={name} className="category-chip" aria-pressed={selected === name} onClick={() => onSelect(name)}>{content}</button> : <Link key={name} className="category-chip" aria-current={selected === name ? "page" : undefined} href={name === "All" ? "/explore" : `/explore?category=${encodeURIComponent(name)}`}>{content}</Link>;
  })}</nav>;
}
export function DiscoveryHeading({ title, eyebrow, href = "/explore", linkLabel = "View all" }: { title: string; eyebrow?: string; href?: string; linkLabel?: string }) {
  return <div className="discovery-heading"><div>{eyebrow ? <p>{eyebrow}</p> : null}<h2>{title}</h2></div><Link href={href}>{linkLabel}<ArrowRight className="size-4" /></Link></div>;
}
export function EventRail({ events }: { events: EventRecord[] }) {
  return <div className="event-rail no-scrollbar">{events.map((event) => <EventCard key={event.id} event={event} />)}</div>;
}
