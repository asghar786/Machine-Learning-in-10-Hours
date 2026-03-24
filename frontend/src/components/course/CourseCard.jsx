import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  const {
    slug,
    title,
    thumbnail,
    price,
    original_price,
    rating = 0,
    review_count = 0,
    duration_hours,
    total_sessions,
    instructor_name,
    category,
    is_free = false,
    badge,
  } = course

  const stars = Array.from({ length: 5 }, (_, i) => (
    <i key={i} className={`fa fa-star ${i < Math.round(rating) ? 'text-warning' : 'text-muted'}`}></i>
  ))

  return (
    <div className="course-grid bg-shadow tooltip-style">
      <div className="course-header">
        <div className="course-thumb">
          <img
            src={thumbnail || '/assets/images/course/img_06.jpg'}
            alt={title}
            className="img-fluid"
          />
          <div className="course-price">
            {is_free ? 'Free' : price ? `$${price}` : 'Enroll'}
          </div>
          {badge && <span className="badge bg-danger position-absolute top-0 start-0 m-2">{badge}</span>}
        </div>
      </div>

      <div className="course-content">
        {category && <span className="course-tag">{category}</span>}
        <h4 className="mb-2">
          <Link to={`/courses/${slug}`}>{title}</Link>
        </h4>

        {instructor_name && (
          <div className="course-meta mb-2">
            <span className="text-muted small">
              <i className="fa fa-user me-1"></i>{instructor_name}
            </span>
          </div>
        )}

        <div className="rating-wrap d-flex align-items-center gap-2">
          <div className="rating">{stars}</div>
          <span className="text-muted small">({review_count})</span>
        </div>

        <div className="course-footer mt-3 d-flex justify-content-between align-items-center">
          <div className="meta-info small text-muted">
            {duration_hours && (
              <span className="me-3"><i className="fa fa-clock me-1"></i>{duration_hours} hr</span>
            )}
            {total_sessions && (
              <span><i className="fa fa-list me-1"></i>{total_sessions} Sessions</span>
            )}
          </div>
          {original_price && price < original_price && (
            <span className="text-muted text-decoration-line-through small">${original_price}</span>
          )}
        </div>
      </div>
    </div>
  )
}
