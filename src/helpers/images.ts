const VECTOR_TYPES = ["image/svg+xml"];

/**
 * Reduce la imagen a `maxWidth` de ancho manteniendo la proporción. Las que ya
 * son más estrechas y las vectoriales (SVG) se devuelven tal cual. Se reescala
 * en el mismo formato; si el navegador no sabe codificarlo (p. ej. WebP en
 * Safari antiguo) `toBlob` cae a PNG, así que hay que usar el `type` del blob.
 */
export const resizeImage = async (
  file: File,
  maxWidth: number,
  quality = 0.9
): Promise<Blob> => {
  if (VECTOR_TYPES.includes(file.type)) return file;

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
