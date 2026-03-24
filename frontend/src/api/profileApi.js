import axiosInstance from './axiosInstance'

export const profileApi = {
  get:            () => axiosInstance.get('/profile'),
  update:         (data) => axiosInstance.put('/profile', data),
  changePassword: (data) => axiosInstance.put('/profile/password', data),
}
