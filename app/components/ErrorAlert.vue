<template>
  <Teleport to="body">
    <div class="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
      >
        <UAlert
          v-if="errorState.isVisible"
          color="error"
          variant="solid"
          icon="i-lucide-circle-alert"
          :title="errorState.title"
          :description="alertDescription"
          close
          close-icon="i-lucide-x"
          class="pointer-events-auto w-full max-w-md shadow-2xl"
          @update:open="closeError"
        />
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { errorState, closeError } = useErrorAlert()

const alertDescription = computed(() => {
  if (errorState.details) {
    return `${errorState.message} — ${errorState.details}`
  }
  return errorState.message
})
</script>
