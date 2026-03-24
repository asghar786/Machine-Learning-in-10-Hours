import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'

export default function AdminUsers() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => axiosInstance.get('/admin/users'),
    select: (res) => res.data,
  })
  const [search, setSearch] = useState('')

  const allUsers = data?.data || []
  const q = search.toLowerCase()
  const users = q
    ? allUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    : allUsers

  // Track which user row is being edited and what the selected role is
  const [editingId, setEditingId]   = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [saving, setSaving]         = useState(false)

  const startEdit = (user) => {
    setEditingId(user.id)
    setSelectedRole(user.role)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setSelectedRole('')
  }

  const saveRole = async (userId) => {
    setSaving(true)
    try {
      await axiosInstance.put(`/admin/users/${userId}`, { role: selectedRole })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      setEditingId(null)
      setSelectedRole('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title mb-1">Users</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/admin">Dashboard</a></li>
              <li className="breadcrumb-item active">Users</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">All Users</h5>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search users…"
              style={{ width: 200 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Group</th>
                  <th>Enrolled Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="7" className="text-center text-muted py-4">No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      {editingId === u.id ? (
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm"
                            style={{ width: 110 }}
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="student">student</option>
                            <option value="instructor">instructor</option>
                            <option value="admin">admin</option>
                          </select>
                          <button
                            className="btn btn-sm btn-success"
                            disabled={saving}
                            onClick={() => saveRole(u.id)}
                          >
                            {saving ? <span className="spinner-border spinner-border-sm"></span> : 'Save'}
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>✕</button>
                        </div>
                      ) : (
                        <span className={`badge bg-${u.role === 'admin' ? 'danger' : u.role === 'instructor' ? 'warning' : 'primary'}`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td><span className="badge bg-info">Group {u.exercise_group}</span></td>
                    <td>{u.enrollments_count ?? '—'}</td>
                    <td>
                      {editingId !== u.id && (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(u)}>
                          Edit Role
                        </button>
                      )}
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
