"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Building2, Check, MapPin, Search, SlidersHorizontal, Sparkles, Ticket } from "lucide-react";
import { CategoryStrip, DiscoveryHeading, EventRail } from "@/components/marketplace/discovery";
import { Button, Input } from "@/components/ui/primitives";
import { eventArtwork, eventHref } from "@/lib/event-presentation";
import { formatCalendarDay, formatNumber } from "@/lib/utils";
import { useDemoStore } from "@/store/demo-store";
import { venues } from "@/data/mock-data";

export function HomeScreen() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Colombo");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const events = useDemoStore((state) => state.events).filter((event) => event.status === "published");
  const favorites = useDemoStore((state) => state.favorites);
  const notify = useDemoStore((state) => state.notify);
  const router = useRouter();
  const featured = events.find((event) => event.featured) ?? events[0];
  const date = featured ? formatCalendarDay(featured.sessions[0].startsAt) : undefined;
  const popular = [...events].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 4);
  const movies = events.filter((event) => event.isMovie);
  const savedCategories = new Set(events.filter((event) => favorites.includes(event.id)).map((event) => event.category));
  const picks = events.filter((event) => !favorites.includes(event.id) && (!savedCategories.size || savedCategories.has(event.category))).slice(0, 3);
  return <div className="discovery-home">
    <section className="page-container discovery-intro">
      <div className="discovery-welcome"><div><p className="overline">GOOD PLANS START HERE</p><h1>Find your next <span>great moment.</span></h1></div><label className="location-picker"><MapPin className="size-4" /><span className="sr-only">Discovery location</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option>Colombo</option><option>Kandy</option><option>Galle</option><option>All Sri Lanka</option></select></label></div>
      <form className="discovery-search" onSubmit={(event) => { event.preventDefault(); router.push(`/explore?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`); }}>
        <Search className="size-5 shrink-0" /><input aria-label="Search events" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Artists, events, or a little adventure…" /><button type="submit" className="search-submit"><span className="hidden sm:inline">Find events</span><ArrowRight className="size-5" /></button><Link href="/explore?filters=1" className="filter-shortcut" aria-label="Filter events"><SlidersHorizontal className="size-5" /></Link>
      </form>
      <CategoryStrip />
      {featured ? <div className="discovery-hero">
        <Image src={eventArtwork(featured)} alt="A concert crowd beneath glowing stage lights" fill unoptimized loading="eager" fetchPriority="high" sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
        <div className="discovery-hero__overlay" /><span className="hero-label"><span />THE SPOTLIGHT</span>
        <div className="discovery-hero__copy"><p>LIVE MUSIC. REAL CONNECTIONS.</p><h2>Your city.<br />Your people.<br /><em>Your kind of night.</em></h2><span className="hero-description">{featured.title} · {featured.venue}</span><Link href={eventHref(featured)} className="market-cta">Get your tickets<ArrowUpRight className="size-5" /></Link></div>
        <div className="hero-date"><span>{date?.month}</span><strong>{date?.day}</strong><span>LIVE IN COLOMBO</span></div><div className="hero-caption"><span className="hero-caption__line" />One ticket. A thousand memories.</div>
      </div> : null}
    </section>
    <section className="page-container discovery-section"><DiscoveryHeading title="Everyone’s talking about" eyebrow="MAKE IT A PLAN" /><EventRail events={popular} /></section>
    <section className="page-container discovery-section"><div className="moment-banner"><div className="moment-banner__icon"><Ticket className="size-8 -rotate-12" /></div><div><p>A little nudge to go out.</p><h2>Your first great night, <span>10% on us.</span></h2><span>Use ENCORE10 at checkout. Good memories included.</span></div><button aria-label="Copy promotional code ENCORE10" onClick={async () => { try { await navigator.clipboard.writeText("ENCORE10"); notify("Code copied", "Apply ENCORE10 at checkout for 10% off tickets.", "success"); } catch { notify("Your code: ENCORE10", "Enter this at checkout for 10% off tickets.", "info"); } }}>ENCORE10<ArrowUpRight className="size-4" /></button></div></section>
    {movies.length ? <section className="page-container discovery-section"><DiscoveryHeading title="Meet you at the movies" eyebrow="BIG SCREEN. BIG FEELINGS." href="/explore?category=Movies" /><div className="cinema-feature"><div className="cinema-feature__image"><Image src={eventArtwork(movies[0])} alt="Red cinema seats waiting for the next screening" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /><span className="cinema-stamp">NOW<br />SHOWING<ArrowUpRight className="size-6" /></span></div><div className="cinema-feature__body"><span className="overline">{movies[0].language} · {movies[0].duration} · {movies[0].ageRestriction}</span><h3>{movies[0].title}</h3><p>{movies[0].shortDescription}</p><div className="showtime-chips">{movies[0].sessions.map((session) => <Link key={session.id} href={`/booking/${session.id}/seats`}>{session.label}<span>{formatCalendarDay(session.startsAt).day} {formatCalendarDay(session.startsAt).month}</span></Link>)}</div><Link href={eventHref(movies[0])} className="text-link">Movie details & showtimes<ArrowRight className="size-4" /></Link></div></div></section> : null}
    <section className="page-container discovery-section"><DiscoveryHeading title="A little more your thing" eyebrow={savedCategories.size ? "INSPIRED BY YOUR SAVED EVENTS" : "CURATED FOR CURIOUS PEOPLE"} /><EventRail events={picks.length ? picks : events.slice(0, 3)} /></section>
    <section className="page-container discovery-section"><DiscoveryHeading title="Places that set the scene" href="/venues/nelum-pokuna" linkLabel="Discover venues" /><div className="venue-strip">{venues.map((venue, index) => <Link className="venue-tile" key={venue.id} href={`/venues/${venue.id}`}><span className="venue-tile__number">0{index + 1}</span><Building2 className="size-6" /><h3>{venue.name}</h3><p>{venue.type} · {formatNumber(venue.capacity)} capacity</p><ArrowUpRight className="size-5" /></Link>)}</div></section>
    <section className="page-container discovery-section"><div className="market-newsletter"><Sparkles className="size-8" /><div><h2>Good plans. Straight to your inbox.</h2><p>Fresh shows, first dibs, and weekends worth waiting for.</p></div><form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); notify("You’re on the list", `Demo event alerts registered for ${email}.`, "success"); }}><Input aria-label="Email for event alerts" type="email" required placeholder="Your email address" value={email} onChange={(event) => { setEmail(event.target.value); setSubscribed(false); }} /><Button type="submit" aria-label="Subscribe to event alerts">{subscribed ? <Check className="size-5" /> : <ArrowRight className="size-5" />}</Button></form></div></section>
    <footer className="market-footer page-container"><div><Link href="/" className="market-wordmark"><Ticket className="size-6" />encore.</Link><p>Go out. Feel something. Do it again.</p></div><nav aria-label="Footer navigation"><Link href="/explore">Explore</Link><Link href="/help">Help & FAQ</Link><Link href="/legal/refunds">Refund policy</Link><Link href="/demo">For organizers</Link><Link href="/legal/terms">Terms</Link></nav><span>© 2026 Encore · Colombo, Sri Lanka</span></footer>
  </div>;
}
