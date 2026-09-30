export default defineNuxtRouteMiddleware((to) => {
  const { role, isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Verificar acceso por rol
  if (to.path.startsWith('/supervisor') && role.value !== 'Supervisor') {
    return navigateTo('/main')
  }

  if (to.path.startsWith('/operador') && role.value !== 'Operador') {
    return navigateTo('/main')
  }
})
