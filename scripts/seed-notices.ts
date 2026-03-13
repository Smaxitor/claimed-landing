// scripts/seed-notices.ts
// Exécuté une seule fois avec : npx ts-node scripts/seed-notices.ts

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const DOCS = {
  annulation_voyage: [
    'Certificat médical',
    'Facture voyage',
    'Justificatif paiement par carte',
    'Conditions générales de vente du voyagiste',
  ],
  retard_vol_bagages: [
    'Attestation de retard compagnie aérienne',
    'Factures achats de première nécessité',
    "Ticket d'enregistrement des bagages",
    'Justificatif paiement par carte',
  ],
  vol_perte_bagages: [
    'Attestation perte/vol compagnie aérienne',
    'Liste inventaire des effets perdus',
    'Justificatif indemnisation compagnie',
    'Justificatif paiement par carte',
  ],
  neige_montagne: [
    "Certificat médical avec durée d'incapacité",
    'Facture forfait ski / cours',
    'Justificatif paiement par carte',
    'Rapport de police ou secours si applicable',
  ],
}

const notices = [
  // ── La Banque Postale — Visa Premier ──────────────────────────────────────
  {
    banque: 'La Banque Postale',
    carte: 'Visa Premier',
    sinistre: 'annulation_voyage',
    plafond: 5000,
    franchise: 0,
    conditions: 'Le voyage doit avoir été réglé avec la carte ou par prélèvement sur le compte associé.',
    delai_declaration: 15,
    assureur: 'CNP/Europ Assistance',
    contact_tel: '+33 5 55 42 51 55',
    contact_web: 'labanquepostale-assurancescartes.fr',
    documents: DOCS.annulation_voyage,
  },
  {
    banque: 'La Banque Postale',
    carte: 'Visa Premier',
    sinistre: 'retard_vol_bagages',
    plafond: 400,
    franchise: 0,
    conditions: "Le billet d'avion doit avoir été réglé avec la carte.",
    delai_declaration: 15,
    assureur: 'CNP/Europ Assistance',
    contact_tel: '+33 5 55 42 51 55',
    contact_web: 'labanquepostale-assurancescartes.fr',
    documents: DOCS.retard_vol_bagages,
  },
  {
    banque: 'La Banque Postale',
    carte: 'Visa Premier',
    sinistre: 'vol_perte_bagages',
    plafond: 800,
    franchise: 70,
    conditions: 'Le billet de transport doit avoir été réglé avec la carte.',
    delai_declaration: 15,
    assureur: 'CNP/Europ Assistance',
    contact_tel: '+33 5 55 42 51 55',
    contact_web: 'labanquepostale-assurancescartes.fr',
    documents: DOCS.vol_perte_bagages,
  },
  {
    banque: 'La Banque Postale',
    carte: 'Visa Premier',
    sinistre: 'neige_montagne',
    plafond: 2300,
    franchise: 30,
    conditions: "Le forfait de ski ou l'hébergement doit avoir été réglé avec la carte.",
    delai_declaration: 15,
    assureur: 'CNP/Europ Assistance',
    contact_tel: '+33 5 55 42 51 55',
    contact_web: 'labanquepostale-assurancescartes.fr',
    documents: DOCS.neige_montagne,
  },
  // ── Société Générale — Visa Premier ───────────────────────────────────────
  {
    banque: 'Société Générale',
    carte: 'Visa Premier',
    sinistre: 'annulation_voyage',
    plafond: 5000,
    franchise: 0,
    conditions: 'Le voyage doit avoir été réglé intégralement ou partiellement avec la carte Visa Premier.',
    delai_declaration: 15,
    assureur: 'Inter Partner Assistance',
    contact_tel: '04 86 91 01 20',
    contact_web: 'visa-assurances.fr',
    documents: DOCS.annulation_voyage,
  },
  {
    banque: 'Société Générale',
    carte: 'Visa Premier',
    sinistre: 'retard_vol_bagages',
    plafond: 400,
    franchise: 0,
    conditions: "Le billet d'avion doit avoir été payé avec la carte.",
    delai_declaration: 15,
    assureur: 'Inter Partner Assistance',
    contact_tel: '04 86 91 01 20',
    contact_web: 'visa-assurances.fr',
    documents: DOCS.retard_vol_bagages,
  },
  {
    banque: 'Société Générale',
    carte: 'Visa Premier',
    sinistre: 'vol_perte_bagages',
    plafond: 800,
    franchise: 0,
    conditions: 'Le titre de transport doit avoir été payé avec la carte.',
    delai_declaration: 15,
    assureur: 'Inter Partner Assistance',
    contact_tel: '04 86 91 01 20',
    contact_web: 'visa-assurances.fr',
    documents: DOCS.vol_perte_bagages,
  },
  {
    banque: 'Société Générale',
    carte: 'Visa Premier',
    sinistre: 'neige_montagne',
    plafond: 2300,
    franchise: 30,
    conditions: "Le forfait ou l'hébergement doit avoir été payé avec la carte.",
    delai_declaration: 15,
    assureur: 'Inter Partner Assistance',
    contact_tel: '04 86 91 01 20',
    contact_web: 'visa-assurances.fr',
    documents: DOCS.neige_montagne,
  },
]

async function seed() {
  console.log(`Insertion de ${notices.length} notices…`)

  const { data, error } = await supabase
    .from('notices')
    .upsert(notices, { onConflict: 'banque,carte,sinistre' })

  if (error) {
    console.error('Erreur Supabase :', error.message)
    process.exit(1)
  }

  console.log('✓ Notices insérées avec succès.')
}

seed()
