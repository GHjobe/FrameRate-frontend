<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, default: null },
  shared: { type: Number, default: 0 },
})

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const hasScore = computed(() => props.percent !== null)
const clamped = computed(() => Math.min(100, Math.max(0, props.percent ?? 0)))
const dashOffset = computed(() => CIRCUMFERENCE * (1 - clamped.value / 100))
const label = computed(() =>
  hasScore.value ? `Compatibility ${clamped.value} percent` : 'Compatibility not available',
)
</script>

<template>
  <div class="gauge">
    <div class="gauge__ring" role="img" :aria-label="label">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="gauge__track" cx="60" cy="60" :r="RADIUS" />
        <circle
          v-if="hasScore"
          class="gauge__progress"
          cx="60"
          cy="60"
          :r="RADIUS"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div class="gauge__center" aria-hidden="true">
        <span class="gauge__label">COMPATIBILITY</span>
        <span class="gauge__percent">{{ hasScore ? `${clamped}%` : '—' }}</span>
      </div>
    </div>

    <div class="gauge__divider" />

    <div class="gauge__shared">
      <span class="gauge__dash" aria-hidden="true" />
      <span class="gauge__count">{{ shared }}</span>
      <span class="gauge__shared-label">Shared Rated Movies</span>
    </div>
  </div>
</template>

<style scoped>
.gauge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
}

.gauge__ring {
  position: relative;
  width: 150px;
  height: 150px;
  flex: none;
}
.gauge__ring svg { width: 100%; height: 100%; }
.gauge__track,
.gauge__progress {
  fill: none;
  stroke-width: 6;
}
.gauge__track { stroke: var(--color-surface-hover); }
.gauge__progress {
  stroke: var(--color-primary);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.4s ease;
}
@media (prefers-reduced-motion: reduce) {
  .gauge__progress { transition: none; }
}

.gauge__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
}
.gauge__label {
  color: var(--color-primary);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
}
.gauge__percent {
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: 1;
}

.gauge__divider {
  align-self: stretch;
  width: 1px;
  background: var(--color-border);
}

.gauge__shared {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
}
.gauge__dash {
  width: 16px;
  height: 2px;
  background: var(--color-primary);
}
.gauge__count {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1;
}
.gauge__shared-label {
  max-width: 6rem;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}
</style>