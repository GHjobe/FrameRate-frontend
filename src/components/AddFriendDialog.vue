<script setup>
import { ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const props = defineProps({
  open: Boolean,
  error: { type: String, default: '' },
  busy: Boolean,
})
const emit = defineEmits(['close', 'submit'])

const dialog = ref(null)
const name = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      name.value = ''
      dialog.value?.showModal()
    } else if (dialog.value?.open) {
      dialog.value.close()
    }
  },
)

function onSubmit() {
  if (props.busy) return
  emit('submit', name.value)
}
</script>

<template>
  <dialog
    ref="dialog"
    class="dialog"
    aria-labelledby="add-friend-title"
    @close="emit('close')"
    @click.self="emit('close')"
  >
    <form class="dialog__content" @submit.prevent="onSubmit">
      <h2 id="add-friend-title" class="dialog__title">Add friend</h2>

      <BaseInput v-model="name" label="Friend's username" :error="error" />

      <div class="dialog__actions">
        <BaseButton type="button" variant="secondary" @click="emit('close')">Cancel</BaseButton>
        <BaseButton type="submit" :disabled="busy">{{ busy ? 'Adding…' : 'Add friend' }}</BaseButton>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.dialog {
  width: min(420px, calc(100vw - 2 * var(--space-6)));
  padding: 0;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.dialog::backdrop { background: rgba(0, 0, 0, 0.6); }

.dialog__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-6);
}
.dialog__title { font-family: var(--font-body); font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-2); }
.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
</style>