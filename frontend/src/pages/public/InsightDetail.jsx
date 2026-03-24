import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api/coursesApi'

export default function InsightDetail() {
  const { slug } = useParams()

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getBySlug(slug).then(r => r.data),
  })

  if (isLoading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary"></div>
    </div>
  )

  if (!post) return (
    <div className="container py-5 text-center">
      <h3>Post not found</h3>
      <Link to="/insights" className="btn btn-main rounded mt-3">← Back to Insights</Link>
    </div>
  )

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="title-block">
                <h1>{post.title}</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/insights">Insights</Link></li>
                  <li className="active">{post.title}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {(post.feature_image || post.thumbnail) && (
                <img
                  src={post.feature_image || post.thumbnail}
                  className="img-fluid rounded mb-4 w-100"
                  alt={post.title}
                  style={{ maxHeight: 460, objectFit: 'cover' }}
                />
              )}
              <div className="d-flex gap-2 align-items-center mb-4">
                <span className="text-muted small">
                  <i className="fa fa-calendar me-1"></i>
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
                {post.type && (
                  <span className="badge bg-light text-dark">{post.type}</span>
                )}
                {post.author && (
                  <span className="text-muted small"><i className="fa fa-user me-1"></i>{post.author}</span>
                )}
                {post.tags?.map((tag) => (
                  <span key={tag} className="badge bg-light text-dark">{tag}</span>
                ))}
              </div>
              {/* Rendered HTML content from CMS */}
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              <div className="mt-5 pt-4 border-top d-flex gap-2">
                <span className="text-muted">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="fab fa-twitter me-1"></i>Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="fab fa-linkedin me-1"></i>LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
