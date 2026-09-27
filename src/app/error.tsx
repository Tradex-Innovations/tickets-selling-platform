"use client";

import { AlertTriangle } from "lucide-react";
import { Button, Card } from "@/components/ui/primitives";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="grid min-h-screen place-items-center bg-[var(--surface)] p-5"><Card className="max-w-md p-8 text-center"><AlertTriangle className="mx-auto size-10 text-red-500" /><h1 className="mt-4 text-2xl font-bold">Something went off-script</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">The prototype kept your local demo state. Retry this screen or return to the demo hub.</p><Button className="mt-5" onClick={reset}>Try again</Button></Card></div>;
}
