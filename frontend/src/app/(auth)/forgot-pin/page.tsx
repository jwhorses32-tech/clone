"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { toast } from "sonner";

const schema = z.object({ email: z.string().email() });

export default function ForgotPinPage() {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="text-xl font-bold text-white">Forgot PIN</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(async (v) => {
          await api.post("/auth/forgot-pin", v);
          toast.success("If the email exists, a PIN reset was sent (check MailHog).");
        })}
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
          {...form.register("email")}
        />
        <button type="submit" className="w-full rounded-lg bg-red-500 py-2 text-sm font-bold text-black">
          Send PIN reset
        </button>
      </form>
    </div>
  );
}
