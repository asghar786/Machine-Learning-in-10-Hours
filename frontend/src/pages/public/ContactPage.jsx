import { Link } from 'react-router-dom'

export default function ContactPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="title-block">
                <h1>Contact Us</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li className="active">Contact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="email" className="form-control" placeholder="Email Address" required />
                  </div>
                  <div className="col-12 mb-3">
                    <input type="text" className="form-control" placeholder="Subject" />
                  </div>
                  <div className="col-12 mb-4">
                    <textarea className="form-control" rows="5" placeholder="Your message…"></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-main rounded">Send Message</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
