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
  documents: string[];       // pièces justificatives à fournir
};

export type DatabaseGaranties = {
  [banque: string]: {
    [carte: string]: {
      [sinistre in TypeSinistre]?: Garantie;
    };
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Garantie placeholder pour les notices non encore analysées */
function nonAnalysee(): Garantie {
  return {
    plafond: 0,
    franchise: 0,
    conditions: "Notice non encore analysée",
    delai_declaration: 0,
    contact_tel: "",
    contact_web: "",
    assureur: "",
    documents: [],
  };
}

/** Génère les quatre sinistres avec une garantie placeholder */
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
        assureur: "La Banque Postale Assurances",
        documents: [
          "Relevé de carte prouvant le paiement du voyage",
          "Justificatif de l'annulation (certificat médical, avis de décès, etc.)",
          "Facture de l'agence ou du prestataire",
          "Justificatif des sommes non remboursées",
        ],
      },
      retard_vol_bagages: {
        plafond: 400,
        franchise: 0,
        conditions: "Le billet d'avion doit avoir été réglé avec la carte.",
        delai_declaration: 15,
        contact_tel: "+33 5 55 42 51 55",
        contact_web: "labanquepostale-assurancescartes.fr",
        assureur: "La Banque Postale Assurances",
        documents: [
          "Carte d'embarquement",
          "Billet d'avion payé par la carte",
          "Attestation de retard émise par la compagnie aérienne",
          "Justificatifs des achats de première nécessité",
        ],
      },
      vol_perte_bagages: {
        plafond: 800,
        franchise: 0,
        conditions: "Le billet de transport doit avoir été réglé avec la carte.",
        delai_declaration: 15,
        contact_tel: "+33 5 55 42 51 55",
        contact_web: "labanquepostale-assurancescartes.fr",
        assureur: "La Banque Postale Assurances",
        documents: [
          "Billet de transport payé par la carte",
          "Déclaration de vol ou perte auprès du transporteur (PIR)",
          "Liste des biens perdus ou volés avec estimation",
          "Dépôt de plainte si vol avéré",
        ],
      },
      neige_montagne: {
        plafond: 2300,
        franchise: 30,
        conditions: "Le forfait de ski ou l'hébergement doit avoir été réglé avec la carte.",
        delai_declaration: 15,
        contact_tel: "+33 5 55 42 51 55",
        contact_web: "labanquepostale-assurancescartes.fr",
        assureur: "La Banque Postale Assurances",
        documents: [
          "Justificatif de paiement du forfait ou hébergement par la carte",
          "Rapport médical ou certificat d'accident",
          "Factures des frais engagés (secours, hospitalisation, rapatriement)",
          "Justificatif de résidence sur place",
        ],
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
        assureur: "Chubb European Group",
        documents: [
          "Relevé de carte prouvant le paiement",
          "Justificatif de l'annulation (médical, légal, etc.)",
          "Contrat de voyage ou bon de réservation",
          "Justificatif des frais non remboursés",
        ],
      },
      retard_vol_bagages: {
        plafond: 400,
        franchise: 0,
        conditions: "Le billet d'avion doit avoir été payé avec la carte.",
        delai_declaration: 15,
        contact_tel: "04 86 91 01 20",
        contact_web: "visa-assurances.fr",
        assureur: "Chubb European Group",
        documents: [
          "Billet d'avion payé par la carte",
          "Carte d'embarquement",
          "Attestation officielle de retard de la compagnie aérienne",
          "Factures des achats de dépannage",
        ],
      },
      vol_perte_bagages: {
        plafond: 800,
        franchise: 0,
        conditions: "Le titre de transport doit avoir été payé avec la carte.",
        delai_declaration: 15,
        contact_tel: "04 86 91 01 20",
        contact_web: "visa-assurances.fr",
        assureur: "Chubb European Group",
        documents: [
          "Titre de transport payé par la carte",
          "Rapport de sinistre du transporteur (PIR)",
          "Inventaire détaillé des biens perdus ou volés",
          "Dépôt de plainte (en cas de vol)",
        ],
      },
      neige_montagne: {
        plafond: 2300,
        franchise: 30,
        conditions: "Le forfait ou l'hébergement doit avoir été payé avec la carte.",
        delai_declaration: 15,
        contact_tel: "04 86 91 01 20",
        contact_web: "visa-assurances.fr",
        assureur: "Chubb European Group",
        documents: [
          "Justificatif de paiement par la carte",
          "Rapport d'accident ou certificat médical",
          "Factures de secours, transport ou hospitalisation",
          "Justificatif de séjour à la montagne",
        ],
      },
    },
  },

  // ── BNP Paribas — notices non encore analysées ────────────────────────────
  "BNP Paribas": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Crédit Agricole — notices non encore analysées ────────────────────────
  "Crédit Agricole": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── LCL — notices non encore analysées ───────────────────────────────────
  "LCL": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── CIC — notices non encore analysées ───────────────────────────────────
  "CIC": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Crédit Mutuel — notices non encore analysées ──────────────────────────
  "Crédit Mutuel": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── BoursoBank — notices non encore analysées ─────────────────────────────
  "BoursoBank": {
    "Visa Classic / Bleue": tousNonAnalyses(),
    "Visa Premier": tousNonAnalyses(),
    "Mastercard Gold": tousNonAnalyses(),
  },

  // ── Hello Bank — notices non encore analysées ─────────────────────────────
  "Hello Bank": {
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
  const garantie = garanties[banque]?.[carte]?.[sinistre];
  return garantie ?? null;
}

/**
 * Retourne la liste des banques présentes dans la base de données.
 */
export function getBanquesDisponibles(): string[] {
  return Object.keys(garanties);
}

/**
 * Retourne true si la garantie trouvée a été analysée
 * (plafond > 0 ou conditions différentes du placeholder).
 */
export function isAnalysee(garantie: Garantie): boolean {
  return garantie.conditions !== "Notice non encore analysée";
}
