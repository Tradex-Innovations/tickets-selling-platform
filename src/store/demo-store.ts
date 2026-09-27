"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultWizardDraft, initialCheckIns, initialEvents, initialOrders, initialSeats, initialTickets, makeSeats } from "@/data/mock-data";
import { calculateOrderTotals, checkInTicket, issueTickets, recommendAdjacentSeats, sellSeats, transferTicket } from "@/lib/domain";
import { isRoleAvailable } from "@/lib/demo-access";
import type { CheckIn, DemoRole, EventRecord, Order, Seat, Ticket, ToastMessage, WizardDraft } from "@/types/domain";

interface CheckoutInput {
  customerName: string;
  customerEmail: string;
  paymentSuccess: boolean;
  addOns: number;
  channel?: "web" | "box-office";
}

interface DemoStore {
  role: DemoRole;
  events: EventRecord[];
  seatsBySession: Record<string, Seat[]>;
  orders: Order[];
  tickets: Ticket[];
  checkIns: CheckIn[];
  selectedSessionId?: string;
  selectedSeatIds: string[];
  holdExpiresAt?: number;
  promoCode: string;
  lastOrderId?: string;
  favorites: string[];
  wizardDraft: WizardDraft;
  sellerApproved: boolean;
  commissionRate: number;
  toasts: ToastMessage[];
  setRole: (role: DemoRole) => void;
  setSession: (sessionId: string) => void;
  toggleSeat: (sessionId: string, seatId: string) => void;
  recommendSeats: (sessionId: string, count: number, budget: number, section: string, accessibility: boolean) => Seat[];
  clearSelection: () => void;
  setPromoCode: (code: string) => void;
  toggleFavorite: (eventId: string) => void;
  checkout: (input: CheckoutInput) => Order;
  checkIn: (ticketId: string, gate?: string) => { ok: boolean; reason?: string };
  undoCheckIn: (ticketId: string) => void;
  transfer: (ticketId: string, name: string, email: string) => void;
  updateWizardDraft: (patch: Partial<WizardDraft>) => void;
  submitWizardEvent: () => EventRecord;
  approveEvent: (eventId: string) => void;
  requestChanges: (eventId: string) => void;
  setSellerApproved: (approved: boolean) => void;
  setCommissionRate: (rate: number) => void;
  featureEvent: (eventId: string) => void;
  createLayoutVersion: () => void;
  notify: (title: string, description?: string, tone?: ToastMessage["tone"]) => void;
  dismissToast: (id: number) => void;
  resetDemo: () => void;
}

const initialState = () => ({
  role: "customer" as DemoRole,
  events: initialEvents,
  seatsBySession: initialSeats,
  orders: initialOrders,
  tickets: initialTickets,
  checkIns: initialCheckIns,
  selectedSessionId: undefined,
  selectedSeatIds: [] as string[],
  holdExpiresAt: undefined,
  promoCode: "",
  lastOrderId: undefined,
  favorites: ["hamlet-colombo"],
  wizardDraft: defaultWizardDraft,
  sellerApproved: true,
  commissionRate: 8.5,
  toasts: [] as ToastMessage[],
});

export const useDemoStore = create<DemoStore>()(persist((set, get) => ({
  ...initialState(),
  setRole: (role) => {
    if (!isRoleAvailable(role)) return;
    set({ role });
    get().notify("Demo role changed", `You are now viewing Encore as ${role.replace("-", " ")}.`, "info");
  },
  setSession: (selectedSessionId) => set({ selectedSessionId, selectedSeatIds: [], promoCode: "", holdExpiresAt: undefined }),
  toggleSeat: (sessionId, seatId) => {
    const state = get();
    const seat = state.seatsBySession[sessionId]?.find((item) => item.id === seatId);
    if (!seat || seat.status !== "available") {
      state.notify("Seat unavailable", "That seat has already been held, sold or blocked.", "error");
      return;
    }
    const alreadySelected = state.selectedSeatIds.includes(seatId);
    if (!alreadySelected && state.selectedSeatIds.length >= 6) {
      state.notify("Ticket limit reached", "You can reserve a maximum of 6 seats in this demo.", "error");
      return;
    }
    const selectedSeatIds = alreadySelected ? state.selectedSeatIds.filter((id) => id !== seatId) : [...state.selectedSeatIds, seatId];
    const holdExpiresAt = selectedSeatIds.length ? (state.holdExpiresAt ?? Date.now() + 10 * 60 * 1000) : undefined;
    set({ selectedSessionId: sessionId, selectedSeatIds, holdExpiresAt });
  },
  recommendSeats: (sessionId, count, budget, section, accessibility) => {
    const recommendation = recommendAdjacentSeats(get().seatsBySession[sessionId] ?? [], count, budget, section, accessibility);
    if (recommendation.length) {
      set({ selectedSessionId: sessionId, selectedSeatIds: recommendation.map((seat) => seat.id), holdExpiresAt: Date.now() + 10 * 60 * 1000 });
      get().notify("Best seats found", `${recommendation[0].row}${recommendation[0].number}–${recommendation.at(-1)?.row}${recommendation.at(-1)?.number} are adjacent and within budget.`, "success");
    } else get().notify("No exact match", "Try a higher budget, fewer seats or any section.", "error");
    return recommendation;
  },
  clearSelection: () => set({ selectedSeatIds: [], holdExpiresAt: undefined }),
  setPromoCode: (promoCode) => set({ promoCode }),
  toggleFavorite: (eventId) => set((state) => ({ favorites: state.favorites.includes(eventId) ? state.favorites.filter((id) => id !== eventId) : [...state.favorites, eventId] })),
  checkout: (input) => {
    const state = get();
    const sessionId = state.selectedSessionId;
    if (!sessionId || !state.selectedSeatIds.length) throw new Error("Select at least one seat before checkout.");
    const event = state.events.find((item) => item.sessions.some((session) => session.id === sessionId));
    const sessionSeats = state.seatsBySession[sessionId] ?? [];
    const selectedSeats = state.selectedSeatIds.map((id) => sessionSeats.find((seat) => seat.id === id)).filter((seat): seat is Seat => Boolean(seat));
    const totals = calculateOrderTotals(selectedSeats.map((seat) => seat.price), { promoCode: state.promoCode, addOns: input.addOns });
    const id = `ORD-${Math.floor(10000 + Math.random() * 89999)}`;
    const order: Order = { id, eventId: event?.id ?? "unknown", sessionId, customerName: input.customerName, customerEmail: input.customerEmail, lines: selectedSeats.map((seat) => ({ seatId: seat.id, label: `${seat.section} · ${seat.row}${seat.number}`, price: seat.price })), ...totals, status: input.paymentSuccess ? "paid" : "failed", channel: input.channel ?? "web", createdAt: new Date().toISOString(), promoCode: state.promoCode || undefined };
    if (!input.paymentSuccess) {
      set({ orders: [order, ...state.orders], selectedSeatIds: [], holdExpiresAt: undefined, lastOrderId: order.id });
      state.notify("Payment declined", "No seats were sold. You can retry with the demo wallet.", "error");
      return order;
    }
    const updatedSeats = sellSeats(sessionSeats, state.selectedSeatIds);
    const newTickets = issueTickets(order);
    set({ orders: [order, ...state.orders], tickets: [...newTickets, ...state.tickets], seatsBySession: { ...state.seatsBySession, [sessionId]: updatedSeats }, selectedSeatIds: [], holdExpiresAt: undefined, lastOrderId: order.id, promoCode: "" });
    state.notify("Payment confirmed", `${newTickets.length} ticket${newTickets.length === 1 ? "" : "s"} added to your wallet.`, "success");
    return order;
  },
  checkIn: (ticketId, gate) => {
    const state = get();
    const ticket = state.tickets.find((item) => item.id === ticketId);
    if (!ticket) return { ok: false, reason: "not-found" };
    const result = checkInTicket(ticket, state.checkIns, gate ?? ticket.entrance);
    if (!result.ok) return { ok: false, reason: result.reason };
    const checkIn: CheckIn = { id: `CI-${Date.now()}`, ticketId, scannedAt: new Date().toISOString(), gate: gate ?? ticket.entrance, staff: "Kasun Jayawardena" };
    set({ checkIns: [checkIn, ...state.checkIns], tickets: state.tickets.map((item) => item.id === ticketId ? { ...item, status: "checked-in" } : item) });
    return { ok: true };
  },
  undoCheckIn: (ticketId) => set((state) => ({ checkIns: state.checkIns.filter((entry) => entry.ticketId !== ticketId), tickets: state.tickets.map((ticket) => ticket.id === ticketId ? { ...ticket, status: "valid" } : ticket) })),
  transfer: (ticketId, name, email) => {
    const state = get();
    const ticket = state.tickets.find((item) => item.id === ticketId);
    if (!ticket || ticket.status !== "valid") return;
    const result = transferTicket(ticket, name, email);
    set({ tickets: [result.replacement, ...state.tickets.map((item) => item.id === ticketId ? result.invalidated : item)] });
    state.notify("Ticket transferred", `A replacement ticket was issued to ${name}; the original QR is invalid.`, "success");
  },
  updateWizardDraft: (patch) => set((state) => ({ wizardDraft: { ...state.wizardDraft, ...patch } })),
  submitWizardEvent: () => {
    const state = get();
    const draft = state.wizardDraft;
    const id = "colombo-afterglow";
    const sessionId = "session-afterglow";
    const event: EventRecord = { id, title: draft.title, slug: id, category: draft.category, description: draft.description, shortDescription: draft.description, organizerId: "lumen-live", organizer: "Lumen Live Entertainment", venueId: draft.venueId, venue: "Nelum Pokuna Theatre", location: "Colombo 07", status: "pending", image: "/images/crescendo-hero.png", imageTone: "violet", sessions: [{ id: sessionId, eventId: id, startsAt: new Date(draft.startsAt).toISOString(), endsAt: new Date(new Date(draft.startsAt).getTime() + 3 * 60 * 60 * 1000).toISOString(), hallId: draft.hallId, layoutVersionId: draft.layoutVersionId, label: "Opening Night" }], ticketCategories: [{ id: "afterglow-reserved", name: "Reserved seating", description: "Numbered stalls seating", price: draft.ticketPrice, allocation: 112 }], tags: ["Live music", "New"], ageRestriction: "All ages", accessibility: ["Wheelchair spaces", "Companion seats"], facilities: ["Parking", "Food court", "Cloakroom"], entryInstructions: "Doors open 75 minutes before showtime.", refundPolicy: draft.refundPolicy };
    const exists = state.events.some((item) => item.id === id);
    set({ events: exists ? state.events.map((item) => item.id === id ? event : item) : [event, ...state.events], seatsBySession: { ...state.seatsBySession, [sessionId]: state.seatsBySession[sessionId] ?? makeSeats("AG", Math.max(100_000, draft.ticketPrice - 400_000)) } });
    state.notify("Event submitted", "Colombo Afterglow is awaiting platform approval.", "success");
    return event;
  },
  approveEvent: (eventId) => {
    set((state) => ({ events: state.events.map((event) => event.id === eventId ? { ...event, status: "published" } : event) }));
    get().notify("Event approved", "The event is now visible in the marketplace.", "success");
  },
  requestChanges: (eventId) => {
    set((state) => ({ events: state.events.map((event) => event.id === eventId ? { ...event, status: "changes-requested" } : event) }));
    get().notify("Changes requested", "The organizer has been notified with clear review notes.", "info");
  },
  setSellerApproved: (sellerApproved) => set({ sellerApproved }),
  setCommissionRate: (commissionRate) => set({ commissionRate }),
  featureEvent: (eventId) => set((state) => ({ events: state.events.map((event) => event.id === eventId ? { ...event, featured: !event.featured } : event) })),
  createLayoutVersion: () => get().notify("Layout v5 created", "Published sessions remain locked to their historical layout versions.", "success"),
  notify: (title, description, tone = "info") => set((state) => ({ toasts: [...state.toasts, { id: Date.now() + Math.random(), title, description, tone }] })),
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  resetDemo: () => set(initialState()),
}), {
  name: "encore-demo-v1",
  merge: (persisted, current) => {
    const previous = persisted as Partial<DemoStore> | undefined;
    return { ...current, ...previous, role: previous?.role && isRoleAvailable(previous.role) ? previous.role : "customer" };
  },
  partialize: (state) => ({ role: state.role, events: state.events, seatsBySession: state.seatsBySession, orders: state.orders, tickets: state.tickets, checkIns: state.checkIns, selectedSessionId: state.selectedSessionId, selectedSeatIds: state.selectedSeatIds, holdExpiresAt: state.holdExpiresAt, promoCode: state.promoCode, lastOrderId: state.lastOrderId, favorites: state.favorites, wizardDraft: state.wizardDraft, sellerApproved: state.sellerApproved, commissionRate: state.commissionRate }),
}));
