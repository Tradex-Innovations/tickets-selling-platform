export type DemoRole =
  | "customer"
  | "seller"
  | "venue-manager"
  | "box-office"
  | "check-in"
  | "admin";

export type EventStatus =
  | "draft"
  | "pending"
  | "changes-requested"
  | "published"
  | "paused"
  | "sold-out"
  | "postponed"
  | "cancelled"
  | "completed";

export type SeatStatus = "available" | "held" | "sold" | "blocked";
export type SeatKind = "standard" | "vip" | "accessible" | "companion" | "restricted";

export interface Seat {
  id: string;
  section: string;
  row: string;
  number: number;
  x: number;
  y: number;
  price: number;
  priceZone: string;
  kind: SeatKind;
  status: SeatStatus;
  heldBy?: string;
  holdExpiresAt?: number;
}

export interface Session {
  id: string;
  eventId: string;
  startsAt: string;
  endsAt: string;
  hallId: string;
  layoutVersionId: string;
  label: string;
  format?: string;
  language?: string;
  status?: "scheduled" | "cancelled" | "rescheduled";
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string;
  price: number;
  allocation: number;
}

export interface EventRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  organizerId: string;
  organizer: string;
  venueId: string;
  venue: string;
  location: string;
  status: EventStatus;
  image: string;
  imageTone: string;
  sessions: Session[];
  ticketCategories: TicketCategory[];
  tags: string[];
  ageRestriction: string;
  accessibility: string[];
  facilities: string[];
  entryInstructions: string;
  refundPolicy: string;
  featured?: boolean;
  isMovie?: boolean;
  language?: string;
  duration?: string;
  formats?: string[];
  cast?: string[];
}

export interface LayoutVersion {
  id: string;
  hallId: string;
  name: string;
  version: number;
  status: "draft" | "published" | "archived";
  capacity: number;
  createdAt: string;
  lockedBySessions: string[];
}

export interface Hall {
  id: string;
  venueId: string;
  name: string;
  capacity: number;
  layouts: LayoutVersion[];
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  address: string;
  description: string;
  capacity: number;
  facilities: string[];
  accessibility: string[];
  parking: string;
  transport: string;
  contact: string;
  halls: Hall[];
}

export interface OrderLine {
  seatId: string;
  label: string;
  price: number;
}

export interface Order {
  id: string;
  eventId: string;
  sessionId: string;
  customerName: string;
  customerEmail: string;
  lines: OrderLine[];
  subtotal: number;
  platformFee: number;
  processingFee: number;
  tax: number;
  discount: number;
  addOns: number;
  total: number;
  status: "paid" | "failed" | "refunded";
  channel: "web" | "box-office";
  createdAt: string;
  promoCode?: string;
}

export type TicketStatus =
  | "valid"
  | "checked-in"
  | "transferred"
  | "listed"
  | "resold"
  | "cancelled"
  | "refunded";

export interface Ticket {
  id: string;
  number: string;
  orderId: string;
  eventId: string;
  sessionId: string;
  seatId: string;
  holderName: string;
  holderEmail: string;
  status: TicketStatus;
  qrToken: string;
  issuedAt: string;
  replacementTicketId?: string;
  entrance: string;
}

export interface CheckIn {
  id: string;
  ticketId: string;
  scannedAt: string;
  gate: string;
  staff: string;
}

export interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
}

export interface WizardDraft {
  title: string;
  category: string;
  description: string;
  venueId: string;
  hallId: string;
  layoutVersionId: string;
  startsAt: string;
  ticketPrice: number;
  ticketLimit: number;
  promoCode: string;
  refundPolicy: string;
}
