import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email invalide" });
  }

  try {
    await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    });

    await resend.emails.send({
      from: "Claimed <onboarding@resend.dev>",
      to: email,
      subject: "Vous êtes sur la liste Claimed 🎉",
      text: `Bonjour,

Merci de rejoindre Claimed. Vous serez parmi les premiers à découvrir comment récupérer l'argent que votre carte bancaire vous doit.

On revient vers vous très bientôt.

L'équipe Claimed`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ error: "Une erreur est survenue" });
  }
}
