import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { getGarantie, isAnalysee, TypeSinistre } from "@/lib/garanties";
import { labelToSinistre, SINISTRE_LABELS_FR } from "@/lib/sinistreMapping";

const inter = Inter({ subsets: ["latin"] });

type Qualification = {
  sinistre: string;
  banque: string;
  carte: string;
  date: string;
  montant: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatEuros(n: number) {
  return n.toLocaleString("fr-FR") + " €";
}

function isLate(dateStr: string): boolean {
  if (!dateStr) return false;
  const diff = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  return diff > 30;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-3 border-b border-[#F0F0F0] last:border-0">
      <span className="text-sm text-[#888] shrink-0">{label}</span>
      <span className="text-sm font-medium text-[#0A0A0A] text-right">{value}</span>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function Resultat() {
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("claimed_qualification");
    if (raw) {
      try {
        setQualification(JSON.parse(raw));
      } catch {
        // ignore parse error
      }
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className={`${inter.className} min-h-screen bg-white flex items-center justify-center`}>
        <span className="text-sm text-[#888]">Chargement…</span>
      </div>
    );
  }

  if (!qualification) {
    return (
      <div className={`${inter.className} min-h-screen bg-white text-[#0A0A0A] flex flex-col items-center justify-center px-6`}>
        <p className="text-sm text-[#888] mb-4">Aucune donnée trouvée.</p>
        <a
          href="/qualification"
          className="rounded-lg bg-[#0A0A0A] px-5 py-3 text-sm font-medium text-white hover:bg-[#222] transition-colors"
        >
          Recommencer
        </a>
      </div>
    );
  }

  const { sinistre: sinistreLabel, banque, carte, date, montant } = qualification;
  const montantNum = parseFloat(montant) || 0;
  const sinistreKey: TypeSinistre | null = labelToSinistre(sinistreLabel);
  const garantie = sinistreKey ? getGarantie(banque, carte, sinistreKey) : null;
  const analyzed = garantie ? isAnalysee(garantie) : false;

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError(false);
    try {
      const res = await fetch("/api/send-dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, banque, carte, sinistre: sinistreLabel, montant }),
      });
      if (res.ok) {
        setEmailSubmitted(true);
      } else {
        setEmailError(true);
      }
    } catch {
      setEmailError(true);
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className={`${inter.className} min-h-screen bg-white text-[#0A0A0A] flex flex-col`}>

      {/* Header */}
      <header className="px-6 pt-6">
        <a
          href="/"
          className="text-lg font-semibold tracking-tight text-[#0A0A0A] hover:opacity-70 transition-opacity"
        >
          Claimed
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* ── Garantie trouvée et analysée ── */}
          {garantie && analyzed && (
            <>
              {/* Hero */}
              <div className="mb-8">
                <p className="text-xs font-medium text-[#888] uppercase tracking-widest mb-2">
                  Résultat de votre analyse
                </p>
                <h1 className="text-2xl font-bold tracking-tight mb-1">
                  Votre carte {carte} {banque} vous couvre jusqu&apos;à {formatEuros(garantie.plafond)}
                </h1>
                <p className="text-sm text-[#666] font-light">
                  Pour votre sinistre : {SINISTRE_LABELS_FR[sinistreKey!]}
                </p>
              </div>

              {/* Alerte délai si date > 30j */}
              {isLate(date) && (
                <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700 leading-relaxed">
                  ⚠️ Votre sinistre date de plus de 30 jours. Certaines assurances
                  imposent une déclaration rapide — vérifiez vos conditions avant
                  de déposer votre dossier.
                </div>
              )}

              {/* Chiffres clés */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="flex flex-col items-center gap-1 bg-[#F5F5F5] rounded-xl px-3 py-4">
                  <span className="text-xl font-bold tracking-tight">
                    {formatEuros(garantie.plafond)}
                  </span>
                  <span className="text-xs text-[#888] text-center leading-snug">plafond</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-[#F5F5F5] rounded-xl px-3 py-4">
                  <span className="text-xl font-bold tracking-tight">
                    {garantie.franchise === 0 ? "Aucune" : formatEuros(garantie.franchise)}
                  </span>
                  <span className="text-xs text-[#888] text-center leading-snug">franchise</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-[#F5F5F5] rounded-xl px-3 py-4">
                  <span className="text-xl font-bold tracking-tight">
                    {garantie.delai_declaration}j
                  </span>
                  <span className="text-xs text-[#888] text-center leading-snug">délai déclaration</span>
                </div>
              </div>

              {/* Montant potentiel */}
              {montantNum > 0 && (
                <div className="mb-6 rounded-xl border border-[#0A0A0A] bg-[#0A0A0A] text-white px-5 py-4">
                  <p className="text-xs text-[#999] mb-1">Montant potentiellement récupérable</p>
                  <p className="text-2xl font-bold">
                    {formatEuros(Math.min(montantNum, garantie.plafond - garantie.franchise))}
                  </p>
                  <p className="text-xs text-[#777] mt-1">
                    Plafonné à {formatEuros(garantie.plafond)}, franchise {garantie.franchise === 0 ? "nulle" : formatEuros(garantie.franchise)}
                  </p>
                </div>
              )}

              {/* Détails */}
              <div className="mb-6 rounded-xl border border-[#E8E8E8] overflow-hidden">
                <div className="px-5 py-4">
                  <InfoRow label="Assureur" value={garantie.assureur} />
                  <InfoRow label="Condition principale" value={garantie.conditions} />
                  <InfoRow label="Téléphone" value={garantie.contact_tel} />
                  <InfoRow label="Site web" value={garantie.contact_web} />
                </div>
              </div>

              {/* CTA email — gate dossier complet */}
              <div className="mb-4 rounded-xl border border-[#E8E8E8] px-5 py-5">
                {emailSubmitted ? (
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A] mb-2">
                      ✓ Votre dossier a été envoyé à {email}
                    </p>
                    <p className="text-xs text-[#888]">
                      Vous avez {garantie.delai_declaration} jours pour déclarer votre sinistre à l&apos;assureur.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-[#0A0A0A] mb-1">
                      Recevez votre dossier complet gratuitement
                    </p>
                    <p className="text-xs text-[#888] mb-4">
                      Liste complète des pièces à fournir et contact de l&apos;assureur, directement dans votre boîte mail.
                    </p>
                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        disabled={emailLoading}
                        className="w-full rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-[#0A0A0A] placeholder-[#BDBDBD] focus:outline-none focus:border-[#0A0A0A] transition-colors disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={emailLoading}
                        className="w-full rounded-lg bg-[#0A0A0A] px-5 py-3 text-sm font-medium text-white hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {emailLoading ? "Envoi…" : "Envoyer mon dossier →"}
                      </button>
                      {emailError && (
                        <p className="text-xs text-red-500">Une erreur est survenue, réessayez.</p>
                      )}
                    </form>
                  </>
                )}
              </div>

              <a
                href="/qualification"
                className="block w-full text-center rounded-lg border border-[#E0E0E0] px-5 py-3 text-sm font-medium text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
              >
                Analyser un autre sinistre
              </a>
            </>
          )}

          {/* ── Garantie trouvée mais non analysée ── */}
          {garantie && !analyzed && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto mb-6 text-xl">
                🔍
              </div>
              <h1 className="text-2xl font-bold mb-3 tracking-tight">
                Notice en cours d&apos;analyse
              </h1>
              <p className="text-sm text-[#666] font-light leading-relaxed mb-2">
                Nous n&apos;avons pas encore analysé la notice de la{" "}
                <strong>{carte}</strong> de <strong>{banque}</strong>.
              </p>
              <p className="text-sm text-[#666] font-light leading-relaxed mb-8">
                Laissez-nous votre email — nous vous notifions dès que l&apos;analyse
                est disponible.
              </p>
              <a
                href="/"
                className="inline-block rounded-lg bg-[#0A0A0A] px-6 py-3 text-sm font-medium text-white hover:bg-[#222] transition-colors"
              >
                Rejoindre la liste d&apos;attente
              </a>
            </div>
          )}

          {/* ── Combinaison non trouvée ── */}
          {!garantie && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mx-auto mb-6 text-xl">
                ✕
              </div>
              <h1 className="text-2xl font-bold mb-3 tracking-tight">
                Combinaison non répertoriée
              </h1>
              <p className="text-sm text-[#666] font-light leading-relaxed mb-8">
                Cette combinaison banque / carte / sinistre n&apos;est pas encore dans
                notre base. Revenez sur le formulaire ou rejoignez la liste
                d&apos;attente.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="/qualification"
                  className="inline-block w-full text-center rounded-lg bg-[#0A0A0A] px-6 py-3 text-sm font-medium text-white hover:bg-[#222] transition-colors"
                >
                  Recommencer
                </a>
                <a
                  href="/"
                  className="inline-block w-full text-center rounded-lg border border-[#E0E0E0] px-5 py-3 text-sm font-medium text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
                >
                  Retour à l&apos;accueil
                </a>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="pb-6 text-center">
        <p className="text-xs text-[#BDBDBD]">© 2026 Claimed</p>
      </footer>
    </div>
  );
}
