import { defineStore } from 'pinia'

/**
 * Genres and streaming services that users added through the "Others" boxes
 * on the Onboarding page. Everyone using the app sees them in the lists.
 *
 * In a component:
 *   const catalog = useCatalogStore()
 *   catalog.extraGenres        -> ['Adventure', ...]
 *   catalog.addGenre('Anime')  -> adds it for everyone (no duplicates)
 *   catalog.extraProviders / catalog.addProvider('Viu')  -> same, for streaming services
 *
 * Saved in localStorage for now, so it is shared by every account in the
 * same browser. Replace load() and save() with backend calls later so it
 * is shared across devices.
 */

const KEY = 'framerate_catalog'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const data = JSON.parse(raw)
      return {
        extraGenres: Array.isArray(data.extraGenres) ? data.extraGenres : [],
        extraProviders: Array.isArray(data.extraProviders) ? data.extraProviders : [],
      }
    }
  } catch {
    // ignore broken or blocked storage
  }
  return { extraGenres: [], extraProviders: [] }
}

export const useCatalogStore = defineStore('catalog', {
  state: () => load(),
  actions: {
    addGenre(name) {
      if (!this.extraGenres.some((g) => g.toLowerCase() === name.toLowerCase())) {
        this.extraGenres.push(name)
        this.save()
      }
    },
    addProvider(name) {
      if (!this.extraProviders.some((p) => p.toLowerCase() === name.toLowerCase())) {
        this.extraProviders.push(name)
        this.save()
      }
    },
    save() {
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({ extraGenres: this.extraGenres, extraProviders: this.extraProviders }),
        )
      } catch {
        // ignore
      }
    },
  },
})