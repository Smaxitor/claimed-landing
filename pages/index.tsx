import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={`${inter.className} min-h-screen bg-white text-[#0A0A0A] flex flex-col`}>

      {/* Header */}
      <header className="px-6 pt-6">
        <span className="text-lg font-semibold tracking-tight text-[#0A0A0A]">Claimed</span>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">

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

        {/* CTA */}
        <a
          href="/qualification"
          className="rounded-lg bg-[#0A0A0A] px-6 py-3 text-sm font-medium text-white hover:bg-[#222] transition-colors mb-3"
        >
          Vérifier mes garanties gratuitement →
        </a>

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
