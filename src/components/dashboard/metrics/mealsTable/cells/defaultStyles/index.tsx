export const cellStyles = {
    longHeader: {
        background: "border col-start-1 col-end-10 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green",
        backgroundSpan8: "border col-start-1 col-end-9 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green"
    },
    leftColumnCell: {
        background: "border col-start-1 p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green"
    },
    rightColumnCell: {
        background: `border p-3 font-semibold text-center transition-colors h-full flex items-center justify-center border-nutrition-green/30 bg-nutrition-green text-white-green hover:bg-dark-green`,
    },
    numeric: {
        display: "flex items-center justify-center border p-3 text-center transition-colors h-full border-nutrition-green/30 bg-white-green text-nutrition-green hover:bg-dark-green",
    }
} as const;