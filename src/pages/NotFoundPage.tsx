import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="error-card">
        <h1>🔍 404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        
        <div className="actions">
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage