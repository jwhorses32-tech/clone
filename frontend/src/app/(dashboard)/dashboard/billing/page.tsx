"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function BillingPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => (await api.get("/billing/plans")).data,
  });

  const sub = useMutation({
    mutationFn: async (planSlug: string) => api.post("/billing/subscribe", { planSlug }),
    onSuccess: () => {
      toast.success("Plan attached (demo)");
      void qc.invalidateQueries({ queryKey: ["plans"] });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Billing & plans</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data as { id: string; slug: string; name: string; depositCents: number }[])?.map((p) => (
          <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="font-semibold text-white">{p.name}</p>
            <p className="text-xs text-zinc-500">{p.slug}</p>
            <p className="mt-2 text-sm text-zinc-400">Deposit: ${(p.depositCents / 100).toFixed(2)}</p>
            <button
              type="button"
              onClick={() => sub.mutate(p.slug)}
              className="mt-3 w-full rounded-lg border border-white/10 py-2 text-xs hover:bg-white/5"
            >
              Select (demo)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
