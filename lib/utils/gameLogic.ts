import { Country } from "@/lib/data/countries";
import { getDifficultyCountries } from "@/lib/data/difficultyCategories";

export const getCountriesForDifficulty = (
  difficulty: "easy" | "medium" | "hard" | "expert"
) => {
  const baseDifficulty = difficulty === "expert" ? "hard" : difficulty;
  return getDifficultyCountries(baseDifficulty);
};

export const getDifficultySettings = (
  difficulty: "easy" | "medium" | "hard" | "expert"
) => {
  const countries = getCountriesForDifficulty(difficulty);
  const settings = {
    easy: { count: 15, label: "Easy" },
    medium: { count: 25, label: "Medium" },
    hard: {
      count: countries.length,
      label: `Hard`,
    },
    expert: {
      count: countries.length,
      label: `Expert`,
    },
  };
  return settings[difficulty];
};

export const getCountryRegion = (countryCode: string): string => {
  const regions = {
    europe: [
      "GB", "FR", "DE", "IT", "ES", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI", "PL", "PT", "GR", "IS", "CZ", "HU", "RO", "BG", "HR", "SI", "SK", "EE", "LV", "LT", "UA", "BY", "MD", "RS", "BA", "ME", "MK", "AL", "CY", "MT", "LU", "MC", "LI", "SM", "VA", "AD", "IE",
    ],
    asia: [
      "JP", "CN", "IN", "KR", "TH", "VN", "SG", "MY", "ID", "PH", "MM", "KH", "LA", "MN", "KP", "KZ", "UZ", "TM", "KG", "TJ", "AZ", "AM", "GE", "AF", "PK", "BD", "LK", "NP", "BT", "MV", "TL", "BN",
    ],
    africa: [
      "EG", "ZA", "NG", "KE", "MA", "DZ", "TN", "LY", "SD", "SS", "ET", "ER", "DJ", "SO", "RW", "BI", "UG", "TZ", "MW", "MZ", "GH", "CI", "SN", "ML", "BF", "NE", "TD", "CM", "CF", "CD", "CG", "GA", "GQ", "AO", "ZM", "ZW", "BW", "NA", "LS", "SZ", "MG", "MU", "SC", "KM", "GN", "GW", "SL", "LR", "GM", "MR", "CV", "ST", "TG", "BJ",
    ],
    americas: [
      "US", "CA", "BR", "MX", "AR", "CL", "CO", "PE", "VE", "UY", "PY", "BO", "EC", "GY", "SR", "CR", "PA", "NI", "HN", "SV", "GT", "BZ", "JM", "CU", "HT", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS",
    ],
    oceania: [
      "AU", "NZ", "FJ", "PG", "SB", "VU", "WS", "TO", "PW", "FM", "MH", "KI", "NR", "TV",
    ],
    middleEast: [
      "IL", "JO", "LB", "SY", "IQ", "IR", "SA", "AE", "QA", "KW", "BH", "OM", "YE", "TR",
    ],
  };

  for (const [region, codes] of Object.entries(regions)) {
    if (codes.includes(countryCode)) return region;
  }
  return "other";
};

export const getSimilarFlags = (countryCode: string): string[] => {
  const similarGroups: { [name: string]: string[] } = {
    NL: ["LU", "RU", "SI", "SK"],
    LU: ["NL", "RU", "SI", "SK"],
    RU: ["NL", "LU", "SI", "SK"],
    SI: ["NL", "LU", "RU", "SK"],
    SK: ["NL", "LU", "RU", "SI"],
    ID: ["MC", "PL"],
    MC: ["ID", "PL"],
    PL: ["ID", "MC"],
    TD: ["RO"],
    RO: ["TD"],
    SE: ["NO", "DK", "FI", "IS"],
    NO: ["SE", "DK", "FI", "IS"],
    DK: ["SE", "NO", "FI", "IS"],
    FI: ["SE", "NO", "DK", "IS"],
    IS: ["SE", "NO", "DK", "FI"],
    GH: ["CM", "GN", "ML", "SN"],
    CM: ["GH", "GN", "ML", "SN"],
    GN: ["GH", "CM", "ML", "SN"],
    ML: ["GH", "CM", "GN", "SN"],
    SN: ["GH", "CM", "GN", "ML"],
    JO: ["AE", "KW", "SD", "SY"],
    AE: ["JO", "KW", "SD", "SY"],
    KW: ["JO", "AE", "SD", "SY"],
    SD: ["JO", "AE", "KW", "SY"],
    SY: ["JO", "AE", "KW", "SD"],
    FR: ["NL", "RU", "CZ", "SK"],
    CZ: ["FR", "NL", "RU", "SK"],
    AU: ["NZ", "FJ"],
    NZ: ["AU", "FJ"],
    FJ: ["AU", "NZ"],
  };

  return similarGroups[countryCode] || [];
};

export const getSimilarNames = (countryName: string): string[] => {
  const nameGroups: { [name: string]: string[] } = {
    "United States": ["United Kingdom", "United Arab Emirates"],
    "United Kingdom": ["United States", "United Arab Emirates"],
    "United Arab Emirates": ["United States", "United Kingdom"],
    "North Korea": ["South Korea"],
    "South Korea": ["North Korea"],
    "Republic of the Congo": ["Democratic Republic of the Congo"],
    "Democratic Republic of the Congo": ["Republic of the Congo"],
    Guinea: ["Guinea-Bissau", "Equatorial Guinea"],
    "Guinea-Bissau": ["Guinea", "Equatorial Guinea"],
    "Equatorial Guinea": ["Guinea", "Guinea-Bissau"],
    "Saint Kitts and Nevis": [
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
    ],
    "Saint Lucia": [
      "Saint Kitts and Nevis",
      "Saint Vincent and the Grenadines",
    ],
    "Saint Vincent and the Grenadines": [
      "Saint Kitts and Nevis",
      "Saint Lucia",
    ],
  };

  return nameGroups[countryName] || [];
};

export const isDistinctiveFlag = (countryCode: string): boolean => {
  const distinctive = [
    "JP", "CA", "CH", "NP", "CY", "MK", "KE", "KW", "SA", "BD", "LK", "IN", "PK", "TR",
  ];
  return distinctive.includes(countryCode);
};

export const weightedRandomSelect = (items: any[], weights: number[]) => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
};

export const calculateSimilarityScore = (
  correctCountry: Country,
  candidateCountry: Country,
  difficulty: "easy" | "medium" | "hard" | "expert"
) => {
  let score = 0;
  const correctRegion = getCountryRegion(correctCountry.code);
  const candidateRegion = getCountryRegion(candidateCountry.code);
  const similarFlags = getSimilarFlags(correctCountry.code);
  const similarNames = getSimilarNames(correctCountry.name);

  if (correctRegion === candidateRegion) {
    score +=
      difficulty === "expert"
        ? 50
        : difficulty === "hard"
        ? 40
        : difficulty === "medium"
        ? 30
        : 20;
  }

  if (similarFlags.includes(candidateCountry.code)) {
    score += difficulty === "expert" ? 70 : 50;
  }

  if (similarNames.includes(candidateCountry.name)) {
    score += difficulty === "expert" ? 45 : 35;
  }

  if (
    (difficulty === "hard" || difficulty === "expert") &&
    isDistinctiveFlag(candidateCountry.code)
  ) {
    score -= difficulty === "expert" ? 50 : 30;
  }

  if (difficulty === "expert") {
    if (
      correctRegion !== candidateRegion &&
      !similarFlags.includes(candidateCountry.code) &&
      !similarNames.includes(candidateCountry.name)
    ) {
      score -= 40;
    }
  }

  score += Math.random() * (difficulty === "expert" ? 8 : 15);

  return Math.max(score, 1);
};

export interface QuestionData {
  currentCountry: Country;
  options: Country[];
}

export const generateQuestion = (
  difficulty: "easy" | "medium" | "hard" | "expert",
  usedCountries: Set<string> = new Set()
): QuestionData | null => {
  const availableCountries = getCountriesForDifficulty(difficulty);

  const remainingCountries = availableCountries.filter(
    (country) => !usedCountries.has(country.code)
  );

  if (remainingCountries.length === 0) {
    return null;
  }

  const correctCountry =
    remainingCountries[Math.floor(Math.random() * remainingCountries.length)];

  const incorrectOptions: Country[] = [];

  const candidateCountries = availableCountries.filter(
    (c) => c.code !== correctCountry.code
  );

  const candidatesWithScores = candidateCountries.map((candidate) => ({
    country: candidate,
    score: calculateSimilarityScore(correctCountry, candidate, difficulty),
  }));

  const minScoreThreshold = difficulty === "expert" ? 10 : 1;
  const viableCandidates = candidatesWithScores.filter(
    (c) => c.score >= minScoreThreshold
  );

  const finalCandidates =
    viableCandidates.length >= 3 ? viableCandidates : candidatesWithScores;

  while (incorrectOptions.length < 3 && finalCandidates.length > 0) {
    const availableCandidates = finalCandidates.filter(
      (c) => !incorrectOptions.find((opt) => opt.code === c.country.code)
    );

    if (availableCandidates.length === 0) break;

    const countries = availableCandidates.map((c) => c.country);
    const weights = availableCandidates.map((c) => c.score);

    const selectedCountry = weightedRandomSelect(countries, weights);
    incorrectOptions.push(selectedCountry);
  }

  while (
    incorrectOptions.length < 3 &&
    candidateCountries.length > incorrectOptions.length
  ) {
    const remainingCandidates = candidateCountries.filter(
      (c) => !incorrectOptions.find((opt) => opt.code === c.code)
    );

    if (remainingCandidates.length === 0) break;

    const nextCandidate =
      remainingCandidates[
        Math.floor(Math.random() * remainingCandidates.length)
      ];
    incorrectOptions.push(nextCandidate);
  }

  const allOptions = [correctCountry, ...incorrectOptions];
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

  return {
    currentCountry: correctCountry,
    options: shuffledOptions,
  };
};

export function parseDifficultyFromQuery(
  queryValue: string | undefined
): "easy" | "medium" | "hard" | "expert" {
  const allowed = ["easy", "medium", "hard", "expert"];
  if (queryValue && allowed.includes(queryValue)) {
    return queryValue as "easy" | "medium" | "hard" | "expert";
  }
  return "easy";
}
