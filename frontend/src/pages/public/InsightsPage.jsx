import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/api/coursesApi'

export default function InsightsPage() {
  const [type, setType] = useState('')

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', type],
    queryFn: () => postsApi.getAll({ type: type || undefined }),
    select: (res) => res.data.data,
  })

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="title-block">
                <h1>Insights</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li className="active">Insights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {/* Type tabs */}
          <div className="d-flex gap-3 mb-5">
            {[['', 'All'], ['blog', 'Blog Posts'], ['case-study', 'Case Studies'], ['news', 'News']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`btn rounded-pill ${type === key ? 'btn-main' : 'btn-outline-secondary'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="row">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border"></div>
              </div>
            ) : !posts || posts.length === 0 ? (
              <div className="col-12 text-center py-5 text-muted">
                <i className="fa fa-pencil-alt fa-3x mb-3"></i>
                <p>No posts yet. Check back soon!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="col-xl-4 col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    {post.thumbnail && (
                      <img src={post.thumbnail} className="card-img-top" alt={post.title} style={{ height: 200, objectFit: 'cover' }} />
                    )}
                    <div className="card-body">
                      <div className="d-flex gap-2 mb-2">
                        {post.type && (
                          <span className="badge bg-light text-dark small">{post.type}</span>
                        )}
                        {post.tags?.map((tag) => (
                          <span key={tag} className="badge bg-light text-dark small">{tag}</span>
                        ))}
                      </div>
                      <h5><Link to={`/insights/${post.slug}`} className="text-dark">{post.title}</Link></h5>
                      <p className="text-muted small">{post.excerpt}</p>
                    </div>
                    <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                      <span className="text-muted small">{new Date(post.published_at).toLocaleDateString()}</span>
                      <Link to={`/insights/${post.slug}`} className="btn btn-sm btn-outline-primary rounded">Read More →</Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
