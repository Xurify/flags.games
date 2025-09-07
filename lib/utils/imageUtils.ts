import { Difficulty } from "@/lib/constants";
import { getDifficultyCountries } from "@/lib/data/difficultyCategories";

export const prefetchAllFlagsForDifficulty = (difficulty: Difficulty) => {
  const countriesForDifficulty = getDifficultyCountries(difficulty);
  const BATCH_SIZE = 8;
  const BATCH_DELAY = 300;
  const LARGE_THRESHOLD = 40;

  if (countriesForDifficulty.length > LARGE_THRESHOLD) {
    let i = 0;
    const prefetchBatch = () => {
      const batch = countriesForDifficulty.slice(i, i + BATCH_SIZE);
      batch.forEach(country => {
        const img = new Image();
        img.src = country.flag;
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
      requestIdleCallback(() => prefetchBatch());
    } else {
      setTimeout(prefetchBatch, BATCH_DELAY);
    }
  } else {
    countriesForDifficulty.forEach(country => {
      const img = new Image();
      img.src = country.flag;
    });
  }
}; 