<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
        Cancelación
      </h1>
      <p class="text-sage-600 dark:text-gray-400 mt-1">
        Cancela una transacción existente
      </p>
    </div>

    <UCard
      class="rounded-[2rem]"
      :ui="{ root: 'bg-white/70 dark:bg-carbon-900/70 backdrop-blur-xl ring-white/60 dark:ring-white/10 shadow-lg', body: 'p-7' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-posyellow-400 flex items-center justify-center">
            <UIcon
              name="i-lucide-x-circle"
              class="w-5 h-5 text-carbon-900"
            />
          </div>
          <div>
            <p class="font-semibold text-carbon-900 dark:text-white">
              Cancelar Transacción
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-400">
              Ingresa la referencia y la tarjeta original
            </p>
          </div>
        </div>
      </template>

      <UForm
        :schema="cancelSchema"
        :state="cancelState"
        class="space-y-5"
        @submit="onCancelSubmit"
      >
        <UFormField
          label="Número de Referencia Financiera"
          name="referenceNumber"
          required
          hint="8 dígitos"
          :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
        >
          <UInput
            :model-value="cancelState.referenceNumber"
            placeholder="12345678"
            icon="i-lucide-hash"
            size="xl"
            variant="subtle"
            class="w-full rounded-full"
            :ui="{ base: 'pl-12' }"
            maxlength="8"
            inputmode="numeric"
            @update:model-value="(val: string) => cancelState.referenceNumber = formatReferenceNumber(val)"
            @keypress="onlyNumbers"
          />
        </UFormField>

        <UFormField
          label="Número de Tarjeta"
          name="cardNumber"
          required
          :hint="getCardHint(cancelState.cardNumber)"
          :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
        >
          <UInput
            :model-value="cancelState.cardNumber"
            placeholder="0000 0000 0000 0000"
            icon="i-lucide-credit-card"
            size="xl"
            variant="subtle"
            class="w-full rounded-full"
            :ui="{ base: 'pl-12' }"
            maxlength="19"
            inputmode="numeric"
            @update:model-value="(val: string) => cancelState.cardNumber = formatCardNumber(val)"
            @keypress="onlyNumbers"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="xl"
          color="warning"
          icon="i-lucide-x-circle"
          class="rounded-full"
          :loading="cancelLoading"
          :disabled="!isCancelFormValid"
        >
          Procesar Cancelación
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  middleware: ['auth', 'role']
})

const { cancelTransaction } = useTransactions()
const {
  onlyNumbers,
  formatCardNumber,
  formatReferenceNumber,
  getCardHint,
  isValidCard,
  isValidReference
} = useCardInput()
const { confirmCancel, maskCard } = useConfirmModal()
const { showTransactionError } = useErrorAlert()
const { showLoader, hideLoader } = useLoader()
const { showCancelSuccess } = useSuccessModal()

const cancelSchema = z.object({
  referenceNumber: z.string()
    .min(1, 'Referencia requerida')
    .refine(val => isValidReference(val), 'Debe tener 8 dígitos'),
  cardNumber: z.string()
    .min(1, 'Tarjeta requerida')
    .refine(val => isValidCard(val), 'Debe tener 16 dígitos')
})

const cancelState = reactive({
  referenceNumber: '',
  cardNumber: ''
})

const cancelLoading = ref(false)

const isCancelFormValid = computed(() => {
  return isValidReference(cancelState.referenceNumber) && isValidCard(cancelState.cardNumber)
})

async function onCancelSubmit() {
  // Mostrar modal de confirmación
  const confirmed = await confirmCancel({
    referenceNumber: cancelState.referenceNumber,
    maskedCard: maskCard(cancelState.cardNumber)
  })

  if (!confirmed) return

  cancelLoading.value = true
  showLoader('Procesando cancelación...')
  try {
    const response = await cancelTransaction({
      referenceNumber: cancelState.referenceNumber,
      cardNumber: cancelState.cardNumber.replace(/\s/g, '')
    })

    // Limpiar formulario
    cancelState.referenceNumber = ''
    cancelState.cardNumber = ''

    // Mostrar modal de éxito
    showCancelSuccess({
      approvalNumber: response.data.approvalNumber,
      referenceNumber: response.data.referenceNumber,
      maskedCard: response.data.maskedCard
    })
  } catch (error) {
    showTransactionError(error, 'cancel')
  } finally {
    hideLoader()
    cancelLoading.value = false
  }
}
</script>
