import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return <div className="page-container grid gap-5 py-12"><Skeleton className="h-10 w-64" /><Skeleton className="h-5 w-96 max-w-full" /><div className="grid gap-5 pt-5 md:grid-cols-3"><Skeleton className="h-80" /><Skeleton className="h-80" /><Skeleton className="h-80" /></div></div>;
}
