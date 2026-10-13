"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Check, Heart, LoaderCircle, Ticket } from "lucide-react";
import { authReturnPath, SOCIAL_PROVIDERS, type SocialProvider } from "@/lib/demo-auth";
import { useDemoStore } from "@/store/demo-store";

const subscribeToHydration = () => () => {};

function ProviderIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "Google") return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z" /><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.04.97-3.38.97-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22Z" /><path fill="#FBBC05" d="M6.41 13.93a6 6 0 0 1 0-3.86V7.48H3.06a10 10 0 0 0 0 9.04l3.35-2.59Z" /><path fill="#EA4335" d="M12 5.95c1.47 0 2.79.5 3.83 1.5L18.7 4.6A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.48l3.35 2.59C7.2 7.71 9.4 5.95 12 5.95Z" /></svg>;
  if (provider === "Facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1877F2" /><path fill="#fff" d="m16.2 15 .5-3h-3V10c0-.82.4-1.62 1.77-1.62h1.36V5.83s-1.24-.21-2.43-.21c-2.47 0-4.08 1.5-4.08 4.22V12H7.58v3h2.74v7.87a11 11 0 0 0 3.38 0V15h2.5Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.37 1.43c.12 1.13-.33 2.22-1 3.04-.7.83-1.82 1.47-2.93 1.39-.15-1.09.41-2.24 1.04-2.96.7-.83 1.9-1.44 2.89-1.47ZM20.55 17.1c-.5 1.12-.74 1.62-1.38 2.62-.9 1.39-2.18 3.12-3.75 3.13-1.4.01-1.76-.91-3.66-.9-1.9.01-2.3.92-3.7.91-1.57-.02-2.78-1.58-3.68-2.97C1.86 16 .97 10.58 3.55 7.78c1.3-1.42 3.36-2.25 5.3-1.86 1.51.3 2.2 1.13 3.45 1.13 1.22 0 1.8-.83 3.44-1.08 1.7-.26 3.51.37 4.79 1.65-3.75 2.05-3.14 7.39.02 9.48Z" /></svg>;
}

export function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destination = authReturnPath(searchParams.get("next"));
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const demoSession = useDemoStore((state) => state.demoSession);
  const signIn = useDemoStore((state) => state.signInDemo);
  const signOut = useDemoStore((state) => state.signOutDemo);
  const [pending, setPending] = useState<SocialProvider>();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function continueWith(provider: SocialProvider) {
    if (timer.current) return;
    setPending(provider);
    // Frontend preview only. No identity provider is contacted.
    timer.current = setTimeout(() => {
      signIn(provider);
      router.replace(destination);
    }, 650);
  }

  return <div className="auth-page">
    <header className="auth-header">
      <Link href="/" className="market-wordmark"><span className="market-logo-icon"><Ticket className="size-6 -rotate-12" /></span>encore<span className="text-violet-400">.</span></Link>
      <Link href="/" className="auth-back"><ArrowLeft className="size-4" />Back to events</Link>
    </header>
    <main className="auth-layout">
      <section className="auth-story" aria-label="The Encore experience">
        <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/crescendo-hero.webp`} alt="A crowd enjoying a concert under glowing purple stage lights" fill unoptimized sizes="(min-width: 1024px) 50vw, 1px" className="object-cover" />
        <div className="auth-story__shade" />
        <span className="auth-story__eyebrow"><span />GOOD PLANS START HERE</span>
        <div className="auth-story__copy"><p>Less scrolling.<br />More <em>showing up.</em></p><span>Live music, movie nights, and moments<br />you’ll want to be part of.</span></div>
        <div className="auth-story__footer"><Ticket className="size-5" /><span>One account. Every great moment.</span></div>
      </section>
      <section className="auth-content" aria-labelledby="auth-title">
        <div className="auth-card">
          <span className="auth-ticket-icon"><Ticket className="size-7 -rotate-12" /></span>
          {hydrated && demoSession ? <>
            <p className="auth-eyebrow">GOOD TO SEE YOU</p>
            <h1 id="auth-title">You’re already signed in.</h1>
            <p className="auth-description">Your demo account is ready. Pick up where you left off.</p>
            <Link href={destination} className="auth-primary-link">Continue to Encore<ArrowRight className="size-4" /></Link>
            <button type="button" className="auth-guest" onClick={signOut}>Sign out and use another account</button>
          </> : <>
            <p className="auth-eyebrow">YOUR NEXT GREAT MOMENT</p>
            <h1 id="auth-title">Sign in or sign up.</h1>
            <p className="auth-description">Choose an account to continue.<br />New here? We’ll create your Encore account.</p>
            <div className="auth-providers" aria-busy={Boolean(pending)}>
              {SOCIAL_PROVIDERS.map((provider) => <button key={provider} type="button" className="auth-provider" disabled={!hydrated || Boolean(pending)} onClick={() => continueWith(provider)}>
                <ProviderIcon provider={provider} /><span>Continue with {provider}</span>{pending === provider ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              </button>)}
            </div>
            <p className="auth-status" role="status">{pending ? `Opening your ${pending} demo session…` : "No new password. No long forms."}</p>
            <div className="auth-benefits"><span><Ticket />All your tickets</span><span><Heart />Saved favorites</span></div>
            <p className="auth-terms">By continuing, you agree to our <Link href="/legal/terms">Terms</Link>.</p>
            <Link href="/" className="auth-guest">Just browsing? Explore events<ArrowRight className="size-3.5" /></Link>
          </>}
          <p className="auth-demo-note"><Check className="size-3.5" /><span>Frontend preview · social sign-in is simulated.</span></p>
        </div>
        <p className="auth-help">Need a hand? <Link href="/help">We’re here to help</Link></p>
      </section>
    </main>
  </div>;
}
