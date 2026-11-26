<script setup>
import { computed, onMounted, ref } from 'vue'
import { getForYou } from '@/api/movies'
import { getWatchlist, addToWatchlist } from '@/api/watchlist'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import BaseButton from '@/components/BaseButton.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const auth = useAuthStore()
const toast = useToastStore()

const state = ref('loading') // loading | ready | error
const movies = ref([])
const watchlist = ref([])

const featured = computed(() => movies.value.slice(0, 2))
const gridMovies = computed(() => movies.value.slice(2))
const inWatchlist = (m) => watchlist.value.some((w) => w.movieId === m.id)
const meta = (m) => `${m.year} • ${m.genres.join(', ')}`
const rank = (i) => String(i + 1).padStart(2, '0')

// Copy items so Vue sees changes made to the mock array by the API layer.
const refreshWatchlist = async () => {
  const list = auth.isLoggedIn ? await getWatchlist() : []
  watchlist.value = (list ?? []).map((item) => ({ ...item }))
}

async function load() {
  state.value = 'loading'
  try {
    const [recs] = await Promise.all([getForYou(), refreshWatchlist()])
    movies.value = recs ?? []
    state.value = 'ready'
  } catch {
    state.value = 'error'
  }
}

async function handleAdd(movie) {
  if (!auth.isLoggedIn) {
    toast.show('Log in to add movies to your watchlist', 'error')
    return
  }
  if (inWatchlist(movie)) {
    toast.show(`${movie.title} is already in your watchlist`)
    return
  }
  try {
    await addToWatchlist(movie.id)
    await refreshWatchlist()
    toast.show(`${movie.title} added to your watchlist`)
  } catch {
    toast.show('Could not update your watchlist', 'error')
  }
}

onMounted(load)
</script>

<template>
  <main class="container for-you">
    <header class="for-you__header">
      <h1>For you</h1>
      <p class="for-you__subtitle">Created recommendations based on your unique taste and rating history</p>
    </header>

    <template v-if="state === 'loading'">
      <div class="for-you__featured">
        <SkeletonLoader v-for="n in 2" :key="n" height="176px" radius="var(--radius-md)" />
      </div>
      <div class="for-you__grid">
        <SkeletonLoader v-for="n in 4" :key="n" height="150px" radius="var(--radius-md)" />
      </div>
    </template>

    <div v-else-if="state === 'error'" class="for-you__status">
      <p>Could not load your recommendations.</p>
      <BaseButton @click="load">Try again</BaseButton>
    </div>

    <p v-else-if="!movies.length" class="for-you__status">No recommendations yet.</p>

    <template v-else>
      <section class="for-you__featured" aria-label="Top picks">
        <article v-for="m in featured" :key="m.id" class="rec rec--featured">
          <RouterLink :to="`/movie/${m.id}`" class="rec__poster">
            <img :src="m.poster" :alt="`${m.title} poster`" />
          </RouterLink>
          <div class="rec__body">
            <p class="rec__reason">{{ m.reason }}</p>
            <h2 class="rec__title">
              <RouterLink :to="`/movie/${m.id}`">{{ m.title }}</RouterLink>
            </h2>
            <p class="rec__meta">{{ meta(m) }}</p>
            <p class="rec__match">★ {{ m.match }}% Match</p>
            <BaseButton class="rec__add" variant="secondary" :disabled="inWatchlist(m)" @click="handleAdd(m)">
              {{ inWatchlist(m) ? 'In watchlist' : '+ Add to watchlist' }}
            </BaseButton>
          </div>
        </article>
      </section>

      <section class="for-you__grid" aria-label="More recommendations">
        <article v-for="(m, i) in gridMovies" :key="m.id" class="rec">
          <RouterLink :to="`/movie/${m.id}`" class="rec__poster">
            <img :src="m.poster" :alt="`${m.title} poster`" />
          </RouterLink>
          <div class="rec__body">
            <p class="rec__reason">{{ m.reason }}</p>
            <p class="rec__rank">{{ rank(i) }}</p>
            <h3 class="rec__title">
              <RouterLink :to="`/movie/${m.id}`">{{ m.title }}</RouterLink>
            </h3>
            <p class="rec__meta">{{ meta(m) }}</p>
            <p class="rec__match">★ {{ m.match }}% Match</p>
            <BaseButton class="rec__add" variant="secondary" :disabled="inWatchlist(m)" @click="handleAdd(m)">
              {{ inWatchlist(m) ? 'In watchlist' : '+ Add to watchlist' }}
            </BaseButton>
          </div>
        </article>
      </section>
    </template>
  </main>
</template>

<style scoped>
.for-you { padding-top: var(--space-8); padding-bottom: var(--space-8); }
.for-you__header { margin-bottom: var(--space-6); }
.for-you__subtitle { color: var(--color-text-muted); font-size: var(--text-sm); margin-top: var(--space-1); }
.for-you__status { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-4); color: var(--color-text-muted); }

.for-you__featured {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}
.for-you__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-6);
}

/* Card: poster flush on the left, details on the right */
.rec {
  display: flex;
  min-height: 150px;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.rec--featured { min-height: 176px; }

.rec__poster { position: relative; flex: 0 0 102px; }
.rec--featured .rec__poster { flex-basis: 128px; }
.rec__poster img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rec__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-4);
}

.rec__reason {
  max-width: 100%;
  padding: 2px var(--space-2);
  background: var(--color-bg);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rec:not(.rec--featured) .rec__reason { align-self: stretch; }

.rec__rank { color: var(--color-text-muted); font-size: 0.75rem; }

.rec__title { font-family: var(--font-body); font-size: var(--text-md); font-weight: 700; }
.rec--featured .rec__title { font-size: var(--text-lg); }

.rec__meta { color: var(--color-text-muted); font-size: 0.75rem; }
.rec__match { color: var(--color-primary); font-size: 0.75rem; font-weight: 600; }

.rec .rec__add {
  margin-top: auto;
  padding: var(--space-1) var(--space-4);
  min-height: 0;
  font-size: 0.75rem;
}
</style>