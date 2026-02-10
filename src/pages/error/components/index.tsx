import type { ErrorState } from "@src/store/slices/error/store";

const Title = ({ error }: { error: ErrorState }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          An Error Occurred
        </h1>
        <p className="text-gray-800 mb-2">
          Message: {error.message || "Unknown error"}
        </p>
        {error.action && (
          <p className="text-gray-800 mb-2">Action: {error.action}</p>
        )}
        {error.routeStack.length > 0 && (
          <div className="mb-2">
            <p className="text-gray-800 font-semibold">Route Stack:</p>
            <ul className="list-disc list-inside text-gray-700">
              {error.routeStack.map((route, index) => (
                <li key={index}>{route}</li>
              ))}
            </ul>
          </div>
        )}
        {error.component && (
          <p className="text-gray-800 mb-2">Component: {error.component}</p>
        )}
        {error.timestamp && (
          <p className="text-gray-800 mb-2">
            Time: {new Date(error.timestamp).toLocaleString()}
          </p>
        )}
      </div>
  )
}

const ClearButton = ({ onClear }: { onClear: () => void }) => {
  return (
    <button
      onClick={onClear}
      className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      Clear Error
    </button>
  );
}

export const ErrorComponents = {
  Title,
  ClearButton,
}
