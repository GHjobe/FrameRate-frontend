<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences'
import { useCatalogStore } from '@/stores/catalog'
import { useToastStore } from '@/stores/toast'
import { getGenres } from '@/api/movies'
import { getOnboardingOptions } from '@/api/onboarding'
import { checkGenre, checkProvider } from '@/utils/validateName'
import { getCountries, getLanguages } from '@/utils/locales'
import BaseChip from '@/components/BaseChip.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseDropdown from '@/components/BaseDropdown.vue'
import BaseToggle from '@/components/BaseToggle.vue'

const MAX_GENRES = 8

const router = useRouter()
const prefs = usePreferencesStore()
const catalog = useCatalogStore()
const toast = useToastStore()

const genreOptions = ref([])
const providerOptions = ref([])
const regionOptions = ref([])
const languageOptions = ref([])

// start from whatever is already saved in the store
const genres = ref([...prefs.genres])
const showOthers = ref(false)
const otherInput = ref('')
const error = ref('')

const providers = ref([...prefs.providers])
const showOtherProvider = ref(false)
const otherProviderInput = ref('')
const providerError = ref('')

const region = ref(prefs.region)
const language = ref(prefs.language)
const blurSpoilers = ref(prefs.blurSpoilers)

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
    error.value = `"${finalName}" is already selected.`
    otherInput.value = ''
    return
  }
  if (atLimit.value) {
    error.value = `You can pick up to ${MAX_GENRES} genres.`
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
    providerError.value = `"${finalName}" is already selected.`
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
    error.value = 'Pick at least 1 genre.'
    return
  }
  prefs.save({
    genres: genres.value,
    providers: providers.value,
    region: region.value,
    language: language.value,
    blurSpoilers: blurSpoilers.value,
  })
  toast.show('Preferences saved')
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
  // all countries and all languages
  regionOptions.value = getCountries()
  languageOptions.value = getLanguages()
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
      <h1 class="head__title">WELCOME</h1>
      <p class="head__sub">Tell us your preferences so we can recommend the best movies and shows just for you.</p>
    </header>

    <!-- 01 Genres -->
    <section class="card">
      <h2 class="card__title">01 / Choose your favorite genres</h2>
      <p class="card__hint">Pick 1 to {{ MAX_GENRES }} genres · {{ genres.length }} selected</p>
      <div class="chips">
        <BaseChip
          v-for="g in allGenres"
          :key="g"
          :selected="genres.includes(g)"
          :disabled="atLimit && !genres.includes(g)"
          @click="toggleGenre(g)"
        >
          {{ g }}
        </BaseChip>
        <BaseChip :selected="showOthers" @click="showOthers = !showOthers">Others +</BaseChip>
      </div>

      <div v-if="showOthers" class="other">
        <label class="other__label" for="other-genre">Specify the genre you enjoy</label>
        <div class="other__row">
          <input
            id="other-genre"
            v-model="otherInput"
            type="text"
            class="other__input"
            placeholder="Enter a genre..."
            maxlength="40"
            @input="error = ''"
            @keydown.enter.prevent="addCustom"
          />
          <button type="button" class="other__add" aria-label="Add genre" @click="addCustom">+</button>
        </div>
      </div>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
    </section>

    <!-- 02 Providers -->
    <section class="card">
      <h2 class="card__title">02 / Where do you watch?</h2>
      <p class="card__hint">Select all that you have.</p>
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
          <span class="tile__name">Others</span>
          <span class="tile__mark" aria-hidden="true">+</span>
        </button>
      </div>

      <div v-if="showOtherProvider" class="other">
        <label class="other__label" for="other-provider">Specify where you watch</label>
        <div class="other__row">
          <input
            id="other-provider"
            v-model="otherProviderInput"
            type="text"
            class="other__input"
            placeholder="Enter a streaming service..."
            maxlength="40"
            @input="providerError = ''"
            @keydown.enter.prevent="addCustomProvider"
          />
          <button type="button" class="other__add" aria-label="Add streaming service" @click="addCustomProvider">+</button>
        </div>
      </div>

      <p v-if="providerError" class="error" role="alert">{{ providerError }}</p>
    </section>

    <!-- 03 Region -->
    <section class="card">
      <h2 class="card__title">03 / Which region are you in?</h2>
      <p class="card__hint">This helps us show the right content and releases for your location.</p>
      <div class="selects">
        <BaseDropdown v-model="region" label="Region" :options="regionOptions" />
        <BaseDropdown v-model="language" label="Language" :options="languageOptions" />
      </div>
      <div class="toggle-row">
        <BaseToggle v-model="blurSpoilers" label="Blur spoilers by default" />
      </div>
    </section>

    <div class="actions">
      <BaseButton variant="text" @click="skip">Skip for now</BaseButton>
      <BaseButton @click="finish">→ Finish</BaseButton>
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