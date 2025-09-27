import { useQuery } from '@tanstack/react-query'
import { nutritionApi } from '../services/api'

const DashboardPage = () => {
  // Example of using TanStack Query
  const { data: nutritionData, isLoading, error } = useQuery({
    queryKey: ['nutrition', 'user123'], // Replace with actual user ID
    queryFn: () => nutritionApi.getNutritionData('user123'),
    enabled: false, // Set to true when you have a real API
  })

  if (isLoading) return <div>Loading nutrition data...</div>
  if (error) return <div>Error loading data: {(error as Error).message}</div>

  return (
    <div className="container">
      <h1>Nutrition Dashboard</h1>
      <p>Track your daily nutrition intake here!</p>
      
      {nutritionData && (
        <div className="nutrition-card">
          <h2>Today's Nutrition</h2>
          <p>Calories: {nutritionData.calories}</p>
          <p>Protein: {nutritionData.protein}g</p>
          <p>Carbs: {nutritionData.carbs}g</p>
          <p>Fat: {nutritionData.fat}g</p>
        </div>
      )}
      
      <div className="placeholder">
        <p>Connect this to your backend API to see real data!</p>
      </div>
    </div>
  )
}

export default DashboardPage