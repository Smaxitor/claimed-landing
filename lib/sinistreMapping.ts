// lib/sinistreMapping.ts
// Mapping entre les labels du formulaire et les clés TypeSinistre

import { TypeSinistre } from "./garanties";

export const SINISTRE_LABELS: Record<string, TypeSinistre> = {
  "Annulation / interruption de voyage": "annulation_voyage",
  "Retard de vol ou de bagage": "retard_vol_bagages",
  "Vol ou perte de bagages": "vol_perte_bagages",
  "Accident neige / montagne": "neige_montagne",
};

export const SINISTRE_LABELS_FR: Record<TypeSinistre, string> = {
  annulation_voyage: "Annulation / interruption de voyage",
  retard_vol_bagages: "Retard de vol ou de bagage",
  vol_perte_bagages: "Vol ou perte de bagages",
  neige_montagne: "Accident neige / montagne",
};

export function labelToSinistre(label: string): TypeSinistre | null {
  return SINISTRE_LABELS[label] ?? null;
}
