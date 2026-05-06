import Link from "next/link";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#integrations", label: "Integrations" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#byok", label: "BYOK" },
  { href: "/support", label: "Contact" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          Polapine<span className="text-red-400">Clone</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-300 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/login?mode=register"
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-red-400"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
