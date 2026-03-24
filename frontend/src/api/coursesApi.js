import axiosInstance from './axiosInstance'

export const coursesApi = {
  getAll: (params) => axiosInstance.get('/courses', { params }),       // ?category=&search=
  getBySlug: (slug) => axiosInstance.get(`/courses/${slug}`),
  // alias used by student pages pending their own update
  detail: (slug) => axiosInstance.get(`/courses/${slug}`),
}

export const enrollmentsApi = {
  enroll: (courseId) => axiosInstance.post('/enrollments', { course_id: courseId }),
  mine: () => axiosInstance.get('/enrollments/me'),
}

export const submissionsApi = {
  submit: (data) => axiosInstance.post('/submissions', data),
  mine: () => axiosInstance.get('/submissions/me'),
  // alias used by student pages pending their own update
  my: () => axiosInstance.get('/submissions/me'),
}

export const certificatesApi = {
  verify: (uuid) => axiosInstance.get(`/certificates/${uuid}`),
  mine: () => axiosInstance.get('/certificates/me'),
  // aliases used by student pages pending their own update
  my: () => axiosInstance.get('/certificates/me'),
  download: (uuid) => axiosInstance.get(`/certificates/${uuid}/download`, { responseType: 'blob' }),
}

export const postsApi = {
  getAll: (params) => axiosInstance.get('/posts', { params }),
  getBySlug: (slug) => axiosInstance.get(`/posts/${slug}`),
}

// alias used by student QuizPage pending its own update
export const quizApi = {
  submit: (answers) => axiosInstance.post('/quiz/submit', { answers }),
  result: (attemptId) => axiosInstance.get(`/quiz/result/${attemptId}`),
}
