import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { instructorApi } from '@/api/instructorApi'

export default function InstructorStudents() {
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['instructor', 'students'],
    queryFn: () => instructorApi.students().then(r => r.data),
  })

  const enrollments = data ?? []

  // Unique courses for filter
  const courses = [...new Map(enrollments.map(e => [e.course?.id, e.course])).values()].filter(Boolean)

  const filtered = enrollments.filter(e => {
    const matchSearch = !search ||
      e.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.user?.email?.toLowerCase().includes(search.toLowerCase())
    const matchCourse = !filterCourse || String(e.course?.id) === filterCourse
    return matchSearch && matchCourse
  })

  return (
    <>
      <div className="page-title-box">
        <div className="page-title-right">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item"><Link to="/instructor">Instructor</Link></li>
            <li className="breadcrumb-item active">My Students</li>
          </ol>
        </div>
        <h4 className="page-title">My Students</h4>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text"><i className="ti ti-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select className="form-select" value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                <option value="">All Courses</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 text-end">
              <span className="badge bg-primary fs-13">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="ti ti-user-off fs-48 mb-3 d-block"></i>
              <h5>{search || filterCourse ? 'No matching students' : 'No students enrolled yet'}</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Enrolled</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="avatar-sm rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: 36, height: 36, fontSize: 14, flexShrink: 0 }}
                          >
                            {e.user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <div className="fw-semibold">{e.user?.name}</div>
                            <div className="text-muted small">{e.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="fw-medium">{e.course?.title}</span>
                      </td>
                      <td className="text-muted small">
                        {new Date(e.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <span className={`badge ${e.completed_at ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {e.completed_at ? 'Completed' : 'In Progress'}
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
