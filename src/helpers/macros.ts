import { KCAL_PER_HC_GRAM } from "./nutrition";

export type MacroKey = "hc" | "prot" | "fat";

export const MACRO_KEYS: readonly MacroKey[] = ["hc", "prot", "fat"];

/**
 * Gramos de proteína, grasa e hidratos, con sus kcal.
 *
 * Las kcal se calculan con 4/9/4 kcal por gramo, salvo que se pasen explícitamente: el catálogo
 * (alimentos, tipos de receta) trae sus propias kcal, que pueden no coincidir con las de las macros
 * (fibra, alcohol, redondeos...). Las operaciones las propagan, así que sumar alimentos da la suma de
 * sus kcal del catálogo.
 */
export class Macros {
  readonly prot: number;
  readonly fat: number;
  readonly hc: number;
  private readonly explicitKcal?: number;

  constructor(prot: number, fat: number, hc: number, kcal?: number) {
    this.prot = prot;
    this.fat = fat;
    this.hc = hc;
    this.explicitKcal = kcal;
  }

  /** Desde una fila de la base de datos; con `kcal` se respetan las kcal guardadas */
  static from(row: { prot: number; fat: number; hc: number; kcal?: number | null }) {
    return new Macros(row.prot, row.fat, row.hc, row.kcal ?? undefined);
  }

  static sum(list: Macros[]) {
    return list.reduce((acc, macros) => acc.add(macros), new Macros(0, 0, 0));
  }

  get kcal(): number {
    return this.explicitKcal ?? this.prot * 4 + this.fat * 9 + this.hc * KCAL_PER_HC_GRAM;
  }

  add(other: Macros): Macros {
    return new Macros(
      this.prot + other.prot,
      this.fat + other.fat,
      this.hc + other.hc,
      this.kcal + other.kcal,
    );
  }

  subtract(other: Macros): Macros {
    return new Macros(
      this.prot - other.prot,
      this.fat - other.fat,
      this.hc - other.hc,
      this.kcal - other.kcal,
    );
  }

  /** Macros de `factor` veces esta cantidad (p.ej. raciones de un alimento) */
  scale(factor: number): Macros {
    return new Macros(this.prot * factor, this.fat * factor, this.hc * factor, this.kcal * factor);
  }

  /**
   * Margen (g) con el que un macro encaja en el objetivo `target`: ±10 %, mínimo ±2 g.
   * Misma regla que recipe_type_matches_macros en la base de datos
   */
  static tolerance(target: number) {
    return Math.max(0.1 * target, 2);
  }

  /** Si cada macro está dentro del margen de `target`. Un objetivo sin macros no admite nada */
  fits(target: Macros): boolean {
    if (target.prot + target.fat + target.hc <= 0) return false;
    return MACRO_KEYS.every(
      (key) => Math.abs(this[key] - target[key]) <= Macros.tolerance(target[key]),
    );
  }
}
