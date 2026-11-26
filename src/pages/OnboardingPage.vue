<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences'
import { useCatalogStore } from '@/stores/catalog'
import { useLocaleStore } from '@/stores/locale'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { messages } from '@/translations/translations'
import { getGenres } from '@/api/movies'
import { getOnboardingOptions } from '@/api/onboarding'
import { checkGenre, checkProvider } from '@/utils/validateGenreAndProvider'
import { getCountries, getLanguages, languageEnglishName } from '@/utils/countriesAndLanguages'
import BaseChip from '@/components/BaseChip.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseDropdown from '@/components/BaseDropdown.vue'
import BaseToggle from '@/components/BaseToggle.vue'

/*
 * Onboarding page: the user picks genres, streaming services, region and language.
 *
 * Stores used:
 *   preferences  - saves what the user picked (genres, providers, region, language)
 *   catalog      - genres and services added through "Others", shared by all users
 *   locale       - app language and translations (locale.t('key'))
 *   auth         - who is logged in (the language is saved per user)
 *
 * The language picked here is applied to the app only when the user presses Finish.
 */

const MAX_GENRES = 8

const router = useRouter()
const prefs = usePreferencesStore()
const catalog = useCatalogStore()
const locale = useLocaleStore()
const auth = useAuthStore()
const toast = useToastStore()

// short name for translating text
const t = (key, params) => locale.t(key, params)

const genreOptions = ref([])
const providerOptions = ref([])

// all languages (shown in their own language) and all countries (in the current app language)
const languageOptions = getLanguages()
const regionOptions = computed(() => getCountries(locale.uiLang))

// start from whatever is already saved
const genres = ref([...prefs.genres])
const showOthers = ref(false)
const otherInput = ref('')
const error = ref('')

const providers = ref([...prefs.providers])
const showOtherProvider = ref(false)
const otherProviderInput = ref('')
const providerError = ref('')

const region = ref(prefs.region)
const language = ref(locale.language) // picked in the dropdown, applied on Finish
const blurSpoilers = ref(prefs.blurSpoilers)

// do we have translations for the language picked in the dropdown?
const pickedLanguageSupported = computed(() => Boolean(messages[language.value]))

// English name of the picked language, used in the "no translation" notice
const languageName = computed(() => languageEnglishName(language.value))

const atLimit = computed(() => genres.value.length >= MAX_GENRES)

// built-in list + everything users added before (shared by everyone)
const allGenres = computed(() => {
  const base = genreOptions.value
  const extra = catalog.extraGenres.filter((g) => !base.some((b) => b.toLowerCase() === g.toLowerCase()))
  return [...base, ...extra]
})

const allProviders = computed(() => {
  const base = providerOptions.value
  const extra = catalog.extraProviders.filter((p) => !base.some((b) => b.toLowerCase() === p.toLowerCase()))
  return [...base, ...extra]
})

/* ---------- Genres ---------- */
function toggleGenre(g) {
  error.value = ''
  const i = genres.value.indexOf(g)
  if (i !== -1) genres.value.splice(i, 1)
  else if (!atLimit.value) genres.value.push(g)
}

// "Others": check the typed genre, then add it to the picks (and to the shared list if it is new)
function addCustom() {
  const raw = otherInput.value
  if (!raw.trim()) return

  const { name, error: problem } = checkGenre(raw)
  if (problem) {
    error.value = problem
    return
  }

  const existing = allGenres.value.find((g) => g.toLowerCase() === name.toLowerCase())
  const finalName = existing || name

  if (genres.value.some((g) => g.toLowerCase() === finalName.toLowerCase())) {
    error.value = t('onboarding.alreadySelected', { name: locale.genre(finalName) })
    otherInput.value = ''
    return
  }
  if (atLimit.value) {
    error.value = t('onboarding.maxGenres', { max: MAX_GENRES })
    return
  }

  error.value = ''
  // new genre: add it for everyone
  if (!existing) catalog.addGenre(finalName)
  genres.value.push(finalName)
  otherInput.value = ''
}

/* ---------- Providers ---------- */
function toggleProvider(p) {
  const i = providers.value.indexOf(p)
  if (i !== -1) providers.value.splice(i, 1)
  else providers.value.push(p)
}

// "Others": same idea as addCustom, but for streaming services
function addCustomProvider() {
  const raw = otherProviderInput.value
  if (!raw.trim()) return

  const { name, error: problem } = checkProvider(raw)
  if (problem) {
    providerError.value = problem
    return
  }

  const existing = allProviders.value.find((p) => p.toLowerCase() === name.toLowerCase())
  const finalName = existing || name

  if (providers.value.some((p) => p.toLowerCase() === finalName.toLowerCase())) {
    providerError.value = t('onboarding.alreadySelected', { name: finalName })
    otherProviderInput.value = ''
    return
  }

  providerError.value = ''
  // new service: add it for everyone
  if (!existing) catalog.addProvider(finalName)
  providers.value.push(finalName)
  otherProviderInput.value = ''
}

/* ---------- Actions ---------- */
function finish() {
  if (genres.value.length < 1) {
    error.value = t('onboarding.pickAtLeastOne')
    return
  }
  prefs.save({
    genres: genres.value,
    providers: providers.value,
    region: region.value,
    language: language.value,
    blurSpoilers: blurSpoilers.value,
  })
  // apply the picked language to the app now, and remember it for this user
  locale.setLanguage(language.value, auth.user?.username)
  toast.show(t('onboarding.saved'))
  router.push('/')
}

function skip() {
  prefs.skip()
  router.push('/')
}

onMounted(async () => {
  const [g, o] = await Promise.all([getGenres(), getOnboardingOptions()])
  genreOptions.value = g
  providerOptions.value = o.providers
  // drop saved picks that are no longer in the lists
  genres.value = genres.value.filter((x) => allGenres.value.includes(x))
  providers.value = providers.value.filter((x) => allProviders.value.includes(x))
})

// placeholder wordmark colors (replace with real logos later)
const brandColor = {
  Netflix: '#e50914',
  Max: '#8b7bff',
  'Apple TV+': '#f1f5f9',
  'Prime Video': '#00a8e1',
  'Disney+': '#4c7bff',
  Hulu: '#1ce783',
}
</script>

<template>
  <main class="onboarding">
    <header class="head">
      <img src="/logo.png" alt="FrameRate" class="head__logo" />
      <h1 class="head__title">{{ t('onboarding.welcome') }}</h1>
      <p class="head__sub">{{ t('onboarding.subtitle') }}</p>
    </header>

    <!-- 01 Genres -->
    <section class="card">
      <h2 class="card__title">{{ t('onboarding.genresTitle') }}</h2>
      <p class="card__hint">{{ t('onboarding.genresHint', { max: MAX_GENRES, count: genres.length }) }}</p>
      <div class="chips">
        <BaseChip
          v-for="g in allGenres"
          :key="g"
          :selected="genres.includes(g)"
          :disabled="atLimit && !genres.includes(g)"
          @click="toggleGenre(g)"
        >
          {{ locale.genre(g) }}
        </BaseChip>
        <BaseChip :selected="showOthers" @click="showOthers = !showOthers">{{ t('onboarding.others') }}</BaseChip>
      </div>

      <div v-if="showOthers" class="other">
        <label class="other__label" for="other-genre">{{ t('onboarding.otherGenreLabel') }}</label>
        <div class="other__row">
          <input
            id="other-genre"
            v-model="otherInput"
            type="text"
            class="other__input"
            :placeholder="t('onboarding.otherGenrePlaceholder')"
            maxlength="40"
            @input="error = ''"
            @keydown.enter.prevent="addCustom"
          />
          <button type="button" class="other__add" :aria-label="t('onboarding.addGenre')" @click="addCustom">+</button>
        </div>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
    </section>

    <!-- 02 Providers -->
    <section class="card">
      <h2 class="card__title">{{ t('onboarding.providersTitle') }}</h2>
      <p class="card__hint">{{ t('onboarding.providersHint') }}</p>
      <div class="tiles">
        <button
          v-for="p in allProviders"
          :key="p"
          type="button"
          :aria-pressed="providers.includes(p)"
          :class="['tile', { 'is-selected': providers.includes(p) }]"
          @click="toggleProvider(p)"
        >
          <span class="tile__name" :style="{ color: brandColor[p] }">{{ p }}</span>
          <span class="tile__mark" aria-hidden="true">{{ providers.includes(p) ? '✓' : '+' }}</span>
        </button>

        <button
          type="button"
          :aria-pressed="showOtherProvider"
          :class="['tile', { 'is-selected': showOtherProvider }]"
          @click="showOtherProvider = !showOtherProvider"
        >
          <span class="tile__name">{{ t('onboarding.othersTile') }}</span>
          <span class="tile__mark" aria-hidden="true">+</span>
        </button>
      </div>

      <div v-if="showOtherProvider" class="other">
        <label class="other__label" for="other-provider">{{ t('onboarding.otherProviderLabel') }}</label>
        <div class="other__row">
          <input
            id="other-provider"
            v-model="otherProviderInput"
            type="text"
            class="other__input"
            :placeholder="t('onboarding.otherProviderPlaceholder')"
            maxlength="40"
            @input="providerError = ''"
            @keydown.enter.prevent="addCustomProvider"
          />
          <button type="button" class="other__add" :aria-label="t('onboarding.addProvider')" @click="addCustomProvider">+</button>
        </div>
      </div>

      <p v-if="providerError" class="error" role="alert">{{ providerError }}</p>
    </section>

    <!-- 03 Region and language -->
    <section class="card">
      <h2 class="card__title">{{ t('onboarding.regionTitle') }}</h2>
      <p class="card__hint">{{ t('onboarding.regionHint') }}</p>
      <div class="selects">
        <BaseDropdown v-model="region" :label="t('onboarding.region')" :options="regionOptions" />
        <BaseDropdown v-model="language" :label="t('onboarding.language')" :options="languageOptions" />
      </div>
      <p v-if="!pickedLanguageSupported" class="notice" role="status">
        {{ t('onboarding.noTranslation', { language: languageName }) }}
      </p>
      <div class="toggle-row">
        <BaseToggle v-model="blurSpoilers" :label="t('onboarding.blurSpoilers')" />
      </div>
    </section>

    <div class="actions">
      <BaseButton variant="text" @click="skip">{{ t('onboarding.skip') }}</BaseButton>
      <BaseButton @click="finish">{{ t('onboarding.finish') }}</BaseButton>
    </div>
  </main>
</template>

<style scoped>
.onboarding {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

.head { text-align: center; margin-bottom: var(--space-8); }
.head__logo { height: 28px; width: auto; margin: 0 auto var(--space-3); }
.head__title {
  color: var(--color-primary);
  font-size: 3rem;
  letter-spacing: 0.06em;
  font-weight: 400;
}
.head__sub { margin-top: var(--space-2); color: var(--color-text-muted); font-size: var(--text-sm); }

.card {
  margin-bottom: var(--space-6);
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
.card__title { font-family: var(--font-body); font-size: var(--text-md); font-weight: 600; }
.card__hint { margin: var(--space-1) 0 var(--space-4); color: var(--color-text-muted); font-size: var(--text-sm); }

.chips { display: flex; flex-wrap: wrap; gap: var(--space-3); }

.other { margin-top: var(--space-4); padding: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); }
.other__label { display: block; margin-bottom: var(--space-2); color: var(--color-primary); font-size: var(--text-sm); }
.other__row { display: flex; align-items: center; gap: var(--space-2); }
.other__input {
  flex: 1;
  padding: 8px 0;
  background: transparent;
  border: none;
  color: var(--color-text);
}
.other__input:focus-visible { outline: none; }
.other__add { width: 28px; height: 28px; font-size: 20px; color: var(--color-primary); border-radius: 50%; }
.other__add:hover { background: var(--color-surface-hover); }

.error { margin-top: var(--space-3); color: var(--color-danger); font-size: var(--text-sm); }
.notice { margin-top: var(--space-3); color: var(--color-primary); font-size: var(--text-sm); }

.tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
.tile {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: background 0.15s, border-color 0.15s;
}
.tile:hover { background: var(--color-surface-hover); }
.tile.is-selected { border-color: var(--color-primary); }
.tile__name { font-weight: 700; }
.tile__mark { color: var(--color-text-muted); font-size: var(--text-sm); }
.tile.is-selected .tile__mark { color: var(--color-primary); }

.selects { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.toggle-row { display: flex; margin-top: var(--space-6); }

.actions { display: flex; align-items: center; justify-content: space-between; }
</style>