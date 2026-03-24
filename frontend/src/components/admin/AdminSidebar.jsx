import { NavLink, useLocation } from 'react-router-dom'
import { useUIStore } from '@/store/authStore'

const NAV = [
  { group: 'Main',
    items: [
      { to: '/admin',          icon: 'ti ti-dashboard',      label: 'Dashboard'    },
      { to: '/admin/users',    icon: 'ti ti-users',          label: 'Users'        },
      { to: '/admin/courses',  icon: 'ti ti-book',           label: 'Courses'      },
      { to: '/admin/submissions', icon: 'ti ti-file-upload', label: 'Submissions'  },
      { to: '/admin/analytics',icon: 'ti ti-chart-bar',      label: 'Analytics'    },
    ]
  },
  { group: 'Settings',
    items: [
      { to: '/admin/settings', icon: 'ti ti-settings',       label: 'Site Settings' },
      { to: '/admin/seo',      icon: 'ti ti-world',          label: 'SEO / SMM'     },
      { to: '/admin/posts',    icon: 'ti ti-pencil',          label: 'Posts / Insights' },
    ]
  },
]

export default function AdminSidebar() {
  const { toggleSidebar } = useUIStore()
  const location = useLocation()

  return (
    <div className="sidenav-menu">
      {/* Logo */}
      <a className="logo" href="/admin">
        <span className="logo-light">
          <span className="logo-lg">
            <img alt="logo" src="/assets/images/logo.png" style={{ height: 36 }} />
          </span>
          <span className="logo-sm">
            <img alt="logo" src="/assets/images/logo.png" style={{ height: 30 }} />
          </span>
        </span>
      </a>

      <button className="button-sm-hover" onClick={toggleSidebar}>
        <i className="ti ti-circle align-middle"></i>
      </button>

      <div data-simplebar="">
        <ul className="side-nav">
          {NAV.map(({ group, items }) => (
            <li key={group} className="side-nav-title side-nav-item">
              <span className="side-nav-title">{group}</span>
              {items.map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) => `side-nav-link${isActive ? ' active' : ''}`}
                >
                  <span className="menu-icon"><i className={icon}></i></span>
                  <span className="menu-text">{label}</span>
                </NavLink>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
