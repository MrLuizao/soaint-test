export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated, initAuth } = useAuth()

  // Inicializar auth desde localStorage
  initAuth()

  // Rutas públicas
  const publicRoutes = ['/login']

  if (publicRoutes.includes(to.path)) {
    // Si ya está autenticado y va al login, redirigir al dashboard
    if (isAuthenticated.value) {
      const { role } = useAuth()
      return navigateTo(role.value === 'Supervisor' ? '/supervisor' : '/operador')
    }
    return
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
