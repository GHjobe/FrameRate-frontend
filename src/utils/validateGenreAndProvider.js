/**
 * Checks the genres and streaming services that users type in the
 * "Others" boxes of the Onboarding page.
 *
 * A typed name is accepted only if it is in the lists below (not case-sensitive).
 * This stops random text like "asdfgh" from being added for everyone.
 *
 * Exports:
 *   checkGenre(text)    -> { name, error }
 *   checkProvider(text) -> { name, error }
 *   name  = the correct spelling from the list (empty if there is an error)
 *   error = a message to show the user (empty if the name is OK)
 *
 * To accept more names, add them to KNOWN_GENRES or KNOWN_PROVIDERS.
 * Later, a moderator approval step can handle names that are not in the lists.
 */

// Letters (any language), numbers, spaces, and & + - . '
const ALLOWED = /^[\p{L}\p{N} &+\-'.]+$/u

export const KNOWN_GENRES = [
  'Action', 'Adventure', 'Animation', 'Anime', 'Biography', 'Comedy', 'Coming-of-Age',
  'Crime', 'Cyberpunk', 'Dark Comedy', 'Disaster', 'Documentary', 'Drama', 'Family',
  'Fantasy', 'Film Noir', 'Heist', 'History', 'Horror', 'K-Drama', 'Martial Arts',
  'Mockumentary', 'Music', 'Musical', 'Mystery', 'Psychological Thriller', 'Reality',
  'Rom-Com', 'Romance', 'Sci-Fi', 'Science Fiction', 'Short', 'Slasher', 'Sport',
  'Superhero', 'Teen', 'Thriller', 'War', 'Western', 'Zombie',
]

export const KNOWN_PROVIDERS = [
  'Netflix', 'Max', 'HBO Max', 'HBO GO', 'Apple TV+', 'Prime Video', 'Amazon Prime Video',
  'Disney+', 'Disney+ Hotstar', 'Hulu', 'Paramount+', 'Peacock', 'YouTube', 'Tubi', 'Plex',
  'Pluto TV', 'Crunchyroll', 'Viu', 'Vivamax', 'iWantTFC', 'WeTV', 'iQIYI', 'Viki', 'Mubi',
  'Criterion Channel', 'Starz', 'AMC+', 'BritBox', 'Shudder', 'Vimeo', 'Cignal Play', 'Kocowa',
]

// Remove extra spaces
function normalize(raw) {
  return raw.trim().replace(/\s+/g, ' ')
}

// Shared checking steps for both genres and providers
function check(raw, list, label) {
  const v = normalize(raw)

  if (v.length < 2) return { name: '', error: 'Please enter at least 2 characters.' }
  if (v.length > 30) return { name: '', error: 'Please keep it to 30 characters or less.' }
  if (!ALLOWED.test(v)) return { name: '', error: "Use letters, numbers, spaces, and & + - . ' only." }

  const found = list.find((item) => item.toLowerCase() === v.toLowerCase())
  if (!found) {
    return { name: '', error: `We don't recognize that ${label}. Please check the spelling.` }
  }
  return { name: found, error: '' }
}

export const checkGenre = (raw) => check(raw, KNOWN_GENRES, 'genre')
export const checkProvider = (raw) => check(raw, KNOWN_PROVIDERS, 'streaming service')