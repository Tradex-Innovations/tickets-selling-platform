import { describe, expect, it } from "vitest";
import { initialEvents, initialSeats } from "@/data/mock-data";
import { calculateOrderTotals, canAccessRoute, checkInTicket, issueTickets, releaseExpiredSeats, sellSeats, sessionsConflict, transferTicket } from "@/lib/domain";
import type { Order } from "@/types/domain";

const paidOrder: Order = { id: "ORD-TEST", eventId: "crescendo-colombo", sessionId: "session-crescendo", customerName: "Test Customer", customerEmail: "test@example.com", lines: [{ seatId: "CC-A5", label: "A5", price: 500_000 }], subtotal: 500_000, discount: 0, platformFee: 25_000, processingFee: 12_500, tax: 0, addOns: 0, total: 537_500, status: "paid", channel: "web", createdAt: "2026-09-03T12:00:00Z" };

describe("ticketing domain", () => {
  it("prevents a seat from being sold twice", () => {
    const seats = sellSeats(initialSeats["session-crescendo"], ["CC-A5"]);
    expect(() => sellSeats(seats, ["CC-A5"])).toThrow(/already sold/i);
  });

  it("releases an expired reservation", () => {
    const seats = [{ ...initialSeats["session-crescendo"][0], status: "held" as const, holdExpiresAt: 100 }];
    expect(releaseExpiredSeats(seats, 101)[0].status).toBe("available");
  });

  it("issues an individual ticket after successful payment", () => {
    const tickets = issueTickets(paidOrder);
    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toMatchObject({ status: "valid", seatId: "CC-A5", orderId: "ORD-TEST" });
  });

  it("does not issue tickets for a failed payment", () => {
    expect(issueTickets({ ...paidOrder, status: "failed" })).toHaveLength(0);
  });

  it("keeps movie showtime availability independent", () => {
    const first = sellSeats(initialSeats["session-serendib-1"], ["SS1-A5"]);
    expect(first.find((seat) => seat.id === "SS1-A5")?.status).toBe("sold");
    expect(initialSeats["session-serendib-2"].find((seat) => seat.id === "SS2-A5")?.status).toBe("available");
  });

  it("does not permit a ticket to check in twice", () => {
    const ticket = issueTickets(paidOrder)[0];
    expect(checkInTicket(ticket, [], ticket.entrance).ok).toBe(true);
    expect(checkInTicket(ticket, [{ id: "CI-1", ticketId: ticket.id, scannedAt: "2026-09-03T12:01:00Z", gate: ticket.entrance, staff: "Staff" }], ticket.entrance)).toMatchObject({ ok: false, reason: "already-scanned" });
  });

  it("invalidates the original ticket on transfer", () => {
    const ticket = issueTickets(paidOrder)[0];
    const result = transferTicket(ticket, "New Holder", "new@example.com");
    expect(result.invalidated.status).toBe("transferred");
    expect(result.replacement.status).toBe("valid");
    expect(result.replacement.qrToken).not.toBe(ticket.qrToken);
  });

  it("restricts portal routes by role", () => {
    expect(canAccessRoute("customer", "/seller/events")).toBe(false);
    expect(canAccessRoute("seller", "/seller/events")).toBe(true);
    expect(canAccessRoute("admin", "/explore")).toBe(true);
    expect(canAccessRoute("seller", "/seller/events", true)).toBe(true);
    expect(canAccessRoute("customer", "/account/tickets", true)).toBe(true);
    expect(canAccessRoute("admin", "/admin", true)).toBe(false);
    expect(canAccessRoute("seller", "/venue-manager/layouts", true)).toBe(false);
    expect(canAccessRoute("box-office", "/", true)).toBe(false);
    expect(canAccessRoute("admin", "/admin", false)).toBe(true);
  });

  it("detects overlapping bookings in the same hall", () => {
    const session = initialEvents[0].sessions[0];
    expect(sessionsConflict(session, { hallId: session.hallId, startsAt: "2026-10-17T20:00:00+05:30", endsAt: session.endsAt })).toBe(true);
    expect(sessionsConflict(session, { hallId: "another-hall", startsAt: session.startsAt, endsAt: session.endsAt })).toBe(false);
  });

  it("calculates discounts, fees and total using integer minor units", () => {
    expect(calculateOrderTotals([500_000, 500_000], { promoCode: "ENCORE10", addOns: 100_000 })).toEqual({ subtotal: 1_000_000, discount: 100_000, platformFee: 45_000, processingFee: 22_500, tax: 0, addOns: 100_000, total: 1_067_500 });
  });
});
