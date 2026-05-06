"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function VerifyEmailContent() {
  const q = useSearchParams();
  const router = useRouter();
  const token = q.get("token");
  const [msg, setMsg] = useState(() => (token ? "Verifying…" : "Missing token"));

  useEffect(() => {
    if (!token) return;
    void (async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setMsg("Email verified. You can sign in.");
        setTimeout(() => router.push("/login"), 1500);
      } catch {
        setMsg("Invalid or expired token");
      }
    })();
  }, [token, router]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-white">
      {msg}
    </div>
  );
}
