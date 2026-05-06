"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["txn", id],
    queryFn: async () => (await api.get(`/tenants/transactions/${id}`)).data,
  });

  if (isLoading) return <p className="text-zinc-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Transaction</h1>
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-zinc-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
