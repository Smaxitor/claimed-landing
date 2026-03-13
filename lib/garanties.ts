// lib/garanties.ts
// Base de données des garanties carte bancaire — Claimed
// Noms de banques et cartes alignés sur pages/qualification.tsx

// ── Types ────────────────────────────────────────────────────────────────────

export type TypeSinistre =
  | "annulation_voyage"
  | "retard_vol_bagages"
  | "vol_perte_bagages"
  | "neige_montagne";

export type Garantie = {
  plafond: number;           // en euros
  franchise: number;         // en euros (0 si aucune)
  conditions: string;        // condition principale en 1 phrase
  delai_declaration: number; // en jours
  contact_tel: string;
  contact_web: string;
  assureur: string;
  documents: string[];
};

export type DatabaseGaranties = {
  [banque: string]: {
    [carte: string]: {
      [sinistre in TypeSinistre]?: Garantie;
    };
  };
};

// ── Documents par type de sinistre ────────────────────────────────────────────

const DOCUMENTS: Record<TypeSinistre, string[]> = {
  annulation_voyage: [
    "Certificat médical",
    "Facture voyage",
    "Justificatif paiement par carte",
    "Conditions générales de vente du voyagiste",
  ],
  retard_vol_bagages: [
    "Attestation de retard compagnie aérienne",
    "Factures achats de première nécessité",
    "Ticket d'enregistrement des bagages",
    "Justificatif paiement par carte",
  ],
  vol_perte_bagages: [
    "Attestation perte/vol compagnie aérienne",
    "Liste inventaire des effets perdus",
    "Justificatif indemnisation compagnie",
    "Justificatif paiement par carte",
  ],
  neige_montagne: [
    "Certificat médical avec durée d'incapacité",
    "Facture forfait ski / cours",
    "Justificatif paiement par carte",
    "Rapport de police ou secours si applicable",
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function nonAnalysee(): Garantie {
  return {
    plafond: 0,
    franchise: 0,
    conditions: "Notice en cours d'intégration",
    delai_declaration: 0,
    contact_tel: "",
    contact_web: "",
    assureur: "",
    documents: [],
  };
}

function tousNonAnalyses(): Record<TypeSinistre, Garantie> {
  return {
    annulation_voyage: nonAnalysee(),
    retard_vol_bagages: nonAnalysee(),
    vol_perte_bagages: nonAnalysee(),
    neige_montagne: nonAnalysee(),
  };
}

// ── Base de données ───────────────────────────────────────────────────────────

export const garanties: DatabaseGaranties = {

  // ── La Banque Postale — données vérifiées, notice 01/2026 ─────────────────
  "La Banque Postale": {
    "Visa Premier": {
      annulation_voyage: {
        plafond: 5000,
        franchise: 0,
        conditions: "Le voyage doit avoir été réglé avec la carte ou par prélèvement sur le compte associé.",
        delai_declaration: 15,
        contact_tel: "+33 5 55 42 51 55",
        contact_web: "labanquepostale-assurancescartes.fr",
        assureur: "CNP/Europ Assistance",
        documents: DOCUMENTS.annulation_voyage,
      },
      retard_vol_bagages: {
        plafond: 400,
        franchise: 0,
        conditions: "Le billet d'avion doit avoir été réglé avec la carte.",
        delai_declaration: 15,
        contact_tel: "+33 5 55 42 51 55",
        contact_web: "labanquepostale-assurancescartes.fr",
        assureur: "CNP/Europ Assistance",
        documents: DOCUMENTS.retard_vol_bagages,
      },
      vol_perte_bagages: {
        plafond: 800,
        franchise: 70,
        conditions: "Le billet de transport doit avoir été réglé avec la carte.",
        delai_declaration: 15,
        contact_tel: "+33 5 55 42 51 55",
        contact_web: "labanquepostale-assurancescartes.fr",
        assureur: "CNP/Europ Assistance",
        documents: DOCUMENTS.vol_perte_bagages,
      },
      neige_montagne: {
        plafond: 2300,
        franchise: 30,
        conditions: "Le forfait de ski ou l'hébergement doit avoir été réglé avec la carte.",
        delai_declaration: 15,
        contact_tel: "+33 5 55 42 51 55",
        contact_web: "labanquepostale-assurancescartes.fr",
        assureur: "CNP/Europ Assistance",
        documents: DOCUMENTS.neige_montagne,
      },
    },
  },

  // ── Société Générale — données vérifiées, notice 12/2025 ─────────────────
  "Société Générale": {
    "Visa Premier": {
      annulation_voyage: {
        plafond: 5000,
        franchise: 0,
        conditions: "Le voyage doit avoir été réglé intégralement ou partiellement avec la carte Visa Premier.",
        delai_declaration: 15,
        contact_tel: "04 86 91 01 20",
        contact_web: "visa-assurances.fr",
        assureur: "Inter Partner Assistance",
        documents: DOCUMENTS.annulation_voyage,
      },
      retard_vol_bagages: {
        plafond: 400,
        franchise: 0,
        conditions: "Le billet d'avion doit avoir été payé avec la carte.",
        delai_declaration: 15,
        contact_tel: "04 86 91 01 20",
        contact_web: "visa-assurances.fr",
        assureur: "Inter Partner Assistance",
        documents: DOCUMENTS.retard_vol_bagages,
      },
      vol_perte_bagages: {
        plafond: 800,
        franchise: 0,
        conditions: "Le titre de transport doit avoir été payé avec la carte.",
        delai_declaration: 15,
        contact_tel: "04 86 91 01 20",
        contact_web: "visa-assurances.fr",
        assureur: "Inter Partner Assistance",
        documents: DOCUMENTS.vol_perte_bagages,
      },
      neige_montagne: {
        plafond: 2300,
        franchise: 30,
        conditions: "Le forfait ou l'hébergement doit avoir été payé avec la carte.",
        delai_declaration: 15,
        contact_tel: "04 86 91 01 20",
        contact_web: "visa-assurances.fr",
        assureur: "Inter Partner Assistance",
        documents: DOCUMENTS.neige_montagne,
      },
    },
  },

  // ── BNP Paribas — notices non encore intégrées ────────────────────────────
  "BNP Paribas": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Crédit Agricole — notices non encore intégrées ────────────────────────
  "Crédit Agricole": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── LCL — notices non encore intégrées ───────────────────────────────────
  "LCL": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── CIC — notices non encore intégrées ───────────────────────────────────
  "CIC": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Crédit Mutuel — notices non encore intégrées ──────────────────────────
  "Crédit Mutuel": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── BoursoBank — notices non encore intégrées ─────────────────────────────
  "BoursoBank": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Hello Bank — notices non encore intégrées ─────────────────────────────
  "Hello Bank": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Caisse d'Épargne — notices non encore intégrées ──────────────────────
  "Caisse d'Épargne": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Banque Populaire — notices non encore intégrées ───────────────────────
  "Banque Populaire": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Fortuneo — notices non encore intégrées ───────────────────────────────
  "Fortuneo": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },
};

// ── Fonctions publiques ───────────────────────────────────────────────────────

/**
 * Retourne la garantie correspondante, ou null si non trouvée.
 * Les noms de banque et carte doivent correspondre exactement
 * aux valeurs du formulaire pages/qualification.tsx.
 */
export function getGarantie(
  banque: string,
  carte: string,
  sinistre: TypeSinistre
): Garantie | null {
  return garanties[banque]?.[carte]?.[sinistre] ?? null;
}

/**
 * Retourne le plafond max pour une combinaison banque/carte/sinistre.
 * Retourne 0 si non trouvé ou non analysé.
 */
export function getPlafondMax(
  banque: string,
  carte: string,
  sinistre: TypeSinistre
): number {
  return getGarantie(banque, carte, sinistre)?.plafond ?? 0;
}

/**
 * Retourne la liste des banques présentes dans la base de données.
 */
export function getBanquesDisponibles(): string[] {
  return Object.keys(garanties);
}

/**
 * Retourne true si la garantie a été analysée
 * (conditions différentes du placeholder).
 */
export function isAnalysee(garantie: Garantie): boolean {
  return garantie.conditions !== "Notice en cours d'intégration";
}
