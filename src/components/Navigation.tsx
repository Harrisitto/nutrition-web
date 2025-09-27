import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">Nutrition Web</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'active' : ''}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            to="/profile" 
            className={isActive('/profile') ? 'active' : ''}
          >
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation