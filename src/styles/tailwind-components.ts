// Custom color palette for nutrition app
export const colors = {
    dark_green: 'rgba(43, 54, 24, 1)',
    fade_dark_green: 'rgba(43, 54, 24, 0.6)',
    green: 'rgb(69, 94, 25)',
    black_green: 'rgba(20, 25, 11, 1)',
    white_green: 'rgba(234, 238, 229, 1)',
    white: 'rgba(255,255,255,1)',
    fade_white_green: 'rgba(234, 238, 229, 0.6)',
    fade_white: 'rgba(255, 255, 255, 0.5)',
    fade_green: 'rgba(47, 59, 26, 0.2)',
    blue: 'rgba(48, 85, 107, 1)',
    purple: 'rgba(107, 47, 85, 1)',
    red: 'rgba(112, 15, 15, 1)',
}

// Common Tailwind CSS classes for your nutrition app using custom colors

export const buttonStyles = {
  // Primary button styles (green highlighting)
  primary: `px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50`,
  primaryClasses: "px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Secondary button styles (using white_green background)
  secondary: `px-4 py-2 border font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50`,
  secondaryClasses: "px-4 py-2 border font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Success button styles (green)
  success: `px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50`,
  successClasses: "px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Blue highlight button
  blue: `px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50`,
  blueClasses: "px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Purple highlight button  
  purple: `px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50`,
  purpleClasses: "px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Danger button styles (red for errors)
  danger: `px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50`,
  dangerClasses: "px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Size variants
  small: "px-3 py-1.5 text-sm",
  large: "px-6 py-3 text-lg"
}

export const cardStyles = {
  // Basic card (white_green background)
  base: "border rounded-lg p-6 shadow-lg",
  baseClasses: "border rounded-lg p-6 shadow-lg",
  
  // Interactive card (hover effects with fade_green)
  interactive: "border rounded-lg p-6 shadow-lg transition-all duration-200 cursor-pointer",
  interactiveClasses: "border rounded-lg p-6 shadow-lg transition-all duration-200 cursor-pointer",
  
  // Success card (green highlighting)
  success: "border-2 rounded-lg p-6",
  successClasses: "border-2 rounded-lg p-6",
  
  // Error card (red for errors)
  error: "border-2 rounded-lg p-6",
  errorClasses: "border-2 rounded-lg p-6",
  
  // Blue highlight card
  blue: "border-2 rounded-lg p-6",
  blueClasses: "border-2 rounded-lg p-6",
  
  // Purple highlight card
  purple: "border-2 rounded-lg p-6",
  purpleClasses: "border-2 rounded-lg p-6"
}

export const inputStyles = {
  // Base input styles (white_green background, black_green text)
  base: "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  baseClasses: "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Error state (red highlighting)
  error: "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  errorClasses: "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  
  // Success state (green highlighting)
  success: "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50",
  successClasses: "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
}

export const textStyles = {
  // Headings (black_green for main text)
  h1: "text-4xl font-bold mb-4",
  h1Classes: "text-4xl font-bold mb-4",
  h2: "text-3xl font-semibold mb-3",
  h2Classes: "text-3xl font-semibold mb-3",
  h3: "text-2xl font-semibold mb-2",
  h3Classes: "text-2xl font-semibold mb-2",
  h4: "text-xl font-medium mb-2", 
  h4Classes: "text-xl font-medium mb-2",
  
  // Highlighted headings (green, blue, purple)
  h3Green: "text-2xl font-semibold mb-2",
  h3Blue: "text-2xl font-semibold mb-2", 
  h3Purple: "text-2xl font-semibold mb-2",
  
  // Body text (black_green and white_green variations)
  body: "leading-relaxed",
  bodyClasses: "leading-relaxed",
  bodyLarge: "text-lg leading-relaxed",
  bodyLargeClasses: "text-lg leading-relaxed",
  bodyLight: "leading-relaxed",
  bodyLightClasses: "leading-relaxed",
  
  // Small text (fade variations)
  small: "text-sm",
  smallClasses: "text-sm",
  smallFade: "text-sm",
  smallFadeClasses: "text-sm",
  
  // Links (green highlighting)
  link: "transition-colors duration-200 underline",
  linkClasses: "transition-colors duration-200 underline",
  
  // Labels (black_green)
  label: "block text-sm font-medium mb-1",
  labelClasses: "block text-sm font-medium mb-1"
}

export const layoutStyles = {
  // Background styles
  pageBackground: "min-h-screen",
  pageBackgroundClasses: "min-h-screen",
  
  // Navigation background (black_green)
  navBackground: "shadow-lg border-b",
  navBackgroundClasses: "shadow-lg border-b",
  
  // Container styles
  container: "max-w-4xl mx-auto px-4",
  containerSmall: "max-w-2xl mx-auto px-4",
  containerLarge: "max-w-6xl mx-auto px-4",
  
  // Flex layouts
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexCol: "flex flex-col",
  
  // Grid layouts
  gridCols2: "grid grid-cols-1 md:grid-cols-2 gap-6",
  gridCols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  gridCols4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
}

// Inline style objects for components that need exact color values
export const inlineStyles = {
  // Buttons
  primaryButton: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  primaryButtonHover: {
    backgroundColor: colors.dark_green,
    borderColor: colors.dark_green,
  },
  
  secondaryButton: {
    backgroundColor: colors.white_green,
    color: colors.black_green,
    borderColor: colors.dark_green,
  },
  secondaryButtonHover: {
    backgroundColor: colors.fade_white_green,
    color: colors.black_green,
  },
  
  blueButton: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  
  purpleButton: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  
  dangerButton: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  
  // Cards
  baseCard: {
    backgroundColor: colors.white_green,
    borderColor: colors.fade_dark_green,
    color: colors.black_green,
  },
  
  successCard: {
    backgroundColor: colors.fade_green,
    borderColor: colors.green,
    color: colors.black_green,
  },
  
  errorCard: {
    backgroundColor: colors.red + '20',
    borderColor: colors.red,
    color: colors.black_green,
  },
  
  // Navigation
  navigation: {
    backgroundColor: colors.black_green,
    borderColor: colors.dark_green,
  },
  
  navLink: {
    color: colors.white_green,
  },
  
  navLinkActive: {
    backgroundColor: colors.green,
    color: colors.white,
  },
  
  // Page background
  pageBackground: {
    backgroundColor: colors.white_green,
    color: colors.black_green,
  },
  
  // Text colors
  primaryText: { color: colors.black_green },
  secondaryText: { color: colors.fade_dark_green },
  highlightGreen: { color: colors.green },
  highlightBlue: { color: colors.blue },
  highlightPurple: { color: colors.purple },
  errorText: { color: colors.red },
}