/**
 * Describe los roles de usuario en el sistema.
 * @readonly
 * @enum {string}
 */
export const StrategiesTypes = Object.freeze({
  PairsInSameAccount: 1,
  Ranges: 2,
  Generic: 3,
  FastOperations: 4
});

export const RecomendationMethods = Object.freeze({
  All: 1,
  SMA_10_50_200: 2,
  SMA_100: 3,
  Strict_SMA_10_50_200: 4,
  Strict_SMA_100: 5,
  Strict_SMA_10_100: 6,
  None: 7,
  SMA_10: 8,
  SMA_5: 9,
});
