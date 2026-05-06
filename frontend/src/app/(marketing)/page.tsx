import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Fingerprint,
  Globe,
  Layers,
  LineChart,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Gateway routing",
    desc: "Route to the best-performing gateway by success rate, cost, and availability.",
  },
  {
    icon: Shield,
    title: "Fraud protection",
    desc: "Blocklists, velocity checks, and webhook alerts to reduce disputes.",
  },
  {
    icon: LineChart,
    title: "Real-time analytics",
    desc: "Monitor volume, failures, and gateway health from one dashboard.",
  },
  {
    icon: Globe,
    title: "Developer API",
    desc: "REST v4.1 with idempotent invoice creation and signed outbound webhooks.",
  },
];

const logos = [
  "Stripe",
  "PayPal",
  "Square",
  "Braintree",
  "Adyen",
  "Authorize.net",
  "NMI",
  "Checkout.com",
  "Coinbase",
  "Apple Pay",
  "Google Pay",
];

const tiers = [
  { name: "CC", deposit: "$0", volume: "$500 – $1K / day", highlight: false },
  { name: "Silver", deposit: "$500", volume: "$5K – $20K / mo", highlight: false },
  { name: "Platinum", deposit: "$2,000", volume: "$20K – $50K / mo", highlight: true },
  { name: "Gold", deposit: "$5,000", volume: "$50K – $100K / mo", highlight: false },
  { name: "Diamond", deposit: "$20,000", volume: "$100K – $200K / mo", highlight: false },
  { name: "Enterprise", deposit: "$100,000", volume: "$200K+", highlight: false },
];

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/5 px-4 pb-24 pt-16 md:px-8 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-300">
            <Zap className="h-3.5 w-3.5" /> Payment orchestration
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Accept payments without the headaches.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Zero setup fees. Smart gateways. Same-day style payouts. Apple Pay, Google Pay, Cash App,
            crypto & cards — with a mock gateway for instant demos.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login?mode=register"
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-red-400"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/support"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Talk to sales
            </Link>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              ["1,831+", "merchants (demo stat)"],
              ["94", "new merchants this month"],
              ["<50ms", "risk checks (target)"],
            ].map(([a, b]) => (
              <div key={b} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-2xl font-bold text-white">{a}</p>
                <p className="text-sm text-zinc-500">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-24 border-b border-white/5 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white">Everything you need</h2>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Production-oriented modules: orchestration, BYOK, outbound webhooks, and an in-house risk
            manager.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <article
                key={f.title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <f.icon className="h-10 w-10 shrink-0 text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 bg-gradient-to-b from-red-500/5 to-transparent px-4 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 text-red-400">
            <Fingerprint className="h-8 w-8" />
            <h2 className="text-3xl font-bold text-white">In-house risk manager</h2>
          </div>
          <p className="mt-4 max-w-3xl text-zinc-400">
            Block past disputers with Redis-backed lookups and per-tenant blocklists. GDPR deletion API
            included — avoid permanent global blocklists without legal review.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {["Customer pays", "Risk scan", "Allow / block", "Gateway"].map((step, i) => (
              <li
                key={step}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-6 text-center text-sm font-medium text-zinc-300"
              >
                <span className="mb-2 block text-xs text-red-500">Step {i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="integrations" className="scroll-mt-24 border-b border-white/5 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white">Works with your stack</h2>
          <p className="mt-2 text-zinc-400">REST API v4.1 · Webhooks · Mock + Stripe adapters in-repo.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {logos.map((name) => (
              <span
                key={name}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-b border-white/5 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white">Volume-based tiers</h2>
          <p className="mt-2 text-zinc-400">Refundable security deposits (demo — wire Stripe for real holds).</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`rounded-2xl border p-6 ${
                  t.highlight
                    ? "border-red-500/50 bg-red-500/10 shadow-lg shadow-red-500/10"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-red-400">{t.name}</p>
                <p className="mt-2 text-3xl font-bold text-white">{t.deposit}</p>
                <p className="text-sm text-zinc-500">refundable deposit</p>
                <p className="mt-4 text-sm text-zinc-400">{t.volume}</p>
                <ul className="mt-4 space-y-2 text-sm text-zinc-500">
                  <li className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-zinc-600" /> Multi-gateway routing
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-zinc-600" /> Fraud signals
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="byok" className="scroll-mt-24 px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-white">Your keys or ours</h2>
            <p className="mt-4 text-zinc-400">
              BYOK: connect Stripe / PayPal / Coinbase with envelope-encrypted credentials stored in
              Postgres. Swap mock adapters for live secrets when you are licensed and PCI-scoped.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <h3 className="font-semibold text-white">Quick integration</h3>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-black/60 p-4 text-xs text-red-200">
              {`POST /api/v1/create-invoice
Headers:
  X-API-Key: pk_...
  X-API-Secret: sk_...
Body:
  { "amount": 5000, "brand_slug": "mystore",
    "order_reference": "ORD-1" }`}
            </pre>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-red-500/10 px-4 py-16 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold text-white">Start accepting payments today</h2>
          <Link
            href="/login?mode=register"
            className="rounded-xl bg-red-500 px-8 py-3 text-sm font-bold text-black hover:bg-red-400"
          >
            Create free account
          </Link>
        </div>
      </section>
    </main>
  );
}
