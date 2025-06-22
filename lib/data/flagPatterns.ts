// Comprehensive flag pattern data for similarity scoring and question generation
export const FLAG_COLOR_PATTERNS: { [key: string]: string[] } = {
  // Basic tricolor patterns
  redWhiteBlue: ["US", "GB", "FR", "NL", "RU", "CZ", "SK", "SI", "LU", "HR"],
  redWhiteGreen: ["IT", "BG", "HU", "IR", "BD", "MG"],
  blueWhiteRed: ["FR", "NL", "RU", "CZ", "SK", "SI", "LU", "HR"],
  greenWhiteRed: ["IT", "BG", "HU", "IR", "BD", "MG"],
  yellowBlueRed: ["RO", "TD", "AD", "CO", "EC", "VE"],
  redWhiteBlack: ["EG", "SY", "IQ", "YE", "SD", "SS"],
  greenYellowRed: ["GH", "CM", "GN", "ML", "SN", "BF", "NE", "TD", "TG", "BJ", "ET"],
  
  // Horizontal stripe patterns (commonly confused)
  redWhite: ["ID", "MC", "PL"],
  
  // Regional color schemes
  panArab: ["EG", "SY", "IQ", "YE", "SD", "SS"],
  andean: ["CO", "EC", "VE", "AR"],
  
};

export const FLAG_ELEMENTS: { [key: string]: string[] } = {
  stars: [
    "US", "AU", "NZ", "BR", "CN", "VN", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS",
  ],
  crosses: ["SE", "NO", "DK", "FI", "IS", "GB", "CH", "GR"],
  stripes: [
    "US", "FR", "IT", "NL", "RU", "CZ", "SK", "SI", "LU", "TH", "MY", "ID", "PH", "SG",
    "BR", "AR", "CL", "CO", "PE", "VE", "UY", "PY", "BO", "EC", "GY", "SR", "CR", "PA",
    "NI", "HN", "SV", "GT", "BZ", "JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS", "HT",
  ],
  circles: ["JP", "BD", "NP", "BN", "PW", "MH", "KI", "NR", "TV"],
  triangles: [
    "BA", "CZ", "SK", "SI", "LU", "TH", "MY", "ID", "PH", "SG", "BR", "AR", "CL", "CO", "PE", "VE", "UY", "PY", "BO", "EC", "GY", "SR", "CR", "PA", "NI", "HN", "SV", "GT", "BZ", "JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS", "HT",
  ],
};

export const COMMON_SUFFIXES = ["land", "stan", "burg", "heim", "avia", "inia"];

export const GEOGRAPHIC_NEIGHBORS: { [key: string]: string[] } = {
  // Europe
  DE: ["FR", "IT", "AT", "CH", "BE", "NL", "DK", "PL", "CZ", "SK", "HU", "SI", "HR", "RS", "BA", "ME", "MK", "AL", "BG", "RO", "UA", "BY", "MD", "LV", "LT", "EE", "FI", "SE", "NO"],
  FR: ["DE", "IT", "ES", "BE", "NL", "CH", "AT", "GB", "IE"],
  IT: ["FR", "DE", "AT", "CH", "SI", "HR", "RS", "BA", "ME", "MK", "AL", "BG", "RO", "GR"],
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
  CN: ["RU", "MN", "KP", "KR", "JP", "VN", "LA", "MM", "IN", "PK", "AF", "TJ", "KG", "KZ"],
  JP: ["KR", "KP", "CN", "RU"],
  KR: ["KP", "JP", "CN"],
  KP: ["KR", "JP", "CN", "RU"],
  IN: ["PK", "CN", "NP", "BT", "BD", "MM", "LK", "MV"],
  PK: ["IN", "CN", "AF", "IR", "TJ", "KG", "KZ", "UZ", "TM"],
  AF: ["PK", "CN", "TJ", "KG", "UZ", "TM", "IR"],
  IR: ["PK", "AF", "TM", "UZ", "KG", "TJ", "AZ", "AM", "GE", "TR", "IQ"],
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
  NG: ["NE", "TD", "CM", "GQ", "GA", "CG", "CD", "BI", "RW", "UG", "TZ", "MW", "MZ", "ZW", "BW", "NA", "GH", "CI", "SN", "ML", "BF", "GN", "GW", "SL", "LR", "GM", "MR", "CV", "ST"],

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

export const SUB_REGIONS: { [key: string]: string[] } = {
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
  westAfrica: ["GH", "CI", "SN", "ML", "BF", "NE", "TD", "TG", "BJ", "NG", "GN", "GW", "SL", "LR", "GM", "MR", "CV", "ST"],
  centralAfrica: ["CM", "CF", "CD", "CG", "GA", "GQ", "AO", "ZM", "ZW", "RW", "BI", "UG", "TZ", "MW", "MZ"],
  southernAfrica: ["ZA", "BW", "NA", "LS", "SZ", "MG", "MU", "SC", "KM"],
  caribbean: ["JM", "CU", "DO", "TT", "BB", "LC", "GD", "VC", "AG", "DM", "KN", "BS", "HT"],
  centralAmerica: ["GT", "BZ", "SV", "HN", "NI", "CR", "PA"],
  andes: ["CO", "EC", "PE", "BO", "CL", "AR"],
  southernCone: ["AR", "CL", "UY", "PY"],
  amazon: ["BR", "GY", "SR", "VE"],
  pacific: ["FJ", "PG", "SB", "VU", "WS", "TO", "PW", "FM", "MH", "KI", "NR", "TV"],
  southeastAsia: ["TH", "VN", "MY", "ID", "PH", "MM", "KH", "LA", "SG", "BN"],
  southAsia: ["IN", "PK", "BD", "LK", "NP", "BT", "MV", "AF"],
  eastAsia: ["CN", "JP", "KR", "KP", "MN"],
  middleEast: ["IL", "JO", "LB", "SY", "IQ", "IR", "SA", "AE", "QA", "KW", "BH", "OM", "YE", "TR"],
  northAfrica: ["EG", "LY", "TN", "DZ", "MA", "SD", "SS"],
}; 

export const SIMILAR_FLAGS: { [key: string]: string[] } = {
  // Nearly identical flags
  RO: ["TD"], // Romania and Chad - almost identical blue-yellow-red vertical stripes
  TD: ["RO"],
  
  ID: ["MC", "PL"], // Red-white horizontal stripes
  MC: ["ID", "PL"], // Monaco and Indonesia are identical, Poland is inverted
  PL: ["ID", "MC"], // Poland (white-red) vs Indonesia/Monaco (red-white)
  
  // Very similar red-white-red horizontal stripes
  LV: ["AT"], // Latvia and Austria - both red-white-red horizontal
  AT: ["LV"],
  
  // Nordic Cross flags - visually very similar cross designs
  DK: ["FI", "IS", "NO", "SE"], // Denmark
  FI: ["DK", "IS", "NO", "SE"], // Finland
  IS: ["DK", "FI", "NO", "SE"], // Iceland
  NO: ["DK", "FI", "IS", "SE"], // Norway
  SE: ["DK", "FI", "IS", "NO"], // Sweden
  
  // Vertical tricolors with similar patterns
  FR: ["IT", "BE", "IE", "CI", "RO", "TD"], // Blue-white-red and similar vertical stripes
  IT: ["FR", "BE", "IE", "CI"], // Green-white-red vertical
  BE: ["FR", "IT", "IE", "CI", "DE"], // Black-yellow-red vertical
  IE: ["FR", "IT", "BE", "CI"], // Green-white-orange vertical
  CI: ["FR", "IT", "BE", "IE"], // Orange-white-green vertical (reverse of Ireland)
  DE: ["BE"], // Black-red-yellow horizontal (similar colors to Belgium)
  
  // Horizontal tricolors
  NL: ["LU", "RU", "HR", "SK", "SI"], // Red-white-blue and similar horizontal stripes
  LU: ["NL", "RU", "HR"], // Red-white-blue horizontal (similar to Netherlands)
  RU: ["NL", "LU", "SK", "SI"], // White-blue-red horizontal
  HR: ["NL", "LU", "SK", "SI"], // Red-white-blue with coat of arms
  SK: ["NL", "RU", "HR", "SI"], // White-blue-red horizontal
  SI: ["NL", "RU", "HR", "SK"], // White-blue-red horizontal
  
  // Pan-African colors (green-yellow-red in various arrangements)
  GH: ["BF", "BJ", "CM", "GN", "ML", "SN", "TG", "ET"], // Red-yellow-green horizontal with star
  BF: ["GH", "BJ", "CM", "GN", "ML", "SN", "TG"], // Red-white-green horizontal
  BJ: ["GH", "BF", "CM", "GN", "ML", "SN", "TG"], // Green-yellow-red horizontal
  CM: ["GH", "BF", "BJ", "GN", "ML", "SN", "TG"], // Green-red-yellow vertical
  GN: ["GH", "BF", "BJ", "CM", "ML", "SN", "TG"], // Red-yellow-green vertical
  ML: ["GH", "BF", "BJ", "CM", "GN", "SN", "TG"], // Green-yellow-red vertical
  SN: ["GH", "BF", "BJ", "CM", "GN", "ML", "TG"], // Green-yellow-red vertical with star
  TG: ["GH", "BF", "BJ", "CM", "GN", "ML", "SN"], // Green-yellow-red horizontal with star
  ET: ["GH"], // Green-yellow-red horizontal with emblem
  
  // Pan-Arab colors (red-white-black with green variations)
  AE: ["EG", "IQ", "JO", "KW", "SD", "SY", "YE"], // Red-white-black horizontal with green vertical
  EG: ["AE", "IQ", "JO", "SY", "YE"], // Red-white-black horizontal with eagle
  IQ: ["AE", "EG", "JO", "SY", "YE"], // Red-white-black horizontal with text
  JO: ["AE", "EG", "IQ", "SY", "YE"], // Black-white-green horizontal with triangle and star
  SY: ["AE", "EG", "IQ", "JO", "YE"], // Red-white-black horizontal with stars
  YE: ["AE", "EG", "IQ", "JO", "SY"], // Red-white-black horizontal
  SD: ["AE"], // Red-white-black horizontal with green triangle
  
  // Union Jack derivatives
  AU: ["NZ", "FJ"], // Blue field with Union Jack canton
  NZ: ["AU", "FJ"], // Blue field with Union Jack canton and stars
  FJ: ["AU", "NZ"], // Light blue field with Union Jack canton
  
  // Stars and Stripes pattern
  US: ["MY"], // Stars and stripes pattern
  MY: ["US"], // Red-white stripes with blue canton
  
  // Crescent and star patterns
  TR: ["TN", "PK"], // Red field with crescent and star
  TN: ["TR", "PK"], // Red field with crescent and star
  PK: ["TR", "TN"], // Green field with crescent and star
  
  // Simple horizontal stripes - commonly confused
  UA: ["AR"], // Ukraine (blue-yellow) can be confused with Argentina's colors
  
  // Cross patterns (not Nordic) - commonly confused
  CH: ["GE"], // Square flag with cross
  GE: ["CH"], // White field with cross pattern
  
  // Green-white-red horizontal stripes
  HU: ["IT", "IR"], // Red-white-green horizontal
  IR: ["HU"], // Green-white-red horizontal
  
  // Blue-white patterns
  GR: ["IL", "UY"], // Blue-white stripes
  IL: ["GR", "UY"], // Blue-white stripes with star
  UY: ["GR", "IL"], // Blue-white stripes with sun
  
  // Complex but similar patterns - commonly confused
  IN: ["NE"], // Orange-white-green horizontal with wheel/emblem
  NE: ["IN"], // Orange-white-green horizontal
  
  // Commonly confused due to circle/sun symbols
  JP: ["BD"], // Red circle on white (Japan) vs green field with red circle (Bangladesh)
  BD: ["JP"],
  
  // Central American flags with similar blue-white-blue patterns
  GT: ["SV", "HN", "NI"], // Blue-white-blue vertical with emblem
  SV: ["GT", "HN", "NI"], // Blue-white-blue horizontal with emblem
  HN: ["GT", "SV", "NI"], // Blue-white-blue horizontal with emblem
  NI: ["GT", "SV", "HN"], // Blue-white-blue horizontal with emblem
  
  // South American flags with similar patterns
  AR: ["UY", "UA"], // Blue-white-blue horizontal with sun, similar colors to Ukraine
  BO: ["EC"], // Red-yellow-green horizontal with emblem
  EC: ["BO", "CO", "VE"], // Yellow-blue-red horizontal with emblem
  CO: ["EC", "VE"], // Yellow-blue-red horizontal
  VE: ["EC", "CO"], // Yellow-blue-red horizontal with stars
  
  // Light blue backgrounds with white stars - commonly confused
  SO: ["FM"], // Somalia (light blue with white star) vs Micronesia (light blue with 4 white stars)
  FM: ["SO"], // Micronesia (light blue with 4 white stars) vs Somalia (light blue with white star)
}; 
