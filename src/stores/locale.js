import { defineStore } from 'pinia'
import { messages, genreNames } from '@/translations/translations'

/**
 * Keeps the language of the app and translates text.
 *
 * In a component:
 *   const locale = useLocaleStore()
 *   locale.t('nav.logIn')            -> translated text for a key
 *   locale.t('onboarding.genresHint', { max: 8, count: 3 })   -> fills {max} and {count}
 *   locale.genre('Action')           -> translated genre name
 *
 * The language is saved per user, so each user keeps their own.
 * It is stored in localStorage for now; replace read() and write()
 * with backend calls later.
 */

const KEY = 'framerate_language'

function read(username) {
  try {
    return localStorage.getItem(`${KEY}:${username}`)
  } catch {
    return null
  }
}

function write(username, code) {
  try {
    localStorage.setItem(`${KEY}:${username}`, code)
  } catch {
    // ignore blocked storage
  }
}

export const useLocaleStore = defineStore('locale', {
  state: () => ({ language: 'en' }), // language code the user picked
  getters: {
    // true if translations exist for the picked language
    isSupported: (s) => Boolean(messages[s.language]),
    // the language the app is actually shown in (English if no translation)
    uiLang: (s) => (messages[s.language] ? s.language : 'en'),
  },
  actions: {
    // Translate a key. Falls back to English, then to the key itself.
    t(key, params = {}) {
      let text = messages[this.uiLang]?.[key] ?? messages.en[key] ?? key
      for (const [name, value] of Object.entries(params)) {
        text = text.split(`{${name}}`).join(String(value))
      }
      return text
    },
    // Translated genre name (the saved value stays in English)
    genre(name) {
      return genreNames[this.uiLang]?.[name] ?? name
    },
    // Change the language now, and remember it for this user
    setLanguage(code, username) {
      this.language = code
      document.documentElement.lang = this.uiLang
      if (username) write(username, code)
    },
    // Called when a user logs in: use their saved language
    loadForUser(username) {
      this.language = read(username) || 'en'
      document.documentElement.lang = this.uiLang
    },
    // Called when a user logs out: back to English
    reset() {
      this.language = 'en'
      document.documentElement.lang = 'en'
    },
  },
})