"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast:
              "bg-[#121214] border border-white/10 text-zinc-100 shadow-lg shadow-black/40",
            success:
              "!border-red-500/40 [&_[data-icon]]:!text-red-400 [&_.sonner-title]:!text-zinc-50",
            error:
              "!border-red-600/50 [&_[data-icon]]:!text-red-300 [&_.sonner-title]:!text-zinc-50",
            warning:
              "!border-amber-500/40 [&_[data-icon]]:!text-amber-400 [&_.sonner-title]:!text-zinc-50",
            info: "!border-zinc-600/40 [&_[data-icon]]:!text-zinc-400 [&_.sonner-title]:!text-zinc-50",
          },
        }}
      />
    </QueryClientProvider>
  );
}
