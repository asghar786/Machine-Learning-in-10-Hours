import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { coursesApi } from '@/api/coursesApi'
import CourseCard from '@/components/course/CourseCard'

export default function HomePage() {
  const { data: coursesData } = useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: () => coursesApi.getAll({ limit: 3 }).then(r => r.data),
  })

  const courses = coursesData || []

  // Re-init jQuery plugins after data loads
  useEffect(() => {
    if (typeof window.$ === 'undefined') return
    if (window.$.fn.counterUp) {
      window.$('.counter').counterUp({ delay: 10, time: 1000 })
    }
    if (window.WOW) new window.WOW({ live: false }).init()
  }, [courses])

  return (
    <>
      {/* ===== Hero Banner ===== */}
      <section className="banner-style-4 banner-padding">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-12 col-xl-6 col-lg-6">
              <div className="banner-content">
                <span className="subheading">Comprehensive Certification Courses</span>
                <h1>Upgrade Your Skills &amp; Advance Your Career</h1>
                <p className="mb-40">
                  Learn Machine Learning, MS Office, Database Management and more —
                  in structured 10-hour courses with hands-on exercises and a verifiable certificate.
                </p>
                <div className="btn-container">
                  <Link to="/courses" className="btn btn-main rounded">Explore Courses</Link>
                  <Link to="/register" className="btn btn-white rounded ms-2">Get Started Free</Link>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-xl-6 col-lg-6">
              <div className="banner-img-round mt-5 mt-lg-0 ps-5">
                <img src="/assets/images/banner/banner_img.png" alt="Learn Online" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats Counter ===== */}
      <section className="counter-section4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-12 counter-inner">
              <div className="row">
                {[
                  { count: '5000', label: 'Students Enrolled', suffix: '+' },
                  { count: '12',   label: 'Courses Available', suffix: '+' },
                  { count: '98',   label: 'Completion Rate',   suffix: '%' },
                  { count: '100',  label: 'Satisfaction',      suffix: '%' },
                ].map(({ count, label, suffix }) => (
                  <div key={label} className="col-lg-3 col-md-6">
                    <div className="counter-item mb-5 mb-lg-0">
                      <div className="count">
                        <span className="counter h2">{count}</span>
                        <span>{suffix}</span>
                      </div>
                      <p>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Popular Courses ===== */}
      <section className="course-wrapper section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="section-heading mb-70 text-center">
                <h2 className="font-lg">Popular Courses</h2>
                <p>Discover Your Perfect Program. Learn at your own pace, get certified.</p>
              </div>
            </div>
          </div>
          <div className="row justify-content-lg-center">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="col-xl-4 col-lg-4 col-md-6">
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              // Placeholder cards while loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="col-xl-4 col-lg-4 col-md-6">
                  <div className="course-grid bg-shadow">
                    <div className="course-header">
                      <div className="course-thumb bg-light" style={{ height: 200 }}></div>
                    </div>
                    <div className="course-content p-4">
                      <div className="bg-light rounded mb-2" style={{ height: 20, width: '80%' }}></div>
                      <div className="bg-light rounded" style={{ height: 14, width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-5">
            <Link to="/courses" className="btn btn-main rounded">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="section-padding bg-gray">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="section-heading mb-60 text-center">
                <h2 className="font-lg">How It Works</h2>
                <p>Four simple steps to earning your certification</p>
              </div>
            </div>
          </div>
          <div className="row">
            {[
              { icon: 'fa-user-plus',   step: '01', title: 'Sign Up',     desc: 'Create your free account in 60 seconds' },
              { icon: 'fa-graduation-cap', step: '02', title: 'Enroll',   desc: 'Choose from our growing course catalog' },
              { icon: 'fa-laptop-code', step: '03', title: 'Learn',       desc: 'Watch sessions, complete hands-on exercises' },
              { icon: 'fa-certificate', step: '04', title: 'Get Certified', desc: 'Pass the final quiz and download your certificate' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="col-xl-3 col-md-6">
                <div className="step-item text-center mb-5 mb-xl-0">
                  <div className="step-icon mb-3">
                    <i className={`fa ${icon} fa-2x text-color`}></i>
                  </div>
                  <span className="step-number text-muted small">Step {step}</span>
                  <h5 className="mt-2">{title}</h5>
                  <p className="text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 text-center">
              <div className="section-heading mb-4">
                <h2 className="font-lg">Ready to Start Learning?</h2>
                <p className="mb-4">Join thousands of learners who have earned their certifications on our platform.</p>
                <Link to="/register" className="btn btn-main rounded me-3">Get Started Free</Link>
                <Link to="/courses" className="btn btn-outline-primary rounded">Browse Courses</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
