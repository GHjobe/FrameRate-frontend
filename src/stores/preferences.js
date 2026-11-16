import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    genres: [],
    providers: [],
    region: 'Philippines',
    language: 'English',
    blurSpoilers: false,
    completed: false, // true after Finish or Skip
  }),
  actions: {
    save({ genres, providers, region, language, blurSpoilers }) {
      this.genres = genres
      this.providers = providers
      this.region = region
      this.language = language
      this.blurSpoilers = blurSpoilers
      this.completed = true
    },
    skip() {
      this.completed = true
    },
  },
})