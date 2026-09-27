import type { CheckIn, DemoRole, Order, Seat, Session, Ticket } from "@/types/domain";
import { formatNumber } from "@/lib/utils";
import { isRoleAvailable, isRouteAvailable, ORGANIZER_PREVIEW_ONLY } from "@/lib/demo-access";

export const PLATFORM_FEE_RATE = 0.05;
export const PROCESSING_FEE_RATE = 0.025;

export function formatMoney(minorUnits: number, currency = "LKR") {
  const amount = formatNumber(Math.round(minorUnits / 100));
  return `${currency === "LKR" ? "Rs." : currency} ${amount}`;
}

export function calculateOrderTotals(
  prices: number[],
  options: { promoCode?: string; addOns?: number } = {},
) {
  const subtotal = prices.reduce((sum, value) => sum + value, 0);
  const discount = options.promoCode?.toUpperCase() === "ENCORE10" ? Math.round(subtotal * 0.1) : 0;
  const platformFee = Math.round((subtotal - discount) * PLATFORM_FEE_RATE);
  const processingFee = Math.round((subtotal - discount) * PROCESSING_FEE_RATE);
  const tax = 0;
  const addOns = options.addOns ?? 0;
  return {
    subtotal,
    discount,
    platformFee,
    processingFee,
    tax,
    addOns,
    total: subtotal - discount + platformFee + processingFee + tax + addOns,
  };
}

export function sellSeats(seats: Seat[], seatIds: string[]) {
  const requested = new Set(seatIds);
  const unavailable = seats.filter((seat) => requested.has(seat.id) && seat.status === "sold");
  if (unavailable.length) throw new Error(`${unavailable[0].row}${unavailable[0].number} is already sold.`);
  return seats.map((seat) => requested.has(seat.id) ? { ...seat, status: "sold" as const, heldBy: undefined, holdExpiresAt: undefined } : seat);
}

export function releaseExpiredSeats(seats: Seat[], now: number) {
  return seats.map((seat) =>
    seat.status === "held" && (seat.holdExpiresAt ?? 0) <= now
      ? { ...seat, status: "available" as const, heldBy: undefined, holdExpiresAt: undefined }
      : seat,
  );
}

export function issueTickets(order: Order): Ticket[] {
  if (order.status !== "paid") return [];
  return order.lines.map((line, index) => ({
    id: `ticket-${order.id}-${index + 1}`,
    number: `EVT-${order.id.slice(-6).toUpperCase()}-${String(index + 1).padStart(2, "0")}`,
    orderId: order.id,
    eventId: order.eventId,
    sessionId: order.sessionId,
    seatId: line.seatId,
    holderName: order.customerName,
    holderEmail: order.customerEmail,
    status: "valid",
    qrToken: `${order.id}:${line.seatId}:${index + 1}`,
    issuedAt: order.createdAt,
    entrance: index % 2 === 0 ? "Gate A" : "Gate B",
  }));
}

export function checkInTicket(ticket: Ticket, checkIns: CheckIn[], gate: string) {
  if (ticket.status === "checked-in" || checkIns.some((entry) => entry.ticketId === ticket.id)) {
    return { ok: false as const, reason: "already-scanned" as const };
  }
  if (["cancelled", "refunded", "transferred", "resold"].includes(ticket.status)) {
    return { ok: false as const, reason: ticket.status };
  }
  if (gate !== ticket.entrance) return { ok: false as const, reason: "wrong-gate" as const };
  return { ok: true as const };
}

export function transferTicket(ticket: Ticket, newName: string, newEmail: string, now = new Date().toISOString()) {
  const replacement: Ticket = {
    ...ticket,
    id: `${ticket.id}-T${Date.now()}`,
    number: `${ticket.number}-R1`,
    holderName: newName,
    holderEmail: newEmail,
    status: "valid",
    issuedAt: now,
    replacementTicketId: undefined,
    qrToken: `${ticket.qrToken}:replacement`,
  };
  return { invalidated: { ...ticket, status: "transferred" as const, replacementTicketId: replacement.id }, replacement };
}

export function sessionsConflict(a: Pick<Session, "hallId" | "startsAt" | "endsAt">, b: Pick<Session, "hallId" | "startsAt" | "endsAt">) {
  return a.hallId === b.hallId && new Date(a.startsAt) < new Date(b.endsAt) && new Date(b.startsAt) < new Date(a.endsAt);
}

const routeRole: Record<string, DemoRole> = {
  "/account": "customer",
  "/seller": "seller",
  "/venue-manager": "venue-manager",
  "/box-office": "box-office",
  "/check-in": "check-in",
  "/admin": "admin",
};

export function canAccessRoute(role: DemoRole, pathname: string, previewOnly = ORGANIZER_PREVIEW_ONLY) {
  if (!isRoleAvailable(role, previewOnly) || !isRouteAvailable(pathname, previewOnly)) return false;
  const match = Object.entries(routeRole).find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return !match || match[1] === role;
}

export function recommendAdjacentSeats(seats: Seat[], count: number, budget: number, section?: string, accessibility = false) {
  const eligible = seats
    .filter((seat) => seat.status === "available")
    .filter((seat) => !section || section === "Any" || seat.section === section)
    .filter((seat) => !accessibility || seat.kind === "accessible" || seat.kind === "companion")
    .sort((a, b) => a.price - b.price || a.row.localeCompare(b.row) || a.number - b.number);
  for (const first of eligible) {
    const group = eligible.filter((seat) => seat.section === first.section && seat.row === first.row && seat.number >= first.number && seat.number < first.number + count);
    const adjacent = group.length === count && group.every((seat, index) => seat.number === first.number + index);
    if (adjacent && group.reduce((sum, seat) => sum + seat.price, 0) <= budget) return group;
  }
  return [];
}
