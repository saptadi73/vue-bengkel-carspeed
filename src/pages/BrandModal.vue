<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[1000] flex items-center justify-center"
        @keydown.esc.prevent="handleCancel"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          :aria-hidden="true"
          @click="closeOnBackdrop ? handleCancel() : null"
        />

        <!-- Dialog -->
        <transition name="scale">
          <div
            ref="dialogRef"
            v-show="isOpen"
            class="relative w-full rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
            :style="{ maxWidth, width: 'calc(100% - 2rem)' }"
            role="dialog"
            :aria-labelledby="titleId"
            aria-modal="true"
            @click.stop
          >
            <!-- Header -->
            <div class="px-6 pt-6">
              <h2 :id="titleId" class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h2>
              <p v-if="description" class="mt-1 text-sm text-gray-600">
                {{ description }}
              </p>
            </div>

            <!-- Body (input default) -->
            <div class="px-6 pt-4 pb-2">
              <slot name="body">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  {{ inputLabel }}
                </label>
                <input
                  ref="inputRef"
                  type="text"
                  class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  :placeholder="inputPlaceholder"
                  v-model="textValue"
                  @keyup.enter="handleOk"
                />
                <p v-if="helpText" class="mt-1 text-xs text-gray-500">
                  {{ helpText }}
                </p>
              </slot>
            </div>

            <!-- Footer -->
            <div class="px-6 pb-6 pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @click="handleCancel"
                ref="cancelBtnRef"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                :disabled="okDisabled"
                @click="handleOk"
                ref="okBtnRef"
              >
                {{ okText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'

// v-models (classic): v-model:open, v-model:text
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  okText: { type: String, default: 'OK' },
  cancelText: { type: String, default: 'Cancel' },
  okDisabled: { type: Boolean, default: false },
  inputLabel: { type: String, default: 'Input' },
  inputPlaceholder: { type: String, default: 'Type here…' },
  helpText: { type: String, default: '' },
  autofocus: { type: String, default: 'input' }, // 'input' | 'ok' | 'cancel'
  maxWidth: { type: String, default: '32rem' },
  closeOnBackdrop: { type: Boolean, default: true },
  idSuffix: { type: String, default: 'base' },
  // v-model props
  open: { type: Boolean, default: false },
  text: { type: String, default: '' },
})

const emit = defineEmits(['ok', 'cancel', 'update:open', 'update:text', 'open-change'])

const isOpen = computed({
  get: () => props.open,
  set: (v) => {
    emit('update:open', v)
    emit('open-change', v)
  },
})

const textValue = computed({
  get: () => props.text,
  set: (v) => emit('update:text', v),
})

const okText = computed(() => props.okText)
const cancelText = computed(() => props.cancelText)
const maxWidth = computed(() => props.maxWidth)
const inputLabel = computed(() => props.inputLabel)
const inputPlaceholder = computed(() => props.inputPlaceholder)
const helpText = computed(() => props.helpText)
const okDisabled = computed(() => props.okDisabled)
const closeOnBackdrop = computed(() => props.closeOnBackdrop)

const titleId = `modal-title-${props.idSuffix}`

const dialogRef = ref(null)
const inputRef = ref(null)
const okBtnRef = ref(null)
const cancelBtnRef = ref(null)

let lastFocusedEl = null

function trapFocus() {
  if (!isOpen.value || !dialogRef.value) return
  const focusable = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return
  if (!dialogRef.value.contains(document.activeElement)) {
    focusable[0].focus()
  }
}

function handleOk() {
  emit('ok', textValue.value)
  isOpen.value = false
}

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}

watch(
  () => isOpen.value,
  (open) => {
    if (open) {
      lastFocusedEl = document.activeElement
      // autofocus target
      queueMicrotask(() => {
        if (props.autofocus === 'ok') okBtnRef.value && okBtnRef.value.focus()
        else if (props.autofocus === 'cancel')
          cancelBtnRef.value && cancelBtnRef.value.focus()
        else inputRef.value && inputRef.value.focus()
      })
      document.addEventListener('focus', trapFocus, true)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('focus', trapFocus, true)
      document.body.style.overflow = ''
      if (lastFocusedEl && lastFocusedEl.focus) {
        lastFocusedEl.focus()
        lastFocusedEl = null
      }
    }
  },
  { immediate: false },
)

onMounted(() => {
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
    queueMicrotask(() => inputRef.value && inputRef.value.focus())
    document.addEventListener('focus', trapFocus, true)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('focus', trapFocus, true)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition:
    transform 160ms ease,
    opacity 160ms ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.98);
}
</style>
