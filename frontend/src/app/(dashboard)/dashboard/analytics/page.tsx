"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ["analytics-summary"],
    queryFn: async () => (await api.get("/tenants/analytics/summary")).data,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-zinc-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
