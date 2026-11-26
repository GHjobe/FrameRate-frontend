import { defineStore } from 'pinia'
import { useLocaleStore } from '@/stores/locale'
import { usePreferencesStore } from '@/stores/preferences'

/**
 * Who is logged in (fake login for now, no real server yet).
 * role: 'guest' | 'user' | 'moderator'
 *
 * On login, this user's own language and preferences are loaded.
 * On logout, both are cleared, so the next person never sees them.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: 'guest',
    user: null,
  }),
  getters: {
    isLoggedIn: (s) => s.role !== 'guest',
    isModerator: (s) => s.role === 'moderator',
  },
  actions: {
    fakeLogin(role = 'user', username = null) {
      this.role = role
      this.user = { username: username || (role === 'moderator' ? 'mod_demo' : 'demo_user') }
      // load this user's own saved language and preferences
      useLocaleStore().loadForUser(this.user.username)
      usePreferencesStore().loadForUser(this.user.username)
    },
    logout() {
      this.role = 'guest'
      this.user = null
      useLocaleStore().reset()
      usePreferencesStore().reset()
    },
  },
})