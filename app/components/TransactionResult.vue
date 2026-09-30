<template>
  <UCard :ui="{ root: 'border-2 border-success-500 dark:border-success-400' }">
    <template #header>
      <div class="flex items-center gap-2 text-success-600 dark:text-success-400">
        <UIcon
          name="i-lucide-check-circle"
          class="w-6 h-6"
        />
        <span class="font-semibold">{{ result.message }}</span>
      </div>
    </template>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Número de Aprobación
        </p>
        <p class="font-mono font-semibold text-lg">
          {{ result.data.approvalNumber }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Referencia Financiera
        </p>
        <p class="font-mono font-semibold text-lg">
          {{ result.data.referenceNumber }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Tarjeta
        </p>
        <p class="font-mono font-semibold text-lg">
          {{ result.data.maskedCard }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Estado
        </p>
        <UBadge
          :color="getStatusColor(result.data.status)"
          variant="soft"
          size="lg"
        >
          {{ getStatusLabel(result.data.status) }}
        </UBadge>
      </div>
      <div v-if="result.data.amount">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Importe
        </p>
        <p class="font-mono font-semibold text-lg">
          ${{ result.data.amount }}
        </p>
      </div>
      <div v-if="result.data.customerName">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Cliente
        </p>
        <p class="font-semibold">
          {{ result.data.customerName }}
        </p>
      </div>
      <div v-if="result.data.originalReference">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Referencia Original
        </p>
        <p class="font-mono font-semibold text-lg">
          {{ result.data.originalReference }}
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  result: {
    success: boolean
    message: string
    data: {
      approvalNumber: string
      referenceNumber: string
      maskedCard: string
      status: string
      amount?: string
      customerName?: string
      originalReference?: string
    }
  }
}>()

const { getStatusColor, getStatusLabel } = useTransactions()
</script>
