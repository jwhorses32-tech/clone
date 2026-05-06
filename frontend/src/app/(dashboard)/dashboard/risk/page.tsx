"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function RiskPage() {
  const qc = useQueryClient();
  const [type, setType] = useState("EMAIL");
  const [value, setValue] = useState("");

  const { data } = useQuery({
    queryKey: ["blocklist"],
    queryFn: async () => (await api.get("/risk/blocklist")).data,
  });

  const add = useMutation({
    mutationFn: async () => api.post("/risk/blocklist", { type, value, reason: "manual" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["blocklist"] });
      toast.success("Added");
      setValue("");
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Risk — blocklist</h1>
      <div className="flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
        >
          {["EMAIL", "IP", "DEVICE", "CARD_FINGERPRINT"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value"
          className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => add.mutate()}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-black"
        >
          Block
        </button>
      </div>
      <ul className="space-y-1 text-sm text-zinc-400">
        {(data as { id: string; type: string; value: string }[])?.map((b) => (
          <li key={b.id} className="font-mono text-xs">
            {b.type}: {b.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
