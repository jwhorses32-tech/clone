"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AdminPage() {
  const qc = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-tenants"],
    queryFn: async () => (await api.get("/admin/tenants")).data,
    retry: false,
  });

  const patch = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/tenants/${id}`, { status }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-tenants"] });
      toast.success("Updated");
    },
  });

  if (isLoading) return <p className="text-zinc-500">Loading…</p>;
  if (error) {
    return (
      <p className="text-zinc-500">
        Admin routes require a user with role ADMIN or STAFF. Seed admin: see backend README.
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Admin — tenants</h1>
      <div className="mt-6 space-y-2">
        {(data as { id: string; displayName: string; status: string }[])?.map((t) => (
          <div
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <span>{t.displayName}</span>
            <span className="text-xs text-zinc-500">{t.status}</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() => patch.mutate({ id: t.id, status: "ACTIVE" })}
              >
                Activate
              </button>
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() => patch.mutate({ id: t.id, status: "SUSPENDED" })}
              >
                Suspend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
