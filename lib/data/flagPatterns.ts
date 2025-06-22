export const FLAG_COLOR_PATTERNS: { [key: string]: string[] } = {
  redWhiteBlue: ["US", "GB", "FR", "NL", "RU", "CZ", "SK", "SI", "LU"],
  redWhiteGreen: ["IT", "BG", "HU", "IR", "BD", "MG"],
  redYellowGreen: [
    "GH", "CM", "GN", "ML", "SN", "BF", "NE", "TD", "TG", "BJ",
  ],
  redWhiteBlack: ["EG", "SY", "IQ", "YE", "SD", "SS"],
  blueWhiteRed: ["FR", "NL", "RU", "CZ", "SK", "SI", "LU"],
  greenWhiteRed: ["IT", "BG", "HU", "IR", "BD", "MG"],
  yellowBlueRed: ["RO", "TD", "AD", "CO", "EC", "VE"],
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