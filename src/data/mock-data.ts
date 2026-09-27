import type { CheckIn, EventRecord, Order, Seat, Ticket, Venue, WizardDraft } from "@/types/domain";

export const currency = "LKR";

function makeSeats(prefix: string, basePrice: number): Seat[] {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  rows.forEach((row, rowIndex) => {
    for (let number = 1; number <= 14; number += 1) {
      const kind = rowIndex === 0 && [1, 2].includes(number)
        ? "accessible"
        : rowIndex === 0 && [3, 4].includes(number)
          ? "companion"
          : rowIndex < 2
            ? "vip"
            : number === 14
              ? "restricted"
              : "standard";
      const status = (rowIndex === 2 && [6, 7, 8].includes(number)) || (rowIndex === 5 && [3, 4].includes(number))
        ? "sold"
        : rowIndex === 6 && number === 12
          ? "blocked"
          : "available";
      seats.push({
        id: `${prefix}-${row}${number}`,
        section: rowIndex < 3 ? "Premium Stalls" : rowIndex < 6 ? "Stalls" : "Rear Circle",
        row,
        number,
        x: 72 + number * 38 + (rowIndex % 2) * 8,
        y: 128 + rowIndex * 38,
        price: basePrice + Math.max(0, 5 - rowIndex) * 100_000,
        priceZone: rowIndex < 2 ? "Platinum" : rowIndex < 5 ? "Gold" : "Silver",
        kind,
        status,
      });
    }
  });
  return seats;
}

export const venues: Venue[] = [
  {
    id: "nelum-pokuna",
    name: "Nelum Pokuna Mahinda Rajapaksa Theatre",
    type: "Performing arts theatre",
    address: "110 Ananda Coomaraswamy Mawatha, Colombo 07",
    description: "A landmark performance venue with modern production facilities, accessible entrances and tiered seating.",
    capacity: 1288,
    facilities: ["Air conditioning", "Premium lounges", "Box office", "Food court", "Cloakroom"],
    accessibility: ["Step-free entrance", "Wheelchair bays", "Accessible washrooms", "Hearing assistance"],
    parking: "On-site and Independence Avenue parking; pre-booking recommended.",
    transport: "8 minutes from Colombo Fort by taxi; bus stops on Green Path.",
    contact: "+94 11 266 9044",
    halls: [{
      id: "nelum-main",
      venueId: "nelum-pokuna",
      name: "Main Auditorium",
      capacity: 1288,
      layouts: [
        { id: "layout-np-v3", hallId: "nelum-main", name: "Concert auditorium", version: 3, status: "published", capacity: 1288, createdAt: "2026-06-12", lockedBySessions: ["session-crescendo"] },
        { id: "layout-np-v4", hallId: "nelum-main", name: "Concert auditorium", version: 4, status: "draft", capacity: 1264, createdAt: "2026-08-28", lockedBySessions: [] },
      ],
    }],
  },
  {
    id: "savoy-wellawatte",
    name: "Savoy Cinema Complex",
    type: "Multiplex cinema",
    address: "12 Galle Road, Wellawatte, Colombo 06",
    description: "A multi-screen cinema with digital projection, Dolby audio and independent showtime inventory.",
    capacity: 680,
    facilities: ["Dolby audio", "Snack bar", "Online pickup", "Family washrooms"],
    accessibility: ["Lift access", "Wheelchair bays", "Companion seating"],
    parking: "Basement parking with 90 spaces.",
    transport: "Opposite Wellawatte railway station.",
    contact: "+94 11 744 4666",
    halls: [
      { id: "savoy-hall-1", venueId: "savoy-wellawatte", name: "Screen 1", capacity: 220, layouts: [{ id: "layout-savoy-v2", hallId: "savoy-hall-1", name: "Cinema standard", version: 2, status: "published", capacity: 220, createdAt: "2026-05-02", lockedBySessions: ["session-serendib-1", "session-serendib-2", "session-serendib-3"] }] },
      { id: "savoy-hall-2", venueId: "savoy-wellawatte", name: "Screen 2", capacity: 180, layouts: [{ id: "layout-savoy2-v1", hallId: "savoy-hall-2", name: "Cinema standard", version: 1, status: "published", capacity: 180, createdAt: "2026-04-12", lockedBySessions: [] }] },
    ],
  },
  {
    id: "cinnamon-grand",
    name: "Cinnamon Grand Colombo",
    type: "Hotel ballroom",
    address: "77 Galle Road, Colombo 03",
    description: "Premium ballroom and conference facilities with flexible table layouts.",
    capacity: 720,
    facilities: ["Valet parking", "Catering", "LED wall", "Green rooms"],
    accessibility: ["Step-free access", "Accessible washrooms"],
    parking: "Complimentary valet parking.",
    transport: "Central Colombo location.",
    contact: "+94 11 249 7000",
    halls: [{ id: "oak-room", venueId: "cinnamon-grand", name: "Oak Room", capacity: 450, layouts: [{ id: "layout-oak-v5", hallId: "oak-room", name: "Dinner tables", version: 5, status: "published", capacity: 420, createdAt: "2026-07-22", lockedBySessions: [] }] }],
  },
];

export const initialEvents: EventRecord[] = [
  {
    id: "crescendo-colombo",
    title: "Crescendo Colombo 2026",
    slug: "crescendo-colombo-2026",
    category: "Music",
    description: "A sweeping night of contemporary orchestral music, Sri Lankan voices and immersive visual production. Crescendo brings a 42-piece orchestra together with leading independent artists for one unforgettable performance.",
    shortDescription: "Orchestra, contemporary voices and immersive production in one landmark night.",
    organizerId: "lumen-live",
    organizer: "Lumen Live Entertainment",
    venueId: "nelum-pokuna",
    venue: "Nelum Pokuna Theatre",
    location: "Colombo 07",
    status: "published",
    image: "/images/crescendo-hero.png",
    imageTone: "indigo",
    sessions: [{ id: "session-crescendo", eventId: "crescendo-colombo", startsAt: "2026-10-17T19:00:00+05:30", endsAt: "2026-10-17T22:00:00+05:30", hallId: "nelum-main", layoutVersionId: "layout-np-v3", label: "Opening Night" }],
    ticketCategories: [
      { id: "cat-platinum", name: "Platinum", description: "Premium stalls and lounge access", price: 1_250_000, allocation: 240 },
      { id: "cat-gold", name: "Gold", description: "Central stalls seating", price: 850_000, allocation: 520 },
      { id: "cat-silver", name: "Silver", description: "Rear circle seating", price: 500_000, allocation: 528 },
    ],
    tags: ["Live music", "Orchestra", "Featured"], ageRestriction: "All ages; guests under 14 must be accompanied by an adult.",
    accessibility: ["Wheelchair spaces", "Companion seats", "Hearing assistance"],
    facilities: ["Parking", "Food court", "Cloakroom", "Air conditioning"],
    entryInstructions: "Doors open at 5:45 PM. Use the entrance printed on each ticket. Late seating is at the venue manager’s discretion.",
    refundPolicy: "Refundable until 7 days before the event. Name transfers are available until 24 hours before doors open.",
    featured: true,
  },
  {
    id: "serendib-skies",
    title: "Serendib Skies",
    slug: "serendib-skies",
    category: "Movies",
    description: "An intimate Sinhala-language drama following three generations rebuilding their family home after a monsoon. Presented in 2D and Dolby Atmos.",
    shortDescription: "A moving new Sri Lankan drama presented in Dolby Atmos.",
    organizerId: "silver-screen",
    organizer: "Silver Screen Lanka",
    venueId: "savoy-wellawatte",
    venue: "Savoy Cinema Complex",
    location: "Wellawatte, Colombo",
    status: "published",
    image: "/images/crescendo-hero.png",
    imageTone: "amber",
    sessions: [
      { id: "session-serendib-1", eventId: "serendib-skies", startsAt: "2026-09-05T14:30:00+05:30", endsAt: "2026-09-05T16:42:00+05:30", hallId: "savoy-hall-1", layoutVersionId: "layout-savoy-v2", label: "Matinee", format: "2D Dolby", language: "Sinhala" },
      { id: "session-serendib-2", eventId: "serendib-skies", startsAt: "2026-09-05T18:15:00+05:30", endsAt: "2026-09-05T20:27:00+05:30", hallId: "savoy-hall-1", layoutVersionId: "layout-savoy-v2", label: "Evening", format: "2D Dolby", language: "Sinhala" },
      { id: "session-serendib-3", eventId: "serendib-skies", startsAt: "2026-09-06T18:15:00+05:30", endsAt: "2026-09-06T20:27:00+05:30", hallId: "savoy-hall-1", layoutVersionId: "layout-savoy-v2", label: "Evening", format: "2D Dolby", language: "Sinhala" },
    ],
    ticketCategories: [{ id: "cat-cinema", name: "Standard", description: "Reserved cinema seating", price: 180_000, allocation: 220 }],
    tags: ["Now showing", "Sinhala", "Dolby"], ageRestriction: "PG-13", accessibility: ["Wheelchair bays", "Companion seats"], facilities: ["Snack bar", "Dolby audio", "Parking"],
    entryInstructions: "Please arrive 20 minutes before showtime. Outside food is not permitted.", refundPolicy: "Showtime exchanges are accepted up to 2 hours before screening.",
    isMovie: true, language: "Sinhala", duration: "2h 12m", formats: ["2D", "Dolby"], cast: ["Dinara Perera", "Mihir Silva", "Kaushalya Fernando"],
  },
  {
    id: "hamlet-colombo", title: "Hamlet: A New Reckoning", slug: "hamlet-a-new-reckoning", category: "Theatre", description: "A bold, contemporary staging of Shakespeare’s tragedy.", shortDescription: "A visceral contemporary staging with a celebrated local ensemble.", organizerId: "stagecraft", organizer: "StageCraft Ceylon", venueId: "nelum-pokuna", venue: "Nelum Pokuna Theatre", location: "Colombo 07", status: "published", image: "/images/crescendo-hero.png", imageTone: "rose", sessions: [{ id: "session-hamlet", eventId: "hamlet-colombo", startsAt: "2026-09-26T19:30:00+05:30", endsAt: "2026-09-26T22:10:00+05:30", hallId: "nelum-main", layoutVersionId: "layout-np-v3", label: "Saturday" }], ticketCategories: [{ id: "hamlet-standard", name: "Reserved", description: "Numbered seating", price: 450_000, allocation: 800 }], tags: ["Drama", "English"], ageRestriction: "16+", accessibility: ["Wheelchair spaces"], facilities: ["Parking", "Cloakroom"], entryInstructions: "Doors close at curtain time.", refundPolicy: "Tickets may be transferred but are not refundable." },
  {
    id: "future-forum", title: "Future Forward Business Forum", slug: "future-forward-forum", category: "Conference", description: "A full-day forum for leaders building resilient South Asian businesses.", shortDescription: "Ideas, connections and practical strategy for tomorrow’s businesses.", organizerId: "apex-forums", organizer: "Apex Business Forums", venueId: "cinnamon-grand", venue: "Cinnamon Grand Colombo", location: "Colombo 03", status: "published", image: "/images/crescendo-hero.png", imageTone: "cyan", sessions: [{ id: "session-forum", eventId: "future-forum", startsAt: "2026-11-03T08:30:00+05:30", endsAt: "2026-11-03T17:00:00+05:30", hallId: "oak-room", layoutVersionId: "layout-oak-v5", label: "Full-day pass" }], ticketCategories: [{ id: "forum-delegate", name: "Delegate", description: "Conference, lunch and networking", price: 2_400_000, allocation: 420 }], tags: ["Leadership", "Networking"], ageRestriction: "18+", accessibility: ["Step-free access"], facilities: ["Lunch", "Wi-Fi", "Valet parking"], entryInstructions: "Registration opens at 7:30 AM.", refundPolicy: "Delegate substitutions accepted until 48 hours before the forum." },
  {
    id: "lions-v-kandy", title: "Colombo Lions vs Kandy Kings", slug: "colombo-lions-kandy-kings", category: "Sports", description: "A prime-time league clash under the lights.", shortDescription: "Two rivals, one charged night under the stadium lights.", organizerId: "island-sports", organizer: "Island Sports Group", venueId: "sugathadasa", venue: "Sugathadasa Stadium", location: "Colombo 13", status: "published", image: "/images/crescendo-hero.png", imageTone: "green", sessions: [{ id: "session-lions", eventId: "lions-v-kandy", startsAt: "2026-10-04T18:30:00+05:30", endsAt: "2026-10-04T21:30:00+05:30", hallId: "stadium-main", layoutVersionId: "layout-stadium-v1", label: "Main match" }], ticketCategories: [{ id: "sports-ga", name: "Grandstand", description: "Reserved grandstand", price: 300_000, allocation: 2200 }], tags: ["Cricket", "Family"], ageRestriction: "All ages", accessibility: ["Accessible grandstand"], facilities: ["Parking", "Food kiosks"], entryInstructions: "Gates open 90 minutes before play.", refundPolicy: "Rain policy applies." },
  {
    id: "coastline-festival", title: "Coastline Arts Festival", slug: "coastline-arts-festival", category: "Festival", description: "Two days of music, crafts and food beside the Indian Ocean.", shortDescription: "Music, makers and food across two open-air days.", organizerId: "tide-events", organizer: "Tide Events Co.", venueId: "galle-face", venue: "Galle Face Green", location: "Colombo 03", status: "published", image: "/images/crescendo-hero.png", imageTone: "orange", sessions: [{ id: "session-coastline", eventId: "coastline-festival", startsAt: "2026-11-14T12:00:00+05:30", endsAt: "2026-11-14T23:00:00+05:30", hallId: "galle-face-main", layoutVersionId: "layout-outdoor-v1", label: "Saturday" }], ticketCategories: [{ id: "festival-ga", name: "General admission", description: "Standing zones", price: 250_000, allocation: 5000 }], tags: ["Outdoor", "Food", "Music"], ageRestriction: "All ages", accessibility: ["Accessible viewing platform"], facilities: ["Food village", "First aid"], entryInstructions: "Use the north festival gate.", refundPolicy: "Non-refundable; transferable." },
  {
    id: "midnight-table", title: "Midnight at the Cinnamon Table", slug: "midnight-cinnamon-table", category: "Dinner show", description: "Fine dining meets live jazz and intimate theatre.", shortDescription: "A five-course dinner, live jazz and intimate theatrical moments.", organizerId: "atelier-events", organizer: "Atelier Experiences", venueId: "cinnamon-grand", venue: "Cinnamon Grand Colombo", location: "Colombo 03", status: "published", image: "/images/crescendo-hero.png", imageTone: "violet", sessions: [{ id: "session-midnight", eventId: "midnight-table", startsAt: "2026-09-19T19:00:00+05:30", endsAt: "2026-09-19T23:00:00+05:30", hallId: "oak-room", layoutVersionId: "layout-oak-v5", label: "Dinner seating" }], ticketCategories: [{ id: "dinner-table", name: "Table seat", description: "Shared premium table", price: 1_850_000, allocation: 420 }], tags: ["Dinner", "Jazz"], ageRestriction: "18+", accessibility: ["Step-free access"], facilities: ["Valet parking", "Five-course dinner"], entryInstructions: "Cocktails from 6:30 PM.", refundPolicy: "Flexible cancellation is available as an add-on." },
];

export const initialSeats: Record<string, Seat[]> = {
  "session-crescendo": makeSeats("CC", 350_000),
  "session-serendib-1": makeSeats("SS1", 80_000),
  "session-serendib-2": makeSeats("SS2", 100_000),
  "session-serendib-3": makeSeats("SS3", 80_000),
  "session-hamlet": makeSeats("HA", 250_000),
  "session-forum": makeSeats("FF", 800_000),
  "session-lions": makeSeats("LK", 150_000),
  "session-coastline": makeSeats("CF", 100_000),
  "session-midnight": makeSeats("MT", 900_000),
};

export const initialOrders: Order[] = [{ id: "ORD-10482", eventId: "crescendo-colombo", sessionId: "session-crescendo", customerName: "Ayesha Perera", customerEmail: "ayesha@example.com", lines: [{ seatId: "CC-C6", label: "Premium Stalls · C6", price: 650_000 }], subtotal: 650_000, platformFee: 32_500, processingFee: 16_250, tax: 0, discount: 0, addOns: 0, total: 698_750, status: "paid", channel: "web", createdAt: "2026-08-30T09:42:00+05:30" }];
export const initialTickets: Ticket[] = [{ id: "ticket-sample-valid", number: "EVT-DEMO-001", orderId: "ORD-10482", eventId: "crescendo-colombo", sessionId: "session-crescendo", seatId: "CC-C6", holderName: "Ayesha Perera", holderEmail: "ayesha@example.com", status: "valid", qrToken: "demo-valid-token", issuedAt: "2026-08-30T09:42:00+05:30", entrance: "Gate A" }, { id: "ticket-sample-cancelled", number: "EVT-DEMO-002", orderId: "ORD-10480", eventId: "crescendo-colombo", sessionId: "session-crescendo", seatId: "CC-C7", holderName: "Nimal Fernando", holderEmail: "nimal@example.com", status: "cancelled", qrToken: "demo-cancelled-token", issuedAt: "2026-08-29T11:00:00+05:30", entrance: "Gate A" }, { id: "ticket-sample-refunded", number: "EVT-DEMO-003", orderId: "ORD-10471", eventId: "crescendo-colombo", sessionId: "session-crescendo", seatId: "CC-C8", holderName: "Maya Silva", holderEmail: "maya@example.com", status: "refunded", qrToken: "demo-refunded-token", issuedAt: "2026-08-25T15:10:00+05:30", entrance: "Gate B" }];
export const initialCheckIns: CheckIn[] = [];

export const defaultWizardDraft: WizardDraft = { title: "Colombo Afterglow Live", category: "Music", description: "An immersive one-night concert bringing leading island artists together with cinematic visuals.", venueId: "nelum-pokuna", hallId: "nelum-main", layoutVersionId: "layout-np-v4", startsAt: "2026-12-12T19:00", ticketPrice: 750_000, ticketLimit: 6, promoCode: "AFTERGLOW", refundPolicy: "Refunds available until seven days before the event. Ticket transfers permitted." };

export const seatLayoutTemplates = ["Cinema hall", "Theatre with balcony", "Concert auditorium", "Stadium section", "Hotel ballroom with tables", "Outdoor GA zones"];
export { makeSeats };
