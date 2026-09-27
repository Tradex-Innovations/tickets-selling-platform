"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Clock3, Eraser, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { BestSeatBanner, SeatLegend, SeatMap } from "@/components/booking/seat-map";
import { Badge, Button, Card, Field, Input, Modal, Select } from "@/components/ui/primitives";
import { currency } from "@/data/mock-data";
import { formatMoney } from "@/lib/domain";
import { formatEventDate } from "@/lib/utils";
import { useDemoStore } from "@/store/demo-store";

export function SeatSelectionScreen({ sessionId }: { sessionId: string }) {
  const events = useDemoStore((state) => state.events);
  const seats = useDemoStore((state) => state.seatsBySession[sessionId] ?? []);
  const selectedSessionId = useDemoStore((state) => state.selectedSessionId);
  const selectedIds = useDemoStore((state) => state.selectedSeatIds);
  const holdExpiresAt = useDemoStore((state) => state.holdExpiresAt);
  const setSession = useDemoStore((state) => state.setSession);
  const toggleSeat = useDemoStore((state) => state.toggleSeat);
  const clearSelection = useDemoStore((state) => state.clearSelection);
  const recommendSeats = useDemoStore((state) => state.recommendSeats);
  const [seconds, setSeconds] = useState(600);
  const [finderOpen, setFinderOpen] = useState(false);
  const [count, setCount] = useState(2);
  const [budget, setBudget] = useState(2_000_000);
  const [section, setSection] = useState("Any");
  const [accessible, setAccessible] = useState(false);
  const [priceZone, setPriceZone] = useState("All prices");
  const router = useRouter();
  const event = events.find((item) => item.sessions.some((session) => session.id === sessionId));
  const session = event?.sessions.find((item) => item.id === sessionId);
  useEffect(() => { if (selectedSessionId !== sessionId) setSession(sessionId); }, [selectedSessionId, sessionId, setSession]);
  useEffect(() => {
    if (!holdExpiresAt) return;
    const update = () => { const value = Math.max(0, Math.floor((holdExpiresAt - Date.now()) / 1000)); setSeconds(value); if (value === 0) clearSelection(); };
    update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer);
  }, [holdExpiresAt, clearSelection]);
  const selected = selectedIds.map((id) => seats.find((seat) => seat.id === id)).filter((seat) => Boolean(seat));
  const total = selected.reduce((sum, seat) => sum + (seat?.price ?? 0), 0);
  const shownSeats = useMemo(() => priceZone === "All prices" ? seats : seats.filter((seat) => seat.priceZone === priceZone), [priceZone, seats]);
  if (!event || !session) return <div className="page-container py-20"><Card className="p-8 text-center"><AlertCircle className="mx-auto size-10 text-orange-500" /><h1 className="mt-4 text-xl font-bold">Session not found</h1><Button className="mt-5" onClick={() => router.push("/explore")}>Explore events</Button></Card></div>;
  return <div className="min-h-screen bg-[var(--surface)] pb-40 lg:pb-10"><div className="border-b border-[var(--line)] bg-white"><div className="page-container flex flex-col justify-between gap-4 py-6 sm:flex-row sm:items-center"><div><div className="flex flex-wrap gap-2"><Badge tone="brand">Choose seats</Badge><Badge>{session.layoutVersionId.replace("layout-", "Layout ")}</Badge></div><h1 className="mt-3 text-2xl font-bold tracking-[-.04em] text-[var(--ink)] sm:text-3xl">{event.title}</h1><p className="mt-1 text-sm text-[var(--muted)]">{formatEventDate(session.startsAt)} · {event.venue}</p></div>{selected.length ? <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-800"><Clock3 className="size-4" />Held for {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</div> : null}</div></div>
    <div className="page-container grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_350px]"><div className="min-w-0"><Card className="mb-4 p-4"><div className="flex flex-wrap items-center justify-between gap-4"><SeatLegend /><div className="flex flex-wrap gap-2"><Select aria-label="Seat price zone" value={priceZone} onChange={(event) => setPriceZone(event.target.value)} className="w-36"><option>All prices</option><option>Platinum</option><option>Gold</option><option>Silver</option></Select><Button variant="outline" onClick={() => setFinderOpen(true)}><Sparkles className="size-4" />Find best seats</Button></div></div></Card><SeatMap seats={shownSeats} selectedIds={selectedIds} onSeatClick={(id) => toggleSeat(sessionId, id)} /><div className="mt-4"><BestSeatBanner /></div></div>
      <aside className="hidden self-start lg:sticky lg:top-24 lg:block"><OrderPanel selected={selected} total={total} clearSelection={clearSelection} onContinue={() => router.push("/checkout")} /></aside></div>
    <div className="market-sticky-action fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-white p-4 shadow-[0_-10px_35px_rgba(15,23,42,.1)] lg:hidden"><div className="page-container flex items-center justify-between gap-4 !px-0"><div><p className="text-xs text-[var(--muted)]">{selected.length} seat{selected.length === 1 ? "" : "s"}</p><p className="text-lg font-bold text-[var(--ink)]">{formatMoney(total, currency)}</p></div><Button disabled={!selected.length} onClick={() => router.push("/checkout")}>Continue</Button></div></div>
    {finderOpen ? <Modal title="Find the best available seats" description="We’ll prioritize adjacent seats with the best central sightline." onClose={() => setFinderOpen(false)}><div className="grid gap-4 sm:grid-cols-2"><Field label="Number of seats"><Input type="number" min={1} max={6} value={count} onChange={(event) => setCount(Number(event.target.value))} /></Field><Field label="Maximum total budget"><Input type="number" step={500} value={budget / 100} onChange={(event) => setBudget(Number(event.target.value) * 100)} /></Field><Field label="Preferred section"><Select value={section} onChange={(event) => setSection(event.target.value)}><option>Any</option><option>Premium Stalls</option><option>Stalls</option><option>Rear Circle</option></Select></Field><label className="flex items-center gap-3 self-end rounded-xl border border-[var(--line)] p-3.5 text-sm font-semibold"><input type="checkbox" checked={accessible} onChange={(event) => setAccessible(event.target.checked)} className="size-4 accent-violet-600" />Accessibility seating</label></div><Button className="mt-6 w-full" onClick={() => { const result = recommendSeats(sessionId, count, budget, section, accessible); if (result.length) setFinderOpen(false); }}><Sparkles className="size-4" />Recommend adjacent seats</Button></Modal> : null}</div>;
}

function OrderPanel({ selected, total, clearSelection, onContinue }: { selected: ({ id: string; section: string; row: string; number: number; price: number } | undefined)[]; total: number; clearSelection: () => void; onContinue: () => void }) {
  return <Card className="overflow-hidden"><div className="border-b border-[var(--line)] p-5"><div className="flex items-center justify-between"><h2 className="font-bold text-[var(--ink)]">Your seats</h2>{selected.length ? <button onClick={clearSelection} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600"><Eraser className="size-3.5" />Clear</button> : null}</div></div><div className="p-5">{selected.length ? <div className="grid gap-3">{selected.map((seat) => seat ? <div key={seat.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><div><p className="text-sm font-bold text-[var(--ink)]">Row {seat.row} · Seat {seat.number}</p><p className="mt-0.5 text-xs text-[var(--muted)]">{seat.section}</p></div><p className="text-sm font-bold">{formatMoney(seat.price, currency)}</p></div> : null)}</div> : <div className="py-8 text-center"><span className="mx-auto grid size-11 place-items-center rounded-full bg-slate-100 text-slate-400"><Ticket className="size-5" /></span><p className="mt-3 text-sm font-bold text-[var(--ink)]">No seats selected</p><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Tap available seats on the map to add them.</p></div>}<div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4"><span className="text-sm font-semibold">Seat total</span><strong className="text-xl">{formatMoney(total, currency)}</strong></div><Button className="mt-4 w-full" disabled={!selected.length} onClick={onContinue}>Continue to checkout</Button><p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[10px] leading-4 text-slate-400"><ShieldCheck className="mt-0.5 size-3 shrink-0" />Seats are held for 10 minutes once selected.</p></div></Card>;
}
