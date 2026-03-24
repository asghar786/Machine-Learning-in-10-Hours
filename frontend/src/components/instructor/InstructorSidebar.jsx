import { NavLink } from 'react-router-dom'
import { useUIStore } from '@/store/authStore'

const NAV = [
  {
    group: 'Main',
    items: [
      { to: '/instructor',          icon: 'ti ti-dashboard',    label: 'Dashboard'   },
      { to: '/instructor/courses',  icon: 'ti ti-book',         label: 'My Courses'  },
      { to: '/instructor/students', icon: 'ti ti-users',        label: 'My Students' },
    ],
  },
  {
    group: 'Account',
    items: [
      { to: '/profile',  icon: 'ti ti-user-circle', label: 'My Profile'       },
      { to: '/account',  icon: 'ti ti-settings',    label: 'Account Settings' },
    ],
  },
]

export default function InstructorSidebar() {
  const { toggleSidebar } = useUIStore()

  return (
    <div className="sidenav-menu">
      <a className="logo" href="/instructor">
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

      <button className="button-sm-hover" onClick={toggleSidebar} type="button">
        <i className="ti ti-circle align-middle"></i>
      </button>

      <button className="button-close-fullsidebar" type="button">
        <i className="ti ti-x align-middle"></i>
      </button>

      <div data-simplebar="">
        <ul className="side-nav">
          {NAV.map(({ group, items }) => (
            <>
              <li key={`title-${group}`} className="side-nav-title">{group}</li>
              {items.map(({ to, icon, label }) => (
                <li key={to} className="side-nav-item">
                  <NavLink
                    to={to}
                    end={to === '/instructor'}
                    className={({ isActive }) => `side-nav-link${isActive ? ' active' : ''}`}
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
