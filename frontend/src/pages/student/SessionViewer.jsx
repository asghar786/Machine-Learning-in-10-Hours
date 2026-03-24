import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { submissionsApi } from '@/api/coursesApi'
import axiosInstance from '@/api/axiosInstance'

/** Convert any YouTube/Vimeo/direct URL into an embeddable src */
function toEmbedUrl(url) {
  if (!url) return null
  // YouTube: watch?v=ID or youtu.be/ID or shorts/ID
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`
  // Vimeo: vimeo.com/ID
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`
  // Already an embed URL or direct mp4/other — use as-is
  return url
}

export default function SessionViewer() {
  const { slug, num } = useParams()
  const queryClient = useQueryClient()
  const [notebookUrls, setNotebookUrls] = useState({})
  const [submitStatus, setSubmitStatus] = useState({})

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', slug, num],
    queryFn: () => axiosInstance.get(`/courses/${slug}/sessions/${num}`).then(r => r.data),
  })

  const submitMutation = useMutation({
    mutationFn: (payload) => submissionsApi.submit(payload),
    onSuccess: (_, variables) => {
      setSubmitStatus((prev) => ({ ...prev, [variables.exercise_id]: 'success' }))
      setNotebookUrls((prev) => ({ ...prev, [variables.exercise_id]: '' }))
      queryClient.invalidateQueries({ queryKey: ['session', slug, num] })
      queryClient.invalidateQueries({ queryKey: ['submissions', 'mine'] })
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

  if (isLoading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status" />
    </div>
  )

  const exercises    = session?.exercises || []
  const course       = session?.course || {}
  const sessions     = course.sessions || []
  const totalSessions = course.total_sessions || sessions.length || 5
  const currentNum   = parseInt(num)
  const completedCount = sessions.filter(s => s.submitted).length
  const progressPct  = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0
  const embedUrl     = toEmbedUrl(session?.video_url)

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row">
          {/* ── Main Content ── */}
          <div className="col-lg-8">
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
                <li className="breadcrumb-item"><Link to={`/courses/${slug}`}>{course.title || slug}</Link></li>
                <li className="breadcrumb-item active">Session {num}</li>
              </ol>
            </nav>

            <h2 className="mb-1">{session?.title || `Session ${num}`}</h2>
            <p className="text-muted small mb-3">
              <i className="fa fa-clock me-1"></i>{session?.duration_minutes || 90} min
              &nbsp;·&nbsp;
              <i className="fa fa-layer-group me-1"></i>Session {currentNum} of {totalSessions}
            </p>

            {/* Video */}
            {embedUrl ? (
              <div className="ratio ratio-16x9 mb-4 rounded overflow-hidden shadow-sm">
                <iframe src={embedUrl} allowFullScreen title={session.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            ) : (
              <div className="bg-light border rounded d-flex flex-column align-items-center justify-content-center mb-4" style={{ height: 240 }}>
                <i className="fa fa-play-circle fa-3x text-muted mb-2"></i>
                <span className="text-muted small">Video coming soon</span>
              </div>
            )}

            {/* Description */}
            {session?.description && (
              <div className="mb-4">
                <p className="text-muted">{session.description}</p>
              </div>
            )}

            {/* Exercises */}
            {exercises.length > 0 && (
              <div className="mb-5">
                <h5 className="mb-3">Exercises</h5>
                {exercises.map((exercise) => {
                  const sub = exercise.my_submission
                  const isPending  = sub?.status === 'pending'
                  const isGraded   = sub?.status === 'graded'
                  const passed     = isGraded && sub.score >= (exercise.pass_threshold ?? 70)

                  return (
                    <div key={exercise.id} className="card border-0 shadow-sm mb-4">
                      <div className="card-body">
                        {/* Header */}
                        <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                          <h6 className="mb-0 flex-grow-1">{exercise.title}</h6>
                          <span className="badge bg-secondary">Group {exercise.group || 'A'}</span>
                          <span className="badge bg-info text-dark">{exercise.type}</span>
                          {isGraded && (
                            <span className={`badge ${passed ? 'bg-success' : 'bg-danger'}`}>
                              {passed ? '✓ Passed' : '✗ Failed'} — {sub.score}/{exercise.max_score ?? 100}
                            </span>
                          )}
                          {isPending && (
                            <span className="badge bg-warning text-dark">
                              <i className="fa fa-clock me-1"></i>Awaiting review
                            </span>
                          )}
                        </div>

                        {exercise.instructions && (
                          <p className="text-muted small mb-3">{exercise.instructions}</p>
                        )}

                        {/* Graded feedback */}
                        {isGraded && sub.feedback && (
                          <div className="alert alert-info py-2 small mb-3">
                            <strong>Feedback:</strong> {sub.feedback}
                          </div>
                        )}

                        {/* Submission form — hide if already pending or passed */}
                        {!isPending && !passed && (
                          <form onSubmit={(e) => handleSubmit(e, exercise.id)}>
                            <div className="mb-2">
                              <label className="form-label small fw-semibold">
                                {isGraded ? 'Resubmit — Notebook URL' : 'Notebook URL'}
                              </label>
                              <input
                                type="url"
                                className="form-control form-control-sm"
                                placeholder="https://colab.research.google.com/…"
                                value={notebookUrls[exercise.id] || ''}
                                onChange={(e) => setNotebookUrls((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                              />
                            </div>
                            <button
                              type="submit"
                              className="btn btn-sm btn-main rounded"
                              disabled={submitMutation.isPending}
                            >
                              {submitMutation.isPending
                                ? <><span className="spinner-border spinner-border-sm me-1" />{' '}Submitting…</>
                                : isGraded ? 'Resubmit' : 'Submit Exercise'
                              }
                            </button>
                          </form>
                        )}

                        {submitStatus[exercise.id] === 'success' && (
                          <div className="alert alert-success mt-2 mb-0 py-2 small">
                            <i className="fa fa-check-circle me-1"></i>
                            Submission received! Your instructor will review it shortly.
                          </div>
                        )}
                        {submitStatus[exercise.id] === 'error' && (
                          <div className="alert alert-danger mt-2 mb-0 py-2 small">
                            Submission failed. Please try again.
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="d-flex gap-3 mt-4">
              {currentNum > 1 && (
                <Link to={`/learn/${slug}/session/${currentNum - 1}`} className="btn btn-outline-secondary rounded">
                  ← Previous
                </Link>
              )}
              {currentNum < totalSessions ? (
                <Link to={`/learn/${slug}/session/${currentNum + 1}`} className="btn btn-main rounded">
                  Next Session →
                </Link>
              ) : (
                <Link to={`/learn/${slug}/quiz`} className="btn btn-main rounded">
                  Take Final Quiz →
                </Link>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            {/* Overall progress */}
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="fw-semibold">Course Progress</small>
                  <small className="text-muted">{completedCount}/{totalSessions} sessions</small>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${progressPct}%`, background: 'var(--theme-primary-color, #F14D5D)' }}
                  />
                </div>
                <small className="text-muted">{progressPct}% complete</small>
              </div>
            </div>

            {/* Sessions list */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white fw-semibold py-3">Sessions</div>
              <ul className="list-group list-group-flush">
                {sessions.map((s) => {
                  const isCurrent = s.session_number === currentNum
                  return (
                    <Link
                      key={s.id}
                      to={`/learn/${slug}/session/${s.session_number}`}
                      className={`list-group-item list-group-item-action d-flex align-items-center gap-2 py-3 ${isCurrent ? 'active' : ''}`}
                    >
                      <span className={`badge rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${isCurrent ? 'bg-white text-primary' : s.submitted ? 'bg-success' : 'bg-light text-dark'}`}
                        style={{ width: 24, height: 24, fontSize: 11 }}>
                        {s.submitted && !isCurrent ? <i className="fa fa-check" style={{ fontSize: 10 }} /> : s.session_number}
                      </span>
                      <span className="small">{s.title}</span>
                    </Link>
                  )
                })}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
