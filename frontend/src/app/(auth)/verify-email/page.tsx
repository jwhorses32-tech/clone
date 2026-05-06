import { Suspense } from "react";
import { VerifyEmailContent } from "./verify-content";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-zinc-500">Loading…</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
