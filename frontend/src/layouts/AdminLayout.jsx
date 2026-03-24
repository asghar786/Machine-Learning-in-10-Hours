import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useUIStore } from '@/store/authStore'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

// Greeva admin CSS/JS — loaded dynamically so they don't pollute public pages
const GREEVA_CSS = [
  '/admin/css/icons.min.css',
  '/admin/css/app.min.css',
]
const GREEVA_JS = [
  '/admin/js/vendors.min.js',
  '/admin/js/app.js',
]
const ICONIFY_ID = 'iconify-cdn'

function injectAssets(assets, type) {
  assets.forEach((src) => {
    const id = `greeva-${src.split('/').pop().replace('.', '-')}`
    if (document.getElementById(id)) return
    if (type === 'css') {
      const link = document.createElement('link')
      link.id = id; link.rel = 'stylesheet'; link.href = src
      document.head.appendChild(link)
    } else {
      const script = document.createElement('script')
      script.id = id; script.src = src; script.defer = true
      document.body.appendChild(script)
    }
  })
}

function removeAssets(assets) {
  assets.forEach((src) => {
    const id = `greeva-${src.split('/').pop().replace('.', '-')}`
    document.getElementById(id)?.remove()
  })
}

function injectIconify() {
  if (document.getElementById(ICONIFY_ID)) return
  const s = document.createElement('script')
  s.id = ICONIFY_ID
  s.src = 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js'
  s.defer = true
  document.body.appendChild(s)
}

export default function AdminLayout() {
  const { sidebarOpen } = useUIStore()
  const { pathname } = useLocation()

  useEffect(() => {
    injectAssets(GREEVA_CSS, 'css')
    injectAssets(GREEVA_JS, 'js')
    injectIconify()
    document.body.classList.add('admin-layout')

    return () => {
      // Remove Greeva assets when leaving admin
      removeAssets(GREEVA_CSS, 'css')
      removeAssets(GREEVA_JS, 'js')
      document.body.classList.remove('admin-layout')
    }
  }, [])

  // Scroll to top on admin route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className={`wrapper ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <AdminSidebar />
      <div className="page-content">
        <AdminTopbar />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
