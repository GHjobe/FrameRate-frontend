// Checks custom genres and streaming services against lists of real names.
// Each function returns { name, error }. name is the proper spelling.

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

function normalize(raw) {
  return raw.trim().replace(/\s+/g, ' ')
}

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