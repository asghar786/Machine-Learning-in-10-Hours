import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { instructorApi } from '@/api/instructorApi'

export default function InstructorCourses() {
  const { data, isLoading } = useQuery({
    queryKey: ['instructor', 'courses'],
    queryFn: () => instructorApi.courses().then(r => r.data),
  })

  const courses = data ?? []

  return (
    <>
      <div className="page-title-box">
        <div className="page-title-right">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item"><Link to="/instructor">Instructor</Link></li>
            <li className="breadcrumb-item active">My Courses</li>
          </ol>
        </div>
        <h4 className="page-title">My Courses</h4>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">
            <i className="ti ti-book me-2"></i>Assigned Courses
          </h5>
          <span className="badge bg-primary">{courses.length} total</span>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="ti ti-book-off fs-48 mb-3 d-block"></i>
              <h5>No courses assigned yet</h5>
              <p>Ask your administrator to assign courses to your instructor profile.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Price</th>
                    <th>Students</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {c.thumbnail ? (
                            <img src={c.thumbnail} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 56, height: 40 }}>
                              <i className="ti ti-book text-muted"></i>
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">{c.title}</div>
                            <div className="text-muted small">{c.duration_hours}h · {c.sessions_count ?? 0} sessions</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark text-capitalize">{c.category ?? '—'}</span>
                      </td>
                      <td className="text-capitalize">{c.level}</td>
                      <td className="fw-semibold">
                        {parseFloat(c.price) === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          `$${parseFloat(c.price).toFixed(2)}`
                        )}
                      </td>
                      <td>
                        <span className="badge bg-info-subtle text-info">
                          <i className="ti ti-users me-1"></i>{c.enrollments_count}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${c.is_published ? 'bg-success' : 'bg-secondary'}`}>
                          {c.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
