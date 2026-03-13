// lib/garanties-db.ts
// Accès aux garanties via Supabase (table "notices")

import { supabase } from './supabaseClient'
import type { Garantie, TypeSinistre } from './garanties'

export type { Garantie, TypeSinistre } from './garanties'
export { isAnalysee } from './garanties'

export async function getGarantie(
  banque: string,
  carte: string,
  sinistre: string
): Promise<Garantie | null> {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('banque', banque)
    .eq('carte', carte)
    .eq('sinistre', sinistre)
    .single()

  if (error || !data) return null
  return data as Garantie
}

export async function getPlafondMax(
  banque: string,
  carte: string,
  sinistre: string
): Promise<number> {
  const garantie = await getGarantie(banque, carte, sinistre)
  return garantie?.plafond ?? 0
}
