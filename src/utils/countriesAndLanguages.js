/**
 * Lists of all countries and all languages for the Onboarding dropdowns.
 *
 * The lists are standard codes (ISO 3166 for countries, ISO 639 for languages).
 * The browser's built-in Intl.DisplayNames turns each code into a name,
 * so no package needs to be installed.
 *
 * Exports:
 *   getCountries(lang)      -> [{ value, label }]  value = English name, label = name in `lang`
 *   getLanguages()          -> [{ value, label }]  value = language code, label like "Español (Spanish)"
 *   languageEnglishName(code) -> 'Korean' for 'ko'
 */

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

// Used only if the browser does not support Intl.DisplayNames
const FALLBACK_COUNTRIES = [
  'Philippines', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Japan', 'South Korea',
].map((name) => ({ value: name, label: name }))

const FALLBACK_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fil', label: 'Filipino' },
  { value: 'es', label: 'Español (Spanish)' },
  { value: 'ja', label: '日本語 (Japanese)' },
  { value: 'ko', label: '한국어 (Korean)' },
]

function displayNames(lang, type) {
  try {
    return new Intl.DisplayNames([lang], { type })
  } catch {
    return new Intl.DisplayNames(['en'], { type })
  }
}

/** English name of a language code, like 'ko' -> 'Korean'. */
export function languageEnglishName(code) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) || code
  } catch {
    return code
  }
}

// Put the wanted items at the top of the list, keep the rest in order
function pinFirst(list, pinnedValues) {
  const first = pinnedValues
    .map((v) => list.find((x) => x.value === v))
    .filter(Boolean)
  return [...first, ...list.filter((x) => !first.includes(x))]
}

/**
 * Options for the Region dropdown.
 * value stays in English (so saved data is the same for every language);
 * label is shown in the given app language. Philippines is always first.
 */
export function getCountries(lang = 'en') {
  try {
    const english = displayNames('en', 'region')
    const local = displayNames(lang, 'region')
    const seen = new Set()
    const list = []
    for (const code of REGION_CODES) {
      const value = english.of(code)
      const label = local.of(code)
      // skip codes the browser does not know (it returns the code itself)
      if (!value || value.toLowerCase() === code.toLowerCase() || seen.has(value)) continue
      seen.add(value)
      list.push({ value, label: label || value })
    }
    list.sort((a, b) => a.label.localeCompare(b.label, lang))
    return pinFirst(list, ['Philippines'])
  } catch {
    return FALLBACK_COUNTRIES
  }
}

/**
 * Options for the Language dropdown.
 * value is the language code ('es'); label shows the name in its own language
 * plus English, like "Español (Spanish)". English and Filipino are first.
 */
export function getLanguages() {
  try {
    const seen = new Set()
    const list = []
    for (const code of LANGUAGE_CODES) {
      const english = languageEnglishName(code)
      if (!english || english.toLowerCase() === code.toLowerCase() || seen.has(code)) continue
      seen.add(code)

      // the language's name written in that language
      let native = english
      try {
        native = new Intl.DisplayNames([code], { type: 'language' }).of(code) || english
      } catch {
        // keep the English name
      }
      native = native.charAt(0).toUpperCase() + native.slice(1)
      const label = native.toLowerCase() === english.toLowerCase() ? english : `${native} (${english})`
      list.push({ value: code, label, english })
    }
    list.sort((a, b) => a.english.localeCompare(b.english))
    return pinFirst(list, ['en', 'fil']).map(({ value, label }) => ({ value, label }))
  } catch {
    return FALLBACK_LANGUAGES
  }
}