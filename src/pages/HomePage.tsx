import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to Nutrition Web</h1>
      <p>Your nutrition tracking application built with React, TypeScript, Redux, and TanStack Query!</p>
      
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default HomePage