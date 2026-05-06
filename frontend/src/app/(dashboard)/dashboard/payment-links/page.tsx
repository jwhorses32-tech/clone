"use client";

export default function PaymentLinksPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Payment links</h1>
      <p className="mt-4 max-w-xl text-sm text-zinc-400">
        Payment links are created automatically when you call{" "}
        <code className="rounded bg-white/10 px-1">POST /api/v1/create-invoice</code>. The response includes{" "}
        <code className="rounded bg-white/10 px-1">payment_url</code> pointing to{" "}
        <code className="rounded bg-white/10 px-1">/pay/&lt;hostedPath&gt;</code>.
      </p>
    </div>
  );
}
