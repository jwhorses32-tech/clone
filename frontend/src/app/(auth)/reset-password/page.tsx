import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-zinc-500">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
