export const SUPPORTED_CITIES = [
  "Andújar",
  "Córdoba"
] as const;

export type SupportedCity = typeof SUPPORTED_CITIES[number];
