import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

export default function AdminCourses() {
  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => axiosInstance.get('/admin/courses'),
    select: (res) => res.data.data,
  })

  const [togglingId, setTogglingId] = useState(null)

  const togglePublished = async (course) => {
    setTogglingId(course.id)
    try {
      await axiosInstance.put(`/admin/courses/${course.id}`, { is_published: !course.is_published })
      await refetch()
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title mb-1">Courses</h4>
          <nav aria-label="breadcrumb"><ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
            <li className="breadcrumb-item active">Courses</li>
          </ol></nav>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary"><i className="ti ti-plus me-1"></i>Add Course</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Level</th>
                  <th>Published</th>
                  <th>Sessions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="8" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                ) : !courses || courses.length === 0 ? (
                  <tr><td colSpan="8" className="text-center text-muted py-4">No courses yet. <a href="#">Add the first course</a></td></tr>
                ) : courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td className="fw-medium">{c.title}</td>
                    <td>{c.category || '—'}</td>
                    <td>{c.is_free ? <span className="badge bg-success">Free</span> : c.price ? `$${c.price}` : '—'}</td>
                    <td>{c.level || '—'}</td>
                    <td>
                      <span className={`badge bg-${c.is_published ? 'success' : 'secondary'}`}>
                        {c.is_published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{c.total_sessions ?? c.sessions_count ?? '—'}</td>
                    <td className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-primary">Edit</button>
                      <button
                        className={`btn btn-sm ${c.is_published ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        disabled={togglingId === c.id}
                        onClick={() => togglePublished(c)}
                      >
                        {togglingId === c.id
                          ? <span className="spinner-border spinner-border-sm"></span>
                          : c.is_published ? 'Unpublish' : 'Publish'
                        }
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
