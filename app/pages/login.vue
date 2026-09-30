<template>
  <UCard
    class="shadow-xl rounded-[2rem]"
    :ui="{ root: 'bg-white/70 dark:bg-carbon-900/70 backdrop-blur-xl ring-white/60 dark:ring-white/10', body: 'p-7' }"
  >
    <template #header>
      <div class="text-center">
        <img
          src="/logo-saint.png"
          alt="SAINT"
          class="h-11 mx-auto mb-4 dark:bg-white dark:rounded-2xl dark:px-4 dark:py-2"
        >
        <p class="text-sage-600 dark:text-gray-400 mt-1">
          Ingresa tus credenciales
        </p>
      </div>
    </template>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-5"
      @submit="onSubmit"
    >
      <UFormField
        name="username"
      >
        <UInput
          v-model="state.username"
          placeholder="Usuario"
          icon="i-lucide-user"
          size="xl"
          variant="subtle"
          class="w-full rounded-full"
          :ui="{ base: 'pl-12' }"
        />
      </UFormField>

      <UFormField
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Contraseña"
          icon="i-lucide-lock"
          size="xl"
          variant="subtle"
          class="w-full rounded-full"
          :ui="{ base: 'pl-12' }"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        size="xl"
        class="rounded-full"
        :loading="loading"
      >
        Iniciar Sesión
      </UButton>
    </UForm>

    <template #footer>
      <UAccordion
        :items="accordionItems"
        :ui="{
          root: 'w-full',
          item: 'border-b-0',
          trigger: 'justify-center py-2 text-sm text-sage-600 dark:text-gray-400',
          content: 'pb-0'
        }"
      >
        <template #content>
          <div class="space-y-2 pt-2">
            <button
              v-for="testUser in testUsers"
              :key="testUser.username"
              type="button"
              class="w-full flex items-center gap-3 rounded-2xl bg-white/60 dark:bg-carbon-800/60 ring-1 ring-white/60 dark:ring-white/10 px-4 py-3 text-left hover:bg-white dark:hover:bg-carbon-800 transition-colors cursor-pointer"
              @click="fillCredentials(testUser)"
            >
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                :class="testUser.role === 'Supervisor' ? 'bg-posyellow-400' : 'bg-primary-500'"
              >
                <UIcon
                  :name="testUser.role === 'Supervisor' ? 'i-lucide-shield' : 'i-lucide-user'"
                  class="w-4 h-4"
                  :class="testUser.role === 'Supervisor' ? 'text-carbon-900' : 'text-white'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-carbon-900 dark:text-white">
                  {{ testUser.role }}
                </p>
                <p class="text-xs text-sage-600 dark:text-gray-400 font-mono">
                  {{ testUser.username }} / {{ testUser.password }}
                </p>
              </div>
              <UIcon
                name="i-lucide-arrow-up-left"
                class="w-4 h-4 text-sage-500 dark:text-gray-500 shrink-0"
              />
            </button>
          </div>
        </template>
      </UAccordion>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'auth',
  middleware: 'auth'
})

const { login } = useAuth()
const { showAuthError } = useErrorAlert()
const { showLoader, hideLoader } = useLoader()
const loading = ref(false)

const schema = z.object({
  username: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(1, 'Contraseña requerida')
})

const state = reactive({
  username: '',
  password: ''
})

const accordionItems = [
  {
    label: 'Ver usuarios de prueba',
    icon: 'i-lucide-key-round',
    slot: 'content' as const
  }
]

const testUsers = [
  { role: 'Supervisor', username: 'supervisor', password: 'supervisor123' },
  { role: 'Operador', username: 'operador', password: 'operador123' }
]

function fillCredentials(testUser: { username: string, password: string }) {
  state.username = testUser.username
  state.password = testUser.password
}

async function onSubmit() {
  loading.value = true
  showLoader('Iniciando sesión...')
  try {
    await login(state.username, state.password)
  } catch (error) {
    showAuthError(error)
  } finally {
    hideLoader()
    loading.value = false
  }
}
</script>
