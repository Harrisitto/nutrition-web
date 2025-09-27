import { useQuery } from '@tanstack/react-query'
import { nutritionApi } from '../services/api'

const ProfilePage = () => {
  // Example of using TanStack Query for profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: nutritionApi.getProfile,
    enabled: false, // Set to true when you have a real API
  })

  if (isLoading) return <div>Loading profile...</div>
  if (error) return <div>Error loading profile: {(error as Error).message}</div>

  return (
    <div className="container">
      <h1>User Profile</h1>
      
      {profile ? (
        <div className="profile-card">
          <h2>Welcome, {profile.name}!</h2>
          <p>Email: {profile.email}</p>
          <p>ID: {profile.id}</p>
        </div>
      ) : (
        <div className="placeholder">
          <h2>Profile Placeholder</h2>
          <p>Connect this to your backend API to see real profile data!</p>
          <p>This page demonstrates TanStack Query integration.</p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage