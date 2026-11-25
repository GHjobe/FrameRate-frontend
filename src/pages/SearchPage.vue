<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { getPopular, searchMovies } from '@/api/movies'
import MovieCard from '@/components/MovieCard.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const query = ref(String(route.query.q || ''))
const popular = ref([])
const results = ref([])
const loading = ref(true)

let debounceTimer = null
let requestId = 0

async function runSearch() {
  const q = query.value.trim()
  const id = ++requestId
  loading.value = true
  const data = q ? await searchMovies(q) : []
  if (id !== requestId) return // a newer search already started
  results.value = data
  loading.value = false
}

// Typing: wait a moment, update the URL, then search
watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const q = value.trim()
    router.replace({ name: 'search', query: q ? { q } : {} })
    runSearch()
  }, 250)
})

// The navbar search bar changes the URL, so keep the page in sync
watch(
  () => route.query.q,
  (value) => {
    const next = String(value || '')
    if (next !== query.value) query.value = next
  },
)

function clearQuery() {
  query.value = ''
}

function addToWatchlist(movie) {
  if (!auth.isLoggedIn) {
    router.push({ name: 'login' })
    return
  }
  toast.show(`Added “${movie.title}” to your watchlist`)
}

onMounted(async () => {
  popular.value = await getPopular()
  if (query.value.trim()) await runSearch()
  else loading.value = false
})
onBeforeUnmount(() => clearTimeout(debounceTimer))
</script>

<template>
  <main class="container search-page">
    <form class="bar" role="search" @submit.prevent="runSearch">
      <svg class="bar__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
      <input
        v-model="query"
        type="text"
        class="bar__input"
        placeholder="Search for movies & more"
        aria-label="Search for movies"
        autofocus
      />
      <button v-if="query" type="button" class="bar__clear" aria-label="Clear search" @click="clearQuery">×</button>
    </form>

    <!-- Results -->
    <section v-if="query.trim()" class="block">
      <h2 class="block__title">
        Results for “{{ query.trim() }}”
        <span v-if="!loading" class="block__count">({{ results.length }})</span>
      </h2>
      <div v-if="loading" class="grid">
        <SkeletonLoader v-for="n in 5" :key="n" width="180px" height="320px" />
      </div>
      <div v-else-if="results.length" class="grid">
        <MovieCard v-for="m in results" :key="m.id" :movie="m" @add="addToWatchlist" />
      </div>
      <p v-else class="empty">No movies found. Try a different title.</p>
    </section>

    <!-- Popular searches -->
    <section v-else class="block">
      <h2 class="block__title">Popular Searches</h2>
      <div v-if="loading" class="grid">
        <SkeletonLoader v-for="n in 5" :key="n" width="180px" height="320px" />
      </div>
      <div v-else class="grid">
        <MovieCard v-for="m in popular" :key="m.id" :movie="m" @add="addToWatchlist" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.search-page { padding-top: var(--space-8); padding-bottom: var(--space-8); }

.bar {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 640px;
  margin: 0 auto var(--space-8);
}
.bar__icon { position: absolute; left: var(--space-4); color: var(--color-text-muted); pointer-events: none; }
.bar__input {
  width: 100%;
  padding: 14px 48px 14px 52px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text);
  font-size: var(--text-md);
  transition: border-color 0.15s;
}
.bar__input::placeholder { color: var(--color-text-muted); }
.bar__input:hover { border-color: var(--color-text-muted); }
.bar__input:focus-visible { border-color: var(--color-nav-active); outline: none; box-shadow: 0 0 0 2px var(--color-nav-active); }
.bar__clear {
  position: absolute;
  right: var(--space-4);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--color-text-muted);
  font-size: 22px;
  line-height: 1;
}
.bar__clear:hover { color: var(--color-text); background: var(--color-surface-hover); }

.block__title { font-family: var(--font-body); font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-4); }
.block__count { color: var(--color-text-muted); font-weight: 400; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, 180px); gap: var(--space-6) var(--space-4); }
.empty { color: var(--color-text-muted); padding: var(--space-8) 0; text-align: center; }
</style>