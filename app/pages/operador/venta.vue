<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-carbon-900 dark:text-white tracking-tight">
        Nueva Venta
      </h1>
      <p class="text-sage-600 dark:text-gray-400 mt-1">
        Procesa una venta con tarjeta de crédito o débito
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
              name="i-lucide-shopping-cart"
              class="w-5 h-5 text-white"
            />
          </div>
          <div>
            <p class="font-semibold text-carbon-900 dark:text-white">
              Datos de la Venta
            </p>
            <p class="text-xs text-sage-600 dark:text-gray-400">
              La información de la tarjeta se cifra con AES
            </p>
          </div>
        </div>
      </template>

      <UForm
        :schema="saleSchema"
        :state="saleState"
        class="space-y-5"
        @submit="onSaleSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormField
            label="Importe"
            name="amount"
            required
            :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
          >
            <UInputNumber
              v-model="saleState.amount"
              :min="0.01"
              :step="0.01"
              placeholder="0.00"
              icon="i-lucide-dollar-sign"
              size="xl"
              variant="subtle"
              :format-options="{ style: 'currency', currency: 'MXN' }"
              class="w-full rounded-full"
              :ui="{ base: 'pl-12' }"
            />
          </UFormField>

          <UFormField
            label="Nombre del Cliente"
            name="customerName"
            required
            :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
          >
            <UInput
              v-model="saleState.customerName"
              placeholder="Nombre completo"
              icon="i-lucide-user"
              size="xl"
              variant="subtle"
              class="w-full rounded-full"
              :ui="{ base: 'pl-12' }"
            />
          </UFormField>
        </div>

        <UDivider
          label="Datos de Tarjeta"
          icon="i-lucide-credit-card"
        />

        <UFormField
          label="Número de Tarjeta"
          name="cardNumber"
          required
          :hint="getCardHint(saleState.cardNumber)"
          :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
        >
          <UInput
            :model-value="saleState.cardNumber"
            placeholder="0000 0000 0000 0000"
            icon="i-lucide-credit-card"
            size="xl"
            variant="subtle"
            class="w-full rounded-full"
            :ui="{ base: 'pl-12' }"
            maxlength="19"
            inputmode="numeric"
            autocomplete="cc-number"
            @update:model-value="(val: string) => saleState.cardNumber = formatCardNumber(val)"
            @keypress="onlyNumbers"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-5">
          <UFormField
            label="Fecha de Expiración"
            name="expirationDate"
            required
            :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
          >
            <UInput
              :model-value="saleState.expirationDate"
              placeholder="MM/AA"
              icon="i-lucide-calendar"
              size="xl"
              variant="subtle"
              class="w-full rounded-full"
              :ui="{ base: 'pl-12' }"
              maxlength="5"
              inputmode="numeric"
              autocomplete="cc-exp"
              @update:model-value="(val: string) => saleState.expirationDate = formatExpirationDate(val)"
              @keypress="onlyNumbersOrSlash"
            />
          </UFormField>

          <UFormField
            label="CVV"
            name="cvv"
            required
            hint="3 dígitos"
            :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-gray-400' }"
          >
            <UInput
              :model-value="saleState.cvv"
              type="password"
              placeholder="•••"
              icon="i-lucide-lock"
              size="xl"
              variant="subtle"
              class="w-full rounded-full"
              :ui="{ base: 'pl-12' }"
              maxlength="3"
              inputmode="numeric"
              autocomplete="cc-csc"
              @update:model-value="(val: string) => saleState.cvv = formatCvv(val)"
              @keypress="onlyNumbers"
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          block
          size="xl"
          icon="i-lucide-check"
          class="rounded-full"
          :loading="saleLoading"
          :disabled="!isFormValid"
        >
          Procesar Venta
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

const { processSale } = useTransactions()
const {
  onlyNumbers,
  onlyNumbersOrSlash,
  formatCardNumber,
  formatExpirationDate,
  formatCvv,
  getCardHint,
  isValidCard,
  isValidExpiration,
  isValidCvv
} = useCardInput()
const { confirmSale, maskCard } = useConfirmModal()
const { showTransactionError } = useErrorAlert()
const { showLoader, hideLoader } = useLoader()
const { showSaleSuccess } = useSuccessModal()

// Validación con Zod
const saleSchema = z.object({
  amount: z.number({ error: issue => issue.input === undefined ? 'Importe requerido' : 'Debe ser un número' })
    .min(0.01, 'El importe debe ser mayor a $0.00'),
  customerName: z.string()
    .min(1, 'Nombre requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  cardNumber: z.string()
    .min(1, 'Número de tarjeta requerido')
    .refine(val => isValidCard(val), 'Debe tener 16 dígitos'),
  expirationDate: z.string()
    .min(1, 'Fecha requerida')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato inválido (MM/AA)')
    .refine(val => isValidExpiration(val), 'La tarjeta está expirada'),
  cvv: z.string()
    .min(1, 'CVV requerido')
    .refine(val => isValidCvv(val), 'El CVV debe tener 3 dígitos')
})

const saleState = reactive({
  amount: undefined as number | undefined,
  customerName: '',
  cardNumber: '',
  expirationDate: '',
  cvv: ''
})

const saleLoading = ref(false)

// Validar formulario usando composable
const isFormValid = computed(() => {
  return (
    saleState.amount !== undefined
    && saleState.amount > 0
    && saleState.customerName.length >= 3
    && isValidCard(saleState.cardNumber)
    && isValidExpiration(saleState.expirationDate)
    && isValidCvv(saleState.cvv)
  )
})

async function onSaleSubmit() {
  const currentAmount = String(saleState.amount)
  const currentCustomerName = saleState.customerName

  // Mostrar modal de confirmación
  const confirmed = await confirmSale({
    amount: currentAmount,
    customerName: currentCustomerName,
    maskedCard: maskCard(saleState.cardNumber)
  })

  if (!confirmed) return

  saleLoading.value = true
  showLoader('Procesando venta...')
  try {
    const response = await processSale({
      amount: currentAmount,
      customerName: currentCustomerName,
      cardNumber: saleState.cardNumber.replace(/\s/g, ''),
      expirationDate: saleState.expirationDate,
      cvv: saleState.cvv
    })

    // Limpiar formulario
    Object.assign(saleState, {
      amount: undefined,
      customerName: '',
      cardNumber: '',
      expirationDate: '',
      cvv: ''
    })

    // Mostrar modal de éxito
    showSaleSuccess({
      approvalNumber: response.data.approvalNumber,
      referenceNumber: response.data.referenceNumber,
      maskedCard: response.data.maskedCard,
      amount: currentAmount,
      customerName: currentCustomerName
    })
  } catch (error) {
    showTransactionError(error, 'sale')
  } finally {
    hideLoader()
    saleLoading.value = false
  }
}
</script>
