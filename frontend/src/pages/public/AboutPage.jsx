import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="title-block">
                <h1>About Us</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li className="active">About</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="section-heading">
                <h2>Our Mission</h2>
                <p>We believe professional education should be accessible, practical, and verifiable. Our platform delivers structured 10-hour courses with hands-on exercises, real datasets, and blockchain-ready certificates — across Machine Learning, MS Office, Database Management, and more.</p>
                <Link to="/courses" className="btn btn-main rounded mt-3">Explore Courses</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/assets/images/about/about_img.png" alt="About" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
