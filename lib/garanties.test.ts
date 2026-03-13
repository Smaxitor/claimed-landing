// lib/garanties.test.ts
// Tests basiques — exécutables avec Jest (npx jest lib/garanties.test.ts)

import {
  getGarantie,
  getPlafondMax,
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
    expect(g!.assureur).toBe("CNP/Europ Assistance");
    expect(isAnalysee(g!)).toBe(true);
  });

  test("LBP Visa Premier vol_perte_bagages a une franchise de 70€", () => {
    const g = getGarantie("La Banque Postale", "Visa Premier", "vol_perte_bagages");
    expect(g).not.toBeNull();
    expect(g!.franchise).toBe(70);
  });

  test("retourne la garantie SG Visa Premier neige_montagne avec franchise 30€", () => {
    const g = getGarantie("Société Générale", "Visa Premier", "neige_montagne");
    expect(g).not.toBeNull();
    expect(g!.plafond).toBe(2300);
    expect(g!.franchise).toBe(30);
    expect(g!.assureur).toBe("Inter Partner Assistance");
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

describe("getPlafondMax()", () => {
  test("retourne le plafond correct", () => {
    expect(getPlafondMax("La Banque Postale", "Visa Premier", "annulation_voyage")).toBe(5000);
    expect(getPlafondMax("Société Générale", "Visa Premier", "retard_vol_bagages")).toBe(400);
  });

  test("retourne 0 pour une banque inexistante", () => {
    expect(getPlafondMax("Banque Imaginaire", "Visa Premier", "annulation_voyage")).toBe(0);
  });
});

describe("getBanquesDisponibles()", () => {
  test("retourne toutes les banques du formulaire", () => {
    const banques = getBanquesDisponibles();
    expect(banques).toContain("La Banque Postale");
    expect(banques).toContain("Société Générale");
    expect(banques).toContain("BNP Paribas");
    expect(banques).toContain("Caisse d'Épargne");
    expect(banques).toContain("Banque Populaire");
    expect(banques).toContain("Fortuneo");
    expect(banques.length).toBeGreaterThanOrEqual(11);
  });
});
