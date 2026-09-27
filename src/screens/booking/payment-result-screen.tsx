"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CircleX, Download, Home, RotateCcw, Ticket } from "lucide-react";
import { TicketCard } from "@/components/tickets/qr-ticket";
import { Button, Card } from "@/components/ui/primitives";
import { useDemoStore } from "@/store/demo-store";

export function PaymentResultScreen() {
  const params = useSearchParams();
  const lastOrderId = useDemoStore((state) => state.lastOrderId);
  const orderId = params.get("order") ?? lastOrderId;
  const order = useDemoStore((state) => state.orders.find((item) => item.id === orderId));
  const tickets = useDemoStore((state) => state.tickets).filter((item) => item.orderId === orderId);
  const events = useDemoStore((state) => state.events);
  const seatsBySession = useDemoStore((state) => state.seatsBySession);
  const event = events.find((item) => item.id === order?.eventId);
  if (!order || order.status === "failed") return <div className="min-h-[75vh] bg-[var(--surface)] py-14"><div className="page-container"><Card className="mx-auto max-w-xl p-8 text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-red-50 text-red-600"><CircleX className="size-8" /></span><h1 className="mt-5 text-3xl font-bold tracking-[-.04em] text-[var(--ink)]">Payment wasn’t completed</h1><p className="mt-3 leading-7 text-[var(--muted)]">The payment simulation was declined. No seats were sold and your card was not charged.</p><div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row"><Link href={order ? `/booking/${order.sessionId}/seats` : "/explore"}><Button><RotateCcw className="size-4" />Select seats and retry</Button></Link><Link href="/explore"><Button variant="outline">Return to events</Button></Link></div></Card></div></div>;
  return <div className="min-h-screen bg-[var(--surface)] pb-16"><section className="bg-[var(--ink)] py-12 text-white"><div className="page-container text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20"><CheckCircle2 className="size-8" /></span><p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-emerald-300">Order {order.id}</p><h1 className="mt-3 text-4xl font-bold tracking-[-.05em]">You’re going to {event?.title}.</h1><p className="mx-auto mt-3 max-w-xl leading-7 text-slate-300">Payment confirmed. Your individual tickets are ready and have been saved to the ticket wallet.</p><div className="mt-6 flex flex-wrap justify-center gap-2"><Link href="/account/tickets"><Button className="bg-white text-slate-950 shadow-none hover:bg-violet-100"><Ticket className="size-4" />Open ticket wallet</Button></Link><Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20"><Download className="size-4" />Download all</Button><Link href="/"><Button variant="ghost" className="text-slate-300 hover:bg-white/10 hover:text-white"><Home className="size-4" />Marketplace</Button></Link></div></div></section><div className="page-container py-9"><div className="mx-auto grid max-w-3xl gap-5">{tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} event={event} seat={seatsBySession[ticket.sessionId]?.find((seat) => seat.id === ticket.seatId)} expanded />)}</div></div></div>;
}
