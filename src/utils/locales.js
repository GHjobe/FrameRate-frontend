// Full lists of countries and languages for the onboarding dropdowns.
// Codes are standard (ISO 3166 for countries, ISO 639 for languages);
// the browser's Intl.DisplayNames turns them into English names.

const REGION_CODES = (
  'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ ' +
  'CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR ' +
  'GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP ' +
  'KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT ' +
  'MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW ' +
  'SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG ' +
  'UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'
).split(' ')

const LANGUAGE_CODES = (
  'af ak am ar as az be bg bm bn bo br bs ca ce co cs cy da de dv dz ee el en eo es et eu fa ff fi fil fo fr fy ga gd gl ' +
  'gn gu ha he hi hr ht hu hy ia id ig is it iu ja jv ka kk km kn ko ku ky la lb lg ln lo lt lv mg mi mk ml mn mr ms mt ' +
  'my nb ne nl nn no ny oc om or pa pl ps pt qu rm ro ru rw sa sd si sk sl sn so sq sr su sv sw ta te tg th ti tk tn to ' +
  'tr tt ug uk ur uz vi wo xh yi yo zh zu'
).split(' ')

const FALLBACK_COUNTRIES = [
  'Philippines', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Japan', 'South Korea',
]
const FALLBACK_LANGUAGES = ['English', 'Filipino', 'Japanese', 'Korean', 'Spanish']

function namesFor(codes, type) {
  const display = new Intl.DisplayNames(['en'], { type })
  const names = codes
    .map((code) => ({ code, name: display.of(code) }))
    // skip codes the browser does not know (it returns the code itself)
    .filter((x) => x.name && x.name.toLowerCase() !== x.code.toLowerCase())
    .map((x) => x.name)
  return [...new Set(names)].sort((a, b) => a.localeCompare(b))
}

// put the default choices first, then the rest A-Z
function pinFirst(list, pinned) {
  const first = pinned.filter((p) => list.includes(p))
  return [...first, ...list.filter((x) => !first.includes(x))]
}

export function getCountries() {
  try {
    return pinFirst(namesFor(REGION_CODES, 'region'), ['Philippines'])
  } catch {
    return FALLBACK_COUNTRIES
  }
}

export function getLanguages() {
  try {
    return pinFirst(namesFor(LANGUAGE_CODES, 'language'), ['English', 'Filipino'])
  } catch {
    return FALLBACK_LANGUAGES
  }
}