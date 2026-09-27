import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/shell/app-shell";
import { ToastRegion } from "@/components/shared/toast-region";
import "./globals.css";

export const metadata: Metadata = {
  title: "Encore — Events worth showing up for",
  description: "A connected event discovery, venue, seating and ticketing platform prototype.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#100b25",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full"><AppShell>{children}</AppShell><ToastRegion /></body>
    </html>
  );
}
