// lib/garanties.test.ts
// Tests basiques — exécutables avec Jest (npx jest lib/garanties.test.ts)

import {
  getGarantie,
  getBanquesDisponibles,
  isAnalysee,
} from "./garanties";

describe("getGarantie()", () => {
  test("retourne la garantie LBP Visa Premier annulation_voyage", () => {
    const g = getGarantie("La Banque Postale", "Visa Premier", "annulation_voyage");
    expect(g).not.toBeNull();
    expect(g!.plafond).toBe(5000);
    expect(g!.franchise).toBe(0);
    expect(g!.delai_declaration).toBe(15);
    expect(g!.contact_tel).toBe("+33 5 55 42 51 55");
    expect(isAnalysee(g!)).toBe(true);
  });

  test("retourne la garantie SG Visa Premier neige_montagne avec franchise 30€", () => {
    const g = getGarantie("Société Générale", "Visa Premier", "neige_montagne");
    expect(g).not.toBeNull();
    expect(g!.plafond).toBe(2300);
    expect(g!.franchise).toBe(30);
    expect(g!.assureur).toBe("Chubb European Group");
    expect(isAnalysee(g!)).toBe(true);
  });

  test("retourne null pour une banque inexistante", () => {
    const g = getGarantie("Banque Imaginaire", "Visa Premier", "vol_perte_bagages");
    expect(g).toBeNull();
  });

  test("retourne une garantie non analysée pour BNP Visa Premier", () => {
    const g = getGarantie("BNP Paribas", "Visa Premier", "retard_vol_bagages");
    expect(g).not.toBeNull();
    expect(isAnalysee(g!)).toBe(false);
    expect(g!.plafond).toBe(0);
  });
});

describe("getBanquesDisponibles()", () => {
  test("retourne au moins les banques vérifiées", () => {
    const banques = getBanquesDisponibles();
    expect(banques).toContain("La Banque Postale");
    expect(banques).toContain("Société Générale");
    expect(banques).toContain("BNP Paribas");
    expect(banques.length).toBeGreaterThanOrEqual(2);
  });
});
