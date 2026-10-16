import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { toBlob } from "html-to-image";
import { RacePoster } from "./racePoster";
import type { RacePosterData } from "./posterData";
import { POSTER_WIDTH } from "./constants";

// Recharts termina de dibujar el perfil en los efectos de los primeros renders
const waitForFrames = async (count: number) => {
  for (let i = 0; i < count; i++) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
};

/**
 * PNG de la imagen de la carrera (1920 de ancho; 1080 de alto o más, ver posterLayout). RacePoster se monta fuera de la pantalla (no
 * hace falta que la vista previa esté abierta), se pasa a png con html-to-image y se desmonta.
 */
export const renderPosterPng = async (data: RacePosterData): Promise<Blob> => {
  const container = document.createElement("div");
  container.style.cssText = "position: fixed; top: 0; left: -100000px; pointer-events: none;";
  document.body.appendChild(container);
  const root = createRoot(container);

  try {
    flushSync(() => root.render(<RacePoster data={data} />));
    await waitForFrames(2);

    const poster = container.firstElementChild as HTMLElement;
    // Que las imágenes de los ingredientes y los puntos de interés estén cargadas (una que no
    // carga no impide generar el png)
    await Promise.all(
      Array.from(poster.querySelectorAll("img"), (img) => img.decode().catch(() => undefined)),
    );
    const png = await toBlob(poster, {
      width: POSTER_WIDTH,
      height: poster.offsetHeight,
      // Px reales, aunque la pantalla tenga más densidad
      pixelRatio: 1,
    });
    if (!png) throw new Error("Race poster could not be rendered");
    return png;
  } finally {
    root.unmount();
    container.remove();
  }
};
