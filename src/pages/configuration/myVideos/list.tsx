import { useTranslation } from "react-i18next";
import { ExternalLink, Trash2 } from "lucide-react";
import { SectionLoading } from "@src/components/global/Animations";
import { deleteButtonStyle } from "@src/components/styles";
import { getYoutubeThumbnail } from "@src/helpers/youtube";
import { useNotification } from "@src/store/slices/notification/hook";
import {
  type Video,
  useDeleteVideo,
  useFetchMyVideos,
} from "@src/services/tanstack/data/videos";
import { VideoThumbnail } from "./thumbnail";

export const VideoList = () => {
  const { t } = useTranslation();
  const { data: videos, isLoading, isError } = useFetchMyVideos();
  const { mutate: deleteVideo, isPending, variables } = useDeleteVideo();
  const { addFormSubmitError } = useNotification();

  const onDelete = (video: Video) => {
    const message = t("data:configuration.sections.myVideos.confirmDelete", {
      name: video.name,
    });
    if (!window.confirm(message)) return;
    deleteVideo(video.id, { onError: () => addFormSubmitError() });
  };

  if (isLoading) {
    return <SectionLoading />;
  }

  if (isError) {
    return (
      <p className="p-4 text-sm text-red-500">
        {t("data:configuration.sections.myVideos.loadError")}
      </p>
    );
  }

  if (!videos?.length) {
    return (
      <p className="p-4 text-sm text-text-muted">
        {t("data:configuration.sections.myVideos.empty")}
      </p>
    );
  }

  return (
    <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
      {videos.map((video) => (
        <li
          key={video.id}
          className="flex items-start justify-between gap-3 rounded-lg border border-nutrition-green/20 bg-white p-2"
        >
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            className="transition-opacity hover:opacity-80"
          >
            <VideoThumbnail
              src={getYoutubeThumbnail(video.url)}
              alt={video.name}
              className="w-28"
            />
          </a>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-text-title">{video.name}</p>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 truncate text-xs text-nutrition-green hover:underline"
            >
              <ExternalLink size={12} className="shrink-0" />
              <span className="truncate">{video.url}</span>
            </a>
            {video.description && (
              <p className="mt-1 line-clamp-2 text-xs text-text-muted">
                {video.description}
              </p>
            )}
          </div>
          <button
            type="button"
            title={t("data:configuration.sections.myVideos.delete")}
            aria-label={t("data:configuration.sections.myVideos.delete")}
            disabled={isPending && variables === video.id}
            onClick={() => onDelete(video)}
            className={deleteButtonStyle}
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
};
