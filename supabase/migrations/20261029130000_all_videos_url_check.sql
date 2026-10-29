-- Solo se aceptan enlaces https de YouTube con un id de vídeo válido.
-- Mismos formatos que getYoutubeVideoId (src/helpers/youtube.ts):
-- watch?v=, youtu.be/, shorts/, embed/, live/ y v/
-- not valid: se aplica a inserts y updates, las filas existentes no se revisan.
alter table public.all_videos
  add constraint all_videos_url_youtube check (
    url ~* '^https://((www\.|m\.)?youtube\.com/(watch\?([^#]*&)?v=|(shorts|embed|live|v)/)|youtu\.be/)[a-z0-9_-]{11}([?&#/]|$)'
  ) not valid;
