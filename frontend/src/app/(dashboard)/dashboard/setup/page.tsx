"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, setTenantId } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  brandSlug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  displayName: z.string().min(2),
});

export default function TenantSetupPage() {
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { brandSlug: "", displayName: "" } });

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-white">Create merchant</h1>
      <p className="mt-2 text-sm text-zinc-500">Creates a tenant, default mock gateway, and owner membership.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={form.handleSubmit(async (v) => {
          const { data } = await api.post<{ id: string }>("/tenants", v);
          setTenantId(data.id);
          toast.success("Merchant created");
          router.push("/dashboard");
          router.refresh();
        })}
      >
        <div>
          <label className="text-xs text-zinc-500">Brand slug (URL-safe)</label>
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm" {...form.register("brandSlug")} />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Display name</label>
          <input className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm" {...form.register("displayName")} />
        </div>
        <button type="submit" className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-bold text-black">
          Create
        </button>
      </form>
    </div>
  );
}
