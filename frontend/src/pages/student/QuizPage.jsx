import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { coursesApi } from '@/api/coursesApi'

export default function QuizPage() {
  const { slug } = useParams()

  const { data: course } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.getBySlug(slug),
    select: (res) => res.data.data,
  })

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="mb-1">{course?.title || 'Final Assessment'}</h2>
            <p className="text-muted mb-5">
              {course?.title ? `Assessment for: ${course.title}` : 'Loading course…'}
            </p>

            <div className="card border-0 shadow-sm p-5">
              <i className="fa fa-chalkboard-teacher fa-4x text-primary mb-4"></i>
              <h4 className="mb-3">Quiz feature coming soon.</h4>
              <p className="text-muted mb-4">
                Your exercises are graded by instructors. Once all sessions are reviewed
                and your score meets the passing threshold, your certificate will be issued
                automatically.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to={`/learn/${slug}/session/1`} className="btn btn-main rounded">
                  Review Sessions
                </Link>
                <Link to="/dashboard" className="btn btn-outline-secondary rounded">
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
