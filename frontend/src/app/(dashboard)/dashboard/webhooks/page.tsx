"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function WebhooksPage() {
  const qc = useQueryClient();
  const [url, setUrl] = useState("http://localhost:3000/api/mock-webhook");

  const { data } = useQuery({
    queryKey: ["webhooks"],
    queryFn: async () => (await api.get("/tenants/webhook-endpoints")).data,
  });

  const create = useMutation({
    mutationFn: async () => api.post("/tenants/webhook-endpoints", { url, events: ["*"] }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook endpoint created");
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Webhook endpoints</h1>
      <div className="flex flex-wrap gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="min-w-[240px] flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => create.mutate()}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-black"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2 text-sm">
        {(data as { id: string; url: string; secret?: string }[])?.map((w) => (
          <li key={w.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="text-zinc-300">{w.url}</p>
            {w.secret && <p className="mt-2 font-mono text-xs text-amber-200/90">secret: {w.secret}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
