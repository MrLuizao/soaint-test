<template>
  <div class="min-h-screen bg-gradient-to-br from-[#D7E0EF] via-sage-100 to-[#D9E4CF] dark:from-carbon-950 dark:via-carbon-950 dark:to-carbon-900">
    <aside class="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex">
      <div class="flex flex-col items-center gap-2 bg-carbon-900 dark:bg-carbon-900 rounded-full py-4 px-2 shadow-2xl">
        <UTooltip
          v-for="item in navItems"
          :key="item.to"
          :text="item.label"
          :content="{ side: 'right' }"
        >
          <NuxtLink
            :to="item.to"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :class="isActive(item.to)
              ? 'bg-white/15 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/10'"
          >
            <UIcon
              :name="item.icon"
              class="w-5 h-5"
            />
          </NuxtLink>
        </UTooltip>

        <div class="w-6 h-px bg-white/10 my-2" />

        <UColorModeButton
          color="neutral"
          variant="ghost"
          class="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
        />

        <UTooltip
          text="Cerrar sesión"
          :content="{ side: 'right' }"
        >
          <button
            class="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-error-400 hover:bg-white/10 transition-all cursor-pointer"
            @click="handleLogout"
          >
            <UIcon
              name="i-lucide-log-out"
              class="w-5 h-5"
            />
          </button>
        </UTooltip>
      </div>
    </aside>

    <NuxtLink
      to="/main"
      class="fixed left-5 top-5 z-40 flex items-center"
    >
      <div class="bg-white/70 dark:bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 shadow-sm ring-1 ring-white/60 dark:ring-white/10">
        <img
          src="/logo-saint.png"
          alt="SAINT"
          class="h-8 w-auto"
        >
      </div>
    </NuxtLink>

    <header class="pt-6 px-6 md:pl-28">
      <div class="flex items-center">
        <div class="flex items-center gap-3 ml-auto">
          <UColorModeButton
            color="neutral"
            variant="ghost"
            class="md:hidden rounded-full bg-white dark:bg-carbon-800"
          />
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-sm"
            :class="role === 'Supervisor' ? 'bg-posyellow-400 text-carbon-900' : 'bg-primary-500 text-white'"
          >
            <UIcon
              :name="role === 'Supervisor' ? 'i-lucide-shield' : 'i-lucide-user'"
              class="w-4 h-4"
            />
            {{ role }}
          </span>
          <div class="group flex items-center bg-white/70 dark:bg-carbon-800/70 backdrop-blur-xl rounded-full p-1.5 shadow-sm ring-1 ring-white/60 dark:ring-white/10 cursor-pointer">
            <UAvatar
              :alt="user?.name"
              size="md"
              class="bg-primary-500 shrink-0"
              :ui="{ fallback: 'text-white font-semibold text-xs' }"
            />
            <div class="overflow-hidden max-w-0 opacity-0 group-hover:max-w-64 group-hover:opacity-100 transition-all duration-500 ease-out">
              <div class="pl-3 pr-4 whitespace-nowrap">
                <p class="text-sm font-semibold text-carbon-900 dark:text-white leading-tight">
                  {{ user?.name }}
                </p>
                <p class="text-xs text-sage-600 dark:text-gray-400 leading-tight">
                  {{ accessDescription }}
                </p>
              </div>
            </div>
          </div>
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            class="md:hidden rounded-full"
            @click="handleLogout"
          />
        </div>
      </div>
    </header>

    <main class="px-6 md:pl-28 md:pr-10 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user, role, logout } = useAuth()
const { confirmLogout } = useConfirmModal()

const accessDescription = computed(() => {
  return role.value === 'Supervisor'
    ? 'Acceso a cancelaciones y devoluciones'
    : 'Acceso a ventas y consultas'
})

const navItems = computed(() => {
  const items = [{ to: '/main', icon: 'i-lucide-home', label: 'Inicio' }]

  if (role.value === 'Operador') {
    items.push(
      { to: '/operador/venta', icon: 'i-lucide-shopping-cart', label: 'Venta' },
      { to: '/operador/consultas', icon: 'i-lucide-search', label: 'Consultas' }
    )
  } else if (role.value === 'Supervisor') {
    items.push(
      { to: '/supervisor/cancelacion', icon: 'i-lucide-x-circle', label: 'Cancelación' },
      { to: '/supervisor/devolucion', icon: 'i-lucide-rotate-ccw', label: 'Devolución' }
    )
  }

  return items
})

function isActive(to: string) {
  const path = to.split('?')[0]
  return route.path === path
}

async function handleLogout() {
  const confirmed = await confirmLogout()
  if (confirmed) {
    logout()
  }
}
</script>
