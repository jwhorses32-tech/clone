"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { toast } from "sonner";

const schema = z.object({
  pin: z.string().regex(/^\d{4,6}$/),
});

export function ResetPinForm() {
  const q = useSearchParams();
  const router = useRouter();
  const token = q.get("token") ?? "";
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { pin: "" } });

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="text-xl font-bold text-white">Reset PIN</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(async (v) => {
          await api.post("/auth/reset-pin", { token, pin: v.pin });
          toast.success("PIN updated");
          router.push("/login");
        })}
      >
        <input
          placeholder="New PIN (4–6 digits)"
          className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
          {...form.register("pin")}
        />
        <button type="submit" className="w-full rounded-lg bg-red-500 py-2 text-sm font-bold text-black">
          Save
        </button>
      </form>
    </div>
  );
}
