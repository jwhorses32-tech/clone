import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#06060a]">
      <header className="border-b border-white/10 px-6 py-4">
        <Link href="/" className="text-lg font-bold text-white">
          Polapine<span className="text-red-400">Clone</span>
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-12">{children}</div>
    </div>
  );
}
