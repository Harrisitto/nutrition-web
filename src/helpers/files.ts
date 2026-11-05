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
