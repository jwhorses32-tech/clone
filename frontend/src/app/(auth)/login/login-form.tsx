"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, setAccessToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMemo } from "react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().min(2),
  pin: z.string().regex(/^\d{4,6}$/),
});

export function LoginForm() {
  const search = useSearchParams();
  const router = useRouter();
  const mode = search.get("mode") === "register" ? "register" : "login";
  const schema = useMemo(() => (mode === "register" ? registerSchema : loginSchema), [mode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", displayName: "", pin: "1234" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (mode === "register") {
        const v = values as z.infer<typeof registerSchema>;
        await api.post("/auth/register", v);
        toast.success("Account created — check your email (MailHog at :8025).");
        router.push("/login");
        return;
      }
      const { data } = await api.post<{ access_token?: string; user: { email: string } }>(
        "/auth/login",
        values,
      );
      if (data.access_token) setAccessToken(data.access_token);
      toast.success(`Welcome, ${data.user.email}`);
      router.push("/dashboard");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } } };
      const msg = err.response?.data?.message;
      toast.error(typeof msg === "string" ? msg : "Request failed");
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-xl">
      <h1 className="text-2xl font-bold text-white">{mode === "register" ? "Create account" : "Welcome back"}</h1>
      <p className="mt-1 text-sm text-zinc-500">
        {mode === "register" ? "Start your merchant workspace." : "Sign in to your dashboard."}
      </p>

      <div className="mt-6 flex gap-2 rounded-lg bg-black/40 p-1">
        <Link
          href="/login"
          className={`flex-1 rounded-md py-2 text-center text-sm font-medium ${
            mode === "login" ? "bg-red-500 text-black" : "text-zinc-400"
          }`}
        >
          Sign In
        </Link>
        <Link
          href="/login?mode=register"
          className={`flex-1 rounded-md py-2 text-center text-sm font-medium ${
            mode === "register" ? "bg-red-500 text-black" : "text-zinc-400"
          }`}
        >
          Create Account
        </Link>
      </div>

      <form className="mt-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {mode === "register" && (
          <div>
            <label className="text-xs font-medium text-zinc-400">Display name</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
              {...form.register("displayName")}
            />
          </div>
        )}
        <div>
          <label className="text-xs font-medium text-zinc-400">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
            {...form.register("email")}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-400">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
            {...form.register("password")}
          />
        </div>
        {mode === "register" && (
          <div>
            <label className="text-xs font-medium text-zinc-400">PIN (4–6 digits)</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm"
              {...form.register("pin")}
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-red-500 py-2.5 text-sm font-bold text-black hover:bg-red-400"
        >
          {mode === "register" ? "Register" : "Login"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
        <Link href="/forgot-password" className="hover:text-red-400">
          Forgot password?
        </Link>
        <Link href="/forgot-pin" className="hover:text-red-400">
          Forgot PIN?
        </Link>
      </div>
    </div>
  );
}
