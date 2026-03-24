import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { certificatesApi } from '@/api/coursesApi'

export default function MyCertificates() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates', 'mine'],
    queryFn: () => certificatesApi.mine().then(r => r.data),
  })

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="title-block">
            <h1>My Certificates</h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {isLoading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isLoading && certificates?.length === 0 && (
            <div className="text-center py-5">
              <i className="fa fa-certificate fa-4x text-muted mb-3"></i>
              <h4>No certificates yet. Complete a course to earn your certificate.</h4>
              <Link to="/courses" className="btn btn-main rounded mt-3">Browse Courses</Link>
            </div>
          )}

          {!isLoading && certificates?.length > 0 && (
            <div className="row">
              {certificates.map((cert) => (
                <div key={cert.id} className="col-md-4 mb-4">
                  <div className="card border-0 shadow-sm text-center p-4">
                    <i className="fa fa-certificate fa-4x text-warning mb-3"></i>
                    <h5>{cert.course?.title || cert.course_title}</h5>
                    <p className="text-muted small mb-1">
                      Issued: {new Date(cert.issued_at).toLocaleDateString()}
                    </p>
                    <p className="text-muted small mb-3">
                      <span className="font-monospace">{cert.uuid}</span>
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <Link
                        to={`/certificates/${cert.uuid}`}
                        className="btn btn-sm btn-outline-primary rounded"
                      >
                        View Certificate
                      </Link>
                      <a
                        href={`/api/v1/certificates/${cert.uuid}/download`}
                        className="btn btn-sm btn-main rounded"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
