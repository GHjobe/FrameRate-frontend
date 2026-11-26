<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'
import BaseAvatar from './BaseAvatar.vue'
import BaseButton from './BaseButton.vue'
import SearchBar from './SearchBar.vue'

/*
 * Top navigation bar. All visible text goes through locale.t('key'),
 * so it follows the language chosen by the user (see src/translations/translations.js).
 * Three versions: guest (Log In / Register), user (avatar menu), moderator (+ Moderation link).
 */

const auth = useAuthStore()
const locale = useLocaleStore()
const route = useRoute()
const router = useRouter()

const links = computed(() => [
  { to: '/', label: locale.t('nav.discover') },
  { to: '/for-you', label: locale.t('nav.forYou') },
  { to: '/watchlist', label: locale.t('nav.watchlist') },
  { to: '/watch-together', label: locale.t('nav.watchTogether') },
])

const menuOpen = ref(false)
const menuRef = ref(null)

function onClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

function logout() {
  menuOpen.value = false
  auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="nav">
    <div class="nav__inner">
      <RouterLink to="/" class="nav__logo" aria-label="FrameRate home">
        <img src="/logo.png" alt="FrameRate" />
      </RouterLink>

      <nav class="nav__links" :aria-label="locale.t('nav.main')">
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="nav__link" exact-active-class="is-active">
          {{ l.label }}
        </RouterLink>
        <RouterLink v-if="auth.isModerator" to="/moderation" class="nav__link" exact-active-class="is-active">
          {{ locale.t('nav.moderation') }}
        </RouterLink>
      </nav>

      <div class="nav__right">
        <SearchBar v-if="route.name !== 'search'" />

        <template v-if="!auth.isLoggedIn">
          <BaseButton variant="text" @click="router.push({ name: 'login' })">{{ locale.t('nav.logIn') }}</BaseButton>
          <BaseButton @click="router.push({ name: 'login', query: { mode: 'register' } })">{{ locale.t('nav.register') }}</BaseButton>
        </template>

        <div v-else ref="menuRef" class="nav__menu">
          <button
            type="button"
            class="nav__avatar"
            :aria-label="locale.t('nav.accountMenu')"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <BaseAvatar :name="auth.user?.username || ''" :size="36" />
          </button>
          <div v-if="menuOpen" class="nav__dropdown" role="menu">
            <RouterLink to="/profile" class="nav__item" role="menuitem">{{ locale.t('nav.profile') }}</RouterLink>
            <button type="button" class="nav__item" role="menuitem" @click="logout">{{ locale.t('nav.logOut') }}</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--navbar-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}
.nav__inner {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  height: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}
.nav__logo {
  display: inline-flex;
  align-items: center;
  line-height: 0;
}
.nav__logo img {
  height: 32px;
  width: auto;
}
.nav__logo:focus-visible {
  outline: 2px solid var(--color-nav-active);
  outline-offset: 4px;
}
.nav__links { display: flex; gap: var(--space-6); }
.nav__link {
  padding: var(--space-2) 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-decoration: none;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}
.nav__link:hover { color: var(--color-text); }
.nav__link.is-active {
  color: var(--color-text);
  font-weight: 600;
  border-bottom-color: var(--color-nav-active);
}
.nav__right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}
.nav__menu { position: relative; }
.nav__avatar { border-radius: 50%; line-height: 0; }
.nav__avatar:focus-visible { outline: 2px solid var(--color-nav-active); outline-offset: 2px; }
.nav__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + var(--space-2));
  min-width: 160px;
  display: flex;
  flex-direction: column;
  padding: var(--space-1);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}
.nav__item {
  padding: var(--space-2) var(--space-3);
  text-align: left;
  color: var(--color-text);
  font-size: var(--text-sm);
  text-decoration: none;
  border-radius: var(--radius-sm);
}
.nav__item:hover { background: var(--color-surface-hover); }
.nav__item:focus-visible { outline: 2px solid var(--color-nav-active); }
</style>