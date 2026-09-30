<template>
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
        Consultas
      </h1>
      <p class="text-sage-600 dark:text-gray-400 mt-1">
        Historial de transacciones aprobadas
      </p>
    </div>

    <UCard
      class="rounded-[1.75rem]"
      :ui="{ root: 'bg-white/70 dark:bg-carbon-900/70 backdrop-blur-xl ring-white/60 dark:ring-white/10 shadow-lg', body: 'p-0 sm:p-0' }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-list"
              class="w-5 h-5 text-primary"
            />
            <span class="font-semibold">Historial de Transacciones</span>
          </div>
          <UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="ghost"
            class="rounded-full"
            :loading="transactionsLoading"
            @click="loadTransactions"
          />
        </div>
      </template>

      <UTable
        :data="transactions"
        :columns="columns"
        :loading="transactionsLoading"
      >
        <template #status-cell="{ row }">
          <UBadge
            :color="getStatusColor(row.original.status)"
            variant="soft"
          >
            {{ getStatusLabel(row.original.status) }}
          </UBadge>
        </template>

        <template #amount-cell="{ row }">
          <span class="font-mono">${{ row.original.amount }}</span>
        </template>

        <template #timestamp-cell="{ row }">
          {{ formatDate(row.original.timestamp) }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role']
})

const { getTransactions, getStatusColor, getStatusLabel, formatDate } = useTransactions()
const { showTransactionError } = useErrorAlert()
const { showLoader, hideLoader } = useLoader()

const columns = [
  { accessorKey: 'referenceNumber', header: 'Referencia' },
  { accessorKey: 'approvalNumber', header: 'Aprobación' },
  { accessorKey: 'maskedCard', header: 'Tarjeta' },
  { accessorKey: 'customerName', header: 'Cliente' },
  { accessorKey: 'amount', header: 'Importe' },
  { accessorKey: 'status', header: 'Estado' },
  { accessorKey: 'timestamp', header: 'Fecha' }
]

const transactions = ref<Awaited<ReturnType<typeof getTransactions>>>([])
const transactionsLoading = ref(false)

async function loadTransactions() {
  transactionsLoading.value = true
  showLoader('Cargando transacciones...')
  try {
    transactions.value = await getTransactions()
  } catch (error) {
    showTransactionError(error, 'query')
  } finally {
    hideLoader()
    transactionsLoading.value = false
  }
}

onMounted(() => {
  loadTransactions()
})
</script>
