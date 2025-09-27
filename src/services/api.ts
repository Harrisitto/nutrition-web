import { API_BASE_URL } from './queryClient'

// Generic API function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Example API functions
export const nutritionApi = {
  // Example: Get user profile
  getProfile: () => apiRequest<{ id: string; name: string; email: string }>('/profile'),
  
  // Example: Get nutrition data
  getNutritionData: (userId: string) => 
    apiRequest<{ calories: number; protein: number; carbs: number; fat: number }>(`/nutrition/${userId}`),
}