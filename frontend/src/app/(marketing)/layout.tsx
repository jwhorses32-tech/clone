import type { ReactNode } from "react";
import { MarketingNav } from "@/components/marketing-nav";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06060a] text-zinc-100">
      <MarketingNav />
      {children}
    </div>
  );
}
