import api from './axiosInstance'

export const authApi = {
  login: (credentials) =>
    api.post('/auth/login', credentials).then((r) => r.data),

  register: (data) =>
    api.post('/auth/register', data).then((r) => r.data),

  logout: () =>
    api.post('/auth/logout').then((r) => r.data),

  me: () =>
    api.get('/auth/me').then((r) => r.data),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (data) =>
    api.post('/auth/reset-password', data).then((r) => r.data),
}
