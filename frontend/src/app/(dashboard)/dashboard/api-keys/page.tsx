"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function ApiKeysPage() {
  const qc = useQueryClient();
  const [revealed, setRevealed] = useState<{ pk: string; sk: string } | null>(null);

  const { data } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => (await api.get("/tenants/api-keys")).data,
  });

  const create = useMutation({
    mutationFn: async () => (await api.post("/tenants/api-keys", {})).data as { publicKey: string; secretKey: string },
    onSuccess: (d) => {
      setRevealed({ pk: d.publicKey, sk: d.secretKey });
      void qc.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key created — copy the secret now.");
    },
  });

  const revoke = useMutation({
    mutationFn: async (id: string) => api.delete(`/tenants/api-keys/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("Revoked");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">API keys</h1>
        <button
          type="button"
          onClick={() => create.mutate()}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-black"
        >
          New key
        </button>
      </div>
      {revealed && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold text-amber-200">One-time reveal</p>
          <p className="mt-2 break-all font-mono text-xs text-zinc-200">pk: {revealed.pk}</p>
          <p className="mt-1 break-all font-mono text-xs text-zinc-200">sk: {revealed.sk}</p>
        </div>
      )}
      <ul className="space-y-2">
        {(data as { id: string; publicKey: string }[])?.map((k) => (
          <li
            key={k.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <span className="font-mono text-sm text-zinc-300">{k.publicKey}</span>
            <button
              type="button"
              onClick={() => revoke.mutate(k.id)}
              className="text-xs text-red-400 hover:underline"
            >
              Revoke
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
