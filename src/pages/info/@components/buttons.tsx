import React from "react";

export type ButtonVariant =
  | "primary" // Verde nutrición principal (bg-nutrition-green)
  | "dark" // Verde oscuro corporativo (bg-dark-green)
  | "secondary" // Blanco con borde gray-blue
  | "ghost" // Texto plano para links de navbar
  | "stripe-starter" // Azul/gris oscuro para plan Starter
  | "stripe-pro" // Verde nutrición destacado para plan Pro
  | "instagram"; // Púrpura nutrición para red social

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  children,
  className = "",
  ...props
}) => {
  // Clases base comunes a todos los botones
  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nutrition-green disabled:opacity-50 disabled:cursor-not-allowed";

  // Mapeo de estilos usando tus colores de Tailwind personalizados
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-nutrition-green text-text-light hover:bg-dark-green shadow-md hover:-translate-y-0.5",
    dark: "bg-dark-green text-text-light hover:bg-black-green shadow-md hover:-translate-y-0.5",
    secondary:
      "bg-white border-2 border-gray-blue-200 text-text-title hover:bg-gray-blue-50 shadow-sm",
    ghost:
      "bg-transparent text-text-title hover:text-nutrition-green font-medium",
    "stripe-starter":
      "bg-gray-blue-700 hover:bg-gray-blue-600 text-white shadow-md",
    "stripe-pro":
      "bg-nutrition-green hover:bg-opacity-90 text-text-light shadow-lg",
    instagram: "bg-nutrition-purple text-text-light hover:opacity-90 shadow-md",
  };

  // Tamaños
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
