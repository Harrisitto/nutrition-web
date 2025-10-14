import { useAuth } from '../../hooks/redux/hooks/auth'

const UserProfile = () => {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600">Email:</label>
          <p className="text-gray-800">{user.email}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600">User ID:</label>
          <p className="text-gray-800 text-sm font-mono">{user.id}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600">Email Verified:</label>
          <p className={`text-sm ${user.email_confirmed_at ? 'text-green-600' : 'text-red-600'}`}>
            {user.email_confirmed_at ? '✅ Verified' : '❌ Not Verified'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600">Created:</label>
          <p className="text-gray-800 text-sm">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}

export default UserProfile