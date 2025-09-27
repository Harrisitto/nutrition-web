import { Link } from 'react-router-dom'
import NavigationUtils from '../components/navigation/NavigationUtils'

const HomePage = () => {
  return (
    <div className="w-full px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black-green mb-4">Welcome to Nutrition Web</h1>
        <p className="text-lg text-fade-dark-green leading-relaxed">
          Your nutrition tracking application built with React, TypeScript, Redux, and TanStack Query!
        </p>
      </div>
      
      <nav className="bg-white-green border border-fade-dark-green rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-xl font-semibold text-nutrition-green mb-4">Quick Navigation</h2>
        <ul className="flex flex-wrap gap-4">
          <li>
            <Link 
              to="/dashboard" 
              className="inline-block px-6 py-3 bg-nutrition-blue hover:bg-opacity-80 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className="inline-block px-6 py-3 bg-nutrition-purple hover:bg-opacity-80 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              👤 Profile
            </Link>
          </li>
        </ul>
      </nav>

      <NavigationUtils />
    </div>
  )
}

export default HomePage