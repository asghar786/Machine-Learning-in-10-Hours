import axiosInstance from './axiosInstance'

export const profileApi = {
  get:            () => axiosInstance.get('/profile'),
  update:         (data) => axiosInstance.put('/profile', data),
  changePassword: (data) => axiosInstance.put('/profile/password', data),
  uploadAvatar:   (file) => {
    const fd = new FormData()
    fd.append('avatar', file)
    return axiosInstance.post('/profile/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
