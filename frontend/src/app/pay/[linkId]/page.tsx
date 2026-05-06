"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function HostedCheckoutPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const [email, setEmail] = useState("");

  const checkout = useQuery({
    queryKey: ["checkout", linkId],
    queryFn: async () => (await api.get(`/checkout/${linkId}`)).data as {
      amount_cents: number;
      currency: string;
      brand: string;
      order_reference: string | null;
    },
  });

  const pay = useMutation({
    mutationFn: async () =>
      api.post(`/checkout/${linkId}/complete`, {
        email: email || undefined,
        deviceFingerprint: "demo-fp",
      }),
    onSuccess: () => toast.success("Payment complete (mock gateway)"),
    onError: () => toast.error("Payment failed — see API error"),
  });

  if (checkout.isLoading) return <div className="flex min-h-screen items-center justify-center text-zinc-500">Loading…</div>;
  if (checkout.isError) return <div className="flex min-h-screen items-center justify-center text-red-400">Invalid link</div>;

  const c = checkout.data!;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#06060a] px-4 py-12 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-widest text-red-400">{c.brand}</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Pay invoice</h1>
        {c.order_reference && <p className="mt-1 text-sm text-zinc-500">Order: {c.order_reference}</p>}
        <p className="mt-6 text-4xl font-bold text-white">
          ${(c.amount_cents / 100).toFixed(2)} <span className="text-lg font-normal text-zinc-500">{c.currency}</span>
        </p>
        <input
          type="email"
          placeholder="Email (optional, for risk demo)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={pay.isPending}
          onClick={() => pay.mutate()}
          className="mt-6 w-full rounded-xl bg-red-500 py-3 text-sm font-bold text-black hover:bg-red-400 disabled:opacity-50"
        >
          {pay.isPending ? "Processing…" : "Pay with Apple Pay / Google Pay / Card (mock)"}
        </button>
        <p className="mt-4 text-center text-xs text-zinc-600">
          Demo checkout — uses orchestration + mock adapter. Stripe Payment Request API can be wired on this page
          next.
        </p>
      </div>
    </div>
  );
}
