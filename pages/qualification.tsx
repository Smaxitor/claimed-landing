import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { supabase } from "@/lib/supabaseClient";

const inter = Inter({ subsets: ["latin"] });

// Generate a random session ID once
function generateSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Data ────────────────────────────────────────────────────────────────────

const SINISTRES = [
  "Annulation / interruption de voyage",
  "Retard de vol ou de bagage",
  "Vol ou perte de bagages",
  "Accident neige / montagne",
];

const BANQUES = [
  "BNP Paribas",
  "Société Générale",
  "Crédit Agricole",
  "LCL",
  "Caisse d'Épargne",
  "Banque Populaire",
  "La Banque Postale",
  "BoursoBank",
  "Crédit Mutuel",
  "CIC",
  "Hello Bank",
  "Fortuneo",
  "Autre",
];

const CARTES = [
  "Visa Classic / Bleue",
  "Visa Premier",
  "Visa Platinum",
  "Visa Infinite",
  "Mastercard Classic",
  "Mastercard Gold",
  "Mastercard Platinum / World Elite",
];

const STEP_NAMES = [
  "type_sinistre",
  "banque",
  "carte",
  "date_sinistre",
  "montant",
];

const TOTAL_STEPS = 5;

// ── Supabase tracking ────────────────────────────────────────────────────────

async function trackEvent(
  sessionId: string,
  step: number,
  stepName: string,
  value: string
) {
  const { error } = await supabase.from("form_events").insert({
    session_id: sessionId,
    step,
    step_name: stepName,
    value,
  });
  if (error) console.error("Supabase tracking error:", error.message);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ChoiceButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-colors duration-150 ${
        selected
          ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
          : "border-[#E0E0E0] bg-white text-[#0A0A0A] hover:border-[#0A0A0A] hover:shadow-[inset_0_0_0_1px_#0A0A0A]"
      }`}
    >
      {label}
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Qualification() {
  const router = useRouter();
  const [sessionId] = useState(() => generateSessionId());
  const [step, setStep] = useState(1);

  // Form values
  const [sinistre, setSinistre] = useState("");
  const [banque, setBanque] = useState("");
  const [carte, setCarte] = useState("");
  const [date, setDate] = useState("");
  const [montant, setMontant] = useState("");

  // ── Helpers ────────────────────────────────────────────────────────────────

  const isLate = () => {
    if (!date) return false;
    const diff =
      (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 30;
  };

  const canProceed = () => {
    if (step === 1) return !!sinistre;
    if (step === 2) return !!banque;
    if (step === 3) return !!carte;
    if (step === 4) return !!date;
    if (step === 5) return !!montant;
    return false;
  };

  const currentValue = () => {
    if (step === 1) return sinistre;
    if (step === 2) return banque;
    if (step === 3) return carte;
    if (step === 4) return date;
    if (step === 5) return montant;
    return "";
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  async function handleNext() {
    if (!canProceed()) return;
    await trackEvent(sessionId, step, STEP_NAMES[step - 1], currentValue());
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      sessionStorage.setItem(
        "claimed_qualification",
        JSON.stringify({ sinistre, banque, carte, date, montant })
      );
      router.push("/resultat");
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className={`${inter.className} min-h-screen bg-white text-[#0A0A0A] flex flex-col`}
    >
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

          <>
              {/* Progress bar */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#888]">
                    Étape {step} sur {TOTAL_STEPS}
                  </span>
                  <span className="text-xs text-[#888]">
                    {Math.round((step / TOTAL_STEPS) * 100)}%
                  </span>
                </div>
                <div className="h-1 w-full bg-[#F0F0F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0A0A0A] rounded-full transition-all duration-300"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step content */}
              <div className="mb-8">
                {/* Step 1 — Type de sinistre */}
                {step === 1 && (
                  <>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                      Quel est votre sinistre ?
                    </h2>
                    <p className="text-sm text-[#888] mb-6">
                      Sélectionnez la situation qui vous concerne.
                    </p>
                    <div className="flex flex-col gap-3">
                      {SINISTRES.map((s) => (
                        <ChoiceButton
                          key={s}
                          label={s}
                          selected={sinistre === s}
                          onClick={() => setSinistre(s)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Step 2 — Banque */}
                {step === 2 && (
                  <>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                      Quelle est votre banque ?
                    </h2>
                    <p className="text-sm text-[#888] mb-6">
                      La banque émettrice de votre carte.
                    </p>
                    <select
                      value={banque}
                      onChange={(e) => setBanque(e.target.value)}
                      className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors appearance-none"
                    >
                      <option value="" disabled>
                        Choisir une banque…
                      </option>
                      {BANQUES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                {/* Step 3 — Carte */}
                {step === 3 && (
                  <>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                      Quel type de carte ?
                    </h2>
                    <p className="text-sm text-[#888] mb-6">
                      Regardez le recto de votre carte.
                    </p>
                    <div className="flex flex-col gap-3">
                      {CARTES.map((c) => (
                        <ChoiceButton
                          key={c}
                          label={c}
                          selected={carte === c}
                          onClick={() => setCarte(c)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Step 4 — Date */}
                {step === 4 && (
                  <>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                      Quand le sinistre a-t-il eu lieu ?
                    </h2>
                    <p className="text-sm text-[#888] mb-6">
                      Date approximative si vous n&apos;êtes pas certain.
                    </p>
                    <input
                      type="date"
                      value={date}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                    {isLate() && (
                      <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700 leading-relaxed">
                        ⚠️ Attention — certaines assurances imposent une
                        déclaration dans les 30 jours. Vérifiez vos conditions.
                      </div>
                    )}
                  </>
                )}

                {/* Step 5 — Montant */}
                {step === 5 && (
                  <>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                      Quel montant est concerné ?
                    </h2>
                    <p className="text-sm text-[#888] mb-6">
                      Une estimation suffit.
                    </p>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 pr-10 text-sm text-[#0A0A0A] placeholder-[#BDBDBD] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#888]">
                        €
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-lg border border-[#E0E0E0] px-5 py-3 text-sm font-medium text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors"
                  >
                    ← Retour
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex-1 rounded-lg bg-[#0A0A0A] px-5 py-3 text-sm font-medium text-white hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {step === TOTAL_STEPS ? "Voir mes garanties →" : "Suivant →"}
                </button>
              </div>
            </>
        </div>
      </main>
    </div>
  );
}
