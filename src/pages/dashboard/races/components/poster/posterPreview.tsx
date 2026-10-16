import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Download, Loader, X } from "lucide-react";
import { primaryButtonStyle } from "@src/components/styles";
import { downloadBlob } from "@src/helpers/images";
import { raceImageFileName } from "@src/services/tanstack/user/races";
import { useNotification } from "@src/store/slices/notification/hook";
import { secondaryButtonStyle } from "../formStyles";
import { RacePoster } from "./racePoster";
import { renderPosterPng } from "./posterImage";
import { useRacePosterData } from "./posterData";
import { posterLayout } from "./layout";
import { POSTER_WIDTH } from "./constants";

// Ancho disponible del elemento, para escalar la imagen de 1920 px a lo que quepa
const useElementWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
};

/**
 * Vista previa, a escala, de la imagen de la carrera tal y como la verá el corredor, con
 * botón para descargarla en png.
 */
export const PosterPreview = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { addFormSubmitError } = useNotification();
  const { data, isReady } = useRacePosterData();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { ref: frameRef, width } = useElementWidth();
  const scale = width / POSTER_WIDTH;
  const posterHeight = useMemo(() => posterLayout(data).height, [data]);
  // Al redimensionar solo cambia la escala: el póster (con Recharts) no se vuelve a pintar
  const poster = useMemo(() => <RacePoster data={data} />, [data]);

  const download = useMutation({
    mutationFn: async () => downloadBlob(await renderPosterPng(data), raceImageFileName(data)),
    onError: () => addFormSubmitError(),
  });

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Click fuera de la imagen (en el fondo) cierra
      onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      className="w-[min(95vw,1400px)] max-w-none rounded-2xl bg-white p-0 backdrop:bg-black/60"
    >
      <div className="flex flex-col gap-4 p-4">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-title">{t("data:races.poster.title")}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={primaryButtonStyle}
              disabled={!isReady || download.isPending}
              onClick={() => download.mutate()}
            >
              {download.isPending ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {t("data:races.poster.download")}
            </button>
            <button
              type="button"
              className={secondaryButtonStyle}
              aria-label={t("data:races.poster.close")}
              onClick={() => dialogRef.current?.close()}
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <div
          ref={frameRef}
          className="w-full overflow-hidden rounded-xl shadow-md"
          style={{ height: posterHeight * scale }}
        >
          <div
            style={{ width: POSTER_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            {poster}
          </div>
        </div>
      </div>
    </dialog>
  );
};
