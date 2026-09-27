"use client";

import { useEffect } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useDemoStore } from "@/store/demo-store";

export function ToastRegion() {
  const toasts = useDemoStore((state) => state.toasts);
  const dismiss = useDemoStore((state) => state.dismissToast);
  const notify = useDemoStore((state) => state.notify);
  useEffect(() => {
    const handler = (event: Event) => { const detail = (event as CustomEvent<{ title: string; description: string }>).detail; notify(detail.title, detail.description, "info"); };
    window.addEventListener("encore-demo-action", handler);
    return () => window.removeEventListener("encore-demo-action", handler);
  }, [notify]);
  return <div className="fixed right-4 top-20 z-[100] grid w-[calc(100%-2rem)] max-w-sm gap-2" aria-live="polite">{toasts.slice(-3).map((toast) => { const Icon = toast.tone === "success" ? CheckCircle2 : toast.tone === "error" ? XCircle : Info; return <div key={toast.id} className="flex gap-3 rounded-2xl border border-white/20 bg-slate-950 p-4 text-white shadow-2xl"><Icon className={toast.tone === "success" ? "mt-0.5 size-5 text-emerald-400" : toast.tone === "error" ? "mt-0.5 size-5 text-red-400" : "mt-0.5 size-5 text-sky-400"} /><div className="min-w-0 flex-1"><p className="text-sm font-bold">{toast.title}</p>{toast.description ? <p className="mt-1 text-xs leading-5 text-slate-300">{toast.description}</p> : null}</div><button onClick={() => dismiss(toast.id)} className="self-start rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Dismiss"><X className="size-4" /></button></div>; })}</div>;
}
