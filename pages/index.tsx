import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${inter.className} min-h-screen bg-white text-[#0A0A0A] flex flex-col`}>

      {/* Header */}
      <header className="px-6 pt-6">
        <span className="text-lg font-semibold tracking-tight text-[#0A0A0A]">Claimed</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">

        {/* Card icon */}
        <div className="text-4xl mb-8 select-none">💳</div>

        {/* Headline */}
        <h1 className="max-w-2xl text-4xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] mb-5">
          <span className="block leading-[1.05] mb-6">Votre carte bancaire cache des centaines d&apos;euros de garanties.</span>
          <span className="block leading-[1.05]">Claimed les réclame à votre place.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-lg text-base sm:text-lg text-[#666] font-light leading-relaxed mb-10">
          Annulation de voyage, vol de bagages, panne électroménager... Votre carte couvre
          peut-être déjà tout ça. La plupart des gens ne le savent pas — et ne réclament jamais rien.
        </p>

        {/* Form */}
        <form
          className="flex flex-col sm:flex-row gap-2 w-full max-w-md mb-3"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-[#0A0A0A] placeholder-[#BDBDBD] focus:outline-none focus:border-[#0A0A0A] transition-colors disabled:opacity-50"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#0A0A0A] px-5 py-3 text-sm font-medium text-white hover:bg-[#222] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Envoi..." : "Je veux savoir →"}
          </button>
        </form>

        {/* Feedback */}
        {status === "success" && (
          <p className="text-sm text-[#0A0A0A] font-medium mb-3">
            Merci&nbsp;! On vous tient au courant.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-500 mb-3">
            Une erreur est survenue, réessayez.
          </p>
        )}

        {/* Trust */}
        <p className="text-xs text-[#BDBDBD] mb-12">
          Gratuit. Sans engagement. Vos données ne sont jamais revendues.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
          {[
            { value: "380€", label: "récupérés en moyenne" },
            { value: "72%", label: "ignorent leurs garanties" },
            { value: "15 min", label: "pour monter son dossier" },
          ].map(({ value, label }) => (
            <div
              key={value}
              className="flex flex-col items-center gap-1 bg-[#F5F5F5] rounded-xl px-4 py-5"
            >
              <span className="text-2xl font-bold text-[#0A0A0A] tracking-tight">{value}</span>
              <span className="text-xs text-[#888] text-center leading-snug">{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-xs text-[#BDBDBD] mt-8">© 2026 Claimed</p>

      </main>

    </div>
  );
}
