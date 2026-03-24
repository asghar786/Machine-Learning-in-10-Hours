import axiosInstance from './axiosInstance'

export const instructorApi = {
  dashboard: () => axiosInstance.get('/instructor/dashboard'),
  courses:   () => axiosInstance.get('/instructor/courses'),
  students:  () => axiosInstance.get('/instructor/students'),
}
