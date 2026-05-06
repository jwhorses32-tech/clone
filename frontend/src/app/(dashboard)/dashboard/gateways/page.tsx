"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function GatewaysPage() {
  const qc = useQueryClient();
  const [code, setCode] = useState("mock");
  const [json, setJson] = useState('{"failRate":0,"latencyMs":20}');

  const { data } = useQuery({
    queryKey: ["gateways"],
    queryFn: async () => (await api.get("/tenants/gateways")).data,
  });

  const connect = useMutation({
    mutationFn: async () => {
      let credentials: Record<string, unknown> = {};
      try {
        credentials = JSON.parse(json) as Record<string, unknown>;
      } catch {
        throw new Error("Invalid JSON");
      }
      return api.post("/tenants/gateways/connect", { gatewayCode: code, credentials });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["gateways"] });
      toast.success("Gateway connected");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">BYOK gateways</h1>
      <div className="max-w-xl space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <label className="text-xs text-zinc-500">Gateway code</label>
        <select
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm"
        >
          <option value="mock">mock</option>
          <option value="stripe">stripe</option>
          <option value="paypal">paypal</option>
          <option value="coinbase">coinbase</option>
          <option value="cashapp">cashapp</option>
        </select>
        <label className="text-xs text-zinc-500">Credentials JSON</label>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-white/10 bg-black p-3 font-mono text-xs"
        />
        <button
          type="button"
          onClick={() => connect.mutate()}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-black"
        >
          Save encrypted credentials
        </button>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-zinc-400">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
