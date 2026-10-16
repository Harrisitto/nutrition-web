import { Cookie } from "lucide-react";
import type { PosterIntake } from "./posterData";

/**
 * Tarjeta cuadrada de una toma: la imagen del ingrediente ocupa casi toda la tarjeta y encima
 * van las unidades (arriba a la derecha, azul) y el nombre (abajo, verde), con un fondo blanco
 * semitransparente que deja leerlos sin tapar del todo la imagen. El "durante" no va aquí: se
 * ve en la barra púrpura de debajo del perfil. Sin borde: el blanco sobre el fondo de la caja
 * y una sombra mínima la separan. El texto escala con el tamaño de la tarjeta.
 */
export const IntakeCard = ({ intake, size }: { intake: PosterIntake; size: number }) => (
  <div
    className="relative shrink-0 overflow-hidden rounded-[0.85em] bg-white shadow-[0_1px_2px_rgba(43,54,24,0.08),0_2px_8px_rgba(43,54,24,0.06)]"
    style={{ width: size, height: size, fontSize: Math.max(13, Math.round(size * 0.13)) }}
  >
    {intake.imageUrl ? (
      <img src={intake.imageUrl} alt="" className="h-full w-full object-contain p-[6%]" />
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <Cookie size={size * 0.4} className="text-nutrition-green/35" />
      </div>
    )}

    <span className="absolute right-[0.3em] top-[0.3em] rounded-full bg-white/80 px-[0.45em] py-[0.1em] font-bold leading-tight text-nutrition-blue">
      ×{intake.amount}
    </span>
    <p className="absolute inset-x-0 bottom-0 truncate bg-white/80 px-[0.5em] py-[0.25em] font-semibold leading-tight text-nutrition-green">
      {intake.name}
    </p>
  </div>
);
