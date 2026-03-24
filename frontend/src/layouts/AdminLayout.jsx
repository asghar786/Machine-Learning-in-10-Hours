import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useUIStore } from '@/store/authStore'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'

const GREEVA_CSS = [
  '/admin/css/icons.min.css',
  '/admin/css/app.min.css',
]
const GREEVA_JS = [
  '/admin/js/vendors.min.js',
  '/admin/js/app.js',
]

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
      script.id = id; script.src = src; script.async = true
      document.body.appendChild(script)
    }
  })
}

function removeAssets(assets) {
  assets.forEach((src) => {
    document.getElementById(`greeva-${src.split('/').pop().replace('.', '-')}`)?.remove()
  })
}

function injectIconify() {
  if (document.getElementById('iconify-cdn')) return
  const s = document.createElement('script')
  s.id = 'iconify-cdn'
  s.src = 'https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js'
  s.async = true
  document.body.appendChild(s)
}

export default function AdminLayout() {
  const { sidebarOpen } = useUIStore()
  const { pathname } = useLocation()

  useEffect(() => {
    const html = document.documentElement
    // Set Greeva theme attributes for dark sidebar + dark topbar
    html.setAttribute('data-menu-color', 'dark')
    html.setAttribute('data-topbar-color', 'dark')
    html.setAttribute('data-bs-theme', 'light')
    html.setAttribute('data-layout-mode', 'fluid')

    injectAssets(GREEVA_CSS, 'css')
    injectAssets(GREEVA_JS, 'js')
    injectIconify()
    document.body.classList.add('admin-layout')

    return () => {
      html.removeAttribute('data-menu-color')
      html.removeAttribute('data-topbar-color')
      html.removeAttribute('data-bs-theme')
      html.removeAttribute('data-layout-mode')
      removeAssets(GREEVA_CSS)
      removeAssets(GREEVA_JS)
      document.body.classList.remove('admin-layout')
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className={`wrapper${sidebarOpen ? '' : ' sidebar-collapsed'}`}>
      <AdminSidebar />
      {/* Topbar is a sibling of page-content, NOT inside it — matches Greeva's vertical layout */}
      <AdminTopbar />
      <div className="page-content">
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
