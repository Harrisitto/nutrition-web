const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"];
const VIDEO_ID = /^[\w-]{11}$/;
// Rutas de youtube.com que llevan el id como segundo segmento
const ID_PATHS = ["shorts", "embed", "live", "v"];

/**
 * Extrae el id de un enlace de YouTube (watch, youtu.be, shorts, embed, live).
 * Devuelve null si no es un enlace https de YouTube con un id válido.
 */
export const getYoutubeVideoId = (value: string): string | null => {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || !YOUTUBE_HOSTS.includes(url.hostname)) return null;

  const [first, second] = url.pathname.split("/").filter(Boolean);
  let id: string | null | undefined;
  if (url.hostname === "youtu.be") id = first;
  else if (first === "watch") id = url.searchParams.get("v");
  else if (ID_PATHS.includes(first)) id = second;

  return id && VIDEO_ID.test(id) ? id : null;
};

/** Miniatura 16:9 (320x180) del vídeo, o null si el enlace no es de YouTube */
export const getYoutubeThumbnail = (value: string): string | null => {
  const id = getYoutubeVideoId(value);
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null;
};
