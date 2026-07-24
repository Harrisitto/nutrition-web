import { useState, useEffect } from "react";

export interface InstagramPost {
  id: string;
  imageUrl: string;
  title: string;
  likes?: number | string;
  date: string;
  postUrl: string;
}

export const useInstagramPosts = (
  token: string,
  fallbackPosts: InstagramPost[] = []
) => {
  const [posts, setPosts] = useState<InstagramPost[]>(fallbackPosts);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay token configurado, usamos directamente el fallback
    if (!token) {
      setPosts(fallbackPosts);
      setLoading(false);
      return;
    }

    const fetchInstagramPosts = async () => {
      setLoading(true);
      try {
        // Petición a la API de Instagram Basic Display
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${token}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error en API Instagram: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
          // Filtrar solo imágenes y carruseles, descartar vídeos puros si no se desean
          const formattedPosts: InstagramPost[] = data.data
            .filter(
              (item: any) =>
                item.media_type === "IMAGE" ||
                item.media_type === "CAROUSEL_ALBUM"
            )
            .map((item: any) => ({
              id: item.id,
              imageUrl: item.media_url,
              title: item.caption || "Publicación de Instagram",
              likes: item.like_count ?? "❤️", // La API básica a veces oculta el conteo de likes
              date: new Date(item.timestamp).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              postUrl: item.permalink,
            }));

          setPosts(formattedPosts.length > 0 ? formattedPosts : fallbackPosts);
        } else {
          setPosts(fallbackPosts);
        }
      } catch (err: any) {
        console.warn(
          "No se pudieron cargar las publicaciones de Instagram API. Usando datos local fallback:",
          err.message
        );
        setError(err.message || "Error al cargar publicaciones");
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [token, JSON.stringify(fallbackPosts)]);

  return { posts, loading, error };
};
