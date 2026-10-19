import type { NewRaceIngredient } from "@src/services/tanstack/data/raceIngredients";

export const amountFields = [
  { key: "hc_amount", unit: "g" },
  { key: "sodium_amount", unit: "mg" },
  { key: "caffeine_amount", unit: "mg" },
  { key: "liquid_amount", unit: "ml" },
] as const;

export type AmountKey = (typeof amountFields)[number]["key"];

// Los que puede elegir el nutricionista. El bucket race_ingredients acepta png, jpeg y webp: los svg
// se convierten a png antes de subirlos (resizeImage)
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const emptyIngredient: NewRaceIngredient = {
  name: "",
  hc_amount: null,
  sodium_amount: null,
  caffeine_amount: null,
  liquid_amount: null,
};
