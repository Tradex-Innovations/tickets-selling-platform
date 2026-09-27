"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import { EventCard } from "@/components/marketplace/event-card";
import { CategoryStrip } from "@/components/marketplace/discovery";
import { Button, Card, Field, Input, Select } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { useDemoStore } from "@/store/demo-store";

export function ExploreScreen() {
  const params = useSearchParams();
  return <ExploreResults key={params.toString()} />;
}

function ExploreResults() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "All");
  const [location, setLocation] = useState(params.get("location") ?? "All Sri Lanka");
  const [sort, setSort] = useState("Recommended");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("Any price");
  const [accessible, setAccessible] = useState(false);
  const [available, setAvailable] = useState(false);
  const [language, setLanguage] = useState("Any language");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(params.get("filters") === "1");
  const events = useDemoStore((state) => state.events);
  const inventory = useDemoStore((state) => state.seatsBySession);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
      if (event.key === "Tab") {
        const elements = dialogRef.current?.querySelectorAll<HTMLElement>('button, input, select, [tabindex="0"]');
        const first = elements?.[0], last = elements?.[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", handleKey); previous?.focus(); };
  }, [filtersOpen]);
  const filtered = useMemo(() => events.filter((event) => {
    const minimum = Math.min(...event.ticketCategories.map((ticket) => ticket.price));
    return event.status === "published"
      && (category === "All" || event.category === category)
      && (location === "All Sri Lanka" || event.location.includes(location))
      && `${event.title} ${event.organizer} ${event.venue} ${event.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())
      && (!date || event.sessions.some((session) => session.startsAt.slice(0, 10) === date))
      && (price === "Any price" || (price === "Under Rs. 5,000" ? minimum < 500_000 : price === "Rs. 5,000–10,000" ? minimum >= 500_000 && minimum <= 1_000_000 : minimum > 1_000_000))
      && (!accessible || event.accessibility.length > 0)
      && (!available || event.sessions.some((session) => inventory[session.id]?.some((seat) => seat.status === "available")))
      && (language === "Any language" || event.language === language);
  }).sort((a, b) => sort === "Soonest first" ? a.sessions[0].startsAt.localeCompare(b.sessions[0].startsAt) : sort === "Price: low to high" ? Math.min(...a.ticketCategories.map((ticket) => ticket.price)) - Math.min(...b.ticketCategories.map((ticket) => ticket.price)) : Number(Boolean(b.featured)) - Number(Boolean(a.featured))), [events, category, location, query, sort, date, price, accessible, available, inventory, language]);
  const reset = () => { setCategory("All"); setLocation("All Sri Lanka"); setQuery(""); setDate(""); setPrice("Any price"); setAccessible(false); setAvailable(false); setLanguage("Any language"); };
  const activeCount = Number(location !== "All Sri Lanka") + Number(Boolean(date)) + Number(price !== "Any price") + Number(accessible) + Number(available) + Number(language !== "Any language");
  const filters = <div className="filter-fields">
    <Field label="Location"><Select value={location} onChange={(event) => setLocation(event.target.value)}>{["All Sri Lanka", "Colombo", "Wellawatte", "Kandy", "Galle"].map((value) => <option key={value}>{value}</option>)}</Select></Field>
    <Field label="Event date"><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></Field>
    <Field label="Ticket price"><Select value={price} onChange={(event) => setPrice(event.target.value)}>{["Any price", "Under Rs. 5,000", "Rs. 5,000–10,000", "Over Rs. 10,000"].map((value) => <option key={value}>{value}</option>)}</Select></Field>
    <Field label="Movie language"><Select value={language} onChange={(event) => setLanguage(event.target.value)}>{["Any language", "Sinhala", "English", "Tamil"].map((value) => <option key={value}>{value}</option>)}</Select></Field>
    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={accessible} onChange={(event) => setAccessible(event.target.checked)} className="size-4 accent-violet-500" />Accessible venue</label>
    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} className="size-4 accent-violet-500" />Tickets available</label>
    <Button variant="outline" onClick={reset}>Reset filters</Button>
  </div>;
  return <div className="min-h-screen">
    <section className="page-container explore-heading"><p className="overline">GO WHERE YOU FEEL ALIVE</p><h1>What’s your next plan?</h1>
      <div className="discovery-search"><Search className="size-5 shrink-0" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, artists, venues…" aria-label="Search events" /><button className="search-submit lg:hidden" onClick={() => setFiltersOpen(true)} aria-label="Open filters"><SlidersHorizontal className="size-5" />{activeCount || ""}</button></div>
      <CategoryStrip selected={category} onSelect={setCategory} />
    </section>
    <div className="page-container explore-layout"><aside className="filter-panel filter-panel--desktop"><h2 className="flex items-center justify-between">Make it your kind of plan <SlidersHorizontal className="size-4" /></h2>{filters}</aside>
      <div className="min-w-0"><div className="explore-toolbar"><div aria-live="polite"><p className="font-bold">{filtered.length} {category === "All" ? "experiences" : category.toLowerCase() + " events"}</p><p className="mt-1 text-xs text-[var(--muted)]">Your next memory is in here.</p></div><div className="flex items-center gap-2"><Select aria-label="Sort events" value={sort} onChange={(event) => setSort(event.target.value)} className="w-44 !text-xs"><option>Recommended</option><option>Soonest first</option><option>Price: low to high</option></Select><button className="market-icon-button" onClick={() => setView(view === "grid" ? "list" : "grid")} aria-label={view === "grid" ? "Show list view" : "Show grid view"}>{view === "grid" ? <List className="size-5" /> : <Grid2X2 className="size-5" />}</button></div></div>
      {filtered.length ? <div className={cn("explore-grid", view === "list" && "explore-grid--list")}>{filtered.map((event, index) => <EventCard key={event.id} event={event} compact={view === "list"} eager={index < 3} />)}</div> : <Card className="grid min-h-80 place-items-center p-8 text-center"><div><Search className="mx-auto size-9 text-violet-400" /><h2 className="mt-5 text-xl font-bold">A different plan, perhaps?</h2><p className="mt-2 text-sm text-[var(--muted)]">No events match these filters. Try another city or date.</p><Button onClick={reset} className="mt-5">Reset search</Button></div></Card>}</div>
    </div>
    {filtersOpen ? <div className="filter-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setFiltersOpen(false); }}><div ref={dialogRef} className="filter-sheet" role="dialog" aria-modal="true" aria-labelledby="filter-title"><div className="mb-6 flex items-center justify-between"><h2 id="filter-title" className="text-xl font-bold">Find your kind of event</h2><button className="market-icon-button" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X className="size-5" /></button></div>{filters}<Button className="mt-6 w-full" onClick={() => setFiltersOpen(false)}>Show {filtered.length} experiences</Button></div></div> : null}
  </div>;
}
