import { useState } from "react";
import { PlayCircle } from "lucide-react";

interface Props {
  src: string | null;
  alt: string;
  className?: string;
}

/** Miniatura de YouTube con icono de reserva si no hay enlace válido o falla la carga */
export const VideoThumbnail = ({ src, alt, className = "" }: Props) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = src && failedSrc !== src;

  return (
    <div
      className={`relative aspect-video shrink-0 overflow-hidden rounded-md bg-nutrition-green/10 ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(src)}
          className="h-full w-full object-cover"
        />
      ) : (
        <PlayCircle className="absolute inset-0 m-auto text-nutrition-green/50" size={28} />
      )}
    </div>
  );
};
