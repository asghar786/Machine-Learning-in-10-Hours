import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // send Sanctum SPA cookies
})

// Attach Sanctum Bearer token from Zustand store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Unwrap Laravel envelope { success, data, message } → return data directly
// Handle 401 globally — clear auth and redirect to login
api.interceptors.response.use(
  (res) => {
    if (res.data && typeof res.data.success === 'boolean') {
      return { ...res, data: res.data.data ?? res.data }
    }
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
