<script setup>
import { computed } from 'vue'
import BaseAvatar from '@/components/BaseAvatar.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  entry: { type: Object, required: true },
})
defineEmits(['add'])

const meta = computed(() => [props.entry.movie.year, ...props.entry.movie.genres].join(' · '))
const who = (m) => (m.isYou ? 'You' : m.username)
</script>

<template>
  <li class="row">
    <span class="row__rank">{{ entry.rank }}</span>

    <RouterLink :to="`/movie/${entry.movie.id}`" class="row__poster">
      <img :src="entry.movie.poster" :alt="`${entry.movie.title} poster`" loading="lazy" />
    </RouterLink>

    <div class="row__body">
      <h3 class="row__title">
        <RouterLink :to="`/movie/${entry.movie.id}`">{{ entry.movie.title }}</RouterLink>
      </h3>
      <p class="row__meta">{{ meta }}</p>
      <p class="row__synopsis">{{ entry.movie.synopsis }}</p>
    </div>

    <ul class="row__members" aria-label="Match for each member">
      <li
        v-for="m in entry.matches"
        :key="m.username"
        class="member"
        :title="`${who(m)}: ${m.percent}% match`"
      >
        <BaseAvatar :name="m.username" :size="52" />
        <span class="member__percent">{{ m.percent }}%</span>
      </li>
    </ul>

    <BaseButton class="row__add" variant="secondary" :disabled="entry.inQueue" @click="$emit('add', entry.movie)">
      {{ entry.inQueue ? 'In Group Queue' : '+ Add to Group Queue' }}
    </BaseButton>
  </li>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 64px 82px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-3) var(--space-6) var(--space-3) 0;
}
.row + .row { border-top: 1px solid var(--color-border); }

.row__rank {
  text-align: center;
  font-size: var(--text-lg);
}

.row__poster img {
  width: 82px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.row__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}
.row__title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 700;
}
.row__title a:hover {
  text-decoration: underline;
  text-decoration-color: var(--color-nav-active);
  text-underline-offset: 4px;
}
.row__meta { color: var(--color-text-muted); font-size: var(--text-sm); }
.row__synopsis {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.row__members {
  display: flex;
  gap: var(--space-2);
}
.member {
  position: relative;
  padding-bottom: var(--space-2);
}
.member__percent {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding: 0 6px;
  background: var(--color-primary);
  color: var(--color-bg);
  border-radius: var(--radius-pill);
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1.4;
}

.row .row__add {
  border-color: var(--color-primary);
  color: var(--color-primary);
  white-space: nowrap;
}
.row .row__add:disabled {
  border-color: var(--color-border);
  color: var(--color-text-muted);
}
</style>