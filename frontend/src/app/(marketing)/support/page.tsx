import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="text-3xl font-bold text-white">Contact</h1>
      <p className="mt-4 text-zinc-400">
        This is a reference implementation of a Polapine-style orchestration stack. For production
        licensing, compliance, and underwriting, engage your legal and payments advisors.
      </p>
      <Link href="/" className="mt-8 inline-block text-red-400 hover:underline">
        ← Back home
      </Link>
    </div>
  );
}
