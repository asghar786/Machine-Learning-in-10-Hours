import { NavLink } from 'react-router-dom'
import { useUIStore } from '@/store/authStore'


const NAV = [
  {
    group: 'Main',
    items: [
      { to: '/admin',             icon: 'ti ti-dashboard',       label: 'Dashboard'        },
      { to: '/admin/users',        icon: 'ti ti-users',           label: 'Users'            },
      { to: '/admin/instructors', icon: 'ti ti-chalkboard',      label: 'Instructors'      },
      { to: '/admin/courses',     icon: 'ti ti-book',            label: 'Courses'          },
      { to: '/admin/submissions', icon: 'ti ti-file-upload',     label: 'Submissions'      },
      { to: '/admin/analytics',   icon: 'ti ti-chart-bar',       label: 'Analytics'        },
      { to: '/admin/visits',      icon: 'ti ti-eye',             label: 'Visit Tracking'   },
    ],
  },
  {
    group: 'Settings',
    items: [
      { to: '/admin/posts',       icon: 'ti ti-pencil',          label: 'Posts / Insights' },
      { to: '/admin/settings',    icon: 'ti ti-settings',        label: 'Site Settings'    },
      { to: '/admin/seo',         icon: 'ti ti-world',           label: 'SEO / SMM'        },
    ],
  },
]

export default function AdminSidebar() {
  const { toggleSidebar, closeSidebar } = useUIStore()

  return (
    <div className="sidenav-menu">
      {/* Brand Logo */}
      <a className="logo" href="/admin">
        <span className="logo-light">
          <span className="logo-lg">
            <img alt="logo" src="/assets/images/logo.png" style={{ height: 36 }} />
          </span>
          <span className="logo-sm">
            <img alt="logo" src="/assets/images/logo.png" style={{ height: 30 }} />
          </span>
        </span>
        <span className="logo-dark">
          <span className="logo-lg">
            <img alt="logo" src="/assets/images/logo.png" style={{ height: 36 }} />
          </span>
          <span className="logo-sm">
            <img alt="logo" src="/assets/images/logo.png" style={{ height: 30 }} />
          </span>
        </span>
      </a>

      {/* Hover toggle */}
      <button className="button-sm-hover" onClick={toggleSidebar} type="button">
        <i className="ti ti-circle align-middle"></i>
      </button>

      {/* Full sidebar close (mobile) */}
      <button className="button-close-fullsidebar" type="button" onClick={closeSidebar}>
        <i className="ti ti-x align-middle"></i>
      </button>

      <div data-simplebar="">
        <ul className="side-nav">
          {NAV.map(({ group, items }) => (
            <>
              {/* Group title is its own <li> — Greeva flat structure */}
              <li key={`title-${group}`} className="side-nav-title">{group}</li>

              {items.map(({ to, icon, label }) => (
                <li key={to} className="side-nav-item">
                  <NavLink
                    to={to}
                    end={to === '/admin'}
                    className={({ isActive }) =>
                      `side-nav-link${isActive ? ' active' : ''}`
                    }
                  >
                    <span className="menu-icon"><i className={icon}></i></span>
                    <span className="menu-text">{label}</span>
                  </NavLink>
                </li>
              ))}
            </>
          ))}
        </ul>
      </div>
    </div>
  )
}
