"use client";

import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", size = "md", onClick, type, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"; size?: "sm" | "md" | "lg" | "icon" }) {
  const variants = { primary: "bg-[var(--brand)] text-white shadow-[0_8px_24px_rgba(91,52,218,.2)] hover:bg-[var(--brand-strong)]", secondary: "bg-[var(--ink)] text-white hover:bg-slate-800", outline: "border border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--brand)] hover:bg-violet-50", ghost: "text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--ink)]", danger: "bg-red-600 text-white hover:bg-red-700" };
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-4 text-sm", lg: "h-12 px-5 text-base", icon: "size-10 p-0" };
  const fallback = type === "submit" ? undefined : () => window.dispatchEvent(new CustomEvent("encore-demo-action", { detail: { title: "Demo action ready", description: "This prototype action produced a simulated result." } }));
  return <button type={type} onClick={onClick ?? fallback} className={cn("inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)} {...props}>{children}</button>;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-[var(--line)] bg-white shadow-[0_12px_35px_rgba(15,23,42,.055)]", className)} {...props} />;
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "brand" | "info"; className?: string }) {
  const tones = { neutral: "bg-slate-100 text-slate-600", success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", warning: "bg-amber-50 text-amber-700 ring-amber-600/15", danger: "bg-red-50 text-red-700 ring-red-600/15", brand: "bg-violet-50 text-violet-700 ring-violet-600/15", info: "bg-sky-50 text-sky-700 ring-sky-600/15" };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.07em] ring-1 ring-inset", tones[tone], className)}>{children}</span>;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-4 focus:ring-violet-100", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-violet-100", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-28 w-full resize-y rounded-xl border border-[var(--line)] bg-white px-3.5 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--brand)] focus:ring-4 focus:ring-violet-100", className)} {...props} />;
}

export function Field({ label, hint, error, children, className }: { label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return <label className={cn("grid gap-2 text-sm font-semibold text-[var(--ink)]", className)}><span>{label}</span>{children}{error ? <span className="text-xs font-medium text-red-600">{error}</span> : hint ? <span className="text-xs font-normal leading-5 text-[var(--muted)]">{hint}</span> : null}</label>;
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-6 flex items-end justify-between gap-4"><div>{eyebrow ? <p className="mb-2 text-xs font-extrabold uppercase tracking-[.18em] text-[var(--brand)]">{eyebrow}</p> : null}<h2 className="text-2xl font-bold tracking-[-.03em] text-[var(--ink)] sm:text-3xl">{title}</h2>{description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p> : null}</div>{action}</div>;
}

export function StatCard({ label, value, change, icon }: { label: string; value: string; change?: string; icon?: ReactNode }) {
  return <Card className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[var(--muted)]">{label}</p><p className="mt-2 text-2xl font-bold tracking-[-.04em] text-[var(--ink)]">{value}</p>{change ? <p className="mt-2 text-xs font-semibold text-emerald-600">{change}</p> : null}</div>{icon ? <div className="grid size-10 place-items-center rounded-xl bg-violet-50 text-[var(--brand)]">{icon}</div> : null}</div></Card>;
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return <Card className="grid min-h-64 place-items-center p-8 text-center"><div><div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">{icon}</div><h3 className="font-bold text-[var(--ink)]">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p>{action ? <div className="mt-5">{action}</div> : null}</div></Card>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-200", className)} />;
}

export function Modal({ title, description, children, onClose }: { title: string; description?: string; children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[80] grid place-items-end bg-slate-950/45 p-0 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}><Card className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-b-none p-6 sm:rounded-2xl"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-[var(--ink)]">{title}</h2>{description ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}</div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog"><X className="size-5" /></Button></div><div className="mt-6">{children}</div></Card></div>;
}

export function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-sm"><thead><tr>{headers.map((header) => <th key={header} className="border-b border-[var(--line)] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[.08em] text-slate-500 first:rounded-tl-xl last:rounded-tr-xl">{header}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="transition hover:bg-slate-50/70">{row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-slate-100 px-4 py-4 text-[var(--ink)]">{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function ProgressSteps({ steps, current }: { steps: string[]; current: number }) {
  return <div className="flex min-w-max items-center gap-2">{steps.map((step, index) => <div key={step} className="flex items-center"><div className={cn("grid size-8 place-items-center rounded-full text-xs font-extrabold", index <= current ? "bg-[var(--brand)] text-white" : "bg-slate-100 text-slate-500")}>{index + 1}</div><span className={cn("ml-2 mr-3 text-xs font-semibold", index <= current ? "text-[var(--ink)]" : "text-slate-400")}>{step}</span>{index < steps.length - 1 ? <div className="h-px w-5 bg-slate-200" /> : null}</div>)}</div>;
}
