import useAppNavigation from '../../hooks/navigation'

const NavigationExample = () => {
  const {
    goToHome,
    goToDashboard,
    goToProfile,
    goToLogin,
    safeNavigate,
    getCurrentRouteMetadata,
    getBreadcrumb,
    getNavigationItems,
    isRouteActive,
    currentRoute,
    isAuthenticated,
    ROUTES,
  } = useAppNavigation()

  const currentMeta = getCurrentRouteMetadata()
  const breadcrumb = getBreadcrumb()
  const navItems = getNavigationItems()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Navigation Hook Demo</h2>
      
      {/* Current Route Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Route</h3>
        <p className="text-sm">
          <span className="font-medium">Path:</span> {currentRoute}
        </p>
        <p className="text-sm">
          <span className="font-medium">Title:</span> {currentMeta.icon} {currentMeta.title}
        </p>
        <p className="text-sm">
          <span className="font-medium">Protected:</span> {currentMeta.isProtected ? 'Yes' : 'No'}
        </p>
        <p className="text-sm">
          <span className="font-medium">Authenticated:</span> {isAuthenticated ? 'Yes' : 'No'}
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Breadcrumb</h3>
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumb.map((crumb, index) => (
            <div key={crumb.route} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <button
                onClick={() => safeNavigate(crumb.route)}
                className="text-blue-600 hover:text-blue-800"
              >
                {crumb.icon} {crumb.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Quick Navigation</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={goToHome}
            className={`p-3 rounded-lg text-left transition-colors ${
              isRouteActive(ROUTES.HOME)
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="font-medium">🏠 Home</div>
            <div className="text-sm text-gray-600">Welcome page</div>
          </button>
          
          <button
            onClick={goToDashboard}
            className={`p-3 rounded-lg text-left transition-colors ${
              isRouteActive(ROUTES.DASHBOARD)
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="font-medium">📊 Dashboard</div>
            <div className="text-sm text-gray-600">Your data</div>
          </button>
          
          <button
            onClick={goToProfile}
            className={`p-3 rounded-lg text-left transition-colors ${
              isRouteActive(ROUTES.PROFILE)
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="font-medium">👤 Profile</div>
            <div className="text-sm text-gray-600">Your profile</div>
          </button>
          
          <button
            onClick={goToLogin}
            className={`p-3 rounded-lg text-left transition-colors ${
              isRouteActive(ROUTES.LOGIN)
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="font-medium">🔐 Login</div>
            <div className="text-sm text-gray-600">Sign in</div>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Generated Navigation Items</h3>
        <div className="space-y-2">
          {navItems.map((item) => (
            <div
              key={item.route}
              className={`p-2 rounded flex items-center justify-between ${
                item.isActive ? 'bg-blue-100' : 'bg-gray-50'
              }`}
            >
              <span>
                {item.icon} {item.label}
              </span>
              <button
                onClick={() => safeNavigate(item.route)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Go →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Navigation Example */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Safe Navigation</h3>
        <p className="text-sm text-gray-600 mb-3">
          These buttons use safeNavigate which checks authentication before navigating to protected routes.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => safeNavigate(ROUTES.DASHBOARD)}
            className="w-full p-2 bg-green-100 hover:bg-green-200 rounded text-left"
          >
            Try to access Dashboard (Protected)
          </button>
          <button
            onClick={() => safeNavigate(ROUTES.HOME)}
            className="w-full p-2 bg-green-100 hover:bg-green-200 rounded text-left"
          >
            Go to Home (Public)
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavigationExample