import { useQuery } from '@tanstack/react-query'
import { nutritionApi } from '../services/api'
import NutritionCard from '../components/NutritionCard'
import { layoutStyles, textStyles } from '../styles/tailwind-components'

const DashboardPage = () => {
  // Example of using TanStack Query
  const { data: nutritionData, isLoading, error } = useQuery({
    queryKey: ['nutrition', 'user123'], // Replace with actual user ID
    queryFn: () => nutritionApi.getNutritionData('user123'),
    enabled: false, // Set to true when you have a real API
  })

  if (isLoading) {
    return (
      <div className="w-full px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={textStyles.body}>Loading nutrition data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full px-8">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-400">Error loading data: {(error as Error).message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-8">
      <div className="mb-8">
        <h1 className={textStyles.h1}>Nutrition Dashboard</h1>
        <p className={textStyles.bodyLarge}>Track your daily nutrition intake here!</p>
      </div>
      
      <div className={layoutStyles.gridCols2}>
        <NutritionCard
          title="Today's Nutrition"
          calories={nutritionData?.calories}
          protein={nutritionData?.protein}
          carbs={nutritionData?.carbs}
          fat={nutritionData?.fat}
        />
        
        <NutritionCard
          title="Weekly Average"
          calories={1850}
          protein={120}
          carbs={200}
          fat={65}
        />
      </div>
      
      <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className={textStyles.h3}>Quick Stats</h2>
        <div className={layoutStyles.gridCols4}>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-400">7 days</div>
            <div className="text-sm text-gray-400">Current streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-400">85%</div>
            <div className="text-sm text-gray-400">Goal completion</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-400">1,250</div>
            <div className="text-sm text-gray-400">Total meals logged</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-400">4.8</div>
            <div className="text-sm text-gray-400">Average rating</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage