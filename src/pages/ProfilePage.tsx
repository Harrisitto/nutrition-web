import { useQuery } from '@tanstack/react-query'
import { nutritionApi } from '../services/api'
import UserProfile from '../components/auth/UserProfile'

const ProfilePage = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: nutritionApi.getProfile,
    enabled: false,
  })

  if (isLoading) return <div className="w-full px-8 py-12 text-center">Loading profile...</div>
  if (error) return <div className="w-full px-8 py-12 text-center text-nutrition-red">Error loading profile: {(error as Error).message}</div>

  return (
    <div className="w-full px-8">
      <h1 className="text-4xl font-bold text-black-green mb-8 text-center">User Profile</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <UserProfile />
        </div>
        
        {profile ? (
          <div className="bg-white-green border border-fade-dark-green rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-nutrition-green mb-2">Welcome, {profile.name}!</h2>
            <p className="text-black-green">Email: {profile.email}</p>
            <p className="text-black-green">ID: {profile.id}</p>
          </div>
        ) : (
          <div className="bg-white-green border border-fade-dark-green rounded-lg p-6 shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-nutrition-green mb-2">Profile Placeholder</h2>
            <p className="text-fade-dark-green">Connect this to your backend API to see real profile data!</p>
            <p className="text-fade-dark-green">This page demonstrates TanStack Query integration.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
