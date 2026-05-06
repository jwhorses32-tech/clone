import { Suspense } from "react";
import { ResetPinForm } from "./reset-pin-form";

export default function ResetPinPage() {
  return (
    <Suspense fallback={<div className="text-center text-zinc-500">Loading…</div>}>
      <ResetPinForm />
    </Suspense>
  );
}
