export const EXPERT_COUNTRY_POOLS: { [key: string]: string[] } = {
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
};

export type ExpertPoolName = keyof typeof EXPERT_COUNTRY_POOLS; 