"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function DashboardOverviewPage() {
  const { data } = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: async () => (await api.get("/tenants/analytics/summary")).data,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">Pick a tenant in the sidebar, then explore modules.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs uppercase text-zinc-500">Settled (sample window)</p>
          <p className="mt-2 text-2xl font-bold text-white">{data?.settled_count ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs uppercase text-zinc-500">Volume (sample)</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {data?.volume_cents_sampled != null ? `$${(data.volume_cents_sampled / 100).toFixed(2)}` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs uppercase text-zinc-500">Failed</p>
          <p className="mt-2 text-2xl font-bold text-white">{data?.failed_count ?? "—"}</p>
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="font-semibold text-red-200">Quick start</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
          <li>
            Create an{" "}
            <Link href="/dashboard/api-keys" className="text-red-400 underline">
              API key
            </Link>
            .
          </li>
          <li>
            Call{" "}
            <code className="rounded bg-black/50 px-1">POST /api/v1/create-invoice</code> with{" "}
            <code className="rounded bg-black/50 px-1">X-API-Key</code> /{" "}
            <code className="rounded bg-black/50 px-1">X-API-Secret</code>.
          </li>
          <li>Open the hosted checkout URL from the response and complete payment (mock gateway).</li>
        </ol>
      </div>
    </div>
  );
}
