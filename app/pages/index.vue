<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <UIcon
      name="i-lucide-loader-2"
      class="w-8 h-8 animate-spin text-primary"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { isAuthenticated, initAuth } = useAuth()

onMounted(() => {
  initAuth()

  if (!isAuthenticated.value) {
    navigateTo('/login')
    return
  }

  // Redirigir a la vista Main
  navigateTo('/main')
})
</script>
