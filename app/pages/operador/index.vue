<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role']
})

await navigateTo('/operador/venta', { replace: true })
</script>
