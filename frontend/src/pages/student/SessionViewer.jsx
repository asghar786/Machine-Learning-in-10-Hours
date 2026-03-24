import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { submissionsApi } from '@/api/coursesApi'
import axiosInstance from '@/api/axiosInstance'

export default function SessionViewer() {
  const { slug, num } = useParams()
  const [notebookUrls, setNotebookUrls] = useState({})
  const [submitStatus, setSubmitStatus] = useState({}) // { [exerciseId]: 'success' | 'error' | 'idle' }

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', slug, num],
    queryFn: () => axiosInstance.get(`/courses/${slug}/sessions/${num}`),
    select: (res) => res.data.data,
  })

  const submitMutation = useMutation({
    mutationFn: (payload) => submissionsApi.submit(payload),
    onSuccess: (_, variables) => {
      setSubmitStatus((prev) => ({ ...prev, [variables.exercise_id]: 'success' }))
      setNotebookUrls((prev) => ({ ...prev, [variables.exercise_id]: '' }))
    },
    onError: (_, variables) => {
      setSubmitStatus((prev) => ({ ...prev, [variables.exercise_id]: 'error' }))
    },
  })

  const handleSubmit = (e, exerciseId) => {
    e.preventDefault()
    setSubmitStatus((prev) => ({ ...prev, [exerciseId]: 'idle' }))
    submitMutation.mutate({
      exercise_id: exerciseId,
      notebook_url: notebookUrls[exerciseId] || '',
    })
  }

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const exercises = session?.exercises || []
  const totalSessions = session?.course?.total_sessions || 5

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
                <li className="breadcrumb-item">
                  <Link to={`/courses/${slug}`}>{session?.course?.title || slug}</Link>
                </li>
                <li className="breadcrumb-item active">Session {num}</li>
              </ol>
            </nav>

            <h2 className="mb-3">{session?.title || `Session ${num}`}</h2>

            {/* Video */}
            {session?.video_url ? (
              <div className="ratio ratio-16x9 mb-4">
                <iframe src={session.video_url} allowFullScreen title={session.title}></iframe>
              </div>
            ) : (
              <div className="bg-light border rounded d-flex align-items-center justify-content-center mb-4" style={{ height: '240px' }}>
                <span className="text-muted">Video coming soon</span>
              </div>
            )}

            {/* Description */}
            {session?.description && (
              <div className="session-content mb-4">
                <p className="text-muted">{session.description}</p>
              </div>
            )}

            {/* Exercises */}
            {exercises.length > 0 && (
              <div className="mb-5">
                <h5 className="mb-3">Exercises</h5>
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h6 className="mb-0">{exercise.title}</h6>
                        <span className="badge bg-secondary">Group {exercise.group || 'A'}</span>
                        <span className="badge bg-info text-dark">{exercise.type}</span>
                      </div>

                      {exercise.description && (
                        <p className="text-muted small mb-3">{exercise.description}</p>
                      )}

                      {/* Submission form */}
                      <form onSubmit={(e) => handleSubmit(e, exercise.id)}>
                        <div className="mb-2">
                          <label className="form-label small fw-semibold">Notebook URL (optional)</label>
                          <input
                            type="url"
                            className="form-control form-control-sm"
                            placeholder="https://colab.research.google.com/..."
                            value={notebookUrls[exercise.id] || ''}
                            onChange={(e) =>
                              setNotebookUrls((prev) => ({ ...prev, [exercise.id]: e.target.value }))
                            }
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-sm btn-main rounded"
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                              Submitting…
                            </>
                          ) : (
                            'Submit Exercise'
                          )}
                        </button>
                      </form>

                      {submitStatus[exercise.id] === 'success' && (
                        <div className="alert alert-success alert-sm mt-2 mb-0 py-2 small">
                          Submission received! Your instructor will review it shortly.
                        </div>
                      )}
                      {submitStatus[exercise.id] === 'error' && (
                        <div className="alert alert-danger alert-sm mt-2 mb-0 py-2 small">
                          Submission failed. Please try again.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="d-flex gap-3 mt-4">
              {parseInt(num) > 1 && (
                <Link
                  to={`/learn/${slug}/session/${parseInt(num) - 1}`}
                  className="btn btn-outline-secondary rounded"
                >
                  ← Previous
                </Link>
              )}
              {parseInt(num) < totalSessions ? (
                <Link
                  to={`/learn/${slug}/session/${parseInt(num) + 1}`}
                  className="btn btn-main rounded"
                >
                  Next Session →
                </Link>
              ) : (
                <Link to={`/learn/${slug}/quiz`} className="btn btn-main rounded">
                  Take Final Quiz →
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar — session list from course */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-semibold">Sessions</div>
              <ul className="list-group list-group-flush">
                {session?.course?.sessions?.map((s) => (
                  <Link
                    key={s.id}
                    to={`/learn/${slug}/session/${s.session_number}`}
                    className="list-group-item list-group-item-action d-flex align-items-center gap-2"
                  >
                    <span
                      className={`badge rounded-circle ${
                        s.session_number === parseInt(num) ? 'bg-primary' : 'bg-light text-dark'
                      }`}
                    >
                      {s.session_number}
                    </span>
                    <span className="small">{s.title}</span>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
