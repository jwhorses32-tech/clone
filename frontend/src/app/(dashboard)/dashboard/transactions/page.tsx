"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";

export default function TransactionsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["txns"],
    queryFn: async () => (await api.get("/tenants/transactions")).data,
  });

  if (isLoading) return <p className="text-zinc-500">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Transactions</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-zinc-500">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {(data as { id: string; status: string; amountCents: number }[])?.map((row) => (
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-3 font-mono text-xs text-zinc-400">{row.id.slice(0, 12)}…</td>
                <td className="p-3">{row.status}</td>
                <td className="p-3">${(row.amountCents / 100).toFixed(2)}</td>
                <td className="p-3">
                  <Link href={`/dashboard/transactions/${row.id}`} className="text-red-400 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
