"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, MapPin } from "lucide-react";
import { currency } from "@/data/mock-data";
import { formatMoney } from "@/lib/domain";
import { eventArtwork, eventHref } from "@/lib/event-presentation";
import { cn, formatCalendarDay, formatEventDate } from "@/lib/utils";
import { useDemoStore } from "@/store/demo-store";
import type { EventRecord } from "@/types/domain";

export function EventCard({ event, compact = false, eager = false }: { event: EventRecord; compact?: boolean; eager?: boolean }) {
  const favorites = useDemoStore((state) => state.favorites);
  const toggleFavorite = useDemoStore((state) => state.toggleFavorite);
  const inventory = useDemoStore((state) => state.seatsBySession);
  const date = event.sessions[0]?.startsAt;
  const calendar = date ? formatCalendarDay(date) : undefined;
  const startingPrice = Math.min(...event.ticketCategories.map((item) => item.price));
  const available = event.sessions.some((session) => session.status !== "cancelled" && inventory[session.id]?.some((seat) => seat.status === "available"));
  const saved = favorites.includes(event.id);
  return <article className={cn("event-card", compact && "event-card--list")}>
    <div className="event-card__art">
      <Link href={eventHref(event)} tabIndex={-1} aria-hidden="true">
        <Image src={eventArtwork(event)} alt="" fill loading={eager ? "eager" : "lazy"} sizes="(max-width: 639px) 80vw, (max-width: 1023px) 45vw, 30vw" className="object-cover" />
        <div className="event-card__shade" />
      </Link>
      <span className="event-card__category">{event.category}</span>
      <button onClick={() => toggleFavorite(event.id)} className="event-card__save" aria-label={saved ? `Unsave ${event.title}` : `Save ${event.title}`} aria-pressed={saved}><Heart className={cn("size-[18px]", saved && "fill-current")} /></button>
      {calendar ? <div className="event-card__date"><strong>{calendar.day}</strong><span>{calendar.month}</span></div> : null}
      <div className="event-card__poster-title" aria-hidden="true">{event.title.split(":")[0]}<span>{event.isMovie ? "ON THE BIG SCREEN" : event.category === "Music" ? "A NIGHT TO REMEMBER" : "BE PART OF THE MOMENT"}</span></div>
    </div>
    <Link href={eventHref(event)} className="event-card__body">
      <p className="event-card__time">{date ? formatEventDate(date) : "Dates coming soon"}</p>
      <h3>{event.title}</h3>
      <p className="event-card__venue"><MapPin className="size-3.5 shrink-0" /><span>{event.venue} · {event.location}</span></p>
      <p className="event-card__organizer">By {event.organizer}</p>
      <div className="event-card__footer"><div><span>From </span><strong>{formatMoney(startingPrice, currency)}</strong></div><span className="event-card__availability">{available ? "Tickets available" : "Sold out"}</span><ArrowUpRight className="size-4" /></div>
    </Link>
  </article>;
}
