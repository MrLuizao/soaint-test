<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
        Devolución
      </h1>
      <p class="text-sage-600 dark:text-gray-400 mt-1">
        Procesa la devolución de una transacción
      </p>
    </div>

    <UCard
      class="rounded-[2rem]"
      :ui="{ root: 'bg-white/70 dark:bg-carbon-900/70 backdrop-blur-xl ring-white/60 dark:ring-white/10 shadow-lg', body: 'p-7' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
            <UIcon
              name="i-lucide-rotate-ccw"
              class="w-5 h-5 text-white"
            />
          </div>
          <div>
            <p class="font-semibold text-carbon-900 dark:text-white">
              Devolución
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-400">
              Ingresa la referencia y la tarjeta original
            </p>
          </div>
        </div>
      </template>

      <UForm
        :schema="refundSchema"
        :state="refundState"
        class="space-y-5"
        @submit="onRefundSubmit"
      >
        <UFormField
          label="Número de Referencia Financiera"
          name="referenceNumber"
          required
          hint="8 dígitos"
          :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
        >
          <UInput
            :model-value="refundState.referenceNumber"
            placeholder="12345678"
            icon="i-lucide-hash"
            size="xl"
            variant="subtle"
            class="w-full rounded-full"
            :ui="{ base: 'pl-12' }"
            maxlength="8"
            inputmode="numeric"
            @update:model-value="(val: string) => refundState.referenceNumber = formatReferenceNumber(val)"
            @keypress="onlyNumbers"
          />
        </UFormField>

        <UFormField
          label="Número de Tarjeta"
          name="cardNumber"
          required
          :hint="getCardHint(refundState.cardNumber)"
          :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
        >
          <UInput
            :model-value="refundState.cardNumber"
            placeholder="0000 0000 0000 0000"
            icon="i-lucide-credit-card"
            size="xl"
            variant="subtle"
            class="w-full rounded-full"
            :ui="{ base: 'pl-12' }"
            maxlength="19"
            inputmode="numeric"
            @update:model-value="(val: string) => refundState.cardNumber = formatCardNumber(val)"
            @keypress="onlyNumbers"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="xl"
          color="info"
          icon="i-lucide-rotate-ccw"
          class="rounded-full"
          :loading="refundLoading"
          :disabled="!isRefundFormValid"
        >
          Procesar Devolución
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

const { refundTransaction } = useTransactions()
const {
  onlyNumbers,
  formatCardNumber,
  formatReferenceNumber,
  getCardHint,
  isValidCard,
  isValidReference
} = useCardInput()
const { confirmRefund, maskCard } = useConfirmModal()
const { showTransactionError } = useErrorAlert()
const { showLoader, hideLoader } = useLoader()
const { showRefundSuccess } = useSuccessModal()

const refundSchema = z.object({
  referenceNumber: z.string()
    .min(1, 'Referencia requerida')
    .refine(val => isValidReference(val), 'Debe tener 8 dígitos'),
  cardNumber: z.string()
    .min(1, 'Tarjeta requerida')
    .refine(val => isValidCard(val), 'Debe tener 16 dígitos')
})

const refundState = reactive({
  referenceNumber: '',
  cardNumber: ''
})

const refundLoading = ref(false)

const isRefundFormValid = computed(() => {
  return isValidReference(refundState.referenceNumber) && isValidCard(refundState.cardNumber)
})

async function onRefundSubmit() {
  // Mostrar modal de confirmación
  const confirmed = await confirmRefund({
    referenceNumber: refundState.referenceNumber,
    maskedCard: maskCard(refundState.cardNumber)
  })

  if (!confirmed) return

  refundLoading.value = true
  showLoader('Procesando devolución...')
  try {
    const response = await refundTransaction({
      referenceNumber: refundState.referenceNumber,
      cardNumber: refundState.cardNumber.replace(/\s/g, '')
    })

    // Limpiar formulario
    refundState.referenceNumber = ''
    refundState.cardNumber = ''

    // Mostrar modal de éxito
    showRefundSuccess({
      approvalNumber: response.data.approvalNumber,
      referenceNumber: response.data.referenceNumber,
      maskedCard: response.data.maskedCard
    })
  } catch (error) {
    showTransactionError(error, 'refund')
  } finally {
    hideLoader()
    refundLoading.value = false
  }
}
</script>
