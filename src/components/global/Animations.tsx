import { useState, useEffect } from 'react';

type PropsLoading = {
	size?: number;
	color?: string;
	className?: string;
};

export const AnimationLoading = ({ size = 40, color = 'gray', className = "" }: PropsLoading) => {
	return (
		<div role="status" className={"inline-block " + className}>
			<svg
				width={size}
				height={size}
				viewBox="0 0 50 50"
				className="animate-spin"
				aria-hidden="true"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke={color}
					strokeWidth="4"
					strokeLinecap="round"
					strokeDasharray="90"
					strokeDashoffset="60"
				/>
			</svg>
		</div>
	);
};

interface InitialAnimationProps {
  /** Duración de la animación en milisegundos */
  duration?: number;
  /** Callback opcional que se ejecuta al finalizar la animación */
  onComplete?: () => void;
}

export const InitialAnimation = ({
  duration = 500,
  onComplete,
}: InitialAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Inicia la transición de salida 400ms antes de que termine la duración total
    const fadeTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(0, duration - 400));

    // Desmonta el componente y notifica la finalización
    const completeTimeout = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(completeTimeout);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-white-green transition-opacity duration-500 ease-in-out
        ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      <div className="relative flex flex-col items-center">
        {/* Halo decorativo de fondo */}
        <div className="absolute -inset-4 bg-nutrition-green/10 rounded-full blur-xl animate-pulse" />

        {/* Contenedor del Icono con animación de escala y flotación */}
        <div className="relative mb-6 p-6 bg-white rounded-3xl shadow-lg border border-nutrition-green/20 animate-bounce duration-1000">
          <svg
            className="w-20 h-20 text-nutrition-green transform transition-transform duration-700 hover:scale-110"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {/* SVG Manzana / Nutrición */}
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
        </div>

        {/* Texto con Fade-in suave */}
        <h1 className="text-2xl md:text-3xl font-bold text-dark-green tracking-wide animate-fade-in">
          EzFood
        </h1>

        {/* Indicador de carga inferior */}
        <div className="mt-8 w-32 h-1.5 bg-gray-blue-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-nutrition-green rounded-full origin-left animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};
