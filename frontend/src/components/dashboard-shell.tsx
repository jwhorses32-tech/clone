"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { api, setAccessToken, setTenantId } from "@/lib/api";
import { toast } from "sonner";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/setup", label: "New merchant" },
  { href: "/dashboard/transactions", label: "Transactions" },
  { href: "/dashboard/payment-links", label: "Payment links" },
  { href: "/dashboard/api-keys", label: "API keys" },
  { href: "/dashboard/webhooks", label: "Webhooks" },
  { href: "/dashboard/gateways", label: "Gateways (BYOK)" },
  { href: "/dashboard/risk", label: "Risk" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/admin", label: "Admin" },
];

type Me = { id: string; email: string; role: string } | null;
type Tenant = { id: string; brandSlug: string; displayName: string };

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantId, setTid] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await api.get<Me>("/auth/me");
        if (!data) {
          router.replace("/login");
          return;
        }
        setMe(data);
        const { data: tlist } = await api.get<Tenant[]>("/tenants");
        setTenants(tlist);
        const stored = typeof window !== "undefined" ? sessionStorage.getItem("tenant_id") : null;
        const pick = stored && tlist.some((t) => t.id === stored) ? stored : tlist[0]?.id ?? null;
        setTid(pick);
        setTenantId(pick);
        if (tlist.length === 0 && !pathname.includes("/setup")) {
          router.replace("/dashboard/setup");
        }
      } catch {
        router.replace("/login");
      }
    })();
  }, [router, pathname]);

  function logout() {
    setAccessToken(null);
    setTenantId(null);
    void api.post("/auth/logout");
    router.replace("/login");
    toast.success("Signed out");
  }

  return (
    <div className="flex min-h-screen bg-[#06060a] text-zinc-100">
      <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-black/40 p-4 md:block">
        <Link href="/" className="block text-lg font-bold">
          Polapine<span className="text-red-400">Clone</span>
        </Link>
        <p className="mt-2 truncate text-xs text-zinc-500">{me?.email}</p>
        {tenants.length > 0 && (
          <div className="mt-4">
            <label className="text-[10px] font-semibold uppercase text-zinc-500">Tenant</label>
            <select
              className="mt-1 w-full rounded border border-white/10 bg-black px-2 py-1.5 text-xs"
              value={tenantId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setTid(v);
                setTenantId(v);
              }}
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.displayName} ({t.brandSlug})
                </option>
              ))}
            </select>
          </div>
        )}
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 ${
                pathname === item.href ? "bg-red-500/20 text-red-300" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-8 w-full rounded-lg border border-white/10 py-2 text-xs text-zinc-400 hover:bg-white/5"
        >
          Log out
        </button>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:hidden">
          <span className="font-bold">Dashboard</span>
          <button type="button" onClick={() => logout()} className="text-xs text-zinc-400">
            Out
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
