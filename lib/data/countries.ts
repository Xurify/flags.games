export interface Country {
  name: string;
  code: string;
  flag: string;
  continent: string;
  region: string;
}

export const countries: Country[] = [
  { name: "United States", code: "US", flag: "/images/flags/us.svg", continent: "North America", region: "Americas" },
  { name: "United Kingdom", code: "GB", flag: "/images/flags/gb.svg", continent: "Europe", region: "Europe" },
  { name: "France", code: "FR", flag: "/images/flags/fr.svg", continent: "Europe", region: "Europe" },
  { name: "Germany", code: "DE", flag: "/images/flags/de.svg", continent: "Europe", region: "Europe" },
  { name: "Italy", code: "IT", flag: "/images/flags/it.svg", continent: "Europe", region: "Europe" },
  { name: "Spain", code: "ES", flag: "/images/flags/es.svg", continent: "Europe", region: "Europe" },
  { name: "Canada", code: "CA", flag: "/images/flags/ca.svg", continent: "North America", region: "Americas" },
  { name: "Australia", code: "AU", flag: "/images/flags/au.svg", continent: "Oceania", region: "Oceania" },
  { name: "Japan", code: "JP", flag: "/images/flags/jp.svg", continent: "Asia", region: "Asia" },
  { name: "China", code: "CN", flag: "/images/flags/cn.svg", continent: "Asia", region: "Asia" },
  { name: "India", code: "IN", flag: "/images/flags/in.svg", continent: "Asia", region: "Asia" },
  { name: "Brazil", code: "BR", flag: "/images/flags/br.svg", continent: "South America", region: "Americas" },
  { name: "Mexico", code: "MX", flag: "/images/flags/mx.svg", continent: "North America", region: "Americas" },
  { name: "Russia", code: "RU", flag: "/images/flags/ru.svg", continent: "Europe/Asia", region: "Europe/Asia" },
  { name: "South Korea", code: "KR", flag: "/images/flags/kr.svg", continent: "Asia", region: "Asia" },
  { name: "The Netherlands", code: "NL", flag: "/images/flags/nl.svg", continent: "Europe", region: "Europe" },
  { name: "Belgium", code: "BE", flag: "/images/flags/be.svg", continent: "Europe", region: "Europe" },
  { name: "Switzerland", code: "CH", flag: "/images/flags/ch.svg", continent: "Europe", region: "Europe" },
  { name: "Austria", code: "AT", flag: "/images/flags/at.svg", continent: "Europe", region: "Europe" },
  { name: "Sweden", code: "SE", flag: "/images/flags/se.svg", continent: "Europe", region: "Europe" },
  { name: "Norway", code: "NO", flag: "/images/flags/no.svg", continent: "Europe", region: "Europe" },
  { name: "Denmark", code: "DK", flag: "/images/flags/dk.svg", continent: "Europe", region: "Europe" },
  { name: "Finland", code: "FI", flag: "/images/flags/fi.svg", continent: "Europe", region: "Europe" },
  { name: "Poland", code: "PL", flag: "/images/flags/pl.svg", continent: "Europe", region: "Europe" },
  { name: "Portugal", code: "PT", flag: "/images/flags/pt.svg", continent: "Europe", region: "Europe" },
  { name: "Greece", code: "GR", flag: "/images/flags/gr.svg", continent: "Europe", region: "Europe" },
  { name: "Turkey", code: "TR", flag: "/images/flags/tr.svg", continent: "Asia", region: "Middle East" },
  { name: "Egypt", code: "EG", flag: "/images/flags/eg.svg", continent: "Africa", region: "Middle East" },
  { name: "South Africa", code: "ZA", flag: "/images/flags/za.svg", continent: "Africa", region: "Africa" },
  { name: "Nigeria", code: "NG", flag: "/images/flags/ng.svg", continent: "Africa", region: "Africa" },
  { name: "Kenya", code: "KE", flag: "/images/flags/ke.svg", continent: "Africa", region: "Africa" },
  { name: "Morocco", code: "MA", flag: "/images/flags/ma.svg", continent: "Africa", region: "Africa" },
  { name: "Argentina", code: "AR", flag: "/images/flags/ar.svg", continent: "South America", region: "Americas" },
  { name: "Chile", code: "CL", flag: "/images/flags/cl.svg", continent: "South America", region: "Americas" },
  { name: "Colombia", code: "CO", flag: "/images/flags/co.svg", continent: "South America", region: "Americas" },
  { name: "Peru", code: "PE", flag: "/images/flags/pe.svg", continent: "South America", region: "Americas" },
  { name: "Venezuela", code: "VE", flag: "/images/flags/ve.svg", continent: "South America", region: "Americas" },
  { name: "Thailand", code: "TH", flag: "/images/flags/th.svg", continent: "Asia", region: "Asia" },
  { name: "Vietnam", code: "VN", flag: "/images/flags/vn.svg", continent: "Asia", region: "Asia" },
  { name: "Singapore", code: "SG", flag: "/images/flags/sg.svg", continent: "Asia", region: "Asia" },
  { name: "Malaysia", code: "MY", flag: "/images/flags/my.svg", continent: "Asia", region: "Asia" },
  { name: "Indonesia", code: "ID", flag: "/images/flags/id.svg", continent: "Asia", region: "Asia" },
  { name: "Philippines", code: "PH", flag: "/images/flags/ph.svg", continent: "Asia", region: "Asia" },
  { name: "New Zealand", code: "NZ", flag: "/images/flags/nz.svg", continent: "Oceania", region: "Oceania" },
  { name: "Ireland", code: "IE", flag: "/images/flags/ie.svg", continent: "Europe", region: "Europe" },
  { name: "Iceland", code: "IS", flag: "/images/flags/is.svg", continent: "Europe", region: "Europe" },
  { name: "Czech Republic", code: "CZ", flag: "/images/flags/cz.svg", continent: "Europe", region: "Europe" },
  { name: "Hungary", code: "HU", flag: "/images/flags/hu.svg", continent: "Europe", region: "Europe" },
  { name: "Romania", code: "RO", flag: "/images/flags/ro.svg", continent: "Europe", region: "Europe" },
  { name: "Bulgaria", code: "BG", flag: "/images/flags/bg.svg", continent: "Europe", region: "Europe" },
  { name: "Croatia", code: "HR", flag: "/images/flags/hr.svg", continent: "Europe", region: "Europe" },
  { name: "Slovenia", code: "SI", flag: "/images/flags/si.svg", continent: "Europe", region: "Europe" },
  { name: "Slovakia", code: "SK", flag: "/images/flags/sk.svg", continent: "Europe", region: "Europe" },
  { name: "Estonia", code: "EE", flag: "/images/flags/ee.svg", continent: "Europe", region: "Europe" },
  { name: "Latvia", code: "LV", flag: "/images/flags/lv.svg", continent: "Europe", region: "Europe" },
  { name: "Lithuania", code: "LT", flag: "/images/flags/lt.svg", continent: "Europe", region: "Europe" },
  { name: "Ukraine", code: "UA", flag: "/images/flags/ua.svg", continent: "Europe", region: "Europe" },
  { name: "Belarus", code: "BY", flag: "/images/flags/by.svg", continent: "Europe", region: "Europe" },
  { name: "Moldova", code: "MD", flag: "/images/flags/md.svg", continent: "Europe", region: "Europe" },
  { name: "Serbia", code: "RS", flag: "/images/flags/rs.svg", continent: "Europe", region: "Europe" },
  { name: "Bosnia and Herzegovina", code: "BA", flag: "/images/flags/ba.svg", continent: "Europe", region: "Europe" },
  { name: "Montenegro", code: "ME", flag: "/images/flags/me.svg", continent: "Europe", region: "Europe" },
  { name: "North Macedonia", code: "MK", flag: "/images/flags/mk.svg", continent: "Europe", region: "Europe" },
  { name: "Albania", code: "AL", flag: "/images/flags/al.svg", continent: "Europe", region: "Europe" },
  { name: "Cyprus", code: "CY", flag: "/images/flags/cy.svg", continent: "Asia", region: "Middle East" },
  { name: "Malta", code: "MT", flag: "/images/flags/mt.svg", continent: "Europe", region: "Europe" },
  { name: "Luxembourg", code: "LU", flag: "/images/flags/lu.svg", continent: "Europe", region: "Europe" },
  { name: "Monaco", code: "MC", flag: "/images/flags/mc.svg", continent: "Europe", region: "Europe" },
  { name: "Liechtenstein", code: "LI", flag: "/images/flags/li.svg", continent: "Europe", region: "Europe" },
  { name: "San Marino", code: "SM", flag: "/images/flags/sm.svg", continent: "Europe", region: "Europe" },
  { name: "Vatican City", code: "VA", flag: "/images/flags/va.svg", continent: "Europe", region: "Europe" },
  { name: "Andorra", code: "AD", flag: "/images/flags/ad.svg", continent: "Europe", region: "Europe" },
  { name: "Israel", code: "IL", flag: "/images/flags/il.svg", continent: "Asia", region: "Middle East" },
  { name: "Jordan", code: "JO", flag: "/images/flags/jo.svg", continent: "Asia", region: "Middle East" },
  { name: "Lebanon", code: "LB", flag: "/images/flags/lb.svg", continent: "Asia", region: "Middle East" },
  { name: "Syria", code: "SY", flag: "/images/flags/sy.svg", continent: "Asia", region: "Middle East" },
  { name: "Iraq", code: "IQ", flag: "/images/flags/iq.svg", continent: "Asia", region: "Middle East" },
  { name: "Iran", code: "IR", flag: "/images/flags/ir.svg", continent: "Asia", region: "Middle East" },
  { name: "Saudi Arabia", code: "SA", flag: "/images/flags/sa.svg", continent: "Asia", region: "Middle East" },
  { name: "United Arab Emirates", code: "AE", flag: "/images/flags/ae.svg", continent: "Asia", region: "Middle East" },
  { name: "Qatar", code: "QA", flag: "/images/flags/qa.svg", continent: "Asia", region: "Middle East" },
  { name: "Kuwait", code: "KW", flag: "/images/flags/kw.svg", continent: "Asia", region: "Middle East" },
  { name: "Bahrain", code: "BH", flag: "/images/flags/bh.svg", continent: "Asia", region: "Middle East" },
  { name: "Oman", code: "OM", flag: "/images/flags/om.svg", continent: "Asia", region: "Middle East" },
  { name: "Yemen", code: "YE", flag: "/images/flags/ye.svg", continent: "Asia", region: "Middle East" },
  { name: "Afghanistan", code: "AF", flag: "/images/flags/af.svg", continent: "Asia", region: "Asia" },
  { name: "Pakistan", code: "PK", flag: "/images/flags/pk.svg", continent: "Asia", region: "Asia" },
  { name: "Bangladesh", code: "BD", flag: "/images/flags/bd.svg", continent: "Asia", region: "Asia" },
  { name: "Sri Lanka", code: "LK", flag: "/images/flags/lk.svg", continent: "Asia", region: "Asia" },
  { name: "Nepal", code: "NP", flag: "/images/flags/np.svg", continent: "Asia", region: "Asia" },
  { name: "Bhutan", code: "BT", flag: "/images/flags/bt.svg", continent: "Asia", region: "Asia" },
  { name: "Maldives", code: "MV", flag: "/images/flags/mv.svg", continent: "Asia", region: "Asia" },
  { name: "Myanmar", code: "MM", flag: "/images/flags/mm.svg", continent: "Asia", region: "Asia" },
  { name: "Cambodia", code: "KH", flag: "/images/flags/kh.svg", continent: "Asia", region: "Asia" },
  { name: "Laos", code: "LA", flag: "/images/flags/la.svg", continent: "Asia", region: "Asia" },
  { name: "Mongolia", code: "MN", flag: "/images/flags/mn.svg", continent: "Asia", region: "Asia" },
  { name: "North Korea", code: "KP", flag: "/images/flags/kp.svg", continent: "Asia", region: "Asia" },
  { name: "Kazakhstan", code: "KZ", flag: "/images/flags/kz.svg", continent: "Asia", region: "Asia" },
  { name: "Uzbekistan", code: "UZ", flag: "/images/flags/uz.svg", continent: "Asia", region: "Asia" },
  { name: "Turkmenistan", code: "TM", flag: "/images/flags/tm.svg", continent: "Asia", region: "Asia" },
  { name: "Kyrgyzstan", code: "KG", flag: "/images/flags/kg.svg", continent: "Asia", region: "Asia" },
  { name: "Tajikistan", code: "TJ", flag: "/images/flags/tj.svg", continent: "Asia", region: "Asia" },
  { name: "Azerbaijan", code: "AZ", flag: "/images/flags/az.svg", continent: "Asia", region: "Asia" },
  { name: "Armenia", code: "AM", flag: "/images/flags/am.svg", continent: "Asia", region: "Asia" },
  { name: "Georgia", code: "GE", flag: "/images/flags/ge.svg", continent: "Asia", region: "Asia" },
  { name: "Algeria", code: "DZ", flag: "/images/flags/dz.svg", continent: "Africa", region: "Africa" },
  { name: "Tunisia", code: "TN", flag: "/images/flags/tn.svg", continent: "Africa", region: "Africa" },
  { name: "Libya", code: "LY", flag: "/images/flags/ly.svg", continent: "Africa", region: "Africa" },
  { name: "Sudan", code: "SD", flag: "/images/flags/sd.svg", continent: "Africa", region: "Africa" },
  { name: "Ethiopia", code: "ET", flag: "/images/flags/et.svg", continent: "Africa", region: "Africa" },
  { name: "Somalia", code: "SO", flag: "/images/flags/so.svg", continent: "Africa", region: "Africa" },
  { name: "Ghana", code: "GH", flag: "/images/flags/gh.svg", continent: "Africa", region: "Africa" },
  { name: "Ivory Coast", code: "CI", flag: "/images/flags/ci.svg", continent: "Africa", region: "Africa" },
  { name: "Senegal", code: "SN", flag: "/images/flags/sn.svg", continent: "Africa", region: "Africa" },
  { name: "Mali", code: "ML", flag: "/images/flags/ml.svg", continent: "Africa", region: "Africa" },
  { name: "Burkina Faso", code: "BF", flag: "/images/flags/bf.svg", continent: "Africa", region: "Africa" },
  { name: "Niger", code: "NE", flag: "/images/flags/ne.svg", continent: "Africa", region: "Africa" },
  { name: "Chad", code: "TD", flag: "/images/flags/td.svg", continent: "Africa", region: "Africa" },
  { name: "Cameroon", code: "CM", flag: "/images/flags/cm.svg", continent: "Africa", region: "Africa" },
  { name: "Central African Republic", code: "CF", flag: "/images/flags/cf.svg", continent: "Africa", region: "Africa" },
  { name: "Democratic Republic of the Congo", code: "CD", flag: "/images/flags/cd.svg", continent: "Africa", region: "Africa" },
  { name: "Republic of the Congo", code: "CG", flag: "/images/flags/cg.svg", continent: "Africa", region: "Africa" },
  { name: "Gabon", code: "GA", flag: "/images/flags/ga.svg", continent: "Africa", region: "Africa" },
  { name: "Equatorial Guinea", code: "GQ", flag: "/images/flags/gq.svg", continent: "Africa", region: "Africa" },
  { name: "Angola", code: "AO", flag: "/images/flags/ao.svg", continent: "Africa", region: "Africa" },
  { name: "Zambia", code: "ZM", flag: "/images/flags/zm.svg", continent: "Africa", region: "Africa" },
  { name: "Zimbabwe", code: "ZW", flag: "/images/flags/zw.svg", continent: "Africa", region: "Africa" },
  { name: "Botswana", code: "BW", flag: "/images/flags/bw.svg", continent: "Africa", region: "Africa" },
  { name: "Namibia", code: "NA", flag: "/images/flags/na.svg", continent: "Africa", region: "Africa" },
  { name: "Lesotho", code: "LS", flag: "/images/flags/ls.svg", continent: "Africa", region: "Africa" },
  { name: "Eswatini", code: "SZ", flag: "/images/flags/sz.svg", continent: "Africa", region: "Africa" },
  { name: "Madagascar", code: "MG", flag: "/images/flags/mg.svg", continent: "Africa", region: "Africa" },
  { name: "Mauritius", code: "MU", flag: "/images/flags/mu.svg", continent: "Africa", region: "Africa" },
  { name: "Seychelles", code: "SC", flag: "/images/flags/sc.svg", continent: "Africa", region: "Africa" },
  { name: "Comoros", code: "KM", flag: "/images/flags/km.svg", continent: "Africa", region: "Africa" },
  { name: "Uruguay", code: "UY", flag: "/images/flags/uy.svg", continent: "South America", region: "Americas" },
  { name: "Paraguay", code: "PY", flag: "/images/flags/py.svg", continent: "South America", region: "Americas" },
  { name: "Bolivia", code: "BO", flag: "/images/flags/bo.svg", continent: "South America", region: "Americas" },
  { name: "Ecuador", code: "EC", flag: "/images/flags/ec.svg", continent: "South America", region: "Americas" },
  { name: "Guyana", code: "GY", flag: "/images/flags/gy.svg", continent: "South America", region: "Americas" },
  { name: "Suriname", code: "SR", flag: "/images/flags/sr.svg", continent: "South America", region: "Americas" },
  { name: "Costa Rica", code: "CR", flag: "/images/flags/cr.svg", continent: "North America", region: "Americas" },
  { name: "Panama", code: "PA", flag: "/images/flags/pa.svg", continent: "North America", region: "Americas" },
  { name: "Nicaragua", code: "NI", flag: "/images/flags/ni.svg", continent: "North America", region: "Americas" },
  { name: "Honduras", code: "HN", flag: "/images/flags/hn.svg", continent: "North America", region: "Americas" },
  { name: "El Salvador", code: "SV", flag: "/images/flags/sv.svg", continent: "North America", region: "Americas" },
  { name: "Guatemala", code: "GT", flag: "/images/flags/gt.svg", continent: "North America", region: "Americas" },
  { name: "Belize", code: "BZ", flag: "/images/flags/bz.svg", continent: "North America", region: "Americas" },
  { name: "Jamaica", code: "JM", flag: "/images/flags/jm.svg", continent: "North America", region: "Americas" },
  { name: "Cuba", code: "CU", flag: "/images/flags/cu.svg", continent: "North America", region: "Americas" },
  { name: "Haiti", code: "HT", flag: "/images/flags/ht.svg", continent: "North America", region: "Americas" },
  { name: "Dominican Republic", code: "DO", flag: "/images/flags/do.svg", continent: "North America", region: "Americas" },
  { name: "Trinidad and Tobago", code: "TT", flag: "/images/flags/tt.svg", continent: "North America", region: "Americas" },
  { name: "Barbados", code: "BB", flag: "/images/flags/bb.svg", continent: "North America", region: "Americas" },
  { name: "Saint Lucia", code: "LC", flag: "/images/flags/lc.svg", continent: "North America", region: "Americas" },
  { name: "Grenada", code: "GD", flag: "/images/flags/gd.svg", continent: "North America", region: "Americas" },
  { name: "Saint Vincent and the Grenadines", code: "VC", flag: "/images/flags/vc.svg", continent: "North America", region: "Americas" },
  { name: "Antigua and Barbuda", code: "AG", flag: "/images/flags/ag.svg", continent: "North America", region: "Americas" },
  { name: "Dominica", code: "DM", flag: "/images/flags/dm.svg", continent: "North America", region: "Americas" },
  { name: "Saint Kitts and Nevis", code: "KN", flag: "/images/flags/kn.svg", continent: "North America", region: "Americas" },
  { name: "Bahamas", code: "BS", flag: "/images/flags/bs.svg", continent: "North America", region: "Americas" },
  { name: "Fiji", code: "FJ", flag: "/images/flags/fj.svg", continent: "Oceania", region: "Oceania" },
  { name: "Papua New Guinea", code: "PG", flag: "/images/flags/pg.svg", continent: "Oceania", region: "Oceania" },
  { name: "Solomon Islands", code: "SB", flag: "/images/flags/sb.svg", continent: "Oceania", region: "Oceania" },
  { name: "Vanuatu", code: "VU", flag: "/images/flags/vu.svg", continent: "Oceania", region: "Oceania" },
  { name: "Samoa", code: "WS", flag: "/images/flags/ws.svg", continent: "Oceania", region: "Oceania" },
  { name: "Tonga", code: "TO", flag: "/images/flags/to.svg", continent: "Oceania", region: "Oceania" },
  { name: "Palau", code: "PW", flag: "/images/flags/pw.svg", continent: "Oceania", region: "Oceania" },
  { name: "Micronesia", code: "FM", flag: "/images/flags/fm.svg", continent: "Oceania", region: "Oceania" },
  { name: "Marshall Islands", code: "MH", flag: "/images/flags/mh.svg", continent: "Oceania", region: "Oceania" },
  { name: "Kiribati", code: "KI", flag: "/images/flags/ki.svg", continent: "Oceania", region: "Oceania" },
  { name: "Nauru", code: "NR", flag: "/images/flags/nr.svg", continent: "Oceania", region: "Oceania" },
  { name: "Tuvalu", code: "TV", flag: "/images/flags/tv.svg", continent: "Oceania", region: "Oceania" },
  { name: "South Sudan", code: "SS", flag: "/images/flags/ss.svg", continent: "Africa", region: "Africa" },
  { name: "Eritrea", code: "ER", flag: "/images/flags/er.svg", continent: "Africa", region: "Africa" },
  { name: "Djibouti", code: "DJ", flag: "/images/flags/dj.svg", continent: "Africa", region: "Africa" },
  { name: "Rwanda", code: "RW", flag: "/images/flags/rw.svg", continent: "Africa", region: "Africa" },
  { name: "Burundi", code: "BI", flag: "/images/flags/bi.svg", continent: "Africa", region: "Africa" },
  { name: "Uganda", code: "UG", flag: "/images/flags/ug.svg", continent: "Africa", region: "Africa" },
  { name: "Tanzania", code: "TZ", flag: "/images/flags/tz.svg", continent: "Africa", region: "Africa" },
  { name: "Malawi", code: "MW", flag: "/images/flags/mw.svg", continent: "Africa", region: "Africa" },
  { name: "Mozambique", code: "MZ", flag: "/images/flags/mz.svg", continent: "Africa", region: "Africa" },
  { name: "Guinea", code: "GN", flag: "/images/flags/gn.svg", continent: "Africa", region: "Africa" },
  { name: "Guinea-Bissau", code: "GW", flag: "/images/flags/gw.svg", continent: "Africa", region: "Africa" },
  { name: "Sierra Leone", code: "SL", flag: "/images/flags/sl.svg", continent: "Africa", region: "Africa" },
  { name: "Liberia", code: "LR", flag: "/images/flags/lr.svg", continent: "Africa", region: "Africa" },
  { name: "Gambia", code: "GM", flag: "/images/flags/gm.svg", continent: "Africa", region: "Africa" },
  { name: "Mauritania", code: "MR", flag: "/images/flags/mr.svg", continent: "Africa", region: "Africa" },
  { name: "Cape Verde", code: "CV", flag: "/images/flags/cv.svg", continent: "Africa", region: "Africa" },
  { name: "São Tomé and Príncipe", code: "ST", flag: "/images/flags/st.svg", continent: "Africa", region: "Africa" },
  { name: "Togo", code: "TG", flag: "/images/flags/tg.svg", continent: "Africa", region: "Africa" },
  { name: "Benin", code: "BJ", flag: "/images/flags/bj.svg", continent: "Africa", region: "Africa" },
  { name: "Timor-Leste", code: "TL", flag: "/images/flags/tl.svg", continent: "Asia", region: "Asia" },
  { name: "Brunei", code: "BN", flag: "/images/flags/bn.svg", continent: "Asia", region: "Asia" },
  { name: "Taiwan", code: "TW", flag: "/images/flags/tw.svg", continent: "Asia", region: "Asia" },
  { name: "Palestine", code: "PS", flag: "/images/flags/ps.svg", continent: "Asia", region: "Middle East" },
  { name: "Kosovo", code: "XK", flag: "/images/flags/xk.svg", continent: "Europe", region: "Europe" },
];

export const getCountryByCode = (code: string) => {
  return countries.find((country) => country.code === code);
};
