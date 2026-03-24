import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { coursesApi } from '@/api/coursesApi'
import CourseCard from '@/components/course/CourseCard'

const CATEGORIES = ['All', 'Machine Learning', 'MS Office', 'Database Management', 'Programming']

export default function CourseCatalog() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { search, category }],
    queryFn: () => coursesApi.getAll({ search: search || undefined, category: category || undefined }),
    select: (res) => res.data.data,
  })

  const courses = data || []

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-8">
              <div className="title-block">
                <h1>All Courses</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li className="active">Courses</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section className="section-padding page">
        <div className="course-top-wrap">
          <div className="container">
            <div className="row align-items-center mb-4">
              <div className="col-lg-8">
                <p>{!isLoading && `${courses.length} course${courses.length !== 1 ? 's' : ''} found`}</p>
              </div>
              <div className="col-lg-4">
                <div className="topbar-search">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Search courses…"
                      className="form-control"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <label><i className="fa fa-search"></i></label>
                  </form>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="d-flex flex-wrap gap-2 mb-5">
              {CATEGORIES.map((cat) => {
                const key = cat === 'All' ? '' : cat
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(key)}
                    className={`btn btn-sm rounded-pill ${category === key ? 'btn-main' : 'btn-outline-secondary'}`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="fa fa-search fa-3x text-muted mb-3"></i>
                <p className="text-muted">No courses found. Try a different search or category.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="col-xl-4 col-lg-4 col-md-6 mb-4">
                  <CourseCard course={course} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
