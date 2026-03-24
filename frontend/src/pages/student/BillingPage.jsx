import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { paymentsApi } from '@/api/paymentsApi'

const STATUS_COLOR = {
  paid:     { bg: 'bg-success', label: 'Paid' },
  pending:  { bg: 'bg-warning text-dark', label: 'Pending' },
  failed:   { bg: 'bg-danger', label: 'Failed' },
  refunded: { bg: 'bg-secondary', label: 'Refunded' },
}

function InvoicePrint({ payment }) {
  const handlePrint = () => {
    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>Invoice ${payment.invoice_number}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1a3c5e; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 22px; font-weight: bold; color: #1a3c5e; }
        .invoice-title { font-size: 28px; color: #1a3c5e; text-align: right; }
        .invoice-meta { text-align: right; color: #666; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: #1a3c5e; color: #fff; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #1a3c5e; }
        .status-paid { color: #28a745; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
      </style></head><body>
      <div class="header">
        <div>
          <div class="logo">ML in 10 Hours</div>
          <div style="font-size:13px;color:#666;margin-top:4px">info@ml10hours.com</div>
        </div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-meta">${payment.invoice_number}</div>
          <div class="invoice-meta">Date: ${new Date(payment.paid_at || payment.created_at).toLocaleDateString()}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Method</th><th>Transaction ID</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          <tr>
            <td>${payment.course_title}</td>
            <td style="text-transform:capitalize">${payment.payment_method}</td>
            <td style="font-family:monospace;font-size:12px">${payment.transaction_id || '—'}</td>
            <td style="text-align:right">$${parseFloat(payment.amount).toFixed(2)} ${payment.currency}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3">Total</td>
            <td style="text-align:right">$${parseFloat(payment.amount).toFixed(2)} ${payment.currency}</td>
          </tr>
        </tbody>
      </table>
      <p class="status-paid">Status: ${payment.status.toUpperCase()}</p>
      <div class="footer">Thank you for enrolling with ML in 10 Hours · machinelearning.local</div>
      </body></html>
    `)
    win.document.close()
    win.print()
  }
  return (
    <button className="btn btn-sm btn-outline-secondary" onClick={handlePrint} title="Print / Download Invoice">
      <i className="fa fa-download me-1"></i>Invoice
    </button>
  )
}

export default function BillingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments', 'mine'],
    queryFn: () => paymentsApi.all().then(r => r.data),
  })

  const payments = data?.payments ?? []
  const summary  = data?.summary  ?? { total_paid: 0, total_count: 0, paid_count: 0, pending_count: 0 }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="title-block">
                <h1>Billing &amp; Invoices</h1>
                <ul className="header-bradcrumb justify-content-center">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li className="active">Billing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">

          {/* Summary cards */}
          <div className="row g-3 mb-5">
            {[
              { icon: 'fa-dollar-sign',    label: 'Total Paid',       value: `$${parseFloat(summary.total_paid).toFixed(2)}`, color: 'text-success' },
              { icon: 'fa-file-invoice',   label: 'Total Invoices',   value: summary.total_count,   color: 'text-primary' },
              { icon: 'fa-check-circle',   label: 'Paid',             value: summary.paid_count,    color: 'text-success' },
              { icon: 'fa-clock',          label: 'Pending',          value: summary.pending_count, color: 'text-warning' },
            ].map(s => (
              <div key={s.label} className="col-md-3 col-sm-6">
                <div className="card border-0 shadow-sm text-center p-4">
                  <i className={`fa ${s.icon} fa-2x ${s.color} mb-2`}></i>
                  <h3 className="mb-0">{s.value}</h3>
                  <p className="text-muted mb-0 small">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Invoices table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
              <h5 className="mb-0"><i className="fa fa-file-invoice me-2 text-primary"></i>Payment History</h5>
              <small className="text-muted">{payments.length} record{payments.length !== 1 ? 's' : ''}</small>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="card-body text-center py-5">
                <i className="fa fa-file-invoice fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No invoices yet</h5>
                <p className="text-muted small mb-3">Enroll in a course to generate your first invoice.</p>
                <Link to="/courses" className="btn btn-main rounded">Browse Courses</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice #</th>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => {
                      const st = STATUS_COLOR[p.status] ?? STATUS_COLOR.paid
                      return (
                        <tr key={p.id}>
                          <td>
                            <span className="font-monospace small fw-semibold">{p.invoice_number}</span>
                          </td>
                          <td>
                            <span className="fw-medium">{p.course_title}</span>
                          </td>
                          <td className="text-muted small">
                            {new Date(p.paid_at || p.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </td>
                          <td>
                            <span className="text-capitalize">
                              <i className={`fa fa-${p.payment_method === 'card' ? 'credit-card' : 'money-bill'} me-1 text-muted`}></i>
                              {p.payment_method}
                            </span>
                          </td>
                          <td className="fw-semibold">
                            ${parseFloat(p.amount).toFixed(2)}
                            <small className="text-muted ms-1">{p.currency}</small>
                          </td>
                          <td>
                            <span className={`badge ${st.bg}`}>{st.label}</span>
                          </td>
                          <td>
                            <InvoicePrint payment={p} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="alert alert-info border-0 mt-4 d-flex align-items-start gap-2">
            <i className="fa fa-info-circle mt-1 flex-shrink-0"></i>
            <div>
              <strong>Need help with a payment?</strong> Contact us at{' '}
              <a href="mailto:info@ml10hours.com">info@ml10hours.com</a> and quote your invoice number.
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
