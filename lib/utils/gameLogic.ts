import { Country } from "@/lib/data/countries";
import { getDifficultyCountries } from "@/lib/data/difficultyCategories";
import {
  DIFFICULTY_LEVELS,
  Difficulty,
  DEFAULT_DIFFICULTY,
  EXPERT_DIFFICULTY,
  HARD_DIFFICULTY,
  MEDIUM_DIFFICULTY,
} from "@/lib/constants";

export const getCountriesForDifficulty = (difficulty: Difficulty) => {
  const baseDifficulty =
    difficulty === EXPERT_DIFFICULTY ? HARD_DIFFICULTY : difficulty;
  return getDifficultyCountries(baseDifficulty);
};

export const getDifficultySettings = (difficulty: Difficulty) => {
  const countries = getCountriesForDifficulty(difficulty);
  const settings = {
    [DEFAULT_DIFFICULTY]: { count: 15, label: "Easy" },
    [MEDIUM_DIFFICULTY]: { count: 25, label: "Medium" },
    [HARD_DIFFICULTY]: {
      count: countries.length,
      label: `Hard`,
    },
    [EXPERT_DIFFICULTY]: {
      count: countries.length,
      label: `Expert`,
    },
  };
  return settings[difficulty];
};

export const getCountryRegion = (countryCode: string): string => {
  const regions = {
    europe: [
      "GB",
      "FR",
      "DE",
      "IT",
      "ES",
      "NL",
      "BE",
      "CH",
      "AT",
      "SE",
      "NO",
      "DK",
      "FI",
      "PL",
      "PT",
      "GR",
      "IS",
      "CZ",
      "HU",
      "RO",
      "BG",
      "HR",
      "SI",
      "SK",
      "EE",
      "LV",
      "LT",
      "UA",
      "BY",
      "MD",
      "RS",
      "BA",
      "ME",
      "MK",
      "AL",
      "CY",
      "MT",
      "LU",
      "MC",
      "LI",
      "SM",
      "VA",
      "AD",
      "IE",
    ],
    asia: [
      "JP",
      "CN",
      "IN",
      "KR",
      "TH",
      "VN",
      "SG",
      "MY",
      "ID",
      "PH",
      "MM",
      "KH",
      "LA",
      "MN",
      "KP",
      "KZ",
      "UZ",
      "TM",
      "KG",
      "TJ",
      "AZ",
      "AM",
      "GE",
      "AF",
      "PK",
      "BD",
      "LK",
      "NP",
      "BT",
      "MV",
      "TL",
      "BN",
    ],
    africa: [
      "EG",
      "ZA",
      "NG",
      "KE",
      "MA",
      "DZ",
      "TN",
      "LY",
      "SD",
      "SS",
      "ET",
      "ER",
      "DJ",
      "SO",
      "RW",
      "BI",
      "UG",
      "TZ",
      "MW",
      "MZ",
      "GH",
      "CI",
      "SN",
      "ML",
      "BF",
      "NE",
      "TD",
      "CM",
      "CF",
      "CD",
      "CG",
      "GA",
      "GQ",
      "AO",
      "ZM",
      "ZW",
      "BW",
      "NA",
      "LS",
      "SZ",
      "MG",
      "MU",
      "SC",
      "KM",
      "GN",
      "GW",
      "SL",
      "LR",
      "GM",
      "MR",
      "CV",
      "ST",
      "TG",
      "BJ",
    ],
    americas: [
      "US",
      "CA",
      "BR",
      "MX",
      "AR",
      "CL",
      "CO",
      "PE",
      "VE",
      "UY",
      "PY",
      "BO",
      "EC",
      "GY",
      "SR",
      "CR",
      "PA",
      "NI",
      "HN",
      "SV",
      "GT",
      "BZ",
      "JM",
      "CU",
      "HT",
      "DO",
      "TT",
      "BB",
      "LC",
      "GD",
      "VC",
      "AG",
      "DM",
      "KN",
      "BS",
    ],
    oceania: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    middleEast: [
      "IL",
      "JO",
      "LB",
      "SY",
      "IQ",
      "IR",
      "SA",
      "AE",
      "QA",
      "KW",
      "BH",
      "OM",
      "YE",
      "TR",
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
    GB: ["US", "FR", "NL", "RU"],
    US: ["GB", "FR", "NL", "RU"],
    BF: ["GH", "CM", "GN", "ML", "SN", "NE", "TD", "TG", "BJ"],
    NE: ["GH", "CM", "GN", "ML", "SN", "BF", "TD", "TG", "BJ"],
    IQ: ["JO", "AE", "KW", "SD", "SY", "IR", "SA", "QA", "BH", "OM", "YE"],
    IR: ["JO", "AE", "KW", "SD", "SY", "IQ", "SA", "QA", "BH", "OM", "YE"],
    SA: ["JO", "AE", "KW", "SD", "SY", "IQ", "IR", "QA", "BH", "OM", "YE"],
    QA: ["JO", "AE", "KW", "SD", "SY", "IQ", "IR", "SA", "BH", "OM", "YE"],
    BH: ["JO", "AE", "KW", "SD", "SY", "IQ", "IR", "SA", "QA", "OM", "YE"],
    OM: ["JO", "AE", "KW", "SD", "SY", "IQ", "IR", "SA", "QA", "BH", "YE"],
    YE: ["JO", "AE", "KW", "SD", "SY", "IQ", "IR", "SA", "QA", "BH", "OM"],
    HR: ["RU", "NL", "LU", "SI", "SK", "CZ", "RS", "BA", "ME", "MK"],
    RS: ["RU", "NL", "LU", "SI", "SK", "CZ", "HR", "BA", "ME", "MK"],
    BA: ["RU", "NL", "LU", "SI", "SK", "CZ", "HR", "RS", "ME", "MK"],
    ME: ["RU", "NL", "LU", "SI", "SK", "CZ", "HR", "RS", "BA", "MK"],
    MK: ["RS", "HR", "BA", "ME", "SI", "SK"],
    EE: ["LV", "LT"],
    LV: ["EE", "LT"],
    LT: ["EE", "LV"],
    KZ: ["UZ", "TM", "KG", "TJ", "AZ", "AM", "GE"],
    UZ: ["KZ", "TM", "KG", "TJ", "AZ", "AM", "GE"],
    TM: ["KZ", "UZ", "KG", "TJ", "AZ", "AM", "GE"],
    KG: ["KZ", "UZ", "TM", "TJ", "AZ", "AM", "GE"],
    TJ: ["KZ", "UZ", "TM", "KG", "AZ", "AM", "GE"],
    AZ: ["KZ", "UZ", "TM", "KG", "TJ", "AM", "GE"],
    AM: ["KZ", "UZ", "TM", "KG", "TJ", "AZ", "GE"],
    GE: ["KZ", "UZ", "TM", "KG", "TJ", "AZ", "AM"],
    JM: ["CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS"],
    CU: ["JM", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS"],
    DO: ["JM", "CU", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS"],
    TT: ["JM", "CU", "DO", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS"],
    BB: ["JM", "CU", "DO", "TT", "LC", "GD", "VC", "AG", "DM", "KN", "BS"],
    LC: ["JM", "CU", "DO", "TT", "BB", "GD", "VC", "AG", "DM", "KN", "BS"],
    GD: ["JM", "CU", "DO", "TT", "BB", "LC", "VC", "AG", "DM", "KN", "BS"],
    VC: ["JM", "CU", "DO", "TT", "BB", "LC", "GD", "AG", "DM", "KN", "BS"],
    AG: ["JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "DM", "KN", "BS"],
    DM: ["JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "KN", "BS"],
    KN: ["JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "BS"],
    BS: ["JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN"],
    PG: [
      "AU",
      "NZ",
      "FJ",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    SB: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    VU: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    WS: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    TO: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    PW: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    FM: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    MH: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "KI",
      "NR",
      "TV",
    ],
    KI: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "NR",
      "TV",
    ],
    NR: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "TV",
    ],
    TV: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
    ],
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
    Guinea: ["Guinea-Bissau", "Equatorial Guinea", "Papua New Guinea"],
    "Guinea-Bissau": ["Guinea", "Equatorial Guinea", "Papua New Guinea"],
    "Equatorial Guinea": ["Guinea", "Guinea-Bissau", "Papua New Guinea"],
    "Papua New Guinea": ["Guinea", "Guinea-Bissau", "Equatorial Guinea"],
    "Saint Kitts and Nevis": [
      "Saint Lucia",
      "Saint Vincent and the Grenadines"
    ],
    "Saint Lucia": [
      "Saint Kitts and Nevis",
      "Saint Vincent and the Grenadines"
    ],
    "Saint Vincent and the Grenadines": [
      "Saint Kitts and Nevis",
      "Saint Lucia"
    ],
    "Sudan": ["South Sudan"],
    "South Sudan": ["Sudan"],
    "Niger": ["Nigeria"],
    "Nigeria": ["Niger"],
    "Slovakia": ["Slovenia"],
    "Slovenia": ["Slovakia"],
    "Austria": ["Australia"],
    "Australia": ["Austria"],
    "Dominica": ["Dominican Republic"],
    "Dominican Republic": ["Dominica"],
    "Moldova": ["Maldives"],
    "Maldives": ["Moldova"],
    "Armenia": ["Romania"],
    "Romania": ["Armenia"],
    "Central African Republic": ["South Africa"],
    "South Africa": ["Central African Republic"],
    "Antigua and Barbuda": ["Barbados"],
    "Barbados": ["Antigua and Barbuda"],
    "Burkina Faso": ["Burundi"],
    "Burundi": ["Burkina Faso"],
    "Mauritania": ["Mauritius"],
    "Mauritius": ["Mauritania"],
    "Seychelles": ["Senegal"],
    "Senegal": ["Seychelles"],
    "Gambia": ["Zambia", "Gabon"],
    "Zambia": ["Gambia", "Gabon"],
    "Gabon": ["Gambia", "Zambia"],
    "Latvia": ["Lithuania", "Estonia"],
    "Lithuania": ["Latvia", "Estonia"],
    "Estonia": ["Latvia", "Lithuania"],
    "Belarus": ["Russia"],
    "Russia": ["Belarus"],
    "Yemen": ["Oman"],
    "Oman": ["Yemen"],
    "Jordan": ["Lebanon"],
    "Lebanon": ["Jordan"],
    "Iran": ["Iraq"],
    "Iraq": ["Iran"],
    "Sweden": ["Switzerland"],
    "Switzerland": ["Sweden"],
    "Chad": ["Chile"],
    "Chile": ["Chad"],
    "Benin": ["Bahrain"],
    "Bahrain": ["Benin"],
  };

  return nameGroups[countryName] || [];
};

export const isDistinctiveFlag = (countryCode: string): boolean => {
  const distinctive = [
    "JP",
    "CA",
    "CH",
    "NP",
    "CY",
    "MK",
    "KE",
    "KW",
    "SA",
    "BD",
    "LK",
    "IN",
    "PK",
    "TR",
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
  difficulty: Difficulty
) => {
  if (difficulty === EXPERT_DIFFICULTY) {
    return calculateExpertSimilarityScore(correctCountry, candidateCountry);
  }

  let score = 0;
  const correctRegion = getCountryRegion(correctCountry.code);
  const candidateRegion = getCountryRegion(candidateCountry.code);
  const similarFlags = getSimilarFlags(correctCountry.code);
  const similarNames = getSimilarNames(correctCountry.name);

  if (correctRegion === candidateRegion) {
    score +=
      difficulty === HARD_DIFFICULTY
        ? 40
        : difficulty === MEDIUM_DIFFICULTY
        ? 30
        : 20;
  }

  if (similarFlags.includes(candidateCountry.code)) {
    score += 50;
  }

  if (similarNames.includes(candidateCountry.name)) {
    score += 35;
  }

  // Expert mode: Additional similarity factors
  if (difficulty === EXPERT_DIFFICULTY) {
    // Same starting letter bonus
    if (correctCountry.name[0] === candidateCountry.name[0]) {
      score += 25;
    }

    // Similar name length bonus
    const lengthDiff = Math.abs(
      correctCountry.name.length - candidateCountry.name.length
    );
    if (lengthDiff <= 2) {
      score += 20;
    }

    // Same ending pattern bonus
    if (
      correctCountry.name.endsWith(candidateCountry.name.slice(-3)) ||
      candidateCountry.name.endsWith(correctCountry.name.slice(-3))
    ) {
      score += 30;
    }

    // Similar syllable count bonus
    const correctSyllables = correctCountry.name.replace(
      /[^aeiou]/gi,
      ""
    ).length;
    const candidateSyllables = candidateCountry.name.replace(
      /[^aeiou]/gi,
      ""
    ).length;
    const syllableDiff = Math.abs(correctSyllables - candidateSyllables);
    if (syllableDiff <= 1) {
      score += 15;
    }

    // Advanced linguistic similarities
    // Shared word bonus (e.g., "United", "Republic", "Democratic")
    const correctWords = correctCountry.name.toLowerCase().split(" ");
    const candidateWords = candidateCountry.name.toLowerCase().split(" ");
    const sharedWords = correctWords.filter((word) =>
      candidateWords.includes(word)
    );
    if (sharedWords.length > 0) {
      score += sharedWords.length * 20;
    }

    // Similar word count bonus
    const wordCountDiff = Math.abs(correctWords.length - candidateWords.length);
    if (wordCountDiff <= 1) {
      score += 15;
    }

    // Flag color pattern analysis
    const colorPatterns = {
      redWhiteBlue: ["US", "GB", "FR", "NL", "RU", "CZ", "SK", "SI", "LU"],
      redWhiteGreen: ["IT", "BG", "HU", "IR", "BD", "MG"],
      redYellowGreen: [
        "GH",
        "CM",
        "GN",
        "ML",
        "SN",
        "BF",
        "NE",
        "TD",
        "TG",
        "BJ",
      ],
      redWhiteBlack: ["EG", "SY", "IQ", "YE", "SD", "SS"],
      blueWhiteRed: ["FR", "NL", "RU", "CZ", "SK", "SI", "LU"],
      greenWhiteRed: ["IT", "BG", "HU", "IR", "BD", "MG"],
      yellowBlueRed: ["RO", "TD", "CO", "EC", "VE"],
      redYellowBlue: ["RO", "TD", "CO", "EC", "VE"],
    };

    for (const [pattern, codes] of Object.entries(colorPatterns)) {
      if (
        codes.includes(correctCountry.code) &&
        codes.includes(candidateCountry.code)
      ) {
        score += 40;
        break;
      }
    }

    // Flag element similarities (stars, crosses, stripes, etc.)
    const flagElements = {
      stars: [
        "US",
        "AU",
        "NZ",
        "BR",
        "CN",
        "VN",
        "CU",
        "DO",
        "TT",
        "BB",
        "LC",
        "GD",
        "VC",
        "AG",
        "DM",
        "KN",
        "BS",
      ],
      crosses: ["SE", "NO", "DK", "FI", "IS", "GB", "CH", "GR"],
      stripes: [
        "US",
        "FR",
        "IT",
        "NL",
        "RU",
        "CZ",
        "SK",
        "SI",
        "LU",
        "TH",
        "MY",
        "ID",
        "PH",
        "SG",
        "BR",
        "AR",
        "CL",
        "CO",
        "PE",
        "VE",
        "UY",
        "PY",
        "BO",
        "EC",
        "GY",
        "SR",
        "CR",
        "PA",
        "NI",
        "HN",
        "SV",
        "GT",
        "BZ",
        "JM",
        "CU",
        "DO",
        "TT",
        "BB",
        "LC",
        "GD",
        "VC",
        "AG",
        "DM",
        "KN",
        "BS",
        "HT",
      ],
      circles: ["JP", "BD", "NP", "BN", "PW", "MH", "KI", "NR", "TV"],
      triangles: [
        "BA",
        "CZ",
        "SK",
        "SI",
        "LU",
        "TH",
        "MY",
        "ID",
        "PH",
        "SG",
        "BR",
        "AR",
        "CL",
        "CO",
        "PE",
        "VE",
        "UY",
        "PY",
        "BO",
        "EC",
        "GY",
        "SR",
        "CR",
        "PA",
        "NI",
        "HN",
        "SV",
        "GT",
        "BZ",
        "JM",
        "CU",
        "DO",
        "TT",
        "BB",
        "LC",
        "GD",
        "VC",
        "AG",
        "DM",
        "KN",
        "BS",
        "HT",
      ],
    };

    for (const [element, codes] of Object.entries(flagElements)) {
      if (
        codes.includes(correctCountry.code) &&
        codes.includes(candidateCountry.code)
      ) {
        score += 35;
        break;
      }
    }

    // Geographic proximity (neighboring countries)
    const neighbors: { [key: string]: string[] } = {
      // Europe
      DE: [
        "FR",
        "IT",
        "AT",
        "CH",
        "BE",
        "NL",
        "DK",
        "PL",
        "CZ",
        "SK",
        "HU",
        "SI",
        "HR",
        "RS",
        "BA",
        "ME",
        "MK",
        "AL",
        "BG",
        "RO",
        "UA",
        "BY",
        "MD",
        "LV",
        "LT",
        "EE",
        "FI",
        "SE",
        "NO",
      ],
      FR: ["DE", "IT", "ES", "BE", "NL", "CH", "AT", "GB", "IE"],
      IT: [
        "FR",
        "DE",
        "AT",
        "CH",
        "SI",
        "HR",
        "RS",
        "BA",
        "ME",
        "MK",
        "AL",
        "BG",
        "RO",
        "GR",
      ],
      ES: ["FR", "PT", "MA", "DZ", "TN", "LY"],
      PL: ["DE", "CZ", "SK", "HU", "UA", "BY", "LT", "LV", "EE", "RU"],
      CZ: ["DE", "PL", "SK", "HU", "AT", "SI"],
      SK: ["CZ", "PL", "HU", "UA", "AT", "SI"],
      HU: ["SK", "CZ", "PL", "UA", "RO", "RS", "HR", "SI", "AT"],
      RO: ["HU", "UA", "MD", "BG", "RS", "BA", "ME", "MK", "AL"],
      BG: ["RO", "RS", "BA", "ME", "MK", "AL", "GR", "TR"],
      GR: ["BG", "AL", "MK", "ME", "TR"],
      TR: ["GR", "BG", "GE", "AM", "AZ", "IR", "IQ", "SY"],

      // Asia
      CN: [
        "RU",
        "MN",
        "KP",
        "KR",
        "JP",
        "VN",
        "LA",
        "MM",
        "IN",
        "PK",
        "AF",
        "TJ",
        "KG",
        "KZ",
      ],
      JP: ["KR", "KP", "CN", "RU"],
      KR: ["KP", "JP", "CN"],
      KP: ["KR", "JP", "CN", "RU"],
      IN: ["PK", "CN", "NP", "BT", "BD", "MM", "LK", "MV"],
      PK: ["IN", "CN", "AF", "IR", "TJ", "KG", "KZ", "UZ", "TM"],
      AF: ["PK", "CN", "TJ", "KG", "UZ", "TM", "IR"],
      IR: ["PK", "AF", "TM", "UZ", "KG", "TJ", "AZ", "AM", "GE", "TR", "IQ"],
      IQ: ["IR", "TR", "SY", "JO", "SA", "KW"],
      SA: ["IQ", "JO", "AE", "QA", "KW", "BH", "OM", "YE"],

      // Africa
      EG: ["LY", "SD", "SS", "IL", "JO", "SA"],
      LY: ["EG", "TN", "DZ", "NE", "TD", "SD"],
      DZ: ["LY", "TN", "MA", "NE", "ML", "MR"],
      MA: ["DZ", "TN", "ES"],
      TN: ["LY", "DZ", "MA"],
      SD: ["EG", "LY", "TD", "CF", "CD", "SS", "ET", "ER"],
      SS: ["SD", "ET", "KE", "UG", "CD", "CF"],
      ET: ["SS", "SD", "ER", "DJ", "SO", "KE"],
      KE: ["SS", "ET", "SO", "UG", "TZ"],
      NG: [
        "NE",
        "TD",
        "CM",
        "GQ",
        "GA",
        "CG",
        "CD",
        "BI",
        "RW",
        "UG",
        "TZ",
        "MW",
        "MZ",
        "ZW",
        "BW",
        "NA",
        "GH",
        "CI",
        "SN",
        "ML",
        "BF",
        "GN",
        "GW",
        "SL",
        "LR",
        "GM",
        "MR",
        "CV",
        "ST",
      ],

      // Americas
      US: ["CA", "MX"],
      CA: ["US"],
      MX: ["US", "GT", "BZ"],
      BR: ["GY", "SR", "VE", "CO", "PE", "BO", "PY", "AR", "UY"],
      AR: ["BR", "PY", "BO", "CL", "UY"],
      CL: ["AR", "BO", "PE"],
      CO: ["BR", "VE", "PE", "EC", "PA"],
      PE: ["BR", "CO", "EC", "BO", "CL"],
      VE: ["BR", "CO", "GY", "SR"],
      BO: ["BR", "AR", "CL", "PE", "PY"],
      PY: ["BR", "AR", "BO"],
      UY: ["BR", "AR"],
      EC: ["CO", "PE"],
      PA: ["CO", "CR"],
      CR: ["PA", "NI"],
      NI: ["CR", "HN"],
      HN: ["NI", "SV", "GT"],
      SV: ["HN", "GT"],
      GT: ["SV", "HN", "BZ", "MX"],
      BZ: ["GT", "MX"],
      JM: ["CU", "DO", "HT"],
      CU: ["JM", "DO", "HT"],
      DO: ["JM", "CU", "HT"],
      HT: ["JM", "CU", "DO"],
    };

    if (neighbors[correctCountry.code]?.includes(candidateCountry.code)) {
      score += 45;
    }

    // Sub-regional similarity bonus
    const subRegions = {
      scandinavia: ["SE", "NO", "DK", "FI", "IS"],
      baltics: ["EE", "LV", "LT"],
      balkans: ["HR", "SI", "RS", "BA", "ME", "MK", "AL", "BG", "RO"],
      centralEurope: ["CZ", "SK", "HU", "AT", "CH", "DE", "PL"],
      benelux: ["BE", "NL", "LU"],
      iberia: ["ES", "PT"],
      britishIsles: ["GB", "IE"],
      caucasus: ["AZ", "AM", "GE"],
      centralAsia: ["KZ", "UZ", "TM", "KG", "TJ"],
      hornOfAfrica: ["ET", "ER", "DJ", "SO"],
      westAfrica: [
        "GH",
        "CI",
        "SN",
        "ML",
        "BF",
        "NE",
        "TD",
        "TG",
        "BJ",
        "NG",
        "GN",
        "GW",
        "SL",
        "LR",
        "GM",
        "MR",
        "CV",
        "ST",
      ],
      centralAfrica: [
        "CM",
        "CF",
        "CD",
        "CG",
        "GA",
        "GQ",
        "AO",
        "ZM",
        "ZW",
        "RW",
        "BI",
        "UG",
        "TZ",
        "MW",
        "MZ",
      ],
      southernAfrica: ["ZA", "BW", "NA", "LS", "SZ", "MG", "MU", "SC", "KM"],
      caribbean: [
        "JM",
        "CU",
        "DO",
        "TT",
        "BB",
        "LC",
        "GD",
        "VC",
        "AG",
        "DM",
        "KN",
        "BS",
        "HT",
      ],
      centralAmerica: ["GT", "BZ", "SV", "HN", "NI", "CR", "PA"],
      andes: ["CO", "EC", "PE", "BO", "CL", "AR"],
      southernCone: ["AR", "CL", "UY", "PY"],
      amazon: ["BR", "GY", "SR", "VE"],
      pacific: [
        "FJ",
        "PG",
        "SB",
        "VU",
        "WS",
        "TO",
        "PW",
        "FM",
        "MH",
        "KI",
        "NR",
        "TV",
      ],
      southeastAsia: [
        "TH",
        "VN",
        "MY",
        "ID",
        "PH",
        "MM",
        "KH",
        "LA",
        "SG",
        "BN",
      ],
      southAsia: ["IN", "PK", "BD", "LK", "NP", "BT", "MV", "AF"],
      eastAsia: ["CN", "JP", "KR", "KP", "MN"],
      middleEast: [
        "IL",
        "JO",
        "LB",
        "SY",
        "IQ",
        "IR",
        "SA",
        "AE",
        "QA",
        "KW",
        "BH",
        "OM",
        "YE",
        "TR",
      ],
      northAfrica: ["EG", "LY", "TN", "DZ", "MA", "SD", "SS"],
    };

    for (const [subRegion, codes] of Object.entries(subRegions)) {
      if (
        codes.includes(correctCountry.code) &&
        codes.includes(candidateCountry.code)
      ) {
        score += 35;
        break;
      }
    }
  }

  if (
    (difficulty === HARD_DIFFICULTY || difficulty === EXPERT_DIFFICULTY) &&
    isDistinctiveFlag(candidateCountry.code)
  ) {
    score -= difficulty === EXPERT_DIFFICULTY ? 60 : 30;
  }

  if (difficulty === EXPERT_DIFFICULTY) {
    if (
      correctRegion !== candidateRegion &&
      !similarFlags.includes(candidateCountry.code) &&
      !similarNames.includes(candidateCountry.name)
    ) {
      score -= 50;
    }
  }

  // Random bonus for variety
  score += Math.random() * (difficulty === EXPERT_DIFFICULTY ? 5 : 15);

  return Math.max(score, 1);
};

export interface QuestionData {
  difficulty: Difficulty;
  currentCountry: Country;
  options: Country[];
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function sampleOne<T>(array: T[]): T | undefined {
  if (!array.length) return undefined;
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

export const generateQuestion = (
  difficulty: Difficulty,
  usedCountries: Set<string> = new Set()
): QuestionData | null => {
  const availableCountries = getCountriesForDifficulty(difficulty);

  const remainingCountries = availableCountries.filter(
    (country) => !usedCountries.has(country.code)
  );

  if (remainingCountries.length === 0) {
    return null;
  }

  let correctCountry: Country;

  if (difficulty === EXPERT_DIFFICULTY) {
    const pools = getExpertCountryPools();

    // 70% chance to pick from challenging pools (increased from 60%)
    if (Math.random() < 0.7) {
      const challengingCountries = remainingCountries.filter((country) =>
        Object.values(pools).some((pool) => pool.includes(country.code))
      );

      if (challengingCountries.length > 0) {
        correctCountry =
          challengingCountries[
            Math.floor(Math.random() * challengingCountries.length)
          ];
      } else {
        correctCountry =
          remainingCountries[
            Math.floor(Math.random() * remainingCountries.length)
          ];
      }
    } else {
      correctCountry =
        remainingCountries[
          Math.floor(Math.random() * remainingCountries.length)
        ];
    }
  } else {
    correctCountry =
      remainingCountries[Math.floor(Math.random() * remainingCountries.length)];
  }

  //correctCountry = { name: "Croatia", code: "HR", flag: "/images/flags/hr.svg" };

  const incorrectOptions: Country[] = [];

  const candidateCountries = availableCountries.filter(
    (c) => c.code !== correctCountry.code
  );

  const candidatesWithScores = candidateCountries.map((candidate) => ({
    country: candidate,
    score: calculateSimilarityScore(correctCountry, candidate, difficulty),
  }));

  // Much higher threshold for expert mode
  const minScoreThreshold = difficulty === EXPERT_DIFFICULTY ? 60 : 1;
  const viableCandidates = candidatesWithScores.filter(
    (c) => c.score >= minScoreThreshold
  );

  // For expert mode, if we don't have enough viable candidates, lower the threshold but still keep it high
  const finalCandidates =
    difficulty === EXPERT_DIFFICULTY
      ? viableCandidates.length >= 3
        ? viableCandidates
        : candidatesWithScores.filter((c) => c.score >= 40)
      : viableCandidates.length >= 3
      ? viableCandidates
      : candidatesWithScores;

  // Expert mode: Much stricter question generation
  if (difficulty === EXPERT_DIFFICULTY && finalCandidates.length > 0) {
    // Sort candidates by descending similarity score
    const sortedCandidates = [...finalCandidates].sort((a, b) => b.score - a.score);
    // Always include the top 2 most similar countries
    for (let i = 0; i < 2 && i < sortedCandidates.length; i++) {
      incorrectOptions.push(sortedCandidates[i].country);
    }
    // For the 3rd distractor, randomly pick from the next 5–10 most similar (not already chosen)
    const poolStart = 2;
    const poolEnd = Math.min(10, sortedCandidates.length);
    const pool = sortedCandidates.slice(poolStart, poolEnd).filter(
      (c) => !incorrectOptions.find((opt) => opt.code === c.country.code)
    );
    if (pool.length > 0) {
      const sampled = sampleOne(pool);
      if (sampled) incorrectOptions.push(sampled.country);
    }
    // If still not enough, fill with next most similar
    while (incorrectOptions.length < 3 && poolStart < sortedCandidates.length) {
      const next = sortedCandidates[poolStart + incorrectOptions.length - 2];
      if (next && !incorrectOptions.find((opt) => opt.code === next.country.code)) {
        incorrectOptions.push(next.country);
      } else {
        break;
      }
    }
  } else {
    // Original logic for other difficulties
    // Ensure at least one very similar option (high similarity)
    const highSimilarityCandidates = finalCandidates.filter(
      (c) => c.score >= 60
    );
    if (highSimilarityCandidates.length > 0) {
      const highSimilarityCountry =
        highSimilarityCandidates[
          Math.floor(Math.random() * highSimilarityCandidates.length)
        ].country;
      incorrectOptions.push(highSimilarityCountry);
    }

    // Ensure at least one moderately similar option (medium similarity)
    if (incorrectOptions.length < 3) {
      const mediumSimilarityCandidates = finalCandidates.filter(
        (c) =>
          c.score >= 30 &&
          c.score < 60 &&
          !incorrectOptions.find((opt) => opt.code === c.country.code)
      );
      if (mediumSimilarityCandidates.length > 0) {
        const mediumSimilarityCountry =
          mediumSimilarityCandidates[
            Math.floor(Math.random() * mediumSimilarityCandidates.length)
          ].country;
        incorrectOptions.push(mediumSimilarityCountry);
      }
    }
  }

  while (incorrectOptions.length < 3 && finalCandidates.length > 0) {
    const availableCandidates = finalCandidates.filter(
      (c) => !incorrectOptions.find((opt) => opt.code === c.country.code)
    );

    if (availableCandidates.length === 0) break;

    const countries = availableCandidates.map((c) => c.country);
    const weights = availableCandidates.map((c) =>
      difficulty === EXPERT_DIFFICULTY ? Math.pow(c.score, 2) : c.score
    );

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
  const shuffledOptions = shuffleArray(allOptions);

  return {
    difficulty,
    currentCountry: correctCountry,
    options: shuffledOptions,
  };
};

export function parseDifficultyFromQuery(
  queryValue: string | undefined
): Difficulty {
  const allowed = DIFFICULTY_LEVELS;
  if (queryValue && allowed.includes(queryValue as Difficulty)) {
    return queryValue as Difficulty;
  }
  return DEFAULT_DIFFICULTY;
}

export const calculateScore = (
  difficulty: Difficulty,
  correctAnswers: number,
  totalQuestions: number,
  timeBonus: number = 0,
  streakBonus: number = 0
): number => {
  let score = 0;

  // Base score for correct answers
  if (difficulty === EXPERT_DIFFICULTY) {
    score += correctAnswers * 12;
  } else if (difficulty === HARD_DIFFICULTY) {
    score += correctAnswers * 8;
  } else if (difficulty === MEDIUM_DIFFICULTY) {
    score += correctAnswers * 6;
  } else {
    score += correctAnswers * 4;
  }

  // Perfect score bonus
  if (correctAnswers === totalQuestions) {
    score += difficulty === EXPERT_DIFFICULTY ? 100 : 50;
  }

  // High accuracy bonus (90%+ for Expert, 80%+ for others)
  const accuracyThreshold = difficulty === EXPERT_DIFFICULTY ? 0.9 : 0.8;
  if (correctAnswers / totalQuestions >= accuracyThreshold) {
    score += difficulty === EXPERT_DIFFICULTY ? 60 : 35;
  }

  // Expert mode: Additional accuracy bonuses
  if (difficulty === EXPERT_DIFFICULTY) {
    // 95%+ accuracy bonus
    if (correctAnswers / totalQuestions >= 0.95) {
      score += 40;
    }

    // 100% accuracy with no mistakes bonus
    if (correctAnswers === totalQuestions && correctAnswers > 0) {
      score += 80;
    }
  }

  // Time bonus (faster completion = more points)
  if (
    (difficulty === HARD_DIFFICULTY || difficulty === EXPERT_DIFFICULTY) &&
    timeBonus > 0
  ) {
    score += Math.floor(
      timeBonus / (difficulty === EXPERT_DIFFICULTY ? 8 : 10)
    );
  }

  // Streak bonus (consecutive correct answers)
  if (streakBonus > 0) {
    if (difficulty === EXPERT_DIFFICULTY) {
      score += streakBonus * 3;
    } else {
      score += streakBonus * 2;
    }
  }

  // Expert mode: Penalty for mistakes
  if (difficulty === EXPERT_DIFFICULTY) {
    const mistakes = totalQuestions - correctAnswers;
    if (mistakes > 0) {
      score -= mistakes * 5;
    }
  }

  // Random bonus for variety (reduced for Expert mode)
  if (difficulty === EXPERT_DIFFICULTY) {
    score += Math.floor(Math.random() * 10);
  } else {
    score += Math.floor(Math.random() * 15);
  }

  return Math.max(0, score);
};

export const calculateExpertScore = (
  correctAnswers: number,
  totalQuestions: number,
  timeBonus: number = 0,
  streakBonus: number = 0,
  difficultyPattern: number[] = [] // Track question difficulty progression
): number => {
  let score = 0;

  // Higher base score for expert mode
  score += correctAnswers * 15;

  // Perfect score bonus (higher for expert)
  if (correctAnswers === totalQuestions) {
    score += 100;
  }

  // Accuracy bonuses (more granular)
  const accuracy = correctAnswers / totalQuestions;
  if (accuracy >= 0.9) score += 80;
  else if (accuracy >= 0.8) score += 60;
  else if (accuracy >= 0.7) score += 40;
  else if (accuracy >= 0.6) score += 20;

  // Enhanced time bonus for expert mode
  if (timeBonus > 0) {
    score += Math.floor(timeBonus / 5); // More generous time bonus
  }

  // Progressive difficulty bonus
  if (difficultyPattern.length > 0) {
    const avgDifficulty =
      difficultyPattern.reduce((a, b) => a + b, 0) / difficultyPattern.length;
    score += Math.floor(avgDifficulty * 2);
  }

  // Streak bonus (but penalize for wrong streaks)
  if (streakBonus > 0) {
    score += streakBonus * 5;
  } else {
    score -= Math.abs(streakBonus) * 10; // Penalty for wrong streaks
  }

  // Consistency bonus (reward steady performance)
  if (difficultyPattern.length >= 5) {
    const variance = calculateVariance(difficultyPattern);
    if (variance < 2) {
      // Low variance = consistent performance
      score += 30;
    }
  }

  // For randomness
  score += Math.floor(Math.random() * 10);

  return Math.max(0, score);
};

export const getRandomDifficulty = (): Difficulty => {
  const randomIndex = Math.floor(Math.random() * DIFFICULTY_LEVELS.length);
  return DIFFICULTY_LEVELS[randomIndex];
};

export const validateDifficulty = (queryValue: string | null): Difficulty => {
  const allowed = DIFFICULTY_LEVELS;
  if (queryValue && allowed.includes(queryValue as Difficulty)) {
    return queryValue as Difficulty;
  }
  return DEFAULT_DIFFICULTY;
};

export const getExpertCountryPools = () => ({
  // Countries with very similar flags
   confusingFlags: [
    "NL", "LU", "RU", "SI", "SK", "CZ", "FR", // Similar tricolors
    "ID", "MC", "PL", // Red-white patterns
    "TD", "RO", // Blue-yellow-red
    "SE", "NO", "DK", "FI", "IS", // Nordic crosses
    "HR", "RS", "BA", "ME", "MK", // Balkan similarities
  ],
  
  // Countries with confusing names
  confusingNames: [
    "GN", "GW", "GQ", // Guinea variants
    "CG", "CD", // Congo variants
    "KP", "KR", // Korea variants
    "US", "GB", "AE", // "United" countries
  ],
  
  // Lesser-known countries that are often confused
  lesserKnown: [
    "SM", "AD", "LI", "MT", "CY", // Small European
    "BT", "MV", "TL", "BN", // Small Asian
    "KI", "NR", "TV", "PW", "FM", "MH", // Pacific islands
    "ST", "CV", "KM", "SC", "MU", // Small African islands
    "LC", "VC", "GD", "DM", "KN", "AG", "BB", // Caribbean
  ],

  // Countries with regional flag patterns
  panAfrican: ["GH", "CM", "GN", "ML", "SN", "BF", "NE"],
  panArab: ["JO", "AE", "KW", "SD", "SY", "IQ", "YE"],
  nordic: ["SE", "NO", "DK", "FI", "IS"],
  caribbean: ["JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC"],
});

// New function for sub-regional similarity with enhanced bonuses
const getSubRegionalSimilarity = (
  correctCode: string,
  candidateCode: string
): number => {
  const subRegions = {
    scandinavia: { codes: ["SE", "NO", "DK"], bonus: 60 },
    balticStates: { codes: ["EE", "LV", "LT"], bonus: 70 },
    benelux: { codes: ["BE", "NL", "LU"], bonus: 65 },
    balkans: {
      codes: ["HR", "SI", "RS", "BA", "ME", "MK", "AL", "BG", "RO"],
      bonus: 50,
    },
    caucasus: { codes: ["AZ", "AM", "GE"], bonus: 75 },
    centralAsia: { codes: ["KZ", "UZ", "TM", "KG", "TJ"], bonus: 55 },
    maghreb: { codes: ["MA", "DZ", "TN", "LY"], bonus: 60 },
    gulfStates: { codes: ["AE", "QA", "KW", "BH", "OM"], bonus: 70 },
    pacificIslands: { codes: ["FJ", "WS", "TO", "VU", "SB", "PG"], bonus: 45 },
    caribbeanSmall: {
      codes: ["LC", "VC", "GD", "DM", "KN", "AG", "BB"],
      bonus: 65,
    },
    centralAmerica: {
      codes: ["GT", "BZ", "SV", "HN", "NI", "CR", "PA"],
      bonus: 40,
    },
  };

  for (const region of Object.values(subRegions)) {
    if (
      region.codes.includes(correctCode) &&
      region.codes.includes(candidateCode)
    ) {
      return region.bonus;
    }
  }
  return 0;
};

// New function for pool-based similarity
const getPoolSimilarityBonus = (
  correctCode: string,
  candidateCode: string,
  pools: ReturnType<typeof getExpertCountryPools>
): number => {
  let bonus = 0;

  Object.entries(pools).forEach(([poolName, countries]) => {
    if (countries.includes(correctCode) && countries.includes(candidateCode)) {
      switch (poolName) {
        case "confusingFlags":
          bonus += 120;
          break;
        case "confusingNames":
          bonus += 110;
          break;
        case "lesserKnown":
          bonus += 40;
          break;
        case "panAfrican":
          bonus += 60;
          break;
        case "panArab":
          bonus += 70;
          break;
        case "nordic":
          bonus += 80;
          break;
        case "caribbean":
          bonus += 65;
          break;
        default:
          bonus += 60;
          break;
      }
    }
  });

  return bonus;
};

// New function for historical confusion patterns
const getHistoricalConfusionBonus = (
  correctCode: string,
  candidateCode: string
): number => {
  const confusionPairs: { [key: string]: string[] } = {
    // Commonly confused pairs based on real user data
    SI: ["SK", "HR", "CZ", "RS"], // Slovenia often confused with Slovakia/Croatia/Czech Republic/Serbia
    SK: ["SI", "CZ", "HR", "RS"], // Slovakia with Slovenia/Czech Republic/Croatia/Serbia
    CZ: ["SK", "SI", "HR", "RS"], // Czech Republic with Slovakia/Slovenia/Croatia/Serbia
    HR: ["SI", "SK", "RS", "BA", "ME"], // Croatia with Slovenia/Slovakia/Serbia/Bosnia/Montenegro
    RS: ["SI", "SK", "HR", "BA", "ME", "MK"], // Serbia with Slovenia/Slovakia/Croatia/Bosnia/Montenegro/Macedonia
    BA: ["HR", "RS", "ME", "SI", "SK"], // Bosnia with Croatia/Serbia/Montenegro/Slovenia/Slovakia
    ME: ["HR", "RS", "BA", "SI", "SK"], // Montenegro with Croatia/Serbia/Bosnia/Slovenia/Slovakia
    MK: ["RS", "HR", "BA", "ME", "SI", "SK"], // Macedonia with Serbia/Croatia/Bosnia/Montenegro/Slovenia/Slovakia
    LV: ["LT", "EE", "RU"], // Baltic confusion
    LT: ["LV", "EE", "RU"],
    EE: ["LV", "LT", "RU"],
    BY: ["RU", "UA", "PL"], // Eastern European confusion
    UA: ["BY", "RU", "PL"],
    PL: ["BY", "UA", "RU", "CZ", "SK"],
    GE: ["AM", "AZ", "TR"], // Caucasus confusion
    AM: ["GE", "AZ", "TR"],
    AZ: ["GE", "AM", "TR"],
    UZ: ["KZ", "TM", "KG", "TJ"], // Central Asian confusion
    KZ: ["UZ", "KG", "TM", "TJ"],
    TM: ["UZ", "TJ", "KZ", "KG"],
    KG: ["UZ", "KZ", "TJ", "TM"],
    TJ: ["UZ", "TM", "KG", "KZ"],
    // Nordic confusion
    SE: ["NO", "DK", "FI", "IS"],
    NO: ["SE", "DK", "FI", "IS"],
    DK: ["SE", "NO", "FI", "IS"],
    FI: ["SE", "NO", "DK", "IS"],
    IS: ["SE", "NO", "DK", "FI"],
    // Benelux confusion
    NL: ["LU", "BE", "DE"],
    LU: ["NL", "BE", "DE"],
    BE: ["NL", "LU", "DE"],
    // Iberian confusion
    ES: ["PT", "FR"],
    PT: ["ES", "FR"],
    // British Isles confusion
    GB: ["IE", "US"],
    IE: ["GB", "US"],
    // Middle Eastern confusion
    JO: ["AE", "KW", "SA", "QA", "BH", "OM"],
    AE: ["JO", "KW", "SA", "QA", "BH", "OM"],
    KW: ["JO", "AE", "SA", "QA", "BH", "OM"],
    SA: ["JO", "AE", "KW", "QA", "BH", "OM"],
    QA: ["JO", "AE", "KW", "SA", "BH", "OM"],
    BH: ["JO", "AE", "KW", "SA", "QA", "OM"],
    OM: ["JO", "AE", "KW", "SA", "QA", "BH"],
    // African confusion
    GH: ["CM", "GN", "ML", "SN", "BF", "NE"],
    CM: ["GH", "GN", "ML", "SN", "BF", "NE"],
    GN: ["GH", "CM", "ML", "SN", "BF", "NE"],
    ML: ["GH", "CM", "GN", "SN", "BF", "NE"],
    SN: ["GH", "CM", "GN", "ML", "BF", "NE"],
    BF: ["GH", "CM", "GN", "ML", "SN", "NE"],
    NE: ["GH", "CM", "GN", "ML", "SN", "BF"],
    // Caribbean confusion
    JM: ["CU", "DO", "TT", "BB", "LC", "GD", "VC"],
    CU: ["JM", "DO", "TT", "BB", "LC", "GD", "VC"],
    DO: ["JM", "CU", "TT", "BB", "LC", "GD", "VC"],
    TT: ["JM", "CU", "DO", "BB", "LC", "GD", "VC"],
    BB: ["JM", "CU", "DO", "TT", "LC", "GD", "VC"],
    LC: ["JM", "CU", "DO", "TT", "BB", "GD", "VC"],
    GD: ["JM", "CU", "DO", "TT", "BB", "LC", "VC"],
    VC: ["JM", "CU", "DO", "TT", "BB", "LC", "GD"],
  };

  const confusedWith = confusionPairs[correctCode];
  if (confusedWith && confusedWith.includes(candidateCode)) {
    return 80; // Increased from 60
  }
  return 0;
};

// Enhanced similarity scoring for expert mode (with balanced randomness)
export const calculateExpertSimilarityScore = (
  correctCountry: Country,
  candidateCountry: Country
): number => {
  let score = 0;
  const pools = getExpertCountryPools();

  // Base regional similarity (higher weight)
  const correctRegion = getCountryRegion(correctCountry.code);
  const candidateRegion = getCountryRegion(candidateCountry.code);
  if (correctRegion === candidateRegion) {
    score += 100; // Increased from 80
  }

  // Flag pattern similarity (very high weight)
  const similarFlags = getSimilarFlags(correctCountry.code);
  if (similarFlags.includes(candidateCountry.code)) {
    score += 150; // Increased from 100
  }

  // Name confusion factor
  const similarNames = getSimilarNames(correctCountry.name);
  if (similarNames.includes(candidateCountry.name)) {
    score += 120; // Increased from 90
  }

  // Same starting letter bonus (higher than before)
  if (correctCountry.name[0] === candidateCountry.name[0]) {
    score += 50; // Increased from 40
  }

  // Enhanced name length similarity
  const lengthDiff = Math.abs(
    correctCountry.name.length - candidateCountry.name.length
  );
  if (lengthDiff === 0) score += 45; // Increased from 35
  else if (lengthDiff === 1) score += 35; // Increased from 25
  else if (lengthDiff === 2) score += 25; // Increased from 15

  // Enhanced ending pattern matching
  const correctEnding = correctCountry.name.slice(-3).toLowerCase();
  const candidateEnding = candidateCountry.name.slice(-3).toLowerCase();
  if (correctEnding === candidateEnding) {
    score += 60; // Increased from 45
  }

  // Common suffix patterns (enhanced)
  const commonSuffixes = ["land", "stan", "burg", "heim", "avia", "inia"];
  const correctSuffix = commonSuffixes.find((suffix) =>
    correctCountry.name.toLowerCase().endsWith(suffix)
  );
  if (
    correctSuffix &&
    candidateCountry.name.toLowerCase().endsWith(correctSuffix)
  ) {
    score += 70; // Increased from 50
  }

  // Enhanced vowel pattern similarity
  const getVowelPattern = (name: string) =>
    name.toLowerCase().replace(/[^aeiou]/g, "");
  const correctVowels = getVowelPattern(correctCountry.name);
  const candidateVowels = getVowelPattern(candidateCountry.name);
  if (correctVowels === candidateVowels) {
    score += 40; // Increased from 30
  } else if (correctVowels.length === candidateVowels.length) {
    score += 20; // Increased from 15
  }

  // Word count similarity (for multi-word countries)
  const correctWords = correctCountry.name.split(" ").length;
  const candidateWords = candidateCountry.name.split(" ").length;
  if (correctWords === candidateWords && correctWords > 1) {
    score += 35; // Increased from 25
  }

  // Enhanced sub-regional patterns
  const subRegionalBonus = getSubRegionalSimilarity(
    correctCountry.code,
    candidateCountry.code
  );
  score += subRegionalBonus;

  // Special country pool bonuses
  score += getPoolSimilarityBonus(
    correctCountry.code,
    candidateCountry.code,
    pools
  );

  // Penalize overly distinctive flags in expert mode
  if (isDistinctiveFlag(candidateCountry.code)) {
    score -= 100; // Increased penalty from 80
  }

  // Bonus for countries that are historically confused
  score += getHistoricalConfusionBonus(
    correctCountry.code,
    candidateCountry.code
  );

  // Balanced random element (reduced for more consistent difficulty)
  score += Math.random() * 5; // Reduced from 8

  return Math.max(score, 1);
};

const calculateVariance = (numbers: number[]): number => {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squaredDifferences = numbers.map((num) => Math.pow(num - mean, 2));
  return squaredDifferences.reduce((a, b) => a + b, 0) / numbers.length;
};
