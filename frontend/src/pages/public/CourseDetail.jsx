import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { coursesApi, enrollmentsApi } from '@/api/coursesApi'
import { paymentsApi } from '@/api/paymentsApi'
import { useAuthStore } from '@/store/authStore'
import { queryClient } from '@/api/queryClient'

export default function CourseDetail() {
  const { slug } = useParams()
  const { isAuthenticated } = useAuthStore()
  const [enrolledSuccess, setEnrolledSuccess] = useState(false)
  const [enrollError, setEnrollError] = useState('')

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.getBySlug(slug).then(r => r.data),
  })

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const price = parseFloat(course.price ?? 0)
      if (price > 0) {
        // Paid course → Stripe checkout
        const res = await paymentsApi.checkout(course.id)
        const url = res.data?.checkout_url
        if (url) { window.location.href = url; return }
      }
      // Free course → direct enroll
      return enrollmentsApi.enroll(course.id)
    },
    onSuccess: (data) => {
      if (!data) return // redirected to Stripe, nothing to do
      queryClient.invalidateQueries({ queryKey: ['course', slug] })
      setEnrolledSuccess(true)
      setEnrollError('')
    },
    onError: (err) => {
      setEnrollError(err?.response?.data?.message || 'Enrollment failed. Please try again.')
    },
  })

  if (isLoading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary"></div>
    </div>
  )

  if (!course) return (
    <div className="container py-5 text-center">
      <h3>Course not found</h3>
      <Link to="/courses" className="btn btn-main rounded mt-3">Browse Courses</Link>
    </div>
  )

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="title-block">
                <h1>{course.title}</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/courses">Courses</Link></li>
                  <li className="active">{course.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="course-details-content">
                <h2 className="mb-3">{course.title}</h2>
                <p className="text-muted mb-4">{course.description}</p>

                {/* Sessions List */}
                {course.sessions?.length > 0 && (
                  <div className="course-curriculum mb-5">
                    <h4 className="mb-4">Course Curriculum</h4>
                    <div className="accordion" id="curriculum">
                      {course.sessions.map((session) => (
                        <div key={session.id} className="accordion-item mb-2">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#session${session.id}`}
                            >
                              <span className="me-2 text-muted small">Session {session.session_number}</span>
                              {session.title}
                              <span className="ms-auto badge bg-light text-dark me-2">
                                {session.duration_minutes} min
                              </span>
                            </button>
                          </h2>
                          <div id={`session${session.id}`} className="accordion-collapse collapse">
                            <div className="accordion-body text-muted small">
                              {session.description || 'Session content — enroll to unlock.'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="course-sidebar sticky-top" style={{ top: 100 }}>
                <div className="card shadow-sm border-0">
                  {course.thumbnail && (
                    <img src={course.thumbnail} className="card-img-top" alt={course.title} />
                  )}
                  <div className="card-body p-4">
                    <div className="price-wrap mb-3">
                      <h3 className="price text-color mb-0">
                        {course.is_free ? 'Free' : course.price ? `$${course.price}` : 'Free'}
                      </h3>
                      {course.original_price && (
                        <span className="text-muted text-decoration-line-through ms-2">${course.original_price}</span>
                      )}
                    </div>

                    {enrolledSuccess ? (
                      <div className="text-center">
                        <p className="text-success mb-2"><i className="fa fa-check-circle me-1"></i>Enrolled successfully!</p>
                        <Link to="/dashboard" className="btn btn-main rounded w-100">Go to Dashboard</Link>
                      </div>
                    ) : course.is_enrolled ? (
                      <Link to={`/learn/${slug}/session/1`} className="btn btn-main rounded w-100 mb-3">
                        Continue Learning
                      </Link>
                    ) : !isAuthenticated ? (
                      <Link to="/login" className="btn btn-main rounded w-100 mb-3">
                        Login to Enroll
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => enrollMutation.mutate()}
                          className="btn btn-main rounded w-100 mb-3"
                          disabled={enrollMutation.isPending}
                        >
                          {enrollMutation.isPending ? 'Enrolling…' : 'Enroll Now'}
                        </button>
                        {enrollError && (
                          <p className="text-danger small mt-2">{enrollError}</p>
                        )}
                      </>
                    )}

                    <ul className="list-unstyled course-meta-list">
                      <li><i className="fa fa-list me-2 text-color"></i>{course.total_sessions} Sessions</li>
                      <li><i className="fa fa-clock me-2 text-color"></i>{course.total_sessions * 2} Hours of Content</li>
                      <li><i className="fa fa-certificate me-2 text-color"></i>Certificate on Completion</li>
                      <li><i className="fa fa-infinity me-2 text-color"></i>Lifetime Access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
