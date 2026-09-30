<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center gap-4 mb-10">
      <div class="w-11 h-11 rounded-full bg-white/70 dark:bg-carbon-800/70 backdrop-blur-xl flex items-center justify-center shadow-sm ring-1 ring-white/60 dark:ring-white/10">
        <UIcon
          name="i-lucide-layout-dashboard"
          class="w-5 h-5 text-carbon-800 dark:text-gray-300"
        />
      </div>
      <h1 class="text-4xl md:text-5xl font-bold text-carbon-900 dark:text-white tracking-tight">
        Panel Principal
      </h1>
    </div>

    <p class="text-sage-600 dark:text-gray-400 -mt-6 mb-10">
      Bienvenido, {{ user?.name }} · Selecciona una operación
    </p>

    <div class="rounded-[2rem] bg-white/40 dark:bg-carbon-900/40 backdrop-blur-xl ring-1 ring-white/60 dark:ring-white/10 p-6 shadow-lg">
      <div class="flex items-center mb-5 px-2">
        <h2 class="font-semibold text-carbon-900 dark:text-white">
          Operaciones
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="op in operations"
          :key="op.title"
          class="rounded-[2rem] p-7 cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden"
          :class="op.bgClass"
          @click="navigateTo(op.to)"
        >
          <div class="flex items-start justify-between mb-8">
            <div>
              <p
                class="text-xs font-medium opacity-70 mb-1"
                :class="op.textClass"
              >
                {{ op.subtitle }}
              </p>
              <h2
                class="text-2xl font-semibold leading-tight"
                :class="op.textClass"
              >
                {{ op.title }}
              </h2>
            </div>
            <div
              class="w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-45"
              :class="op.btnClass"
            >
              <UIcon
                name="i-lucide-arrow-up-right"
                class="w-5 h-5"
                :class="op.btnIconClass"
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :class="op.iconBgClass"
            >
              <UIcon
                :name="op.icon"
                class="w-6 h-6"
                :class="op.btnIconClass"
              />
            </div>
            <p
              class="text-sm opacity-75"
              :class="op.textClass"
            >
              {{ op.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { user, role } = useAuth()

interface Operation {
  title: string
  subtitle: string
  description: string
  icon: string
  to: string
  bgClass: string
  textClass: string
  btnClass: string
  btnIconClass: string
  iconBgClass: string
}

const operations = computed<Operation[]>(() => {
  if (role.value === 'Operador') {
    return [
      {
        title: 'Nueva Venta',
        subtitle: 'Operador',
        description: 'Procesar venta con tarjeta',
        icon: 'i-lucide-shopping-cart',
        to: '/operador/venta',
        bgClass: 'bg-primary-500',
        textClass: 'text-white',
        btnClass: 'bg-white/20',
        btnIconClass: 'text-white',
        iconBgClass: 'bg-white/20'
      },
      {
        title: 'Consultas',
        subtitle: 'Historial',
        description: 'Ver transacciones aprobadas',
        icon: 'i-lucide-search',
        to: '/operador/consultas',
        bgClass: 'bg-posteal-500',
        textClass: 'text-white',
        btnClass: 'bg-white/20',
        btnIconClass: 'text-white',
        iconBgClass: 'bg-white/20'
      }
    ]
  }

  return [
    {
      title: 'Cancelación',
      subtitle: 'Supervisor',
      description: 'Cancelar una transacción',
      icon: 'i-lucide-x-circle',
      to: '/supervisor/cancelacion',
      bgClass: 'bg-carbon-900',
      textClass: 'text-white',
      btnClass: 'bg-white/15',
      btnIconClass: 'text-white',
      iconBgClass: 'bg-white/15'
    },
    {
      title: 'Devolución',
      subtitle: 'Supervisor',
      description: 'Procesar devolución',
      icon: 'i-lucide-rotate-ccw',
      to: '/supervisor/devolucion',
      bgClass: 'bg-posyellow-400',
      textClass: 'text-carbon-900',
      btnClass: 'bg-carbon-900/10',
      btnIconClass: 'text-carbon-900',
      iconBgClass: 'bg-carbon-900/10'
    }
  ]
})
</script>
