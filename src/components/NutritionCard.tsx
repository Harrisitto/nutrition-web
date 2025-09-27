interface NutritionCardProps {
  title: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  className?: string
}

const NutritionCard: React.FC<NutritionCardProps> = ({
  title,
  calories,
  protein,
  carbs,
  fat,
  className = ""
}) => {
  return (
    <div className={`bg-white-green border border-fade-dark-green rounded-lg p-6 shadow-lg ${className}`}>
      <h3 className="text-xl font-semibold text-nutrition-green mb-4">{title}</h3>
      
      {calories !== undefined && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-nutrition-blue">{calories}</div>
            <div className="text-sm text-fade-dark-green">Calories</div>
          </div>
          
          {protein !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-nutrition-green">{protein}g</div>
              <div className="text-sm text-fade-dark-green">Protein</div>
            </div>
          )}
          
          {carbs !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-nutrition-purple">{carbs}g</div>
              <div className="text-sm text-fade-dark-green">Carbs</div>
            </div>
          )}
          
          {fat !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-dark-green">{fat}g</div>
              <div className="text-sm text-fade-dark-green">Fat</div>
            </div>
          )}
        </div>
      )}
      
      {calories === undefined && (
        <div className="mt-4 text-center text-fade-dark-green">
          <div className="text-4xl mb-2">🥗</div>
          <p>Connect to your backend API to see nutrition data!</p>
        </div>
      )}
    </div>
  )
}

export default NutritionCard