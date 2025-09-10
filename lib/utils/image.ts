import { Difficulty } from "@/lib/constants";
import { getDifficultyCountries } from "@/lib/data/difficultyCategories";

export const prefetchAllFlags = (difficulty: Difficulty) => {
  const countriesForDifficulty = getDifficultyCountries(difficulty);
  const BATCH_SIZE = 14;
  const BATCH_DELAY = 150;
  const LARGE_THRESHOLD = 40;

  if (countriesForDifficulty.length > LARGE_THRESHOLD) {
    let i = 0;
    const prefetchBatch = () => {
      const batch = countriesForDifficulty.slice(i, i + BATCH_SIZE);
      batch.forEach(country => {
        const img = new Image();
        img.src = getCountryFlagUrl(country.code);
      });
      i += BATCH_SIZE;
      if (i < countriesForDifficulty.length) {
        const scheduleIdle = (cb: () => void) => {
          if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => cb(), { timeout: BATCH_DELAY });
          } else {
            setTimeout(cb, BATCH_DELAY);
          }
        };
        scheduleIdle(prefetchBatch);
      }
    };
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => prefetchBatch(), { timeout: 1000 });
    } else {
      setTimeout(prefetchBatch, BATCH_DELAY);
    }
  } else {
    countriesForDifficulty.forEach(country => {
      const img = new Image();
      img.src = getCountryFlagUrl(country.code);
    });
  }
}; 

export const getCountryFlagUrl = (countryCode: string) => {
  if (!countryCode) return "";
  return `/images/flags/${countryCode.toLowerCase()}.svg`;
};

export const getCountryFlagIconUrl = (countryCode: string) => {
  if (!countryCode) return "";
  return `/images/flags/icons/${countryCode.toLowerCase()}.svg`;
};