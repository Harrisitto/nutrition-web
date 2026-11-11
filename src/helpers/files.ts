/** Tamaño legible de un fichero: "512 B", "1.2 KB", "3.4 MB" */
export const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
};

/** Nombre del fichero sin la extensión: "plan semana.pdf" -> "plan semana" */
export const fileNameWithoutExtension = (fileName: string) => {
    const dot = fileName.lastIndexOf(".");
    return dot > 0 ? fileName.slice(0, dot) : fileName;
};

/** Contenido del fichero en base64, sin el prefijo "data:<tipo>;base64," */
export const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
