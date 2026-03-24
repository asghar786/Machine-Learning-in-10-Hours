import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { certificatesApi } from '@/api/coursesApi'

export default function CertificateVerify() {
  const { uuid } = useParams()

  const { data: cert, isLoading, isError } = useQuery({
    queryKey: ['certificate', uuid],
    queryFn: () => certificatesApi.verify(uuid),
    select: (res) => res.data.data,
    retry: false,
  })

  return (
    <section className="section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            {isLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            )}

            {isError && (
              <div className="text-center py-5">
                <i className="fa fa-times-circle fa-4x text-danger mb-3"></i>
                <h3>Certificate Not Found</h3>
                <p className="text-muted">Certificate not found or invalid.</p>
                <span className="badge bg-danger fs-6 mb-3">INVALID</span>
                <br />
                <Link to="/" className="btn btn-main rounded mt-3">Go Home</Link>
              </div>
            )}

            {!isLoading && !isError && !cert && (
              <div className="text-center py-5">
                <i className="fa fa-times-circle fa-4x text-danger mb-3"></i>
                <h3>Certificate Not Found</h3>
                <p className="text-muted">Certificate not found or invalid.</p>
                <span className="badge bg-danger fs-6 mb-3">INVALID</span>
                <br />
                <Link to="/" className="btn btn-main rounded mt-3">Go Home</Link>
              </div>
            )}

            {cert && (
              <div className="card shadow p-5 text-center border-0">
                {cert.is_revoked ? (
                  <div className="badge bg-danger fs-6 mb-3">REVOKED</div>
                ) : (
                  <div className="badge bg-success fs-6 mb-3">VALID</div>
                )}
                <h2 className="mb-1">{cert.user_name}</h2>
                <p className="text-muted mb-3">has successfully completed</p>
                <h3 className="text-color mb-3">{cert.course_title}</h3>
                <p><strong>Score:</strong> {cert.final_score}%</p>
                <p><strong>Issued:</strong> {new Date(cert.issued_at).toLocaleDateString()}</p>
                <p className="text-muted small mt-3">Certificate ID: {uuid}</p>
                {!cert.is_revoked && (
                  <a href={`/api/v1/certificates/${uuid}/download`} className="btn btn-main rounded mt-3">
                    <i className="fa fa-download me-2"></i>Download PDF
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
