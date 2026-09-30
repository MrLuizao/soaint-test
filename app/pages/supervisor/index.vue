<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role']
})

await navigateTo('/supervisor/cancelacion', { replace: true })
</script>
