import { calculateOrderTotals, checkInTicket, issueTickets, releaseExpiredSeats, sellSeats, sessionsConflict } from "@/lib/domain";
import type { CheckIn, Order, Seat, Session, Ticket } from "@/types/domain";

const simulatedDelay = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = { signInDemo: async <T>(role: T) => { await simulatedDelay(350); return { role, authenticated: true }; } };
export const eventService = { submitForApproval: async <T>(event: T) => { await simulatedDelay(); return event; } };
export const venueService = { hasConflict: (session: Session, existing: Session[]) => existing.some((item) => sessionsConflict(session, item)) };
export const seatingService = { releaseExpired: releaseExpiredSeats, sell: sellSeats };
export const reservationService = { hold: async (seats: Seat[]) => { await simulatedDelay(450); return seats.map((seat) => ({ ...seat, status: "held" as const })); } };
export const orderService = { calculateTotals: calculateOrderTotals };
export const paymentService = { process: async (outcome: "success" | "failure") => { await simulatedDelay(1100); return { ok: outcome === "success", reference: `PAY-${Date.now()}` }; } };
export const ticketService = { issue: issueTickets };
export const checkInService = { validate: (ticket: Ticket, checkIns: CheckIn[], gate: string) => checkInTicket(ticket, checkIns, gate) };
export const refundService = { request: async (order: Order) => { await simulatedDelay(); return { orderId: order.id, status: "pending-review" }; } };
export const payoutService = { estimate: (orders: Order[], commissionRate: number) => Math.round(orders.filter((order) => order.status === "paid").reduce((sum, order) => sum + order.subtotal - order.discount, 0) * (1 - commissionRate / 100)) };
export const notificationService = { send: async (channel: "email" | "sms", recipient: string) => { await simulatedDelay(500); return { channel, recipient, status: "delivered" }; } };
export const moderationService = { review: async (decision: "approved" | "changes-requested" | "rejected") => { await simulatedDelay(600); return { decision, reviewedAt: new Date().toISOString() }; } };
