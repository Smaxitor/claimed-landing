import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { supabase } from "@/lib/supabaseClient";
import { getGarantie, isAnalysee } from "@/lib/garanties";
import { labelToSinistre, SINISTRE_LABELS_FR } from "@/lib/sinistreMapping";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, banque, carte, sinistre: sinistreLabel, montant } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email invalide" });
  }

  const sinistreKey = labelToSinistre(sinistreLabel ?? "");
  const garantie = sinistreKey ? getGarantie(banque, carte, sinistreKey) : null;
  const sinistreFr = sinistreKey ? SINISTRE_LABELS_FR[sinistreKey] : (sinistreLabel ?? "");

  try {
    // 1. Ajouter au Resend Audience
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    });

    // 2. Envoyer l'email avec le dossier
    if (garantie && isAnalysee(garantie)) {
      const docsList = garantie.documents.map((d, i) => `${i + 1}. ${d}`).join("\n");

      await resend.emails.send({
        from: "Claimed <onboarding@resend.dev>",
        to: email,
        subject: `Votre dossier de remboursement — ${sinistreFr}`,
        text: `Bonjour,

Voici votre dossier de remboursement pour le sinistre : ${sinistreFr}
Carte : ${carte} — ${banque}
Montant déclaré : ${montant} €

─────────────────────────────────────
PIÈCES JUSTIFICATIVES À FOURNIR
─────────────────────────────────────
${docsList}

─────────────────────────────────────
CONTACT ASSUREUR
─────────────────────────────────────
Assureur : ${garantie.assureur}
Téléphone : ${garantie.contact_tel}
Site web : https://${garantie.contact_web}
Condition principale : ${garantie.conditions}
Délai de déclaration : ${garantie.delai_declaration} jours

⚠️ Pensez à déclarer votre sinistre dans les ${garantie.delai_declaration} jours.

Bonne chance dans vos démarches,
L'équipe Claimed`,
      });
    } else {
      await resend.emails.send({
        from: "Claimed <onboarding@resend.dev>",
        to: email,
        subject: `Votre dossier Claimed — ${sinistreFr}`,
        text: `Bonjour,

Nous avons bien reçu votre demande pour le sinistre : ${sinistreFr}
Carte : ${carte} — ${banque}

Nous n'avons pas encore analysé la notice de cette carte. Nous vous contacterons dès que l'analyse sera disponible.

L'équipe Claimed`,
      });
    }

    // 3. Sauvegarder dans Supabase
    await supabase.from("form_results").insert({
      email,
      banque,
      carte,
      sinistre: sinistreLabel,
      montant: parseFloat(montant) || 0,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("send-dossier error:", error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
}
