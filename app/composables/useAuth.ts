interface User {
  id: string
  name: string
  role: 'Supervisor' | 'Operador'
}

interface AuthState {
  token: string | null
  user: User | null
}

const authState = reactive<AuthState>({
  token: null,
  user: null
})

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!authState.token)
  const user = computed(() => authState.user)
  const role = computed(() => authState.user?.role)
  const token = computed(() => authState.token)

  function initAuth() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('pos_token')
      const savedUser = localStorage.getItem('pos_user')

      if (savedToken && savedUser) {
        authState.token = savedToken
        authState.user = JSON.parse(savedUser)
      }
    }
  }

  async function login(username: string, password: string) {
    const response = await $fetch<{ token: string, user: User }>('/api/auth/login', {
      method: 'POST',
      body: { username, password }
    })

    authState.token = response.token
    authState.user = response.user

    if (import.meta.client) {
      localStorage.setItem('pos_token', response.token)
      localStorage.setItem('pos_user', JSON.stringify(response.user))
    }

    // Redirigir a la vista Main
    router.push('/main')

    return response
  }

  function logout() {
    authState.token = null
    authState.user = null

    if (import.meta.client) {
      localStorage.removeItem('pos_token')
      localStorage.removeItem('pos_user')
    }

    router.push('/login')
  }

  function getAuthHeaders() {
    return {
      Authorization: `Bearer ${authState.token}`
    }
  }

  return {
    isAuthenticated,
    user,
    role,
    token,
    initAuth,
    login,
    logout,
    getAuthHeaders
  }
}
