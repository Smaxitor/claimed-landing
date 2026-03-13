import { useState } from "react";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

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
    <div className={`${geist.className} min-h-screen bg-white text-gray-900`}>
      <main className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center">

        {/* Logo / Brand */}
        <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-12">
          Claimed
        </p>

        {/* Headline */}
        <h1 className="max-w-2xl text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
          Votre carte bancaire cache des centaines d&apos;euros de garanties.{" "}
          <span className="text-indigo-600">Claimed les réclame à votre place.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-lg text-gray-500 leading-relaxed mb-12">
          Annulation de voyage, vol de bagages, panne électroménager... Votre carte couvre
          peut-être déjà tout ça. La plupart des gens ne le savent pas — et ne réclament
          jamais rien.
        </p>

        {/* Email form */}
        <form
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Envoi..." : "Je veux savoir"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-sm text-green-600 font-medium mb-4">
            Merci&nbsp;! On vous tient au courant.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-500 font-medium mb-4">
            Une erreur est survenue, réessayez.
          </p>
        )}

        {/* Trust line */}
        <p className="text-sm text-gray-400 mb-20">
          Gratuit. Sans engagement. Vos données ne sont jamais revendues.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl border-t border-gray-100 pt-12">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-gray-900">380€</span>
            <span className="text-sm text-gray-500 text-center">récupérés en moyenne</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-gray-900">72%</span>
            <span className="text-sm text-gray-500 text-center">des porteurs ignorent leurs garanties</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-gray-900">15 min</span>
            <span className="text-sm text-gray-500 text-center">pour monter son dossier</span>
          </div>
        </div>

      </main>
    </div>
  );
}
