const SVG_TYPE = "image/svg+xml";

/** Proporción alto / ancho del viewBox de un svg (1 si no tiene). */
const svgAspectRatio = async (file: File): Promise<number> => {
  const svg = new DOMParser().parseFromString(await file.text(), SVG_TYPE).documentElement;
  const [, , width, height] = (svg.getAttribute("viewBox") ?? "").split(/[\s,]+/).map(Number);
  return width > 0 && height > 0 ? height / width : 1;
};

/**
 * Convierte un svg a png de `width` px de ancho. El bucket race_ingredients no
 * acepta svg: un svg puede llevar scripts, que se ejecutan si se abre su url de
 * storage. Al pintarlo como imagen (<img> y canvas) los scripts no se ejecutan.
 */
const rasterizeSvg = async (file: File, width: number): Promise<Blob> => {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    // Un svg sin width/height (solo viewBox) puede no tener tamaño propio
    const ratio =
      image.naturalWidth > 0 && image.naturalHeight > 0
        ? image.naturalHeight / image.naturalWidth
        : await svgAspectRatio(file);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.max(1, Math.round(width * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context not available");
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
        "image/png"
      )
    );
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * Reduce la imagen a `maxWidth` de ancho manteniendo la proporción. Las que ya
 * son más estrechas se devuelven tal cual, y las vectoriales (SVG) se
 * convierten a PNG de `maxWidth` de ancho. Se reescala en el mismo formato; si
 * el navegador no sabe codificarlo (p. ej. WebP en Safari antiguo) `toBlob` cae
 * a PNG, así que hay que usar el `type` del blob.
 */
export const resizeImage = async (
  file: File,
  maxWidth: number,
  quality = 0.9
): Promise<Blob> => {
  if (file.type === SVG_TYPE) return rasterizeSvg(file, maxWidth);

  const bitmap = await createImageBitmap(file);
  if (bitmap.width <= maxWidth) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = maxWidth;
  canvas.height = Math.round((bitmap.height * maxWidth) / bitmap.width);

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Canvas 2D context not available");
  }
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      file.type,
      quality
    )
  );
};

/** Descarga un blob en el navegador con el nombre `fileName`. */
export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  // Se revoca después: algunos navegadores leen el blob tras el click
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
