import axiosInstance from './axiosInstance'

export const paymentsApi = {
  all:      () => axiosInstance.get('/payments'),
  get:      (id) => axiosInstance.get(`/payments/${id}`),
  checkout: (courseId) => axiosInstance.post('/payments/checkout', { course_id: courseId }),
}
