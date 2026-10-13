"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  ArrowLeft, BarChart3, Building2, CalendarDays, CheckCircle2, ChevronDown, CircleUserRound, Compass, CreditCard,
  DoorOpen, Grid2X2, Heart, LayoutDashboard, LifeBuoy, Menu, RotateCcw, ScanLine, Search,
  Settings, ShieldCheck, ShoppingBag, Sparkles, Store, Ticket, Users, WalletCards, X,
} from "lucide-react";
import { Button, Card } from "@/components/ui/primitives";
import { canAccessRoute } from "@/lib/domain";
import { isRoleAvailable, isRouteAvailable } from "@/lib/demo-access";
import { normalizePathname } from "@/lib/pathname";
import { isAuthPath } from "@/lib/demo-auth";
import { cn, titleCase } from "@/lib/utils";
import { useDemoStore } from "@/store/demo-store";
import type { DemoRole } from "@/types/domain";

const roles: { id: DemoRole; label: string; route: string }[] = [
  { id: "customer", label: "Customer", route: "/" },
  { id: "seller", label: "Event organizer", route: "/seller" },
  { id: "venue-manager", label: "Venue manager", route: "/venue-manager" },
  { id: "box-office", label: "Box-office staff", route: "/box-office" },
  { id: "check-in", label: "Check-in staff", route: "/check-in" },
  { id: "admin", label: "Platform admin", route: "/admin" },
];
const visibleRoles = roles.filter((item) => isRoleAvailable(item.id));

type NavItem = { label: string; href: string; icon: typeof LayoutDashboard };
const nav: Record<Exclude<DemoRole, "customer">, NavItem[]> = {
  seller: [
    { label: "Overview", href: "/seller", icon: LayoutDashboard }, { label: "Events", href: "/seller/events", icon: CalendarDays },
    { label: "Create event", href: "/seller/events/create", icon: Sparkles }, { label: "Orders", href: "/seller/orders", icon: ShoppingBag },
    { label: "Attendees", href: "/seller/attendees", icon: Users }, { label: "Inventory", href: "/seller/inventory", icon: Ticket },
    { label: "Promotions", href: "/seller/promotions", icon: Heart }, { label: "Communications", href: "/seller/communications", icon: LifeBuoy },
    { label: "Reports", href: "/seller/reports", icon: BarChart3 }, { label: "Payouts", href: "/seller/payouts", icon: WalletCards },
    { label: "Team & permissions", href: "/seller/team", icon: ShieldCheck }, { label: "Settings", href: "/seller/settings", icon: Settings },
  ],
  "venue-manager": [
    { label: "Overview", href: "/venue-manager", icon: LayoutDashboard }, { label: "Venues", href: "/venue-manager/venues", icon: Building2 },
    { label: "Halls", href: "/venue-manager/halls", icon: DoorOpen }, { label: "Seating layouts", href: "/venue-manager/layouts", icon: Grid2X2 },
    { label: "Layout builder", href: "/venue-manager/layouts/builder", icon: Sparkles }, { label: "Availability", href: "/venue-manager/calendar", icon: CalendarDays },
    { label: "Booking requests", href: "/venue-manager/bookings", icon: Ticket }, { label: "Reports", href: "/venue-manager/reports", icon: BarChart3 },
    { label: "Venue staff", href: "/venue-manager/team", icon: Users }, { label: "Settings", href: "/venue-manager/settings", icon: Settings },
  ],
  "box-office": [
    { label: "New sale", href: "/box-office", icon: Ticket }, { label: "Counter sales", href: "/box-office/sales", icon: ShoppingBag },
    { label: "Reissue requests", href: "/box-office/reissues", icon: RotateCcw }, { label: "Activity log", href: "/box-office/activity", icon: Users },
  ],
  "check-in": [
    { label: "Ticket scanner", href: "/check-in", icon: ScanLine }, { label: "Entry stats", href: "/check-in/stats", icon: BarChart3 },
    { label: "Activity", href: "/check-in/activity", icon: Users },
  ],
  admin: [
    { label: "Platform overview", href: "/admin", icon: LayoutDashboard }, { label: "Seller verification", href: "/admin/sellers", icon: ShieldCheck },
    { label: "Event approval", href: "/admin/events", icon: CalendarDays }, { label: "Venues", href: "/admin/venues", icon: Building2 },
    { label: "Orders & payments", href: "/admin/orders", icon: CreditCard }, { label: "Refunds", href: "/admin/refunds", icon: RotateCcw },
    { label: "Disputes", href: "/admin/disputes", icon: LifeBuoy }, { label: "Settlements", href: "/admin/settlements", icon: WalletCards },
    { label: "Homepage", href: "/admin/content", icon: Sparkles }, { label: "Risk alerts", href: "/admin/risk", icon: ShieldCheck },
    { label: "Audit logs", href: "/admin/audit", icon: Users }, { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className={cn("flex items-center gap-2.5 font-extrabold tracking-[-.04em]", inverse ? "text-white" : "text-[var(--ink)]")}><span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-lg shadow-violet-900/20"><Ticket className="size-5 -rotate-12" /></span><span className="text-xl">encore<span className="text-[var(--brand)]">.</span></span></Link>;
}

const subscribeToHydration = () => () => {};

export function RoleSwitcher() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [open, setOpen] = useState(false);
  const role = useDemoStore((state) => state.role);
  const setRole = useDemoStore((state) => state.setRole);
  const router = useRouter();
  const selected = visibleRoles.find((item) => item.id === role) ?? visibleRoles[0];
  return <div className="demo-role-switcher relative"><button onClick={() => setOpen(!open)} className="flex h-10 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:border-violet-300" disabled={!hydrated} aria-label="Switch demo role" aria-haspopup="listbox" aria-expanded={open}><span className="grid size-6 place-items-center rounded-lg bg-violet-50 text-[var(--brand)]"><CircleUserRound className="size-4" /></span><span className="hidden max-w-32 truncate sm:block">{selected.label}</span><ChevronDown className="size-4 text-slate-400" /></button>{open ? <><button className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} aria-label="Close role menu" /><Card className="absolute right-0 top-12 z-50 w-64 overflow-hidden p-2 shadow-2xl" role="listbox"> <p className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">Switch demo experience</p>{visibleRoles.map((item) => <button key={item.id} onClick={() => { setRole(item.id); setOpen(false); router.push(item.route); }} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition", role === item.id ? "bg-violet-50 text-[var(--brand)]" : "text-slate-700 hover:bg-slate-50")} role="option" aria-selected={role === item.id}><span>{item.label}</span>{role === item.id ? <CheckCircle2 className="size-4" /> : null}</button>)}</Card></> : null}</div>;
}

function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const demoSession = useDemoStore((state) => state.demoSession);
  const pathname = normalizePathname(usePathname());
  const isHome = pathname === "/";
  const sessionId = useDemoStore((state) => state.selectedSessionId);
  const backHref = pathname === "/checkout" && sessionId ? `/booking/${sessionId}/seats` : pathname.startsWith("/booking/") ? "/explore" : "/";
  return <header className="market-header"><div className="page-container market-header__inner">
    <div className="flex items-center gap-3">{!isHome ? <Link href={backHref} className="market-icon-button lg:hidden" aria-label="Back to discovery"><ArrowLeft className="size-5" /></Link> : null}<Link href="/" className="market-wordmark"><span className="market-logo-icon"><Ticket className="size-6 -rotate-12" /></span>encore<span className="text-violet-400">.</span></Link></div>
    <nav className="market-desktop-nav" aria-label="Primary navigation">{[{ name: "Discover", href: "/" }, { name: "Explore events", href: "/explore" }, { name: "Movies", href: "/explore?category=Movies" }, { name: "My tickets", href: "/account/tickets" }].map((item) => <Link key={item.name} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.name}</Link>)}</nav>
    <div className="flex items-center gap-2"><Link href="/demo" className="market-partner-link">For organizers <ChevronDown className="size-3.5" /></Link><RoleSwitcher /><Link href={hydrated && demoSession ? "/account" : "/login"} className="market-sign-in" aria-label={hydrated && demoSession ? "My account" : undefined}>{hydrated && demoSession ? <><CircleUserRound className="size-4" /><span>Account</span></> : "Sign in"}</Link><button className="market-icon-button lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>
    </div>{menuOpen ? <nav className="market-menu" aria-label="More navigation">{[{ name: "Explore events", href: "/explore" }, { name: "My account", href: "/account" }, { name: "Venues", href: "/venues/nelum-pokuna" }, { name: "Help & FAQ", href: "/help" }, { name: "Partner workspaces", href: "/demo" }].map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.name}<ArrowLeft className="size-4 rotate-180" /></Link>)}</nav> : null}</header>;
}

function PortalShell({ children, role }: { children: React.ReactNode; role: Exclude<DemoRole, "customer"> }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = normalizePathname(usePathname());
  const items = nav[role];
  const sectionTitle = roles.find((item) => item.id === role)?.label;
  return <div className="portal-shell min-h-screen bg-[var(--surface)]"><aside className={cn("fixed inset-y-0 left-0 z-50 w-72 -translate-x-full bg-[var(--ink)] p-5 text-white transition-transform lg:translate-x-0", mobileOpen && "translate-x-0")}><div className="flex items-center justify-between"><Logo inverse /><button className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)}><X className="size-5" /></button></div><div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-slate-400">Current workspace</p><p className="mt-1 text-sm font-bold">{sectionTitle}</p><p className="mt-1 text-xs text-slate-400">Demo organization · Colombo</p></div><nav className="mt-6 grid max-h-[calc(100vh-220px)] gap-1 overflow-y-auto pr-1" aria-label={`${sectionTitle} navigation`}>{items.map((item) => { const Icon = item.icon; const active = item.href === `/${role}` ? pathname === item.href : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-white text-slate-950 shadow-lg" : "text-slate-300 hover:bg-white/10 hover:text-white")}><Icon className="size-[18px]" />{item.label}</Link>; })}</nav></aside>{mobileOpen ? <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" /> : null}<div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--line)] bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-xl border border-[var(--line)] p-2 lg:hidden" aria-label="Open navigation"><Menu className="size-5" /></button><div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex"><span>{sectionTitle}</span><span>/</span><span className="font-semibold text-[var(--ink)]">{titleCase(pathname.split("/").filter(Boolean).at(-1) ?? "Overview")}</span></div></div><div className="flex items-center gap-2"><button className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block" aria-label="Search"><Search className="size-5" /></button><RoleSwitcher /></div></header><main className="mx-auto max-w-[1500px] p-4 pb-24 sm:p-6 lg:p-8">{children}</main></div></div>;
}

function AccessDenied({ pathname }: { pathname: string }) {
  const role = useDemoStore((state) => state.role);
  const setRole = useDemoStore((state) => state.setRole);
  const router = useRouter();
  const expected = roles.find((item) => pathname.startsWith(item.route) && item.route !== "/") ?? roles[0];
  if (!isRouteAvailable(pathname)) return <div className="grid min-h-screen place-items-center bg-[var(--surface)] p-5"><Card className="max-w-lg p-8 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-50 text-[var(--brand)]"><ShieldCheck className="size-7" /></div><h1 className="mt-5 text-2xl font-bold text-[var(--ink)]">This workspace is not part of this preview</h1><p className="mt-3 leading-7 text-[var(--muted)]">This presentation includes the organizer workspace and the customer booking experience.</p><Link href="/demo" className="mt-6 inline-block"><Button>Explore the organizer preview</Button></Link><Link href="/" className="mt-4 block text-sm font-semibold text-[var(--brand)]">Return to marketplace</Link></Card></div>;
  return <div className="grid min-h-screen place-items-center bg-[var(--surface)] p-5"><Card className="max-w-lg p-8 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-600"><ShieldCheck className="size-7" /></div><h1 className="mt-5 text-2xl font-bold text-[var(--ink)]">This area is role-restricted</h1><p className="mt-3 leading-7 text-[var(--muted)]">The {titleCase(role)} demo cannot open this workspace. Switch to {expected.label} to continue the presentation.</p><Button className="mt-6" onClick={() => { setRole(expected.id); router.push(expected.route); }}>Switch to {expected.label}</Button><Link href="/" className="mt-4 block text-sm font-semibold text-[var(--brand)]">Return to marketplace</Link></Card></div>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = normalizePathname(usePathname());
  const role = useDemoStore((state) => state.role);
  if (isAuthPath(pathname)) return <div className="marketplace">{children}</div>;
  if (!canAccessRoute(role, pathname)) return <AccessDenied pathname={pathname} />;
  if (role !== "customer" && pathname.startsWith(`/${role}`)) return <PortalShell role={role}>{children}</PortalShell>;
  const focusedBooking = ["/events/", "/movies/", "/booking/", "/checkout", "/payment/"].some((prefix) => pathname.startsWith(prefix));
  const tabs = [{ href: "/", label: "Discover", icon: Store }, { href: "/explore", label: "Explore", icon: Compass }, { href: "/account/saved", label: "Saved", icon: Heart }, { href: "/account/tickets", label: "My tickets", icon: Ticket }];
  return <div className={cn("marketplace", !focusedBooking && "marketplace--with-tabs")}><PublicHeader /><main>{children}</main>{!focusedBooking ? <nav className="market-bottom-nav" aria-label="Customer navigation">{tabs.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}><span><Icon className="size-[21px]" /></span>{label}</Link>)}</nav> : null}</div>;
}

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-400"><span>Workspace</span><span>/</span><span className="text-[var(--brand)]">{title}</span></div><h1 className="text-3xl font-bold tracking-[-.04em] text-[var(--ink)] sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p></div>{actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}</div>;
}
