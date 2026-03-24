import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <section className="footer footer-4">
      <div className="footer-mid">
        <div className="container">
          <div className="row">
            {/* Brand */}
            <div className="col-xl-3 me-auto col-sm-8">
              <div className="footer-logo mb-3">
                <Link to="/"><img src="/assets/images/logo-white.png" alt="ML in 10 Hours" className="img-fluid" /></Link>
              </div>
              <div className="widget footer-widget mb-5 mb-lg-0">
                <p>Machine Learning in 10 Hours — a comprehensive certification platform with AI/ML, MS Office, DBMS and more. Learn. Practice. Get Certified.</p>
                <div className="footer-socials mt-4">
                  <a href="#"><i className="fab fa-facebook-f"></i></a>
                  <a href="#"><i className="fab fa-twitter"></i></a>
                  <a href="#"><i className="fab fa-linkedin-in"></i></a>
                  <a href="#"><i className="fab fa-youtube"></i></a>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="col-xl-2 col-sm-4">
              <div className="footer-widget mb-5 mb-lg-0">
                <h5 className="widget-title">Courses</h5>
                <ul className="list-unstyled footer-links">
                  <li><Link to="/courses?category=machine-learning">Machine Learning</Link></li>
                  <li><Link to="/courses?category=ms-office">MS Office Suite</Link></li>
                  <li><Link to="/courses?category=dbms">Database Management</Link></li>
                  <li><Link to="/courses?category=programming">Programming</Link></li>
                </ul>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-xl-2 col-sm-4">
              <div className="footer-widget mb-5 mb-lg-0">
                <h5 className="widget-title">Quick Links</h5>
                <ul className="list-unstyled footer-links">
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/insights">Insights / Blog</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/certificates/verify">Verify Certificate</Link></li>
                </ul>
              </div>
            </div>

            {/* Insights */}
            <div className="col-xl-2 col-sm-4">
              <div className="footer-widget mb-5 mb-lg-0">
                <h5 className="widget-title">Resources</h5>
                <ul className="list-unstyled footer-links">
                  <li><Link to="/insights">Blog</Link></li>
                  <li><Link to="/insights/case-studies">Case Studies</Link></li>
                  <li><Link to="#">Privacy Policy</Link></li>
                  <li><Link to="#">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="col-xl-2 col-sm-4">
              <div className="footer-widget mb-5 mb-lg-0">
                <h5 className="widget-title">Contact</h5>
                <ul className="list-unstyled footer-links">
                  <li><a href="mailto:info@ml10hours.com">info@ml10hours.com</a></li>
                  <li><a href="#">Support Center</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-btm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-6 col-sm-12 col-lg-6">
              <p className="mb-0 copyright text-sm-center text-lg-start">
                © {new Date().getFullYear()} ML in 10 Hours. All rights reserved.
              </p>
            </div>
            <div className="col-xl-6 col-sm-12 col-lg-6">
              <div className="footer-btm-links text-start text-sm-center text-lg-end">
                <Link to="#">Terms of Service</Link>&nbsp;&nbsp;
                <Link to="#">Privacy Policy</Link>&nbsp;&nbsp;
                <Link to="#">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-btm-top">
        <a href="#top-header" className="js-scroll-trigger scroll-to-top"><i className="fa fa-angle-up"></i></a>
      </div>
    </section>
  )
}
