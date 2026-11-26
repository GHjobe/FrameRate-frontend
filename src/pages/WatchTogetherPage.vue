<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getParty, getCompatibility, getRecommendations, addFriend, addToGroupQueue } from '@/api/party'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import AddFriendDialog from '@/components/AddFriendDialog.vue'
import BaseAvatar from '@/components/BaseAvatar.vue'
import BaseButton from '@/components/BaseButton.vue'
import CompatibilityGauge from '@/components/CompatibilityGauge.vue'
import GroupMovieRow from '@/components/GroupMovieRow.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const state = ref('loading') 
const members = ref([])
const compatibility = ref({ percent: null, shared: 0 })
const recommendations = ref([])

const addOpen = ref(false)
const addError = ref('')
const adding = ref(false)

async function fetchAll() {
  const username = auth.user.username
  const [party, compat, recs] = await Promise.all([
    getParty(username),
    getCompatibility(username),
    getRecommendations(username),
  ])
  members.value = party
  compatibility.value = compat
  recommendations.value = recs
}

async function load() {
  if (!auth.isLoggedIn) {
    state.value = 'loggedOut'
    return
  }
  state.value = 'loading'
  try {
    await fetchAll()
    state.value = 'ready'
  } catch {
    state.value = 'error'
  }
}

function openAdd() {
  addError.value = ''
  addOpen.value = true
}

async function handleAddFriend(name) {
  adding.value = true
  addError.value = ''
  try {
    const friend = await addFriend(name)
    await fetchAll()
    addOpen.value = false
    toast.show(`${friend.username} added to your party`)
  } catch (e) {
    addError.value = e.message
  } finally {
    adding.value = false
  }
}

async function handleQueue(movie) {
  try {
    await addToGroupQueue(movie.id)
    recommendations.value = await getRecommendations(auth.user.username)
    toast.show(`${movie.title} added to the group queue`)
  } catch {
    toast.show('Could not add to the group queue', 'error')
  }
}

const goToLogin = () => router.push({ name: 'login' })

watch(() => auth.isLoggedIn, load, { immediate: true })
</script>

<template>
  <main class="container watch-together">
    <h1>Activity &amp; Settings</h1>

    <div v-if="state === 'loggedOut'" class="watch-together__status">
      <p>Log in to use Watch Together.</p>
      <BaseButton @click="goToLogin">Log in</BaseButton>
    </div>

    <template v-else-if="state === 'loading'">
      <div class="watch-together__top">
        <SkeletonLoader height="180px" radius="var(--radius-md)" />
        <SkeletonLoader height="180px" radius="var(--radius-md)" />
      </div>
      <SkeletonLoader v-for="n in 3" :key="n" height="130px" radius="var(--radius-md)" />
    </template>

    <div v-else-if="state === 'error'" class="watch-together__status">
      <p>Could not load Watch Together.</p>
      <BaseButton @click="load">Try again</BaseButton>
    </div>

    <template v-else>
      <div class="watch-together__top">
        <section class="watch-together__box" aria-labelledby="party-title">
          <h2 id="party-title" class="section-title">Party Members</h2>
          <ul class="party__list">
            <li v-for="m in members" :key="m.username" class="party__member">
              <BaseAvatar :name="m.username" :size="88" />
              <span class="party__name">{{ m.isYou ? 'You' : m.username }}</span>
            </li>
            <li class="party__member">
              <button type="button" class="party__add" aria-label="Add friend" @click="openAdd">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <span class="party__name">Add friend</span>
            </li>
          </ul>
        </section>

        <section class="watch-together__box watch-together__box--gauge" aria-label="Compatibility">
          <CompatibilityGauge :percent="compatibility.percent" :shared="compatibility.shared" />
        </section>
      </div>

      <section class="recs" aria-labelledby="recs-title">
        <h2 id="recs-title" class="section-title section-title--strong">Highly Recommended Movies</h2>
        <p class="recs__subtitle">Based on shared ratings</p>
        <ol class="recs__list">
          <GroupMovieRow
            v-for="entry in recommendations"
            :key="entry.movie.id"
            :entry="entry"
            @add="handleQueue"
          />
        </ol>
      </section>

      <AddFriendDialog :open="addOpen" :error="addError" :busy="adding" @close="addOpen = false" @submit="handleAddFriend" />
    </template>
  </main>
</template>

<style scoped>
.watch-together {
  padding-top: var(--space-8);
  padding-bottom: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.watch-together__status {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  color: var(--color-text-muted);
}

.watch-together__top {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: var(--space-6);
}

.watch-together__box {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.watch-together__box--gauge {
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 500;
}
.section-title--strong { font-weight: 600; }

.party__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-3);
}
.party__member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  width: 88px;
}
.party__name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.party__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-bg);
}
.party__add:hover { background: var(--color-primary-hover); }

.recs__subtitle { color: var(--color-text-muted); font-size: var(--text-sm); margin-top: var(--space-1); }
.recs__list {
  margin-top: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
</style>