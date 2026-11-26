import { defineStore } from 'pinia'

/**
 * What the logged-in user picked in Onboarding: genres, streaming services,
 * region, language, blur spoilers, and whether Onboarding is done.
 *
 * These are saved PER USER (key = framerate_preferences:<username>), so one
 * user never sees or changes another user's choices.
 * The auth store calls loadForUser() on login and reset() on logout.
 * Stored in localStorage for now; replace read() and write() with backend calls later.
 */

const KEY = 'framerate_preferences'

const defaults = () => ({
  genres: [],
  providers: [],
  region: 'Philippines',
  language: 'en', // language code, like 'en', 'fil', 'es', 'ja'
  blurSpoilers: false,
  completed: false, // true after Finish or Skip
})

function read(username) {
  try {
    const raw = localStorage.getItem(`${KEY}:${username}`)
    if (!raw) return {}
    const data = JSON.parse(raw)
    return {
      genres: Array.isArray(data.genres) ? data.genres : [],
      providers: Array.isArray(data.providers) ? data.providers : [],
      region: typeof data.region === 'string' ? data.region : 'Philippines',
      language: typeof data.language === 'string' ? data.language : 'en',
      blurSpoilers: data.blurSpoilers === true,
      completed: data.completed === true,
    }
  } catch {
    return {}
  }
}

function write(username, data) {
  try {
    localStorage.setItem(`${KEY}:${username}`, JSON.stringify(data))
  } catch {
    // ignore blocked storage
  }
}

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({ ...defaults(), owner: null }), // owner = username these choices belong to
  actions: {
    // Called on login: load this user's saved choices (or empty defaults for a new user)
    loadForUser(username) {
      Object.assign(this, defaults(), read(username), { owner: username })
    },
    // Called on logout: clear everything so the next user starts clean
    reset() {
      Object.assign(this, defaults(), { owner: null })
    },
    save({ genres, providers, region, language, blurSpoilers }) {
      this.genres = genres
      this.providers = providers
      this.region = region
      this.language = language
      this.blurSpoilers = blurSpoilers
      this.completed = true
      this.persist()
    },
    skip() {
      this.completed = true
      this.persist()
    },
    // Save to this user's own storage key
    persist() {
      if (!this.owner) return
      write(this.owner, {
        genres: this.genres,
        providers: this.providers,
        region: this.region,
        language: this.language,
        blurSpoilers: this.blurSpoilers,
        completed: this.completed,
      })
    },
  },
})